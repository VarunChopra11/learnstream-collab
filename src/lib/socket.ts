
// Socket utility functions for handling WebSocket connections
export type SocketMessage = {
  type: string;
  payload: any;
};

// Function to create a WebSocket connection
export function createWebSocketConnection(url: string): WebSocket {
  const socket = new WebSocket(url);
  
  socket.onopen = () => {
    console.log('WebSocket connection established');
  };
  
  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  return socket;
}

// Parse incoming WebSocket messages
export function parseSocketMessage(data: string): SocketMessage {
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing socket message:', error);
    return { type: 'error', payload: null };
  }
}

// Send a message through the WebSocket connection
export function sendSocketMessage(socket: WebSocket, type: string, payload: any): void {
  if (socket.readyState === WebSocket.OPEN) {
    const message: SocketMessage = { type, payload };
    socket.send(JSON.stringify(message));
  } else {
    console.warn('WebSocket is not connected. Message not sent.');
  }
}

// For demo purposes, we'll use a mock WebSocket server
// In a real application, replace this with your actual WebSocket server URL
export const WEBSOCKET_URL = 'wss://echo.websocket.events';
