import { Router } from "express";
import { createTable, getTables } from "../controllers/table.controller.js";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.middleware.js";

const tableRouter = Router();

tableRouter.post("/", verifyJWT, authorizeRoles("admin"), createTable);
tableRouter.get("/", verifyJWT, authorizeRoles("admin", "waiter", "kitchen"), getTables);

export default tableRouter;