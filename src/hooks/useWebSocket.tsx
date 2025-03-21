
import { useState, useEffect, useRef, useCallback } from 'react';
import { createWebSocketConnection, parseSocketMessage, sendSocketMessage, SocketMessage } from '@/lib/socket';

type UseWebSocketOptions = {
  url: string;
  onMessage?: (message: SocketMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
};

export function useWebSocket({
  url,
  onMessage,
  onOpen,
  onClose,
  onError,
  autoReconnect = true,
  reconnectInterval = 5000,
  maxReconnectAttempts = 5,
}: UseWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [messageHistory, setMessageHistory] = useState<SocketMessage[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<number | null>(null);

  // Connect to WebSocket
  const connect = useCallback(() => {
    try {
      const socket = createWebSocketConnection(url);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('WebSocket connection opened');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        onOpen?.();
      };

      socket.onmessage = (event) => {
        const message = parseSocketMessage(event.data);
        setMessageHistory((prev) => [...prev, message]);
        onMessage?.(message);
      };

      socket.onclose = (event) => {
        console.log('WebSocket connection closed', event);
        setIsConnected(false);
        onClose?.();

        if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectTimeoutRef.current = window.setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connect();
          }, reconnectInterval);
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        onError?.(error);
      };
    } catch (err) {
      console.error('Failed to connect to WebSocket:', err);
    }
  }, [url, onMessage, onOpen, onClose, onError, autoReconnect, reconnectInterval, maxReconnectAttempts]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  // Send a message through the WebSocket
  const send = useCallback((type: string, payload: any) => {
    if (socketRef.current) {
      sendSocketMessage(socketRef.current, type, payload);
    }
  }, []);

  // Clean up on unmount
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    isConnected,
    messageHistory,
    send,
    connect,
    disconnect,
  };
}
