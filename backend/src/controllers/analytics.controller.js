
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import Order from "../models/order.model.js";
import Table from "../models/table.model.js";

const getDashboardAnalytics = asyncHandler(async (req, res) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const revenuePromise = Order.aggregate([
        {
            $match: {
                status: "COMPLETED",
                paidAt: {
                    $gte: startOfDay,
                    $lte: endOfDay,
                },
            },
        },
        {
            $group: {
                _id: null,
                todayRevenue: {
                    $sum: "$grandTotal",
                },
            },
        },
    ]);

    const todayOrdersPromise = Order.countDocuments({
        createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
        },
    });

    const activeOrdersPromise = Order.countDocuments({
        createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
        },
        status: "OPEN",
    });

    const paymentPendingOrdersPromise = Order.countDocuments({
        createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
        },
        status: "PAYMENT_PENDING",
    });

    const occupiedTablesPromise = Table.countDocuments({
        status: "OCCUPIED",
    });

    const availableTablesPromise = Table.countDocuments({
        status: "AVAILABLE",
    });

    const [
        revenue,
        todayOrders,
        activeOrders,
        paymentPendingOrders,
        occupiedTables,
        availableTables,
    ] = await Promise.all([
        revenuePromise,
        todayOrdersPromise,
        activeOrdersPromise,
        paymentPendingOrdersPromise,
        occupiedTablesPromise,
        availableTablesPromise,
    ]);

    const todayRevenue = revenue[0]?.todayRevenue ?? 0;

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                todayRevenue,
                todayOrders,
                activeOrders,
                paymentPendingOrders,
                occupiedTables,
                availableTables,
            },
            "Dashboard fetched successfully"
        )
    );
});


export { getDashboardAnalytics };