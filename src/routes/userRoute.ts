import express, { Request, Response } from "express";
import * as userController from "../controllers/userController";
import * as authController from "../controllers/authController";

const router = express.Router();

router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);

router.patch("/updateMe", authController.protect, userController.updateMe);

router.delete("/deleteMe", authController.protect, userController.deleteMe);

router.post("/signup", authController.signup);
router.post("/login", authController.login);

//Mailtrap.io används för få email
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// Hantera alla users

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    userController.getAllUsers
  )
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    userController.createUser
  );

// Hantera specifika users (med id)
router
  .route("/:id")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    userController.getUser
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    userController.deleteUser
  );

export default router;
