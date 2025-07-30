"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const require_auth_1 = require("../middleware/require-auth");
const TrackController_1 = require("../controllers/TrackController");
const trackRoute = express_1.default.Router();
const trackController = new TrackController_1.TrackController();
trackRoute.get("/achievement", require_auth_1.requireAuth, trackController.getAchievement);
trackRoute.get("/progress", require_auth_1.requireAuth, trackController.getProgress);
exports.default = trackRoute;
