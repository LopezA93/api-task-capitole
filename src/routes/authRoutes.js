import { Router } from "express";
import * as authController from "../controllers/authController.js";
import * as rules from "../validators/authValidator.js";
import validate from "../middlewares/validator.js";

const authRouter = Router();

authRouter.post(
  "/register",
  rules.registerValidation,
  validate,
  authController.registerController,
);
authRouter.post(
  "/login",
  rules.loginValidation,
  validate,
  authController.loginController,
);
authRouter.post(
  "/refresh",
  rules.refreshValidation,
  validate,
  authController.refreshController,
);
authRouter.post(
  "/logout",
  rules.refreshValidation,
  validate,
  authController.logoutController,
);

export default authRouter;
