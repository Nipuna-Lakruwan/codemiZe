import jwt from "jsonwebtoken";

const socketAuth = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = user;
      next();
    } catch (err) {
      return next(new Error("Authentication error"));
    }
  });
};

export default socketAuth;