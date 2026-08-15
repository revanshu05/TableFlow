import api from "../utils/axios";

const getKitchenTickets = () => {
    return api.get("/kitchen-tickets");
}

const updateKitchenTicketStatus = (ticketId, action) => {
    return api.patch(`/kitchen-tickets/${ticketId}/${action}`);
}

const updateKitchenTicket = (ticketId, items) => {
    return api.patch(`/kitchen-tickets/${ticketId}`, { items });
}
export { getKitchenTickets, updateKitchenTicketStatus, updateKitchenTicket };