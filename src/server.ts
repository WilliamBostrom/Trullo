import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";
dotenv.config({ path: "./config.env" });

// Ersätt lösenordet i databasanropet
const DB = process.env.DATABASE?.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD || ""
);

// Anslut till databasen med mongoose
mongoose
  .connect(DB as string)
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// Starta servern
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
