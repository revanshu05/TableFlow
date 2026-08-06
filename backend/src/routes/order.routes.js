import { Router } from "express";

import { createOrder, getOrderById, getOrders, requestBill } from "../controllers/order.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { createKitchenTicket } from "../controllers/kitchenTicket.controller.js";

const orderRouter = Router();

orderRouter.post("/", verifyJWT, authorizeRoles("waiter"), createOrder);
orderRouter.get("/", verifyJWT, authorizeRoles("waiter", "admin", "cashier"), getOrders);
orderRouter.get("/:id", verifyJWT, authorizeRoles("waiter", "admin", "cashier"), getOrderById);
orderRouter.post("/:id/send-to-kitchen", verifyJWT, authorizeRoles("waiter"), createKitchenTicket);
orderRouter.patch("/:id/request-bill", verifyJWT, authorizeRoles("waiter", "admin"), requestBill);

export default orderRouter;