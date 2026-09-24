import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDB } from "./db/connectDB.js";
import senderRoute from "./routes/sender.route.js";

const app = express();
app.use(express.json());
const port = Number(process.env.PORT) || 5001;

app.use("/api/sender", senderRoute);

app.listen(port, () => {
  connectDB();
  console.log(`Server running at http://localhost:${port}`);
});
