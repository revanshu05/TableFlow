import mongoose, { Types } from "mongoose";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { emitToRooms } from "../socket/socket.service.js";

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

    const members = customer.members ?? 1;

    if (!Number.isInteger(members) || members < 1) {
        throw new ApiError(400, "Number of members must be at least 1.");
    }

    if (members > table.capacity) {
        throw new ApiError(
            400,
            `This table can accommodate at most ${table.capacity} members.`
        );
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const settings = await restaurantSettings.findOneAndUpdate(
            {},
            {
                $inc: {
                    nextOrderNumber: 1,
                },
            },
            {
                new: false,
                session,
            }
        );

        if (!settings) {
            throw new ApiError(500, "Restaurant settings not initialized");
        }

        const orderNumber = settings.nextOrderNumber;

        const [order] = await Order.create(
            [
                {
                    table: tableId,
                    waiter: req.user._id,
                    customer: {
                        name: customer.name.trim(),
                        phone: customer.phone?.trim() || "",
                        members,
                    },
                    notes: notes?.trim() || "",
                    orderNumber,
                },
            ],
            { session }
        );

        const updatedTable = await Table.findOneAndUpdate(
            {
                _id: tableId,
                status: "AVAILABLE",
            },
            {
                status: "OCCUPIED",
                assignedWaiter: req.user._id,
                currentOrder: order._id,
            },
            {
                session,
                new: true,
            }
        );

        if (!updatedTable) {
            throw new ApiError(
                409,
                "Table was claimed by another order simultaneously."
            );
        }

        await session.commitTransaction();

        await order.populate([
            { path: "table", select: "tableNo capacity"},
            { path: "waiter", select: "name email" }
        ]);

        emitToRooms(["room:waiter", "room:admin"], "table:statusChanged", {
            tableId,
            status: "OCCUPIED"
        });

        emitToRooms(["room:waiter", "room:admin"], "order:created", order);

        return res.status(201).json(
            new ApiResponse(
                201,
                order,
                "New order created successfully"
            )
        );

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
});

