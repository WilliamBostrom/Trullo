import mongoose, { Document, Schema } from "mongoose";

// Definiera ett interface för Task för att få typade fält
interface ITask extends Document {
  title: string;
  description: string;
  status: "to-do" | "in progress" | "blocked" | "done";
  assignedTo: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  finishedBy?: Date; // Optional
}

// Skapa Task-schema
const taskSchema: Schema<ITask> = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
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

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;
