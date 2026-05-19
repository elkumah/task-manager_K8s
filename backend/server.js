import crypto from "node:crypto";

// This fixes the "crypto is not defined" error in the MongoDB driver
if (!global.crypto) {
  global.crypto = crypto;
}
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import todoRoutes from "./routes/todo.js";

dotenv.config({
  override: false, // Docker env vars take priority
});
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
//Add health route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});
app.use("/api/todos", todoRoutes);

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;

console.log("Using Mongo URI:", mongoURI);

if (!mongoURI) {
  console.error("❌ MONGO_URI is not defined");
  process.exit(1);
}
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
