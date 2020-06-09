import express from 'express';
import socketio from 'socket.io';
import http from 'http';
import {
  addUser,
  findUserById,
  findUserIndexById,
  removeUserByIndex,
  getUsers,
  userExists,
} from './services/service.user';
import { constants } from './config';

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = 3000;

//TODO set up a controllers directory

io.on('connection', (socket: SocketIO.Socket) => {
  console.log('connected');
  const { id } = socket;
  let inactivityTimer: NodeJS.Timeout;

  socket.on('new-user', (name: string) => {
    if (userExists(id)) {
      // TODO an error could be thrown instead
      socket.emit('login_error', {
        error: constants.LOG_IN_ERROR,
        message: constants.USER_EXISTS_MESSAGE,
      });
    } else {
      addUser(id, name);
      resetTimer();
      socket.broadcast.emit('user-connected', name);
    }
  });
  socket.on('send-chat-message', (message: string) => {
    const currentuser = findUserById(id);
    console.log(getUsers());
    
    resetTimer();
    socket.broadcast.emit('chat-message', {
      message: message,
      name: currentuser && currentuser.name,
    });
  });
  socket.on('disconnect', () => {
    const currentuser = findUserById(id);
    socket.broadcast.emit('user-disconnected', currentuser && currentuser.name);
    const index = findUserIndexById(id);
    index !== -1 && removeUserByIndex(index);
  });

  const resetTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      // TODO seperate function
      const currentuser = findUserById(id);
      socket.broadcast.emit('user-disconnected', currentuser && currentuser.name); // TODO 'timeout' event
      const index = findUserIndexById(id);
      index !== -1 && removeUserByIndex(index);
    }, constants.INACTIVITY_LIMIT); // TODO change to suitable time
  };
});

server.listen(PORT);
