"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const require_auth_1 = require("../middleware/require-auth");
const validate_1 = require("../middleware/validate");
const PreferenceController_1 = require("../controllers/PreferenceController");
const PreferenceValidator_1 = require("../validators/PreferenceValidator");
const preferenceRoute = express_1.default.Router();
const preferenceController = new PreferenceController_1.PreferenceController();
preferenceRoute.get("/", require_auth_1.requireAuth, preferenceController.getPreference);
preferenceRoute.post("/", (0, validate_1.validate)({
    body: PreferenceValidator_1.PreferenceSchema,
}), require_auth_1.requireAuth, preferenceController.editPreference);
exports.default = preferenceRoute;
