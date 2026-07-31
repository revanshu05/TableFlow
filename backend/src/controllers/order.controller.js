import { Types } from "mongoose";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import Order from "../models/order.model.js";
import Table from "../models/table.model.js";

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

    const order = await Order.create({
        table: tableId,
        waiter: req.user._id,
        customer,
        notes,
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

export {
    createOrder,
};