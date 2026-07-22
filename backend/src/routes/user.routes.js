import { Router } from "express";
import { registerUser, getCurrentUser } from "../controllers/user.controller.js";
import { loginUser} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post("/register", registerUser);

userRouter.get("/current-user", verifyJWT, getCurrentUser);

export default userRouter;