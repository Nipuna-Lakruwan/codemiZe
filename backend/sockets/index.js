import socketAuth from "../middleware/socketAuth.js";

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

    if (socket.user.role === "School" || socket.user.role === "Dashboard") {
      socket.join("battleBreakers");
      console.log("BattleBreakers client joined");
    }

    socket.on("battleBreakers-startQuestion", (data) => {
      const { _id, question, startTime, allocatedTime, questionNo } = data;
      io.to("battleBreakers").emit("battleBreakers-startQuestionclient", {
        _id,
        question,
        startTime,
        allocatedTime,
        questionNo,
      });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
      onlineUsers.delete(userId.toString());
    });
  });
};

export default setupSocket;