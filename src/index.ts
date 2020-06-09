import express from 'express';
import socketio from 'socket.io';
import http from 'http';
import {
  addUser,
  findUserById,
  findUserIndexById,
  removeUserById,
  getUsers,
} from './services/service.user';

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = 3000;

io.on('connection', (socket: SocketIO.Socket) => {
  console.log('connected');
  const { id } = socket;
  const currentuser = findUserById(id);

  socket.on('new-user', (name: string) => {
    addUser(id, name);
    socket.broadcast.emit('user-connected', name);
  });
  socket.on('send-chat-message', (message: string) => {
    console.log(getUsers());

    socket.broadcast.emit('chat-message', {
      message: message,
      name: currentuser && currentuser.name,
    });
  });
  socket.on('disconnect', () => {
    const currentuser = findUserById(id);
    socket.broadcast.emit('user-disconnected', currentuser && currentuser.name);
    const index = findUserIndexById(id);
    index !== -1 && removeUserById(index);
  });
});

server.listen(PORT);
