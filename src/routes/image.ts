import express from "express";
import { ImageController } from "../controllers/ImageController";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from "../constant/cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { APP_NAME } from "../constant";

const imageRoute = express.Router();
const imageController = new ImageController();

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: APP_NAME,
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  } as any,
});

export const upload = multer({ storage: storage });

imageRoute.post(
  "/",
  upload.single("image"),
  imageController.uploadSingle
);

export default imageRoute;
