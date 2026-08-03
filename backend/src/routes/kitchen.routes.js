import { Router } from "express";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.middleware.js";
import { getKitchenTickets, updateKitchenTicketStatus } from "../controllers/kitchenTicket.controller.js";

const kitchenRouter = Router();

kitchenRouter.get("/tickets", verifyJWT, authorizeRoles("kitchen"), getKitchenTickets);
kitchenRouter.patch("/tickets/:ticketId/:action", verifyJWT, authorizeRoles("kitchen"), updateKitchenTicketStatus);

export default kitchenRouter;