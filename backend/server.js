import dotenv from "dotenv";
dotenv.config({ quiet: true });
import http from "http";
import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from 'cookie-parser';
import connectToDB from "./config/db.js";
import logger from "./middleware/logger.js";
import { Server } from "socket.io";
import setupSocket from "./sockets/index.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import gameRoutes from "./routes/game.routes.js";
import battleBreakerRoutes from "./routes/battleBreaker.routes.js";
import quizHunterRoutes from "./routes/quizHunter.routes.js";
import codeCrusherRoutes from "./routes/codeCrusher.routes.js";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

const port = process.env.PORT || 8000;
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.set("io", io);
app.set("onlineUsers", new Map());

setupSocket(io, app);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/games", gameRoutes);
app.use("/api/v1/battle-breakers", battleBreakerRoutes);
app.use("/api/v1/quiz-hunters", quizHunterRoutes)
app.use("/api/v1/code-crushers", codeCrusherRoutes);

// Connect to DB
connectToDB();

// Static folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));