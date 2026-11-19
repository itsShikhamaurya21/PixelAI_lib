
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./Configs/connectDB.js";

import authRouter from "./Routes/auth.route.js";
import componentRouter from "./Routes/component.routes.js";
import aiComponentRouter from "./Routes/aiComponent.route.js";
import userRouter from "./Routes/user.route.js";

dotenv.config();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Global middlewares
app.use(express.json());
app.use(cookieParser());

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "PixelAI server is running successfully!",
  });
});

// API routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/components", componentRouter);
app.use("/api/ai", aiComponentRouter);

// Server and database connection
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`PixelAI server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
