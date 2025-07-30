"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageController = void 0;
const BaseController_1 = require("./BaseController");
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        allowed_formats: ["jpg", "jpeg", "png", "gif"],
    },
});
class ImageController extends BaseController_1.BaseController {
    constructor() {
        super();
        this.uploadSingle = async (req, res) => {
            try {
                if (!req.file) {
                    console.log("No file uploaded");
                    return this.sendError(res, new Error("No file uploaded"), 400);
                }
                const upload = req.file;
                return this.sendSuccess(res, upload, "File uploaded successfully");
            }
            catch (error) {
                this.sendError(res, error);
            }
        };
    }
}
exports.ImageController = ImageController;
