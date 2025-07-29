import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "../constant/cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  } as any,
});


export class ImageController extends BaseController {
  constructor() {
    super();
  }

  uploadSingle = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        console.log("No file uploaded");
        return this.sendError(res, new Error("No file uploaded"), 400);
      }
      const upload = req.file
      return this.sendSuccess(res, upload, "File uploaded successfully");
    } catch (error) {
      this.sendError(res, error);
    }
  };
}
