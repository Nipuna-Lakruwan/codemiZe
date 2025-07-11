import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import setupSocket from "./sockets/index.js";

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
