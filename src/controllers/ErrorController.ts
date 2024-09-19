import { Request, Response, NextFunction } from "express";
import { AppErrorTypes } from "../types/error";
import AppError from "../middlewares/AppError";

interface ValidationEl {
  message: any;
}

const handleCastErrorDB = (err: AppErrorTypes): AppError => {
  const message = `Invalid string value: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFields = (err: AppErrorTypes) => {
  if (err.keyValue) {
    const value = Object.values(err.keyValue)[0];
    const message = `Duplicate field value: ${value}. Use another value.`;
    return new AppError(message, 400);
  }
  return new AppError("Duplicate field error", 400);
};

const handleValidationErrorDB = (err: AppErrorTypes): AppError => {
  const errors = Object.values(err.errors).map((el) => {
    const validationError = el as ValidationEl;
    return validationError.message;
  });

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err: AppErrorTypes, res: Response) => {
  const statusCode = err.statusCode ?? 500;
  res.status(statusCode).json({
    status: err.status || "error",
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppErrorTypes, res: Response) => {
  const statusCode = err.statusCode ?? 500;
  if (err.isOperational) {
    res.status(statusCode).json({
      status: err.status || "error",
      message: err.message,
    });
  } else {
    console.error("ERROR", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

// Error middleware
const errorController = (
  err: AppErrorTypes,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFields(error);
    if (error._message === "Validation failed")
      error = handleValidationErrorDB(error);
    sendErrorProd(error, res);
  }
};

export default errorController;
