import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (token) => {
  if (socket && socket.connected) {
    console.log("Already connected:", socket.id);
    return socket;
  }

  if (socket){ 
    socket.disconnect();
    socket = null;
  }

  socket = io(import.meta.env.VITE_BACKEND_URL, {
    auth: { token },
    transports: ["websocket"],
    autoConnect: true,
    reconnectionAttempts: 3,
    reconnectionDelay: 1000,
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