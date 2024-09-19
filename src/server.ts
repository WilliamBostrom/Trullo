import express, { Request, Response } from "express";
import tasksRouter from "./routes/taskRoute";
// import userRouter from ("./routes/taskRoute");

import connect from "./utils/dbConnection";

const app = express();
app.use(express.json());

// Anslut till databasen
connect();

// Använd router för uppgifter
app.use("/api/tasks", tasksRouter);
// app.use("/api/users", userRouter);

// Ifall 404 på endpoint
app.all("*", (req, res, rext) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

// Starta servern
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
