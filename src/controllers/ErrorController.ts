import { Request, Response, NextFunction } from "express";
import { AppError } from "../types/error";

const sendErrorDev = (err: AppError, res: Response) => {
  const statusCode = err.statusCode ?? 500;
  res.status(statusCode).json({
    status: err.status || "error",
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
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
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(err, res);
  }
};

export default errorController;
