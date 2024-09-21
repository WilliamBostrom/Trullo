import { Request, Response, NextFunction } from "express";
import Task from "../models/taskModel";
import asyncHandler from "../middlewares/asyncHandler";
import AppError from "../middlewares/AppError";

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

export const getTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return next(new AppError("No task found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: { task },
    });
  }
);

export const createTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const newTask = await Task.create(req.body);
    res.status(200).json({
      status: "success",
      data: { newTask },
    });
  }
);

export const updateTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return next(new AppError("No task found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: { task },
    });
  }
);

export const deleteTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return next(new AppError("No task found with that ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
