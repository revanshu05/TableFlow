import { Schema, model } from "mongoose";

const restaurantSettingsSchema = new Schema(
    {
        nextKitchenTicketNumber: {
            type: Number,
            required: true,
            default: 1,
            min: 1,
        },

        taxPercentage: {
            type: Number,
            required: true,
            default: 5,
            min: 0,
            max: 100,
        },
    },
    {
        timestamps: true,
    }
);

const restaurantSettings = model("RestaurantSettings", restaurantSettingsSchema);
export default restaurantSettings;