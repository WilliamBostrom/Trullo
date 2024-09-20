import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import asyncHandler from "../middlewares/asyncHandler";
import AppError from "../middlewares/AppError";

// Hämta alla användare
export const getAllUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find({});
    res.status(200).json({
      status: "success",
      results: users.length,
      data: { users },
    });
  }
);

// Hämta en specifik användare
export const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: { user },
    });
  }
);

// Skapa en ny användare
export const createUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: "success",
      data: { newUser },
    });
  }
);

// Uppdatera en användare
export const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: { user },
    });
  }
);

// Ta bort en användare
export const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
