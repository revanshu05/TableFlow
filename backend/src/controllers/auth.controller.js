import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "strict",
    path: "/",
};


const generateTokensForUser = async (user) => {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};


const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    if(!email?.trim() || !password){
        throw new ApiError(400, "Email and password are required");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if(!user){
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if(!isPasswordCorrect){
        throw new ApiError(401, "Invalid email or password");
    }

    if(!user.active){
        throw new ApiError(403, "Your account is inactive. Please contact the administrator.");
    }

    const { accessToken, refreshToken } = await generateTokensForUser(user);

    const loggedInUser = user.toObject();
    delete loggedInUser.password;
    delete loggedInUser.refreshToken;

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200, 
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                }, 
                "Login successful"
            )
        );
});


const logoutUser = asyncHandler(async (req, res) => {
    
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {refreshToken: 1},
        }
    );

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(
            new ApiResponse(200, {}, "User logged out successfully")
        );
});


const refreshAccessToken = asyncHandler(async (req, res) => {
    
    const oldRefreshToken = 
        req.body?.refreshToken || 
        req.header("x-refresh-token") ||
        req.cookies?.refreshToken;

    if(!oldRefreshToken){
        throw new ApiError(401, "Unauthorized Request - No refresh token provided");
    }

    let decodedToken;
    
    try {
        decodedToken = jwt.verify(
            oldRefreshToken, 
            process.env.REFRESH_TOKEN_SECRET
        );
    } catch (error) {
        throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await User.findById(decodedToken._id).select("-password");

    if(!user){
        throw new ApiError(401, "Invalid refresh token - User not found");
    }

    if(oldRefreshToken !== user.refreshToken){
        throw new ApiError(401, "Invalid refresh token - Token does not match active session");
    }

    const { accessToken, refreshToken } = await generateTokensForUser(user);

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken
                },
                "Access token refreshed successfully"
            )
        );
});

export {loginUser, logoutUser, refreshAccessToken};
