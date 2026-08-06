import mongoose, { Types } from "mongoose";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import restaurantSettings from "../models/restaurantSettings.model.js";
import Order from "../models/order.model.js";
import Table from "../models/table.model.js";
import KitchenTicket from "../models/kitchenTicket.model.js";

const createOrder = asyncHandler(async (req, res) => {
    const {
        tableId,
        customer,
        notes,
    } = req.body;

    if (!customer?.name?.trim()) {
        throw new ApiError(400, "Customer name is required.");
    }

    if (!Types.ObjectId.isValid(tableId)) {
        throw new ApiError(400, "Invalid table id.");
    }

    const table = await Table.findById(tableId).lean();

    if (!table) {
        throw new ApiError(404, "Table not found.");
    }

    if (table.status !== "AVAILABLE") {
        throw new ApiError(409, "Table already occupied.");
    }

    const existingOrder = await Order.findOne({
        table: tableId,
        status: {
            $in: [
                "OPEN",
                "PAYMENT_PENDING",
            ],
        },
    }).lean();

    if (existingOrder) {
        throw new ApiError(
            409,
            "An active order already exists for this table."
        );
    }

    const settings = await restaurantSettings.findOneAndUpdate(
        {},
        {
            $inc: {
                nextOrderNumber: 1,
            },
        },
        {
            new: false
        }
    )

    if(!settings){
        throw new ApiError(500, "Restaurant settings not initialized");
    }

    const orderNumber = settings.nextOrderNumber;

    const order = await Order.create({
        table: tableId,
        waiter: req.user._id,
        customer,
        notes,
        orderNumber,
    });

    await Table.findByIdAndUpdate(
        tableId,
        {
            status: "OCCUPIED",
            assignedWaiter: req.user._id,
            currentOrder: order._id,
        }
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            order,
            "New order created successfully"
        )
    );
});

const getOrders = asyncHandler(async (req, res) => {
    const user = req.user;

    let orders;

    if(user.role === "admin"){
        orders = await Order.find()
            .select("_id table customer waiter kotCount subtotal tax discount grandTotal status paymentStatus createdAt")
            .populate("table", "tableNo")
            .populate("waiter", "name")
            .sort({ createdAt: -1})
            .lean();
    }
    else if(user.role === "waiter"){
        orders = await Order.find({
            waiter: req.user._id,
        })
            .select("_id table customer status kotCount grandTotal createdAt")
            .populate("table", "tableNo")
            .sort({ createdAt: 1})
            .lean();
    }
    else if(user.role === "cashier"){
        orders = await Order.find({
            status: "PAYMENT_PENDING"
        })
            .select("_id table customer waiter kotCount subtotal tax discount grandTotal status paymentStatus createdAt")
            .populate("table", "tableNo")
            .populate("waiter", "name")
            .sort({ createdAt: 1})
            .lean();
    }
    else{
        throw new ApiError(403, "Unauthorized");
    }

    return res.status(200).json(
        new ApiResponse(200, orders, "Orders fetched successfully")
    );
});

const getOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if(!Types.ObjectId.isValid(id)){
        throw new ApiError(400, "Invalid order id");
    }

    const user = req.user;
    const userId = user._id;

    let order;

    if(user.role === "waiter"){
        order = await Order.findOne({
            _id: id,
            waiter: userId,
        })
            .select("-__v")
            .populate("table", "tableNo")
            .populate("waiter", "name")
            .lean();
    }
    else if(user.role === "admin"){
        order = await Order.findById(id)
            .select("-__v")
            .populate("table", "tableNo")
            .populate("waiter", "name")
            .lean();
    }
    else if(user.role === "cashier"){
        order = await Order.findOne({
            _id: id,
            status: {
                $in : [ "PAYMENT_PENDING", "COMPLETED"]
            } 
        })
            .select("-__v")
            .populate("table", "tableNo")
            .populate("waiter", "name")
            .lean();
    }
    else{
        throw new ApiError(403, "Unauthorized");
    }

    if(!order){
        throw new ApiError(404, "Order not found");
    }

    return res.status(200).json(
        new ApiResponse(200, order, "Order fetched successfully")
    );
});

const requestBill = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    if(!Types.ObjectId.isValid(id)){
        throw new ApiError(400, "Invalid object id");
    }

    const order = await Order.findById(id);

    if(!order){
        throw new ApiError(404, "Order not found");
    }

    if(user.role === "waiter"){
        if(!order.waiter.equals(user._id)) throw new ApiError(403, "Not authorized");
    }
    else if(user.role !== "admin"){
        throw new ApiError(403, "Not authorized");
    }

    if(order.status !== "OPEN"){
        throw new ApiError(409, "Order status must be OPEN to request bill");
    }

    const pendingTicket = await KitchenTicket.findOne({
        order: order._id,
        status: {
            $ne: "SERVED",
        },
    });

    if(pendingTicket){
        throw new ApiError(409, "All KOTs must be served first");
    }

    order.status = "PAYMENT_PENDING";
    order.requestedBillAt = new Date();

    await order.save();

    const updatedOrder = await Order.findById(order._id)
        .populate("waiter", "name")
        .populate("table", "tableNo")
        .lean();

    return res.status(200).json(
        new ApiResponse(200, updatedOrder, "Bill requested successfully")
    )
});

const completePayment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    let { paymentMethod, tip } = req.body;
    
    tip = tip ?? 0;

    if(!Types.ObjectId.isValid(id)){
        throw new ApiError(400, "Invalid order id");
    }

    if(!["admin", "cashier"].includes(user.role)){
        throw new ApiError(403, "Unauthorized");
    }

    if(!["CASH", "CARD", "UPI"].includes(paymentMethod)){
        throw new ApiError(400, "Invalid payment method");
    }

    if(typeof tip !== "number" || tip < 0){
        throw new ApiError(400, "Tip must be non negative number");
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const order = await Order.findById(id).session(session);

        if(!order){
            throw new ApiError(404, "Order not found");
        }

        if(order.status !== "PAYMENT_PENDING"){
            throw new ApiError(409, "Order status must be PAYMENT_PENDING to complete payment")
        }

        order.status = "COMPLETED";
        order.paymentStatus = "PAID";
        order.paymentMethod = paymentMethod;
        order.tip = tip;
        order.paidAt = new Date();

        const table = await Table.findById(order.table).session(session);

        if(!table){
            throw new ApiError(404, "Table not found");
        }

        table.status = "AVAILABLE";
        table.assignedWaiter = null;
        table.currentOrder = null;

        await order.save({session});
        await table.save({session});

        await session.commitTransaction();

        const updatedOrder = await Order.findById(order._id)
            .populate("table", "tableNo")
            .populate("waiter", "name")
            .lean();

        return res.status(200).json(
            new ApiResponse(200, updatedOrder, "Payment completed successfully")
        );

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
});

export {
    createOrder, 
    getOrders,
    getOrderById,
    requestBill,
};