import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/user.model.js';

import { Types } from 'mongoose';

const registerUser = asyncHandler(async (req, res) => {

    const {
        name,
        email,
        password,
        phone,
        role,
    } = req.body;


    if (!name?.trim() || !email?.trim() || !password) {
        throw new ApiError(400, "Name, email and password are required");
    }

    const allowedRoles = ["admin", "waiter", "cashier", "kitchen"];
    if (role && !allowedRoles.includes(role)) {
        throw new ApiError(400, `Invalid role. Allowed: ${allowedRoles.join(", ")}`);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({
        email: normalizedEmail,
    });

    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        phone: phone?.trim() || "",
        role: role || "waiter",
    });

    const createdUser = user.toObject();
    delete createdUser.password;
    delete createdUser.refreshToken;

    return res
        .status(201)
        .json(
            new ApiResponse(201, createdUser, "User created successfully")
        );
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, req.user, "Current user fetched successfully")
    );
});

const getTeamMembers = asyncHandler(async (req, res) => {
    const users = await User.find()
        .select("-password -refreshToken")
        .sort({ createdAt: 1 })
        .lean();

    return res.status(200).json(
        new ApiResponse(200, users, "Team members fetched successfully")
    );
});

const updateTeamMember = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const {
        name,
        phone,
        role,
        active,
    } = req.body;

    if (!Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const user = await User.findById(userId);

    if(!user){
        throw new ApiError(404, "Team member not found");
    }

    if(user._id.toString() === req.user._id.toString() && active === false){
        throw new ApiError(400, "You cannot deactivate your own account");
    }

    if(role !== undefined){

        const allowedRoles = [
            "admin",
            "waiter",
            "cashier",
            "kitchen",
        ];

        if (!allowedRoles.includes(role)) {
            throw new ApiError(400, `Invalid role. Allowed: ${allowedRoles.join(", ")}`);
        }

        user.role = role;
    }

    if(name !== undefined){
        if(!name.trim()){
            throw new ApiError(400, "Name cannot be empty");
        }

        user.name = name.trim();
    }


    if(phone !== undefined){
        user.phone = phone.trim();
    }

    if(active !== undefined){
        if(typeof active !== "boolean"){
            throw new ApiError(400, "Active must be a boolean");
        }

        user.active = active;
    }

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;
    delete updatedUser.refreshToken;

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "Team member updated successfully")
    );
});

export {registerUser, getCurrentUser, getTeamMembers, updateTeamMember};