import { Router } from "express";
import { registerUser, getCurrentUser } from "../controllers/user.controller.js";
import { loginUser} from "../controllers/auth.controller.js";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.get("/current-user", verifyJWT, getCurrentUser);

userRouter.get(
    "/admin-test", 
    verifyJWT, 
    authorizeRoles("admin"), 
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Welcome Admin!",
            user: req.user,
        });
    }
);

export default userRouter;