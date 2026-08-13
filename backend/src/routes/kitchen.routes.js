import { Router } from "express";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.middleware.js";
import { getKitchenTickets, updateKitchenTicketStatus } from "../controllers/kitchenTicket.controller.js";

const kitchenRouter = Router();

kitchenRouter.get("/", verifyJWT, authorizeRoles("kitchen", "admin"), getKitchenTickets);
kitchenRouter.patch("/:ticketId/:action", verifyJWT, authorizeRoles("kitchen", "admin"), updateKitchenTicketStatus);

export default kitchenRouter;