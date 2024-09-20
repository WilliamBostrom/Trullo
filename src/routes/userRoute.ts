import express, { Request, Response } from "express";
import * as userController from "../controllers/userController";
import * as authController from "../controllers/authController";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

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
