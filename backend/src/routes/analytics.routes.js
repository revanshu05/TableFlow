import { Router } from "express";

import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { getDashboardAnalytics } from "../controllers/analytics.controller.js";

const analyticsRouter = Router();

analyticsRouter.get("/dashboard", verifyJWT, authorizeRoles("admin"), getDashboardAnalytics);

export default analyticsRouter;