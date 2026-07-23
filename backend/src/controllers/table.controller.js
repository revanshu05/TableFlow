import Table from "../models/table.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


const createTable = asyncHandler(async (req, res) => {
    const { tableNo, capacity } = req.body;

    if(tableNo === undefined || capacity === undefined){
        throw new ApiError(400, "Table number and capacity are required");
    }

    if(!Number.isInteger(tableNo) || !Number.isInteger(capacity)){
        throw new ApiError(400, "Table number and capacity must be integers");
    }

    if(tableNo < 1 || capacity < 1){
        throw new ApiError(400, "Table number and capacity must be greater than 0");
    }

    const existingTable = await Table.findOne({ tableNo });

    if(existingTable){
        throw new ApiError(409, "Table already exists");
    }

    const table = await Table.create({
        tableNo, 
        capacity
    });

    return res
        .status(201)
        .json(
            new ApiResponse(201, table, "Table created successfully")
        );
});


const getTables = asyncHandler(async (req, res) => {

    const tables = await Table.find()
        .select("tableNo capacity status assignedWaiter currentOrder")
        .sort({ tableNo: 1 })
        .lean();

    return res.status(200).json(
        new ApiResponse(
            200,
            tables,
            "Tables fetched successfully"
        )
    );
});

export {createTable, getTables};