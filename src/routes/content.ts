import express from "express";
import { requireAuth } from "../middleware/require-auth";
import { ContentController } from "../controllers/ContentController";

const contentRoute = express.Router();
const contentController = new ContentController();

contentRoute.get(
  "/primary-goals",
  requireAuth,
  contentController.getAppPrimaryGoals
);

contentRoute.get(
  "/activity-levels",
  requireAuth,
  contentController.getAppActivityLevels
);

contentRoute.get("/foods", requireAuth, contentController.getAppFoods);

contentRoute.get(
  "/suggested-menus",
  requireAuth,
  contentController.getSuggestedMenus
);

export default contentRoute;
