import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/user.model.js';

const registerUser = asyncHandler(async (req, res) => {

    const {name, email, password, phone, role} = req.body;

    if([name, email, password].some(
        (field) => field?.trim() === ""
    )){
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({email});

    if(existingUser){
        throw new ApiError(409, "User already exists !!");
    }

    const user = await User.create({
        name,
        email,
        password,
        phone,
        role,
    });

    const createdUser = await User.findById(user._id).select("-password");

    return res
        .status(201)
        .json(
            new ApiResponse(201, createdUser, "User registered successfully.")
        );
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, req.user, "Current user fetched successfully")
    );
});

export {registerUser, getCurrentUser};