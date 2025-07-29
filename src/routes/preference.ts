import express from "express";
import { requireAuth } from "../middleware/require-auth";
import { validate } from "../middleware/validate";
import { PreferenceController } from "../controllers/PreferenceController";
import { PreferenceSchema } from "../validators/PreferenceValidator";

const preferenceRoute = express.Router();
const preferenceController = new PreferenceController();

preferenceRoute.get("/", requireAuth, preferenceController.getPreference);

preferenceRoute.post(
  "/",
  validate({
    body: PreferenceSchema,
  }),
  requireAuth,
  preferenceController.editPreference
);

export default preferenceRoute;
