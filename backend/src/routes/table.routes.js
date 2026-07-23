import { Router } from "express";
import { createTable, getTables } from "../controllers/table.controller.js";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.middleware.js";

const tableRouter = Router();

tableRouter.post("/create-table", verifyJWT, authorizeRoles("admin"), createTable);
tableRouter.get("/get-tables", verifyJWT, authorizeRoles("admin", "waiter", "kitchen"), getTables);

export default tableRouter;