import express from 'express';
import socketio from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = 3000;

interface User {
  id: string;
  name: string;
}
let users: Array<User> = [];

io.on('connection', (socket: SocketIO.Socket) => {
  console.log('connected');
  const { id } = socket;

  socket.on('new-user', (name: string) => {
    users.push({
      id,
      name,
    });
    socket.broadcast.emit('user-connected', name);
  });
  socket.on('send-chat-message', (message: string) => {
    const currentuser = users.find((user) => (user.id = id));
    socket.broadcast.emit('chat-message', {
      message: message,
      name: currentuser && currentuser.name,
    });
  });
  socket.on('disconnect', () => {
    const currentuser = users.find((user) => (user.id = id));
    socket.broadcast.emit('user-disconnected', currentuser && currentuser.name);
    const index = users.findIndex((user) => (user.id = id));
    users.splice(index, 1);
  });
});

server.listen(PORT);
