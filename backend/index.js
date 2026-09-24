import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { connectDB } from "./db/connectDB.js";
import senderRoute from "./routes/sender.route.js";

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5001;

app.use("/api/sender", senderRoute);
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

startServer();
