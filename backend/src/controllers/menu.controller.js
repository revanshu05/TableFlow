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

    if(!name?.trim() || !category?.trim() || price === undefined){
        throw new ApiError(400, "Name, category and price are required");
    }

    if(typeof price !== "number"){
        throw new ApiError(400, "Price must be a number");
    }

    if(price <= 0){
        throw new ApiError(400, "Price must be greater than 0");
    }

    const allowedCategories = [
        "STARTER",
        "MAIN_COURSE",
        "BEVERAGE",
        "SOUP",
        "DESSERT",
        "PIZZA",
        "DRINK",
        "SALAD",
    ];

    const normalizedCategory = category.trim().toUpperCase();

    if(!allowedCategories.includes(normalizedCategory)){
        throw new ApiError(400, `Invalid category. Allowed: ${allowedCategories.join(", ")}`);
    }

    const trimmedName = name.trim();
    const escapedName = trimmedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const existingItem = await MenuItem.findOne({
        name: { $regex: new RegExp(`^${escapedName}$`, "i") },
    });

    if(existingItem){
        throw new ApiError(409, "Item already exists with same name");
    }

    const item = await MenuItem.create({
        name: trimmedName,
        description: description?.trim() || "",
        category: normalizedCategory,
        price: Number(price.toFixed(2)),
    });

    return res.status(201).json(
        new ApiResponse(201, item, "Item created successfully")
    );
});

const getMenuItems = asyncHandler(async (req, res) => {
    const { category } = req.query;

    const isAdmin = req.user.role === "admin";

    const filter = {};

    if(!isAdmin){
        filter.isAvailable = true;
    }

    if(category && category.trim().toUpperCase() !== "ALL"){
        filter.category = category.trim().toUpperCase();
    }

    const menuItems = await MenuItem.find(filter)
        .select("-__v")
        .sort({
            category: 1,
            name: 1,
        })
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

    if (!isAdmin) {
        filter.isAvailable = true;
    }

    const menuItem = await MenuItem.findOne(filter)
        .select("-__v")
        .lean();

    if(!menuItem){
        throw new ApiError(404, "Menu item not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, menuItem, "Menu item fetched successfully")
        )
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

        const escaped = trimmedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const existing = await MenuItem.findOne({
            _id: { $ne: id },
            name: { $regex: new RegExp(`^${escaped}$`, "i") },
        });

        if(existing){
            throw new ApiError(409, "Another item already exists with this name");
        }

        updateFields.name = trimmedName;
    }

    if(description !== undefined){
        updateFields.description = description.trim();
    }

    if(category !== undefined){
        const allowedCategories = [
            "STARTER",
            "MAIN_COURSE",
            "BEVERAGE",
            "SOUP",
            "DESSERT",
            "PIZZA",
            "DRINK",
            "SALAD",
        ];
        const normalizedCategory = category.trim().toUpperCase();

        if (!allowedCategories.includes(normalizedCategory)) {
            throw new ApiError(400, `Invalid category. Allowed: ${allowedCategories.join(", ")}`);
        }

        updateFields.category = normalizedCategory;
    }

    if(price !== undefined){
        if(typeof price !== "number" || isNaN(price)){
            throw new ApiError(400, "Price must be a valid number");
        }

        if(price <= 0){
            throw new ApiError(400, "Price must be greater than 0");
        }

        updateFields.price = Number(price.toFixed(2));
    }

    if(Object.keys(updateFields).length === 0){
        throw new ApiError(400, "At least one field is required for update");
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
        throw new ApiError(404, "Menu item not found");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedItem, "Item updated successfully")
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