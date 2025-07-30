"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const require_auth_1 = require("../middleware/require-auth");
const ContentController_1 = require("../controllers/ContentController");
const contentRoute = express_1.default.Router();
const contentController = new ContentController_1.ContentController();
contentRoute.get("/primary-goals", require_auth_1.requireAuth, contentController.getAppPrimaryGoals);
contentRoute.get("/activity-levels", require_auth_1.requireAuth, contentController.getAppActivityLevels);
contentRoute.get("/foods", require_auth_1.requireAuth, contentController.getAppFoods);
contentRoute.get("/suggested-menus", require_auth_1.requireAuth, contentController.getSuggestedMenus);
exports.default = contentRoute;
