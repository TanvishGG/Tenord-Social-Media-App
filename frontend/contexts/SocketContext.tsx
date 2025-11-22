"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface UserPresence {
  user_id: string;
  username: string;
  nickname?: string;
  avatar?: string;
}

interface MessageData {
  message_id: string;
  content: string;
  username: string;
  author: string;
  channel: string;
  nickname?: string;
  avatar?: string;
  timestamp: string;
}

interface MessageEditData {
  message_id: string;
  content: string;
}

interface MessageDeleteData {
  message_id: string;
}

interface TypingData {
  user_id: string;
  username: string;
  isTyping: boolean;
}

interface SocketContextType {
  socket: Socket | null;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  sendTyping: (channelId: string, isTyping: boolean) => void;
  onMessage: (callback: (data: MessageData) => void) => void;
  onMessageEdit: (callback: (data: MessageEditData) => void) => void;
  onMessageDelete: (callback: (data: MessageDeleteData) => void) => void;
  onUserOnline: (callback: (data: UserPresence) => void) => void;
  onUserOffline: (callback: (data: { user_id: string }) => void) => void;
  onUserTyping: (callback: (data: TypingData) => void) => void;
  offMessage: (callback: (data: MessageData) => void) => void;
  offMessageEdit: (callback: (data: MessageEditData) => void) => void;
  offMessageDelete: (callback: (data: MessageDeleteData) => void) => void;
  offUserOnline: (callback: (data: UserPresence) => void) => void;
  offUserOffline: (callback: (data: { user_id: string }) => void) => void;
  offUserTyping: (callback: (data: TypingData) => void) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token) {
      const newSocket = io(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080', {
        auth: {
          token,
        },
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else if (socket) {
      socket.close();
      setSocket(null);
    }
  }, [isAuthenticated, token]);

  const joinRoom = useCallback((roomId: string) => {
    if (socket) {
      socket.emit('joinRoom', roomId);
    }
  }, [socket]);

  const leaveRoom = useCallback((roomId: string) => {
    if (socket) {
      socket.emit('leaveRoom', roomId);
    }
  }, [socket]);

  const sendTyping = useCallback((channelId: string, isTyping: boolean) => {
    if (socket) {
      socket.emit('typing', { channelId, isTyping });
    }
  }, [socket]);

  const onMessage = useCallback((callback: (data: MessageData) => void) => {
    if (socket) {
      socket.on('message', callback);
    }
  }, [socket]);

  const onMessageEdit = useCallback((callback: (data: MessageEditData) => void) => {
    if (socket) {
      socket.on('messageEdit', callback);
    }
  }, [socket]);

  const onMessageDelete = useCallback((callback: (data: MessageDeleteData) => void) => {
    if (socket) {
      socket.on('messageDelete', callback);
    }
  }, [socket]);

  const onUserOnline = useCallback((callback: (data: UserPresence) => void) => {
    if (socket) {
      socket.on('userOnline', callback);
    }
  }, [socket]);

  const onUserOffline = useCallback((callback: (data: { user_id: string }) => void) => {
    if (socket) {
      socket.on('userOffline', callback);
    }
  }, [socket]);

  const onUserTyping = useCallback((callback: (data: TypingData) => void) => {
    if (socket) {
      socket.on('userTyping', callback);
    }
  }, [socket]);

  const offMessage = useCallback((callback: (data: MessageData) => void) => {
    if (socket) {
      socket.off('message', callback);
    }
  }, [socket]);

  const offMessageEdit = useCallback((callback: (data: MessageEditData) => void) => {
    if (socket) {
      socket.off('messageEdit', callback);
    }
  }, [socket]);

  const offMessageDelete = useCallback((callback: (data: MessageDeleteData) => void) => {
    if (socket) {
      socket.off('messageDelete', callback);
    }
  }, [socket]);

  const offUserOnline = useCallback((callback: (data: UserPresence) => void) => {
    if (socket) {
      socket.off('userOnline', callback);
    }
  }, [socket]);

  const offUserOffline = useCallback((callback: (data: { user_id: string }) => void) => {
    if (socket) {
      socket.off('userOffline', callback);
    }
  }, [socket]);

  const offUserTyping = useCallback((callback: (data: TypingData) => void) => {
    if (socket) {
      socket.off('userTyping', callback);
    }
  }, [socket]);

  const contextValue: SocketContextType = {
    socket,
    joinRoom,
    leaveRoom,
    sendTyping,
    onMessage,
    onMessageEdit,
    onMessageDelete,
    onUserOnline,
    onUserOffline,
    onUserTyping,
    offMessage,
    offMessageEdit,
    offMessageDelete,
    offUserOnline,
    offUserOffline,
    offUserTyping,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};