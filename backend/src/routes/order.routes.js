import { Router } from "express";

import { createOrder, getBill, getOrderById, getOrderKots, getOrders, requestBill } from "../controllers/order.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { createKitchenTicket } from "../controllers/kitchenTicket.controller.js";

const orderRouter = Router();

orderRouter.post("/", verifyJWT, authorizeRoles("waiter", "admin"), createOrder);
orderRouter.get("/", verifyJWT, authorizeRoles("waiter", "admin", "cashier"), getOrders);
orderRouter.get("/:id", verifyJWT, authorizeRoles("waiter", "admin", "cashier"), getOrderById);
orderRouter.get("/:id/kots", verifyJWT, authorizeRoles("waiter", "admin"), getOrderKots);
orderRouter.post("/:id/create-ticket", verifyJWT, authorizeRoles("waiter", "admin"), createKitchenTicket);
orderRouter.patch("/:id/request-bill", verifyJWT, authorizeRoles("waiter", "admin"), requestBill);
orderRouter.get("/:id/bill", verifyJWT, authorizeRoles("admin", "waiter", "cashier"), getBill);

export default orderRouter;