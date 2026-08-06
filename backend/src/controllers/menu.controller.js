import MenuItem from "../models/menu.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Types } from "mongoose";

const createMenuItem = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        category,
        price,
    } = req.body;

    if(!name || !category || price === undefined){
        throw new ApiError(400, "name, category and price are required");
    }

    if(typeof price !== "number"){
        throw new ApiError(400, "price must be a number");
    }

    if(price < 0){
        throw new ApiError(400, "price must be greater than 0");
    }

    const existingItem = await MenuItem.findOne({
        name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });

    if(existingItem){
        throw new ApiError(409, "Item already exists");
    }

    const item = await MenuItem.create({
        name: name.trim(),
        description: description?.trim(),
        category,
        price,
    });

    return res
        .status(201)
        .json(
            new ApiResponse(201, item, "item created successfully")
        )
});

const getMenuItems = asyncHandler(async (req, res) => {
    const { category } = req.query;

    const isAdmin = req.user.role === "admin";

    const filter = {};

    if(!isAdmin){
        filter.isAvailable = true;
    }

    if(category){
        filter.category = category.trim().toUpperCase();
    }

    const menuItems = await MenuItem.find(filter)
        .select("-__v")
        .lean();

    return res.status(200).json(
        new ApiResponse(200, menuItems, "items fetched successfully")
    );
});

const getMenuItemById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if(!Types.ObjectId.isValid(id)){
        throw new ApiError(400, "Invalid item id");
    }

    const isAdmin = req.user.role === "admin";

    const filter = {_id: id,};

    if(isAdmin){
        filter.isAvailable = true;
    }

    const menuItem = await MenuItem.findOne(filter)
        .select("-__v")
        .lean();

    if(!menuItem){
        throw new ApiError(404, "menu item not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, menuItem, "item fetched successfully")
        );
});

const updateMenuItem = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if(!Types.ObjectId.isValid(id)){
        throw new ApiError(400, "Invalid item id");
    }

    const {
        name,
        description,
        category,
        price,
    } = req.body;

    const updateFields = {};

    if(name !== undefined){
        const trimmedName = name.trim();

        if(trimmedName === ""){
            throw new ApiError(400, "name cannot be empty")
        }

        const existing = await MenuItem.findOne({
            _id: { $ne: id},
            name: {$regex: new RegExp(`^${name.trim()}$`, "i") },
        });

        if(existing){
            throw new ApiError(409, "another items exists with same name");
        }

        updateFields.name = name.trim();
    }

    if(description !== undefined){
        updateFields.description = description;
    }

    if(category !== undefined){
        updateFields.category = category;
    }

    if(price !== undefined){
        if(!Number.isInteger(price)){
            throw new ApiError(400, "price must be an integer");
        }

        if(price < 1){
            throw new ApiError(400, "price must be greater than 0");
        }

        updateFields.price = price;
    }

    if(Object.keys(updateFields).length === 0){
        throw new ApiError(400, "atleast one field is required for update");
    }

    const updatedItem = await MenuItem.findOneAndUpdate(
        {_id: id},
        updateFields,
        {
            new: true,
            runValidators: true,
        }
    )
        .select("-__v")
        .lean();
    
    if(!updatedItem){
        throw new ApiError(404, "menu item now found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedItem,
                "Item updated successfully"
            )
        );
});

const updateItemAvailability = asyncHandler(async (req, res) => {
    const {id} = req.params;

    if(!Types.ObjectId.isValid(id)){
        throw new ApiError(400, "Invalid item id");
    }

    const {isAvailable, ...extra} = req.body;

    if(isAvailable === undefined){
        throw new ApiError(400, "'isAvailable' is required");
    }

    if(typeof isAvailable !== "boolean"){
        throw new ApiError(400, "'isAvailable' must be a boolean");
    }

    if(Object.keys(extra).length > 0){
        throw new ApiError(400, "Only availability can be updated through this endpoint");
    }

    if(typeof isAvailable !== "boolean"){
        throw new ApiError(400, "'isAvailable' must be a boolean");
    }

    const updatedItem = await MenuItem.findOneAndUpdate(
        { _id: id },
        { isAvailable},
        { new: true, runValidators: true},
    )
        .select("-__v")
        .lean();

    if(!updatedItem){
        throw new ApiError(404, "Menu item not found");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedItem, "availability updated successfully")
    );
});

export {createMenuItem, getMenuItems, getMenuItemById, updateMenuItem, updateItemAvailability};