const getOrders = asyncHandler(async (req, res) => {
    const user = req.user;

    const {
        status,
        sort = "newest",
        page = 1,
        limit = 15,
    } = req.query;


    const allowedStatus = [
        "OPEN",
        "PAYMENT_PENDING",
        "COMPLETED"
    ];

    if (status && !allowedStatus.includes(status)) {
        throw new ApiError(400, "Invalid order status");
    }


    const sortOptions = {
        newest: {
            createdAt: -1,
            _id: -1,
        },
        oldest: {
            createdAt: 1,
            _id: 1,
        }
    };

    if (!sortOptions[sort]) {
        throw new ApiError(400, "Invalid sort option");
    }

    const sortQuery = sortOptions[sort];
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if(
        !Number.isInteger(pageNumber) ||
        pageNumber < 1){

        throw new ApiError(400, "Invalid page number");
    }

    if(
        !Number.isInteger(limitNumber) ||
        limitNumber < 1 ||
        limitNumber > 100){

        throw new ApiError(
            400,
            "Limit must be between 1 and 100"
        );
    }


    const skip = (pageNumber - 1) * limitNumber;

    let query;

    if(user.role === "admin"){

        query = {};

        if(status){
            query.status = status;
        }
    }
    else if(user.role === "waiter"){

        query = {
            waiter: user._id
        };

        if(status){
            query.status = status;
        }

    }
    else if(user.role === "cashier"){

        const allowedCashierStatuses = [
            "PAYMENT_PENDING",
            "COMPLETED"
        ];

        if(
            status &&
            !allowedCashierStatuses.includes(status)
        ){
            throw new ApiError(
                400,
                "Cashier can only access payment pending or completed orders"
            );
        }

        query = {
            status: {
                $in: status
                    ? [status]
                    : allowedCashierStatuses
            }
        };

    }
    else {
        throw new ApiError(403, "Unauthorized");
    }


    const [orders, totalOrders] = await Promise.all([

        Order.find(query)
            .select(
                "_id orderNumber table customer waiter kotCount grandTotal status createdAt"
            )
            .populate("table", "tableNo")
            .populate("waiter", "name")
            .sort(sortQuery)
            .skip(skip)
            .limit(limitNumber)
            .lean(),

        Order.countDocuments(query)

    ]);


    const totalPages = Math.ceil(totalOrders / limitNumber);

    const pagination = {
        page: pageNumber,
        limit: limitNumber,
        totalOrders,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1
    };


    return res.status(200).json(
        new ApiResponse(
            200,
            {
                orders,
                pagination
            },
            "Orders fetched successfully"
        )
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

const getOrderKots = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    if(!Types.ObjectId.isValid(id)){
        throw new ApiError(400, "Invalid order id");
    }

    let orderQuery = { _id: id };

    if(user.role === "waiter"){
        orderQuery.waiter = user._id;
    }
    else if(user.role === "cashier"){
        orderQuery.status = { $in: ["PAYMENT_PENDING", "COMPLETED"] };
    }
    else if(user.role !== "admin"){
        throw new ApiError(403, "Unauthorized");
    }

    const orderExists = await Order.exists(orderQuery);

    if(!orderExists){
        throw new ApiError(404, "Order not found");
    }

    const tickets = await KitchenTicket.find({
        order: id
    })
        .select("ticketNumber table items status createdAt")
        .populate("table", "tableNo")
        .sort({ createdAt: 1 })
        .lean();

    return res.status(200).json(
        new ApiResponse(200, tickets, "KOTs fetched successfully")
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

    if(order.kotCount === 0 || order.items.length === 0){
        throw new ApiError(400, "Cannot request bill for empty order");
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

    await order.populate([
        {path: "waiter", select: "name"},
        {path: "table", select: "tableNo"}
    ]);

    emitToRooms(["room:cashier", "room:admin", "room:waiter"], "order:billRequested", order);

    return res.status(200).json(
        new ApiResponse(200, order, "Bill requested successfully")
    )
});

const completePayment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    let { paymentMethod, tip = 0, discount = 0 } = req.body;

    if(!Types.ObjectId.isValid(id)){
        throw new ApiError(400, "Invalid order id");
    }

    if(!["admin", "cashier", "waiter"].includes(user.role)){
        throw new ApiError(403, "Unauthorized");
    }

    if(!["CASH", "CARD", "UPI"].includes(paymentMethod)){
        throw new ApiError(400, "Invalid payment method");
    }

    if(typeof tip !== "number" || tip < 0){
        throw new ApiError(400, "Tip must be non negative number");
    }

    if(typeof discount !== "number" || discount < 0){
        throw new ApiError(400, "Discount must be a non-negative number");
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const order = await Order.findById(id).session(session);

        if(!order){
            throw new ApiError(404, "Order not found");
        }

        if(user.role === "waiter" && !order.waiter.equals(user._id)){
            throw new ApiError(403, "Not authorized to complete payment for this order");
        }

        if(order.status !== "PAYMENT_PENDING"){
            throw new ApiError(409, "Order status must be PAYMENT_PENDING to complete payment")
        }

        if(discount > (order.subtotal + order.tax)){
            throw new ApiError(400, "Discount cannot exceed the total bill amount");
        }

        order.status = "COMPLETED";
        order.paymentStatus = "PAID";
        order.paymentMethod = paymentMethod;
        order.tip = tip;
        order.discount = discount;
        order.grandTotal = Math.max(0, order.subtotal + order.tax - discount);
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

        await order.populate([
            {path: "table", select: "tableNo"},
            {path: "waiter", select: "name"}
        ]);

        emitToRooms(["room:cashier", "room:admin", "room:waiter"], "order:completed", order);
        emitToRooms(["room:waiter", "room:admin"], "table:statusChanged", {
            tableId: order.table._id || order.table,
            status: "AVAILABLE"
        });

        return res.status(200).json(
            new ApiResponse(200, order, "Payment completed successfully")
        );

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
});

const getBill = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    if(!Types.ObjectId.isValid(id)){
        throw new ApiError(400, "Invalid order id");
    }

    const order = await Order.findById(id)
        .select("orderNumber customer items subtotal tax discount grandTotal paymentMethod paymentStatus tip status table waiter createdAt paidAt")
        .populate("table", "tableNo")
        .populate("waiter", "name")
        .lean();

    if(!order){
        throw new ApiError(404, "Order not found");
    }
    
    if(user.role === "waiter"){
        if(!order.waiter?._id?.equals(user._id)){
            throw new ApiError(403, "Not authorized to view bill for this order");
        }
    }

    if(!["COMPLETED", "PAYMENT_PENDING"].includes(order.status)){
        throw new ApiError(409, "Bill is only available for PAYMENT_PENDING and COMPLETED orders");
    }

    const bill = {
        orderNumber: order.orderNumber,
        tableNo: order.table?.tableNo || "N/A",
        waiterName: order.waiter?.name || "N/A",
        customerName: order.customer?.name || "",
        customerPhone: order.customer?.phone || "",
        members: order.customer?.members || 1,
        orderedItems: order.items || [],
        subtotal: order.subtotal,
        tax: order.tax,
        discount: order.discount,
        grandTotal: order.grandTotal,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        tip: order.tip,
        createdAt: order.createdAt,
        paidAt: order.paidAt,
    };

    return res.status(200).json(
        new ApiResponse(200, bill, "Bill fetched successfully")
    );
});

export {
    createOrder, 
    getOrders,
    getOrderById,
    getOrderKots,
    requestBill,
    completePayment,
    getBill,
};