import { Router } from "express";
import { registerUser, getCurrentUser, getTeamMembers, updateTeamMember } from "../controllers/user.controller.js";
import { loginUser} from "../controllers/auth.controller.js";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post("/team", verifyJWT, authorizeRoles("admin"), registerUser);
userRouter.get("/current-user", verifyJWT, getCurrentUser);
userRouter.get("/team", verifyJWT, authorizeRoles("admin"), getTeamMembers);
userRouter.patch("/team/:userId", verifyJWT, authorizeRoles("admin"), updateTeamMember);

export default userRouter;