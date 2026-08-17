import { WebSocketServer } from 'ws';
import type { WebSocket } from 'ws';
import type { Server } from 'http';
import { ClientMessageSchema } from './schemas';

export function attachWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });
  wss.on('connection', (socket: WebSocket) => {
    console.log('Connection established');

    socket.on('message', (raw)=>{
        let parsed;
        try{
            parsed = JSON.parse(raw.toString());
        }catch{
            socket.send(JSON.stringify({type: 'ERROR', message: 'Invalid JSON'}));
            return;
        }

        const result = ClientMessageSchema.safeParse(parsed);
        if(!result.success){
            socket.send(JSON.stringify({type: 'ERROR', message: 'Invalid message shape'}))
            return;
        }

        const msg = result.data;

        switch (msg.type) {
            case 'WATCH_WAREHOUSE':
                //
                break;

            case 'TRANSFER':
                //
                break;
        }
    })
    socket.on('close', () => console.log('Connection ended'));
  });
  return wss;
}