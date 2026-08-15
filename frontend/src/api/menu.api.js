import api from "../utils/axios.js";

const getMenuItems = (category = "") => {
    const query = category
        ? `?category=${category}`
        : "";

    return api.get(`/menu${query}`);
};

const createMenuItem = (data) => {
    return api.post("/menu", data);
};

export { getMenuItems, createMenuItem };