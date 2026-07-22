import { Router } from "express";
import { loginUser, logoutUser } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/login", loginUser);
authRouter.post("/logout", verifyJWT, logoutUser);

export default authRouter;