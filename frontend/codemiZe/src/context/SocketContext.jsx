import { createContext, useEffect, useState } from "react";
import {
  connectSocket,
  getSocket,
  disconnectSocket,
} from "../utils/socket";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  // Reconnect socket after page reload if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const s = connectSocket(token);
      setSocket(s);

      s.on("connect", () => console.log("Socket reconnected on refresh:", s.id));
      s.on("disconnect", () => console.log("Socket disconnected"));
    }

    return () => {
      disconnectSocket();
    };
  }, []);

  // Handle login/logout explicitly
  useEffect(() => {
    const handleLogin = () => {
      const token = localStorage.getItem("token");
      if (!token || (socket && socket.connected)) return;

      const s = connectSocket(token);
      setSocket(s);
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
