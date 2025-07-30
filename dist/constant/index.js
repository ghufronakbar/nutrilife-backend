"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_NAME = exports.PORT = exports.BASE_URL = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.BASE_URL = process.env.BASE_URL || "http://localhost:3000";
exports.PORT = process.env.PORT || 3000;
exports.APP_NAME = process.env.APP_NAME || "Nutrilife";
