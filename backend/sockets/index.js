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

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
      onlineUsers.delete(userId.toString());
    });
  });
};

export default setupSocket;