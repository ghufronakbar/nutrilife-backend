import express from "express";
import imageRoute from "./image";
import userRoute from "./user";
import preferenceRoute from "./preference";

const router = express.Router();

router.use("/image", imageRoute);
router.use("/user", userRoute)
router.use("/preference", preferenceRoute)

export default router;
