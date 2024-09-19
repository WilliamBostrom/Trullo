"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../middlewares/AppError"));
const handleCastErrorDB = (err) => {
    const message = `Invalid string value: ${err.value}`;
    return new AppError_1.default(message, 400);
};
const handleDuplicateFields = (err) => {
    if (err.keyValue) {
        const value = Object.values(err.keyValue)[0];
        const message = `Duplicate field value: ${value}. Use another value.`;
        return new AppError_1.default(message, 400);
    }
    return new AppError_1.default("Duplicate field error", 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => {
        const validationError = el;
        return validationError.message;
    });
    const message = `Invalid input data. ${errors.join(". ")}`;
    return new AppError_1.default(message, 400);
};
const sendErrorDev = (err, res) => {
    const statusCode = err.statusCode ?? 500;
    res.status(statusCode).json({
        status: err.status || "error",
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
const sendErrorProd = (err, res) => {
    const statusCode = err.statusCode ?? 500;
    if (err.isOperational) {
        res.status(statusCode).json({
            status: err.status || "error",
            message: err.message,
        });
    }
    else {
        console.error("ERROR", err);
        res.status(500).json({
            status: "error",
            message: "Something went very wrong!",
        });
    }
};
// Error middleware
const errorController = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    }
    else if (process.env.NODE_ENV === "production") {
        let error = { ...err };
        if (error.name === "CastError")
            error = handleCastErrorDB(error);
        if (error.code === 11000)
            error = handleDuplicateFields(error);
        if (error._message === "Validation failed")
            error = handleValidationErrorDB(error);
        sendErrorProd(error, res);
    }
};
exports.default = errorController;
