import express from 'express';
import socketio from 'socket.io';
import http from 'http';
import { handleNewUser, handleMessage, handleDisconnect, handleTermination } from './controllers/controller.chatroom';

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = 8080;

io.on('connection', (socket: SocketIO.Socket) => {
  socket.on('new-user', handleNewUser(socket));

  socket.on('send-chat-message', handleMessage(socket));

  socket.on('disconnect', handleDisconnect(socket));
});

process.on('SIGTERM', handleTermination(io, server));

process.on('SIGINT', handleTermination(io, server));

server.listen(PORT);
