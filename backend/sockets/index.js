import socketAuth from "../middleware/socketAuth.js";
import battleBreakersHandler from "./games/battleBreakers.js";
import codeCrushersHandler from "./games/codeCrushers.js";
import circuitSmashersHandler from "./games/circuitSmashers.js";
import routeSeekersHandler from "./games/routeSeekers.js";

const setupSocket = (io, app) => {
  const onlineUsers = app.get("onlineUsers");

  socketAuth(io);

  io.on("connection", (socket) => {
    const userId = socket.user?.id;

    if (!userId) {
      console.error("User not authenticated.");
      return;
    }

    console.log(`User connected: ${userId}`);
    onlineUsers.set(userId, socket.id);

    if (socket.user.role === "Dashboard") {
      socket.join("scoreboard");
      console.log("Scoreboard client joined");
    }

    if (socket.user.role === "School") {
      socket.join("student");
      console.log("Student client joined");
    }

    // Initialize game handlers based on user role
    if (socket.user.role === "School" || socket.user.role === "Dashboard" || socket.user.role === "Admin") {
      battleBreakersHandler.initializeClient(socket, io);
      codeCrushersHandler.initializeClient(socket, io);
      circuitSmashersHandler.initializeClient(socket, io);
      routeSeekersHandler.initializeClient(socket, io);
    }

    // Global event handlers
    socket.on("displayWinners", () => {
      io.to("student").emit("finalists");
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
      onlineUsers.delete(userId.toString());
    });
  });
};

export default setupSocket;