import express from 'express';
import socketio from 'socket.io';
import http from 'http';
import cors from 'cors';
import { handleNewUser, handleMessage, handleDisconnect, handleTermination } from './controllers/controller.chatroom';

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.set('port', PORT);
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket: SocketIO.Socket) => {
  socket.on('new-user', handleNewUser(socket));

  socket.on('send-chat-message', handleMessage(socket));

  socket.on('disconnect', handleDisconnect(socket));

  socket.on('logout', handleDisconnect(socket));
});

process.on('SIGTERM', handleTermination(io, server));

process.on('SIGINT', handleTermination(io, server));

server.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
