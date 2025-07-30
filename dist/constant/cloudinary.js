"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLOUDINARY_API_SECRET = exports.CLOUDINARY_API_KEY = exports.CLOUDINARY_CLOUD_NAME = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "your_cloud_name";
exports.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "your_api_key";
exports.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "your_api_secret";
