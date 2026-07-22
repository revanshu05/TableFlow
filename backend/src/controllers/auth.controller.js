import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
};

const generateAccessAndRefreshTokens = async (userId) => {
    const user = await User.findById(userId);

    if(!user) throw new ApiError(404, "User not found");

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
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if(!isPasswordCorrect){
        throw new ApiError(401, "Invalid email or password");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(200, {user: loggedInUser}, "Login successful")
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {refreshToken: 1},
        }
    )

    res
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions);

    
    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "User logged out successfully")
        );
});


const refreshAccessToken = asyncHandler(async (req, res) => {
    
    const oldRefreshToken = req.cookies?.refreshToken;

    if(!oldRefreshToken){
        throw new ApiError(401, "Unauthorized Request");
    }

    let decodedToken;
    
    try {
        decodedToken = jwt.verify(
            oldRefreshToken, 
            process.env.REFRESH_TOKEN_SECRET
        );

    } catch (error) {
        console.error(error);
        throw new ApiError(401, "invalid or expired refresh token");
    }

    const user = await User.findById(decodedToken._id)
        .select("-password");

    if(!user){
        throw new ApiError(401, "invalid refresh token");
    }

    if(oldRefreshToken !== user.refreshToken){
        throw new ApiError(401, "invalid refresh token");
    }

    console.log(req.cookies);

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

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