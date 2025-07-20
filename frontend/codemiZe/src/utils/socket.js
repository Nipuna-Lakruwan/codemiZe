import { io } from "socket.io-client";

let socket = null;

export const connectSocket = () => {
  if (socket && socket.connected) {
    console.log("Already connected:", socket.id);
    return socket;
  }

  if (socket) {
    console.log("Disconnecting existing socket");
    socket.disconnect();
    socket = null;
  }

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
  console.log("Creating new socket connection to:", backendUrl);

  socket = io(backendUrl, {
    transports: ["websocket"],
    autoConnect: true,
    reconnectionAttempts: 3,
    reconnectionDelay: 1000,
    withCredentials: true, // This enables sending cookies with the request
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};