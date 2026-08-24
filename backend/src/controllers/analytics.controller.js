
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";

import Order from "../models/order.model.js";
import Table from "../models/table.model.js";


const getDashboardAnalytics = asyncHandler(async (req, res) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const [orderAggregation, occupiedTables, availableTables] = await Promise.all([
        Order.aggregate([
            {
                $match: {
                    $or: [
                        { createdAt: { $gte: startOfDay, $lte: endOfDay } },
                        { paidAt: { $gte: startOfDay, $lte: endOfDay } },
                    ],
                },
            },
            {
                $facet: {
                    revenue: [
                        {
                            $match: {
                                status: "COMPLETED",
                                paidAt: { $gte: startOfDay, $lte: endOfDay },
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                todayRevenue: { $sum: "$grandTotal" },
                            },
                        },
                    ],
                    counts: [
                        {
                            $match: {
                                createdAt: { $gte: startOfDay, $lte: endOfDay },
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                todayOrders: { $sum: 1 },
                                activeOrders: {
                                    $sum: { $cond: [{ $eq: ["$status", "OPEN"] }, 1, 0] },
                                },
                                paymentPendingOrders: {
                                    $sum: { $cond: [{ $eq: ["$status", "PAYMENT_PENDING"] }, 1, 0] },
                                },
                            },
                        },
                    ],
                },
            },
        ]),
        Table.countDocuments({ status: "OCCUPIED" }),
        Table.countDocuments({ status: "AVAILABLE" }),
    ]);

    const facetResults = orderAggregation[0] || {};
    const rawRevenue = facetResults.revenue?.[0]?.todayRevenue ?? 0;
    const counts = facetResults.counts?.[0] || {};

    const todayRevenue = Number(rawRevenue.toFixed(2));
    const todayOrders = counts.todayOrders ?? 0;
    const activeOrders = counts.activeOrders ?? 0;
    const paymentPendingOrders = counts.paymentPendingOrders ?? 0;

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