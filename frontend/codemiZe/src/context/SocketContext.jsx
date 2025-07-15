import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { ROLES, isAdmin, isJudge, isSchool } from '../utils/roleConstants';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.token) {
      // Create socket connection with authentication
      const newSocket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', {
        auth: {
          token: user.token
        },
        transports: ['websocket', 'polling'],
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setIsConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user?.token]);

  const joinGame = (gameType, role) => {
    if (socket && user) {
      // Only allow school (student) role to join games
      if (!isSchool(user.role)) {
        console.warn('Only students can join games');
        return false;
      }
      
      socket.emit('join_game', { 
        gameType, 
        role, 
        userRole: user.role,
        userId: user.id 
      });
      return true;
    }
    return false;
  };

  const emitBuzzerPress = (data) => {
    if (socket && user) {
      // Only allow school (student) role to press buzzers
      if (!isSchool(user.role)) {
        console.warn('Only students can press buzzers');
        return false;
      }
      
      socket.emit('buzzer_press', { 
        ...data, 
        userRole: user.role,
        userId: user.id 
      });
      return true;
    }
    return false;
  };

  const emitAdminAction = (action, data) => {
    if (socket && user) {
      // Only allow admin role to perform admin actions
      if (!isAdmin(user.role)) {
        console.warn('Only admins can perform admin actions');
        return false;
      }
      
      socket.emit(action, { 
        ...data, 
        userRole: user.role,
        userId: user.id,
        timestamp: new Date().toISOString()
      });
      return true;
    }
    return false;
  };

  const emitJudgeAction = (action, data) => {
    if (socket && user) {
      // Only allow judge or admin role to perform judge actions
      if (!isJudge(user.role) && !isAdmin(user.role)) {
        console.warn('Only judges and admins can perform judge actions');
        return false;
      }
      
      socket.emit(action, { 
        ...data, 
        userRole: user.role,
        userId: user.id,
        timestamp: new Date().toISOString()
      });
      return true;
    }
    return false;
  };

  const safeEmit = (event, data, requiredRoles) => {
    if (!socket || !user) return false;
    
    const userRoles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    
    if (!userRoles.includes(user.role)) {
      console.warn(`Socket event '${event}' denied: insufficient permissions`);
      return false;
    }
    
    socket.emit(event, { 
      ...data, 
      userRole: user.role,
      userId: user.id,
      timestamp: new Date().toISOString()
    });
    return true;
  };

  const emitBattleBreakersDashboard = (action, data) => {
    // Battle Breakers dashboard is admin-only
    return emitAdminAction(action, data);
  };

  const value = {
    socket,
    isConnected,
    joinGame,
    emitBuzzerPress,
    emitAdminAction,
    emitJudgeAction,
    safeEmit,
    emitBattleBreakersDashboard,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
