import RestaurantSettings from "../models/restaurantSettings.model.js";

const initializeRestaurantSettings = async () => {
    const settings = await RestaurantSettings.findOne();

    if(!settings){
        await RestaurantSettings.create({});
    }
};

export default initializeRestaurantSettings;