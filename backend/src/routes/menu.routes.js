import { Router } from "express";
import { createMenuItem, getMenuItems, getMenuItemById, updateMenuItem, updateItemAvailability } from "../controllers/menu.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const menuRouter = Router();

menuRouter.post("/", verifyJWT, authorizeRoles("admin"), createMenuItem);
menuRouter.get("/", verifyJWT, authorizeRoles("admin", "waiter", "cashier", "kitchen"), getMenuItems);
menuRouter.get("/:id", verifyJWT, authorizeRoles("admin", "waiter", "kitchen", "cashier"), getMenuItemById);
menuRouter.patch("/:id", verifyJWT, authorizeRoles("admin"), updateMenuItem);
menuRouter.patch("/:id/availability", verifyJWT, authorizeRoles("admin"), updateItemAvailability);

export default menuRouter;