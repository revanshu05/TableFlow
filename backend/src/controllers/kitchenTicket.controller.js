import mongoose, {Types} from "mongoose";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import Table from "../models/table.model.js";
import MenuItem from "../models/menu.model.js";
import KitchenTicket from "../models/kitchenTicket.model.js";
import Order from "../models/order.model.js";
import restaurantSettings from "../models/restaurantSettings.model.js";


const createTicket = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { items } = req.body;

    if (!Types.ObjectId.isValid(orderId)) {
        throw new ApiError(400, "Invalid order id.");
    }

    if(!Array.isArray(items) || items.length === 0){
        throw new ApiError(400, "Atleast one item is required");
    }

    const seenItems = new Set();

    for(const item of items){
        const id = item.menuItem.toString();

        if (seenItems.has(id)) {
            throw new ApiError(400, "Duplicate menu items are not allowed");
        }
        
        if(!Types.ObjectId.isValid(item.menuItem)){
            throw new ApiError(400, "Invalid menu item id");
        }

        if(!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10){
            throw new ApiError(400, "Quantity must be between 1 to 10");
        }

        seenItems.add(id);
    }

    const order = await Order.findById(orderId);

    if(!order){
        throw new ApiError(404, "Order not found");
    }

    if(order.status !== "OPEN"){
        throw new ApiError(409, "Order is no more OPEN");
    }

    const menuItemIds = items.map((item) => item.menuItem);

    const menuItems = await MenuItem.find({
        _id : {$in: menuItemIds, }, 
    });

    if(menuItems.length !== menuItemIds.length){
        throw new ApiError(404, "One or more menu items were not found");
    }

    for(const menuItem of menuItems){
        if(!menuItem.isAvailable){
            throw new ApiError(400, `${menuItem.name} is not available.`)
        }
    }

    const menuItemMap = new Map();

    for(const menuItem of menuItems){
        menuItemMap.set(menuItem._id.toString(), menuItem);
    }

    const snapshots = items.map(item => {
        const menuItem = menuItemMap.get(item.menuItem.toString());

        return {
            menuItem: menuItem._id,
            name: menuItem.name,
            quantity: item.quantity,
            unitPrice: menuItem.price,
        };
    });

    const session = await mongoose.startSession();

    try{
        session.startTransaction();

        const settings = await restaurantSettings.findOneAndUpdate(
            {},
            {
                $inc: {
                    nextKitchenTicketNumber: 1,
                },
            },
            {
                new: false,
                session,
            }
        )

        if(!settings){
            throw new ApiError(500, "Restaurant settings not initialized");
        }

        const ticketNumber = settings.nextKitchenTicketNumber;

        const [kitchenTicket] = await KitchenTicket.create(
            [
                {
                    order: order._id,
                    table: order.table,
                    waiter: order.waiter,
                    ticketNumber,
                    items: snapshots,
                },
            ],
            {
                session,
            }
        );

        const orderItemMap = new Map();

        const orderItems = order.items;

        for(const orderItem of orderItems){
            orderItemMap.set(orderItem.menuItem.toString(), orderItem);
        }

        for(const item of snapshots){
            const existingItem = orderItemMap.get(item.menuItem.toString());

            if(existingItem){
                existingItem.quantity += item.quantity;
            }
            else{
                orderItemMap.set(item.menuItem.toString(), item);
            }
        }

        order.items = Array.from(orderItemMap.values());

        let subTotal = 0;

        for(const item of order.items){
            subTotal += item.quantity * item.unitPrice;
        }

        order.subtotal = subTotal;

        order.tax = (order.subtotal * settings.taxPercentage) / 100;

        order.grandTotal = order.subtotal + order.tax - order.discount;

        order.kotCount++;

        await order.save({session});

        await session.commitTransaction();

        return res.status(201).json(
            new ApiResponse(201, kitchenTicket, "Kitchen ticket created successfully")
        );

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }


});


export { createTicket };