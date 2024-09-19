"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Skapa Task-schema
const taskSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: [true, "A task must have a title"],
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        required: [true, "A task must have a description"],
        trim: true,
    },
    status: {
        type: String,
        enum: ["to-do", "in progress", "blocked", "done"],
        default: "to-do",
        required: [true, "A task must have a status"],
    },
    assignedTo: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        // type: String,
        ref: "User",
        required: [true, "A task must be assigned to a user"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    finishedBy: {
        type: Date,
    },
});
// Skapa och exportera Task-modellen baserad på schema och interface
const Task = mongoose_1.default.model("Task", taskSchema);
exports.default = Task;
