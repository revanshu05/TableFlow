import { Router } from "express";

import { createOrder } from "../controllers/order.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { createTicket } from "../controllers/kitchenTicket.controller.js";

const orderRouter = Router();

orderRouter.post("/create-order", verifyJWT, authorizeRoles("waiter"), createOrder);
orderRouter.post("/:orderId/send-to-kitchen", verifyJWT, authorizeRoles("waiter"), createTicket);

export default orderRouter;