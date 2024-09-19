import { Request, Response } from "express";
import Task from "../models/taskModel";

// Hämta alla uppgifter
export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({});
    res.status(200).json({
      status: "success",
      results: tasks.length,
      data: { tasks },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Error retrieving tasks",
    });
  }
};

// Hämta en specifik uppgift
export const getTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        status: "fail",
        message: "Task not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: { task },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Error retrieving task",
    });
  }
};

// Skapa en ny uppgift
export const createTask = async (req: Request, res: Response) => {
  try {
    const newTask = await Task.create(req.body);
    res.status(200).json({
      status: "success",
      data: { newTask },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Uppdatera en befintlig uppgift
export const updateTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return res.status(404).json({
        status: "fail",
        message: "Task not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: { task },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Error updating task",
    });
  }
};

// Ta bort en uppgift
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({
        status: "fail",
        message: "Task not found",
      });
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Error deleting task",
    });
  }
};
