import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";
dotenv.config({ path: "./config.env" });

// Fånga okontrollerade synkrona undantag
process.on("uncaughtException", (err: Error) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// Ersätt lösenordet i databasanropet
const DB = process.env.DATABASE?.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD || ""
);

// Anslut till databasen med mongoose
async function main() {
  await mongoose.connect(DB as string).then((con) => {
    console.log("Connection successful");
  });
}
main().catch((err: Error) => {
  console.log("DATABASE CONNECTION FAILED! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// Starta servern
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
