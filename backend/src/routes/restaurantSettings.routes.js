import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { getRestaurantSettings, updateRestaurantSettings } from "../controllers/restaurantSettings.controller.js";
import { updateKitchenTicketStatus } from "../controllers/kitchenTicket.controller.js";

const restaurantSettingsRouter = Router();

restaurantSettingsRouter.get("/", verifyJWT, authorizeRoles("admin"), getRestaurantSettings);
restaurantSettingsRouter.patch("/", verifyJWT, authorizeRoles("admin"), updateRestaurantSettings);

export default restaurantSettingsRouter;