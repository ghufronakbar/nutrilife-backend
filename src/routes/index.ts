import express from "express";
import imageRoute from "./image";
import userRoute from "./user";
import preferenceRoute from "./preference";
import foodRoute from "./food";
import contentRoute from "./content";
import trackRoute from "./progress";

const router = express.Router();

router.use("/image", imageRoute);
router.use("/user", userRoute)
router.use("/preference", preferenceRoute)
router.use("/food", foodRoute)
router.use("/content", contentRoute)
router.use("/track", trackRoute)

export default router;
