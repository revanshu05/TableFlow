import { Router } from "express";

import { completePayment, createOrder, getBill, getOrderById, getOrderKots, getOrders, requestBill } from "../controllers/order.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { createKitchenTicket } from "../controllers/kitchenTicket.controller.js";

const orderRouter = Router();

orderRouter.post("/", verifyJWT, authorizeRoles("waiter", "admin"), createOrder);
orderRouter.get("/", verifyJWT, authorizeRoles("waiter", "admin", "cashier"), getOrders);
orderRouter.get("/:id", verifyJWT, authorizeRoles("waiter", "admin", "cashier"), getOrderById);
orderRouter.get("/:id/kots", verifyJWT, authorizeRoles("waiter", "admin", "cashier"), getOrderKots);
orderRouter.post("/:id/create-ticket", verifyJWT, authorizeRoles("waiter", "admin"), createKitchenTicket);
orderRouter.patch("/:id/request-bill", verifyJWT, authorizeRoles("waiter", "admin"), requestBill);
orderRouter.patch("/:id/complete-payment", verifyJWT, authorizeRoles("admin", "waiter", "cashier"), completePayment);
orderRouter.get("/:id/bill", verifyJWT, authorizeRoles("admin", "waiter", "cashier"), getBill);

export default orderRouter;