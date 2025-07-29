import express from "express";
import imageRoute from "./image";
import userRoute from "./user";

const router = express.Router();

router.use("/image", imageRoute);
router.use("/user", userRoute)

export default router;
