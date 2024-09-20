import express, { Request, Response } from "express";
import * as userController from "../controllers/userController";

const router = express.Router();

// Hantera alla users
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

// Hantera specifika users (med id)
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
