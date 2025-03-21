
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
    // First check if the message is JSON
    if (data.trim().startsWith('{') || data.trim().startsWith('[')) {
      return JSON.parse(data);
    } else {
      // Handle non-JSON messages - just echo them back as text messages
      console.log('Received non-JSON message:', data);
      return { type: 'text', payload: data };
    }
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

// Replace echo.websocket.events with a more stable WebSocket service
// Using a free signaling server for WebRTC and WebSocket communication
export const WEBSOCKET_URL = 'wss://socketsbay.com/wss/v2/1/demo/';

