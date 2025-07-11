import express from "express";
import cors from "cors";
import path from "path";
import connectToDB from "./config/db.js";
import logger from "./middleware/logger.js";

const app = express();

// Connect to DB
connectToDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Static folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

export default app;