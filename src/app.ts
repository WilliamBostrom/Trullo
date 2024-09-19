import express, { Request, Response, NextFunction } from "express";

const app = express();

import taskRouter from "./routes/taskRoute";

// Utökar Request-typen för att inkludera `requestTime`
interface CustomRequest extends Request {
  requestTime?: string;
}

app.use(express.json());

app.use((req: CustomRequest, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use("/api/tasks", taskRouter);

// Felhantering för okända URL:er
app.all("*", (req: CustomRequest, res: Response) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

export default app;
