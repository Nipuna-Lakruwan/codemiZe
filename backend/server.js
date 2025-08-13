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

// Import Common routes
import authRoutes from "./routes/Common/auth.routes.js";
import adminRoutes from "./routes/Common/admin.routes.js";
import gameRoutes from "./routes/Common/game.routes.js";
import criteriaRoutes from "./routes/Common/criteria.routes.js";
import routeSeekersQuestionRoutes from "./routes/Common/routeSeekersQuestion.routes.js";
// Game import routes
import battleBreakerRoutes from "./routes/Games/battleBreaker.routes.js";
import quizHunterRoutes from "./routes/Games/quizHunter.routes.js";
import codeCrusherRoutes from "./routes/Games/codeCrusher.routes.js";
import circuitSmashersRoutes from "./routes/Games/circuitSmashers.routes.js";
import routeSeekersRoutes from "./routes/Games/routeSeekers.route.js";
// Judge import routes
import judgeCircuitSmashersRoutes from "./routes/Judges/circuitSmashers.routes.js";
import judgeCodeCrusherRoutes from "./routes/Judges/codeCrusher.routes.js";
import judgeRouteSeekersRoutes from "./routes/Judges/routeSeekersMarking.routes.js";
import judgeQuizHuntersRoutes from "./routes/Judges/quizHunters.routes.js";

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
app.use("/api/v1/quiz-hunters", quizHunterRoutes);
app.use("/api/v1/code-crushers", codeCrusherRoutes);
app.use("/api/v1/circuit-smashers", circuitSmashersRoutes);
app.use("/api/v1/route-seekers", routeSeekersRoutes);
app.use("/api/v1/criteria", criteriaRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/questions/route-seekers", routeSeekersQuestionRoutes);
// Judge routes :)
app.use("/api/v1/judge/circuit-smashers", judgeCircuitSmashersRoutes);
app.use("/api/v1/judge/quiz-hunters", judgeQuizHuntersRoutes);
app.use("/api/v1/judge/code-crushers", judgeCodeCrusherRoutes);
app.use("/api/v1/judge/route-seekers", judgeRouteSeekersRoutes);

// Connect to DB
connectToDB();

// Static folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));