import { createContext, useEffect, useState } from "react";
import {
  connectSocket,
  getSocket,
  disconnectSocket,
} from "../utils/socket";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    console.log("Attempting to connect socket with HttpOnly cookie");
    const s = connectSocket();
    if (s) {
      setSocket(s);
      s.on("connect", () => console.log("Socket connected:", s.id));
      s.on("connect_error", (err) => console.error("Socket connection error:", err.message));
      s.on("disconnect", () => console.log("Socket disconnected"));
    }

    return () => {
      disconnectSocket();
    };
  }, []);

  // Handle login/logout explicitly
  useEffect(() => {
    const handleLogin = () => { 
      if (socket && socket.connected) return;

      const s = connectSocket();
      if (s) {
        setSocket(s);
        s.on("connect_error", (err) => console.error("Socket connection error:", err.message));
      }
    };

    const handleLogout = () => {
      disconnectSocket();
      setSocket(null);
    };

    window.addEventListener("login", handleLogin);
    window.addEventListener("logout", handleLogout);

    // ⚠️ Vite Hot Reload cleanup
    if (import.meta.hot) {
      import.meta.hot.dispose(() => {
        disconnectSocket();
      });
    }

    return () => {
      window.removeEventListener("login", handleLogin);
      window.removeEventListener("logout", handleLogout);
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};