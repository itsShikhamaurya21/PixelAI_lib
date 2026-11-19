import express from "express";
import { getAllUsers, getCurrentUser } from "../Controllers/user.controller.js";
import isAuth from "../Middleware/isAuth.middleware.js";

const userRouter = express.Router();

userRouter.get("/current-user", isAuth, getCurrentUser);
userRouter.get("/all-users",getAllUsers)

export default userRouter;