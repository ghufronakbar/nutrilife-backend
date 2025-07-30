"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../controllers/UserController");
const require_auth_1 = require("../middleware/require-auth");
const validate_1 = require("../middleware/validate");
const UserValidator_1 = require("../validators/UserValidator");
const userRoute = express_1.default.Router();
const userController = new UserController_1.UserController();
userRoute.post("/login", (0, validate_1.validate)({
    body: UserValidator_1.UserLoginSchema,
}), userController.login);
userRoute.post("/register", (0, validate_1.validate)({
    body: UserValidator_1.UserRegisterSchema,
}), userController.register);
userRoute.get("/profile", require_auth_1.requireAuth, userController.getProfile);
userRoute.put("/profile", (0, validate_1.validate)({
    body: UserValidator_1.UserEditSchema,
}), require_auth_1.requireAuth, userController.editProfile);
exports.default = userRoute;
