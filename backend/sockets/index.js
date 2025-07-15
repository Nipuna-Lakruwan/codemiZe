import socketAuth from "../middleware/socketAuth.js";

const setupSocket = (io, app) => {
  const onlineUsers = app.get("onlineUsers");

  socketAuth(io); // Authenticate first

  io.on("connection", (socket) => {
    const userId = socket.user?.id;

    if (!userId) {
      console.error("User not authenticated.");
      return;
    }

    console.log(`User connected: ${userId}`);
    onlineUsers.set(userId, socket.id);

    // Handle buzzer press events
    socket.on("buzzer_press", (data) => {
      console.log(`Buzzer pressed by user: ${userId}`, data);
      
      // Broadcast buzzer press to all connected clients (especially dashboard)
      io.emit("buzzer_pressed", {
        userId,
        school: data.school,
        questionNumber: data.questionNumber,
        timestamp: new Date().toISOString(),
        user: socket.user
      });
    });

    // Handle joining game rooms
    socket.on("join_game", (gameData) => {
      const { gameType, role } = gameData;
      const roomName = `${gameType}_${role}`;
      
      socket.join(roomName);
      console.log(`User ${userId} joined room: ${roomName}`);
      
      if (role === "dashboard") {
        socket.join("battle_breakers_dashboard");
      } else if (role === "student") {
        socket.join("battle_breakers_student");
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
      onlineUsers.delete(userId.toString());
    });
  });
};

export default setupSocket;