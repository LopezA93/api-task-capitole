import { Router } from "express";
import auth from "../middlewares/auth.js";
import requireAdmin from "../middlewares/requireAdmin.js";
import validate from "../middlewares/validator.js";
import * as rules from "../validators/userValidator.js";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const userRoutes = Router();

userRoutes.get("/", auth, requireAdmin, getUsers);
userRoutes.post(
  "/",
  auth,
  requireAdmin,
  rules.createUserValidation,
  validate,
  createUser,
);
userRoutes.patch(
  "/:id",
  auth,
  requireAdmin,
  rules.updateUserValidation,
  validate,
  updateUser,
);
userRoutes.delete(
  "/:id",
  auth,
  requireAdmin,
  rules.idValidation,
  validate,
  deleteUser,
);

export default userRoutes;
