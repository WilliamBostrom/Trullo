"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTask = exports.getAllTasks = void 0;
const taskModel_1 = __importDefault(require("../models/taskModel"));
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const AppError_1 = __importDefault(require("../middlewares/AppError"));
// Hämta alla uppgifter
exports.getAllTasks = (0, asyncHandler_1.default)(async (req, res, next) => {
    const tasks = await taskModel_1.default.find({});
    res.status(200).json({
        status: "success",
        results: tasks.length,
        data: { tasks },
    });
});
// Hämta en specifik uppgift
exports.getTask = (0, asyncHandler_1.default)(async (req, res, next) => {
    const task = await taskModel_1.default.findById(req.params.id);
    if (!task) {
        return next(new AppError_1.default("No tour found with that ID", 404));
    }
    res.status(200).json({
        status: "success",
        data: { task },
    });
});
// Skapa en ny uppgift
exports.createTask = (0, asyncHandler_1.default)(async (req, res, next) => {
    const newTask = await taskModel_1.default.create(req.body);
    res.status(200).json({
        status: "success",
        data: { newTask },
    });
});
// Uppdatera en befintlig uppgift
exports.updateTask = (0, asyncHandler_1.default)(async (req, res, next) => {
    const task = await taskModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!task) {
        return next(new AppError_1.default("No tour found with that ID", 404));
    }
    res.status(200).json({
        status: "success",
        data: { task },
    });
});
// Ta bort en uppgift
exports.deleteTask = (0, asyncHandler_1.default)(async (req, res, next) => {
    const task = await taskModel_1.default.findByIdAndDelete(req.params.id);
    if (!task) {
        return next(new AppError_1.default("No tour found with that ID", 404));
    }
    res.status(204).json({
        status: "success",
        data: null,
    });
});
