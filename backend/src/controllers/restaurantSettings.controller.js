import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import restaurantSettings from "../models/restaurantSettings.model.js";

const getRestaurantSettings = asyncHandler(async (req, res) => {

    const settings = await restaurantSettings.findOne()
        .select("-_id restaurantName phone address taxPercentage")
        .lean();


    if(!settings){
        throw new ApiError(500, "Restaurant settings not initialized");
    }


    return res.status(200).json(
        new ApiResponse(200, settings, "Restaurant settings fetched successfully")
    );

});


const updateRestaurantSettings = asyncHandler(async (req, res) => {

    const {
        restaurantName,
        phone,
        address,
        taxPercentage,
    } = req.body;


    const updateFields = {};

    if(restaurantName !== undefined){

        if(typeof restaurantName !== "string" || !restaurantName.trim()){
            throw new ApiError(400, "Restaurant name cannot be empty");
        }


        updateFields.restaurantName = restaurantName.trim();
    }

    if(phone !== undefined){

        if(typeof phone !== "string"){
            throw new ApiError(400, "Phone must be a string");
        }

        updateFields.phone = phone.trim();
    }

    if(address !== undefined){

        if(typeof address !== "string"){
            throw new ApiError(400, "Address must be a string");
        }

        updateFields.address = address.trim();

    }

    if(taxPercentage !== undefined){

        if(typeof taxPercentage !== "number" || taxPercentage < 0 || taxPercentage > 100){
            throw new ApiError(400, "Tax must be between 0 to 100");
        }
        updateFields.taxPercentage = taxPercentage;
    }


    if(Object.keys(updateFields).length === 0){
        throw new ApiError(400, "No valid settings provided");
    }

    const settings =await restaurantSettings.findOneAndUpdate(
            {},
            {
                $set: updateFields,
            },
            {
                new: true,
                projection: {
                    _id: 0,
                    restaurantName: 1,
                    phone: 1,
                    address: 1,
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


export {
    getRestaurantSettings,
    updateRestaurantSettings,
};