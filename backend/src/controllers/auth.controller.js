import User from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";


const generateAccessAndRefreshTokens = async (userId) => {
    const user = await User.findById(userId);

    if(!user) throw new apiError(404, "User not found");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({validateBeforeSave: false});

    return {accessToken, refreshToken};
};


const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    if([email, password].some(
        (field) => !field?.trim()
    )){
        throw new apiError(400, "Email and password are required");
    }

    const user = await User.findOne({email});

    if(!user){
        throw new apiError(401, "Invalid email or password");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if(!isPasswordCorrect){
        throw new apiError(401, "Invalid email or password");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(200, {user: loggedInUser}, "Login successful")
        );
});

export {loginUser};