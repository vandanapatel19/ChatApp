import express from "express";
import { signup, login, checkAuth, updateProfile } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";

const UserRouter = express.Router();

UserRouter.post("/signup", signup);
UserRouter.post("/login", login);
UserRouter.get("/checkAuth", protectRoute, checkAuth);
UserRouter.put("/update-profile", protectRoute, updateProfile);
UserRouter.put("/updateProfile", protectRoute, updateProfile);

export default UserRouter;