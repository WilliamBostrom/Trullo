import express, { Request, Response } from "express";

import * as taskController from "../controllers/taskController";
import * as authController from "../controllers/authController";

const router = express.Router();

router
  .route("/")
  .get(authController.protect, taskController.getAllTasks)
  .post(authController.protect, taskController.createTask);

router
  .route("/:id")
  .get(authController.protect, taskController.getTask) // Alla kan se en specifik uppgift
  .patch(
    authController.protect,
    authController.restrictTo("admin", "user"),
    taskController.restrictToOwnerOrAdmin,
    taskController.updateTask
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "user"),
    taskController.restrictToOwnerOrAdmin,
    taskController.deleteTask
  );

export default router;
