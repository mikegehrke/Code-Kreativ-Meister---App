import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'sonner';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
  userId?: string;
  roomId?: string;
}

interface WebSocketContextType {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  sendMessage: (message: WebSocketMessage) => void;
  subscribe: (eventType: string, callback: (data: any) => void) => () => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  getOnlineUsers: (roomId?: string) => string[];
  reconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: React.ReactNode;
  url?: string;
  userId?: string;
  autoConnect?: boolean;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  url = 'ws://localhost:8081',
  userId,
  autoConnect = true
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [onlineUsers, setOnlineUsers] = useState<Record<string, string[]>>({});
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const subscribersRef = useRef<Record<string, ((data: any) => void)[]>>({});
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 1000;

  // Initialize WebSocket connection
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus('connecting');
    
    try {
      const wsUrl = userId ? `${url}?userId=${userId}` : url;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;
        
        // Send initial connection message
        if (userId) {
          sendMessage({
            type: 'user_connected',
            data: { userId },
            timestamp: Date.now()
          });
        }
        
        toast.success('Real-time Verbindung hergestellt');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        setIsConnected(false);
        setConnectionStatus('disconnected');
        
        if (!event.wasClean && reconnectAttemptsRef.current < maxReconnectAttempts) {
          scheduleReconnect();
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('error');
        
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          scheduleReconnect();
        } else {
          toast.error('Verbindung fehlgeschlagen - Bitte Seite neu laden');
        }
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionStatus('error');
    }
  }, [url, userId]);

  // Schedule reconnection
  const scheduleReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    const delay = reconnectDelay * Math.pow(2, reconnectAttemptsRef.current);
    reconnectAttemptsRef.current++;

    reconnectTimeoutRef.current = setTimeout(() => {
      console.log(`Reconnecting... Attempt ${reconnectAttemptsRef.current}`);
      connect();
    }, delay);
  }, [connect]);

  // Handle incoming messages
  const handleMessage = useCallback((message: WebSocketMessage) => {
    const { type, data } = message;

    // Handle system messages
    switch (type) {
      case 'user_joined':
        if (data.roomId) {
          setOnlineUsers(prev => ({
            ...prev,
            [data.roomId]: [...(prev[data.roomId] || []), data.userId]
          }));
        }
        break;
      
      case 'user_left':
        if (data.roomId) {
          setOnlineUsers(prev => ({
            ...prev,
            [data.roomId]: (prev[data.roomId] || []).filter(id => id !== data.userId)
          }));
        }
        break;
      
      case 'online_users_update':
        if (data.roomId) {
          setOnlineUsers(prev => ({
            ...prev,
            [data.roomId]: data.users
          }));
        }
        break;

      case 'new_message':
        // Show notification for new messages
        if (data.userId !== userId) {
          toast.success(`Neue Nachricht von ${data.username || 'Unbekannt'}`);
        }
        break;

      case 'new_like':
        if (data.targetUserId === userId) {
          toast.success(`${data.username} hat dein Video geliked! ❤️`);
        }
        break;

      case 'new_comment':
        if (data.targetUserId === userId) {
          toast.success(`${data.username} hat dein Video kommentiert! 💬`);
        }
        break;

      case 'new_follower':
        if (data.targetUserId === userId) {
          toast.success(`${data.username} folgt dir jetzt! 👥`);
        }
        break;

      case 'live_stream_started':
        toast.info(`${data.username} ist jetzt live! 🔴`);
        break;

      case 'gift_received':
        if (data.recipientId === userId) {
          toast.success(`Du hast ein ${data.giftName} ${data.giftEmoji} erhalten!`);
        }
        break;
    }

    // Notify subscribers
    const subscribers = subscribersRef.current[type] || [];
    subscribers.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in WebSocket subscriber:', error);
      }
    });
  }, [userId]);

  // Send message through WebSocket
  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        ...message,
        userId: userId || message.userId,
        timestamp: Date.now()
      }));
    } else {
      console.warn('WebSocket not connected, message not sent:', message);
    }
  }, [userId]);

  // Subscribe to specific event types
  const subscribe = useCallback((eventType: string, callback: (data: any) => void) => {
    if (!subscribersRef.current[eventType]) {
      subscribersRef.current[eventType] = [];
    }
    
    subscribersRef.current[eventType].push(callback);

    // Return unsubscribe function
    return () => {
      subscribersRef.current[eventType] = subscribersRef.current[eventType]?.filter(
        cb => cb !== callback
      ) || [];
    };
  }, []);

  // Join a room (for chat, live streams, etc.)
  const joinRoom = useCallback((roomId: string) => {
    sendMessage({
      type: 'join_room',
      data: { roomId, userId },
      timestamp: Date.now()
    });
  }, [sendMessage, userId]);

  // Leave a room
  const leaveRoom = useCallback((roomId: string) => {
    sendMessage({
      type: 'leave_room',
      data: { roomId, userId },
      timestamp: Date.now()
    });
  }, [sendMessage, userId]);

  // Get online users for a room
  const getOnlineUsers = useCallback((roomId?: string) => {
    if (roomId) {
      return onlineUsers[roomId] || [];
    }
    return Object.values(onlineUsers).flat();
  }, [onlineUsers]);

  // Manual reconnect
  const reconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect]);

  // Initialize connection
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect, autoConnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const contextValue: WebSocketContextType = {
    isConnected,
    connectionStatus,
    sendMessage,
    subscribe,
    joinRoom,
    leaveRoom,
    getOnlineUsers,
    reconnect
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};

