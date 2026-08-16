import { Schema, model } from "mongoose";

const restaurantSettingsSchema = new Schema(
    {
        restaurantName: {
            type: String,
            required: true,
            trim: true,
            default: "My Restaurant",
        },

        phone: {
            type: String,
            trim: true,
            default: "",
        },

        address: {
            type: String,
            trim: true,
            default: "",
        },

        taxPercentage: {
            type: Number,
            required: true,
            default: 5,
            min: 0,
            max: 100,
        },

        nextKitchenTicketNumber: {
            type: Number,
            required: true,
            default: 1,
            min: 1,
        },

        nextOrderNumber: {
            type: Number,
            required: true,
            default: 1,
            min: 1,
        },
    },
    {
        timestamps: true,
    }
);

const restaurantSettings = model(
    "RestaurantSettings",
    restaurantSettingsSchema
);

export default restaurantSettings;