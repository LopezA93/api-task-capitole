import { Router } from "express";
import auth from "../middlewares/auth.js";
import requireAdmin from "../middlewares/requireAdmin.js";
import validate from "../middlewares/validator.js";
import * as taskControllers from "../controllers/taskController.js";
import * as validation from "../validators/taskValidator.js";

const taskRouter = Router();

taskRouter.use(auth);

taskRouter.post(
  "/",
  requireAdmin,
  validation.createTaskValidation,
  validate,
  taskControllers.createTaskController,
);
taskRouter.patch(
  "/:id/assign",
  requireAdmin,
  validation.assignValidation,
  validate,
  taskControllers.assignTaskController,
);
taskRouter.delete(
  "/:id",
  requireAdmin,
  validation.idValidation,
  validate,
  taskControllers.deleteTaskController,
);

taskRouter.get("/", taskControllers.listTasksController);
taskRouter.patch(
  "/:id/complete",
  validation.idValidation,
  validate,
  taskControllers.completeTaskController,
);

export default taskRouter;
