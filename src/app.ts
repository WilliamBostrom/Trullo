import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import AppError from "./middlewares/AppError";
import ErrorHandler from "./controllers/ErrorController";
import taskRouter from "./routes/taskRoute";
import userRouter from "./routes/userRoute";

// Skapa Express-app
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Utöka Request-typen för att inkludera `requestTime`
interface CustomRequest extends Request {
  requestTime?: string;
}

// Middleware för att lägga till requestTime
app.use(express.json());

app.use((req: CustomRequest, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use("/api/tasks", taskRouter);
app.use("/api/users", userRouter);

// Felhantering för okända URL:er
app.all("*", (req: CustomRequest, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global felhanterare
app.use(ErrorHandler);

export default app;