// Hook for real-time notifications
export const useRealTimeNotifications = (userId?: string) => {
  const { subscribe, isConnected } = useWebSocket();

  useEffect(() => {
    if (!isConnected || !userId) return;

    const unsubscribers = [
      subscribe('new_message', (data) => {
        if (data.recipientId === userId) {
          // Handle new message notification
          console.log('New message received:', data);
        }
      }),

      subscribe('new_like', (data) => {
        if (data.targetUserId === userId) {
          // Handle new like notification
          console.log('New like received:', data);
        }
      }),

      subscribe('new_comment', (data) => {
        if (data.targetUserId === userId) {
          // Handle new comment notification
          console.log('New comment received:', data);
        }
      }),

      subscribe('new_follower', (data) => {
        if (data.targetUserId === userId) {
          // Handle new follower notification
          console.log('New follower:', data);
        }
      })
    ];

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [subscribe, isConnected, userId]);
};

// Hook for live chat
export const useLiveChat = (roomId: string, userId?: string) => {
  const { sendMessage, subscribe, joinRoom, leaveRoom, getOnlineUsers, isConnected } = useWebSocket();
  const [messages, setMessages] = useState<any[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    if (!isConnected || !roomId) return;

    // Join the room
    joinRoom(roomId);

    // Subscribe to chat messages
    const unsubscribeMessages = subscribe('chat_message', (data) => {
      if (data.roomId === roomId) {
        setMessages(prev => [...prev, data]);
      }
    });

    // Subscribe to online users updates
    const unsubscribeUsers = subscribe('online_users_update', (data) => {
      if (data.roomId === roomId) {
        setOnlineCount(data.users.length);
      }
    });

    return () => {
      leaveRoom(roomId);
      unsubscribeMessages();
      unsubscribeUsers();
    };
  }, [roomId, isConnected, joinRoom, leaveRoom, subscribe]);

  const sendChatMessage = useCallback((message: string, type: 'text' | 'emoji' | 'gift' = 'text') => {
    if (!message.trim() || !isConnected) return;

    sendMessage({
      type: 'chat_message',
      data: {
        roomId,
        userId,
        message: message.trim(),
        messageType: type,
        timestamp: Date.now()
      },
      timestamp: Date.now()
    });
  }, [sendMessage, roomId, userId, isConnected]);

  return {
    messages,
    onlineCount,
    onlineUsers: getOnlineUsers(roomId),
    sendChatMessage,
    isConnected
  };
};

// Connection status indicator component
export const WebSocketStatus: React.FC = () => {
  const { connectionStatus, reconnect } = useWebSocket();

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'disconnected': return 'text-gray-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Online';
      case 'connecting': return 'Verbinde...';
      case 'disconnected': return 'Offline';
      case 'error': return 'Fehler';
      default: return 'Unbekannt';
    }
  };

  if (connectionStatus === 'connected') {
    return null; // Don't show when everything is working
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-full bg-black/80 text-white text-sm ${getStatusColor()}`}>
        <div className={`w-2 h-2 rounded-full ${
          connectionStatus === 'connecting' ? 'animate-pulse bg-yellow-500' :
          connectionStatus === 'connected' ? 'bg-green-500' :
          connectionStatus === 'error' ? 'bg-red-500' : 'bg-gray-500'
        }`} />
        <span>{getStatusText()}</span>
        {(connectionStatus === 'error' || connectionStatus === 'disconnected') && (
          <button
            onClick={reconnect}
            className="ml-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
          >
            Neu verbinden
          </button>
        )}
      </div>
    </div>
  );
};
