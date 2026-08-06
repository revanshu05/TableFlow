
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import restaurantSettings from "../models/restaurantSettings.model.js";

const getRestaurantSettings = asyncHandler(async (req, res) => {
    
    const settings = await restaurantSettings.findOne()
        .select("-_id taxPercentage")
        .lean();

    if(!settings){
        throw new ApiError(500, "Restaurant settings not initialized");
    }

    return res.status(200).json(
        new ApiResponse(200, settings, "Restaurant settings fetched successfully")
    );
});

const updateRestaurantSettings = asyncHandler(async (req, res) => {
    const taxPercentage = req.body.taxPercentage ?? 0;

    if(typeof taxPercentage !== "number" || taxPercentage < 0 || taxPercentage > 100){
        throw new ApiError(400, "Tax must be between 0 to 100");
    }

    const settings = await restaurantSettings.findOneAndUpdate(
        {},
        {
            $set: {
                taxPercentage: taxPercentage,
            },
        },
        {
            new: true,
            projection: {
                _id: 0,
                taxPercentage: 1,
            },
            lean: true,
        }
    );

    if(!settings){
        throw new ApiError(500, "Restaurant settings not initialized");
    }
    
    return res.status(200).json(
        new ApiResponse(200, settings, "Restaurant settings updated successfully")
    );
});


export { getRestaurantSettings, updateRestaurantSettings };