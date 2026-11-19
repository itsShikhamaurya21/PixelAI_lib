
import express from "express";
import {
  register,
  login,
  logOut,
  getCurrentUser
} from "../Controllers/auth.controller.js";

import isAuth from "../Middleware/isAuth.middleware.js"

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", isAuth, getCurrentUser);
authRouter.get("/logout", logOut);

export default authRouter;
