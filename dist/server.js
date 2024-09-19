"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config({ path: "./config.env" });
// Ersätt lösenordet i databasanropet
const DB = process.env.DATABASE?.replace("<PASSWORD>", process.env.DATABASE_PASSWORD || "");
// Anslut till databasen med mongoose
mongoose_1.default
    .connect(DB)
    .then(() => {
    console.log("Connection successful");
})
    .catch((err) => {
    console.error("Database connection error:", err);
});
// Starta servern
const port = process.env.PORT || 3000;
app_1.default.listen(port, () => {
    console.log(`App running on port ${port}`);
});
