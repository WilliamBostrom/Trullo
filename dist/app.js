"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const AppError_1 = __importDefault(require("./middlewares/AppError"));
const ErrorController_1 = __importDefault(require("./controllers/ErrorController"));
const taskRoute_1 = __importDefault(require("./routes/taskRoute"));
// Skapa Express-app
const app = (0, express_1.default)();
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
// Middleware för att lägga till requestTime
app.use(express_1.default.json());
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});
// Routes
app.use("/api/tasks", taskRoute_1.default);
// Felhantering för okända URL:er
app.all("*", (req, res, next) => {
    next(new AppError_1.default(`Can't find ${req.originalUrl} on this server`, 404));
});
// Global felhanterare
app.use(ErrorController_1.default);
exports.default = app;
