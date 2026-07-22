import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/login", loginUser);
authRouter.post("/logout", verifyJWT, logoutUser);
authRouter.post("/refresh-token", refreshAccessToken);

export default authRouter;