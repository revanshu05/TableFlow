import api from "../utils/axios";

const getKitchenTickets = () => {
    return api.get("/kitchen-tickets");
}

const updateKitchenTicketStatus = (ticketId, action) => {
    return api.patch(`/kitchen-tickets/${ticketId}/${action}`);
}

export { getKitchenTickets, updateKitchenTicketStatus };