"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const express_1 = __importDefault(require("express"));
const ImageController_1 = require("../controllers/ImageController");
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = require("../constant/cloudinary");
const cloudinary_2 = require("cloudinary");
const constant_1 = require("../constant");
const imageRoute = express_1.default.Router();
const imageController = new ImageController_1.ImageController();
cloudinary_2.v2.config({
    cloud_name: cloudinary_1.CLOUDINARY_CLOUD_NAME,
    api_key: cloudinary_1.CLOUDINARY_API_KEY,
    api_secret: cloudinary_1.CLOUDINARY_API_SECRET,
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_2.v2,
    params: {
        folder: constant_1.APP_NAME,
        allowed_formats: ["jpg", "jpeg", "png", "gif"],
    },
});
exports.upload = (0, multer_1.default)({ storage: storage });
imageRoute.post("/", exports.upload.single("image"), imageController.uploadSingle);
exports.default = imageRoute;
