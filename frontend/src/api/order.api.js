import api from "../utils/axios.js";

const createOrder = (orderData) => {
    return api.post("/orders", orderData);
}

const getOrders = () => {
    return api.get("/orders");
}

const createKitchenTicket = (orderId, items) => {
    return api.post(`/orders/${orderId}/create-ticket`, 
        { items }
    );
};

export { createOrder, getOrders, createKitchenTicket };