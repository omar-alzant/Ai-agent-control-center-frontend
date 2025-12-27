import { io, Socket } from 'socket.io-client';

// The URL should match your backend server address
const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  // This helps prevent CORS issues during development
  withCredentials: true,
  transports: ["websocket"]
});