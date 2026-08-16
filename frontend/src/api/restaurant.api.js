import api from "../utils/axios.js";

const getRestaurantSettings = () => {
    return api.get("/restaurant-settings");
};


const updateRestaurantSettings = (data) => {
    return api.patch("/restaurant-settings", data);
};


export {
    getRestaurantSettings,
    updateRestaurantSettings,
};