import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { loginLimiter, refreshTokenLimiter } from "../middlewares/rateLimiter.middleware.js";

const authRouter = Router();

authRouter.post("/login", loginLimiter, loginUser);
authRouter.post("/logout", verifyJWT, logoutUser);
authRouter.post("/refresh-token", refreshTokenLimiter, refreshAccessToken);

export default authRouter;