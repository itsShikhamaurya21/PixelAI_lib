import express from "express";

import {
  createComponent,
  getAllComponents,
  getComponentById,
  getMyComponents,
  updateComponent,
  deleteComponent,
  publishComponent,
  generateComponent,
  saveComponent,
} from "../Controllers/component.controller.js";

import isAuth from "../Middleware/isAuth.middleware.js";

const componentRouter = express.Router();

componentRouter.post("/generate", isAuth, generateComponent);
componentRouter.post("/save", isAuth, saveComponent);

// Create a component
componentRouter.post("/", isAuth, createComponent);
componentRouter.post("/create", isAuth, createComponent);

// Get all public components
componentRouter.get("/all-components", getAllComponents);

// Get my private components
componentRouter.get("/my-components", isAuth, getMyComponents);

// Get single component
componentRouter.get("/:id", getComponentById);

// Update component
componentRouter.put("/:id", isAuth, updateComponent);

// Delete component
componentRouter.delete("/:id", isAuth, deleteComponent);

// Publish component
componentRouter.patch("/:id/publish", isAuth, publishComponent);

export default componentRouter;