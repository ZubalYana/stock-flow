import {app} from './app';
import http from 'http';
import { attachWebSocket } from './websocket/wss.js';

const server = http.createServer(app)
attachWebSocket(server)

const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=>console.log(`Server running on ${PORT}`))