import express from "express";
import { requireAuth } from "../middleware/require-auth";
import { validate } from "../middleware/validate";
import { FoodController } from "../controllers/FoodController";
import { FoodSchema } from "../validators/FoodValidator";

const foodRoute = express.Router();
const foodController = new FoodController();

foodRoute.get("/", requireAuth, foodController.getLogs);

foodRoute.post(
  "/",
  validate({
    body: FoodSchema,
  }),
  requireAuth,
  foodController.createLog
);

foodRoute.delete("/:id", requireAuth, foodController.deleteLog);

export default foodRoute;
