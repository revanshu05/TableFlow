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

const getOrderKots = (orderId) => {
    return api.get(`/orders/${orderId}/kots`);
};

const getOrderById = (orderId) => {
    return api.get(`/orders/${orderId}`);
};

const requestBill = (orderId) => {
    return api.patch(`/orders/${orderId}/request-bill`);
};

const completePayment = (orderId, paymentData) => {
    return api.patch(`/orders/${orderId}/complete-payment`, paymentData);
};

const getBill = (orderId) => {
    return api.get(`/orders/${orderId}/bill`);
};

export { 
    createOrder,
    getOrders, 
    createKitchenTicket, 
    getOrderKots, 
    getOrderById, 
    requestBill,
    completePayment,
    getBill,
};
