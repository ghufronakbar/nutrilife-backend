import express from "express";
import { requireAuth } from "../middleware/require-auth";
import { TrackController } from "../controllers/TrackController";

const trackRoute = express.Router();
const trackController = new TrackController();

trackRoute.get("/achievement", requireAuth, trackController.getAchievement);
trackRoute.get("/progress", requireAuth, trackController.getProgress);

export default trackRoute;
