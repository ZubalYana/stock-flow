import { WebSocketServer } from 'ws';
import type { Server } from 'http';

export function attachWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });
  wss.on('connection', (socket) => {
    console.log('Connection established');
    socket.on('close', () => console.log('Connection ended'));
  });
  return wss;
}