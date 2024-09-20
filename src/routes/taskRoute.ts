import express, { Request, Response } from "express";

import * as taskController from "../controllers/taskController";
import * as authController from "../controllers/authController";

const router = express.Router();

router
  .route("/")
  .get(authController.protect, taskController.getAllTasks)
  .post(taskController.createTask);

router
  .route("/:id")
  .get(taskController.getTask)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

export default router;
