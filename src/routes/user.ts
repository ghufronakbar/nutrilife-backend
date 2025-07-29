import express from "express";
import { UserController } from "../controllers/UserController";
import { requireAuth } from "../middleware/require-auth";
import { validate } from "../middleware/validate";
import {
  UserEditSchema,
  UserLoginSchema,
  UserRegisterSchema,
} from "../validators/UserValidator";

const userRoute = express.Router();
const userController = new UserController();

userRoute.post(
  "/login",
  validate({
    body: UserLoginSchema,
  }),
  userController.login
);

userRoute.post(
  "/register",
  validate({
    body: UserRegisterSchema,
  }),
  userController.register
);

userRoute.get("/profile", requireAuth, userController.getProfile);

userRoute.put(
  "/profile",
  validate({
    body: UserEditSchema,
  }),
  requireAuth,
  userController.editProfile
);

export default userRoute;
