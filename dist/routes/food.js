"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const require_auth_1 = require("../middleware/require-auth");
const validate_1 = require("../middleware/validate");
const FoodController_1 = require("../controllers/FoodController");
const FoodValidator_1 = require("../validators/FoodValidator");
const foodRoute = express_1.default.Router();
const foodController = new FoodController_1.FoodController();
foodRoute.get("/", require_auth_1.requireAuth, foodController.getLogs);
foodRoute.post("/", (0, validate_1.validate)({
    body: FoodValidator_1.FoodSchema,
}), require_auth_1.requireAuth, foodController.createLog);
foodRoute.delete("/:id", require_auth_1.requireAuth, foodController.deleteLog);
exports.default = foodRoute;
