import express from "express";
import { generateComponent } from "../Controllers/aicomponent.controller.js";
import isAuth from "../Middleware/isAuth.middleware.js";

const aiComponentRouter = express.Router();

// Generate React component using AI
aiComponentRouter.post("/generate", isAuth, generateComponent);

export default aiComponentRouter;