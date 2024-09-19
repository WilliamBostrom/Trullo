import { Request, Response, NextFunction } from "express";
import Task from "../models/taskModel";
import asyncHandler from "../middlewares/asyncHandler";
import AppError from "../middlewares/AppError";

// Hämta alla uppgifter
export const getAllTasks = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const tasks = await Task.find({});
    res.status(200).json({
      status: "success",
      results: tasks.length,
      data: { tasks },
    });
  }
);

// Hämta en specifik uppgift
export const getTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return next(new AppError("No tour found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: { task },
    });
  }
);

// Skapa en ny uppgift
export const createTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const newTask = await Task.create(req.body);
    res.status(200).json({
      status: "success",
      data: { newTask },
    });
  }
);

// Uppdatera en befintlig uppgift
export const updateTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return next(new AppError("No tour found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: { task },
    });
  }
);

// Ta bort en uppgift
export const deleteTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return next(new AppError("No tour found with that ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
