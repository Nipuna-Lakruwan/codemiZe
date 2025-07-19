import jwt from "jsonwebtoken";

const socketAuth = (io) => {
  io.use((socket, next) => {
    let token;
    // If no token in auth, try to get from cookies
    if (socket.handshake.headers.cookie) {
      const cookies = socket.handshake.headers.cookie.split(';')
        .map(cookie => cookie.trim().split('='))
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
      
      token = cookies.token;
    }

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