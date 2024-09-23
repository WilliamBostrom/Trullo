import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import AppError from "./middlewares/AppError";
import ErrorHandler from "./controllers/ErrorController";
import taskRouter from "./routes/taskRoute";
import userRouter from "./routes/userRoute";

// Skapa Express-app
const app = express();

// Security http headers
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Brute force - Säkerhet för att förhindra för mycket API anrop
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hour",
});
app.use("/api", limiter);

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
