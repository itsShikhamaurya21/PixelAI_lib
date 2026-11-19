
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

// Allowed frontend origins
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
].filter(Boolean);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("Blocked CORS origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Global middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PixelAI backend is running successfully!",
  });
});

// API routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/components", componentRouter);
app.use("/api/ai", aiComponentRouter);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS: This frontend origin is not allowed.",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

// Start server
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`PixelAI backend running on port ${PORT}`);
      console.log("Allowed origins:", allowedOrigins);
    });
  } catch (error) {
    console.error("Failed to start PixelAI backend:", error);
    process.exit(1);
  }
};

startServer();
