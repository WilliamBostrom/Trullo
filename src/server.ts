import express, { Request, Response } from "express";
import tasksRouter from "./routes/taskRoute";
import connect from "./utils/dbConnection";

const app = express();
app.use(express.json());

// Anslut till databasen
connect();

// Använd router för uppgifter
app.use("/api/tasks", tasksRouter);

// Starta servern
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
