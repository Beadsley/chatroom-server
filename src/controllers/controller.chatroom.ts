import logger from '../services/service.logger';
import {
  addUser,
  findUserById,
  findUserIndexById,
  removeUserByIndex,
  getUsers,
  userExists,
  updateUserByIndex,
} from '../services/service.user';
import { constants } from '../config';
import http from 'http';

export const handleNewUser = (socket: SocketIO.Socket) => (name: string) => {
  const { id } = socket;

  if (userExists(id)) {
    // TODO an error could be thrown instead
    logger.error(constants.USER_EXISTS_MESSAGE);
    socket.emit('login_error', {
      error: constants.LOG_IN_ERROR,
      message: constants.USER_EXISTS_MESSAGE,
    });
  } else {
    logger.info(`New user: ${name}`);
    addUser(id, name);
    resetTimer(socket);
    socket.broadcast.emit('user-connected', name);
  }
};

export const handleMessage = (socket: SocketIO.Socket) => (message: string) => {
  const { id } = socket;
  const currentuser = findUserById(id);
  currentuser && resetTimer(socket);
  socket.broadcast.emit('chat-message', {
    message: message,
    name: currentuser && currentuser.name,
  });
};

export const handleDisconnect = (socket: SocketIO.Socket) => () => {
  const { id } = socket;
  const currentuser = findUserById(id);
  socket.broadcast.emit('user-disconnected', currentuser && currentuser.name);
  currentuser && logger.info(`User left the chat: ${currentuser.name}`);
  const index = findUserIndexById(id);
  index !== -1 && removeUserByIndex(index);
};

export const handleTermination = (io: SocketIO.Server, server: http.Server) => (signal: string) => {
  logger.info(`${signal} signal recieved`);
  logger.info('Closing http server.');
  disconnectAllSockets(io);
  server.close(() => {
    logger.info('Server closed.');
  });
};

// TODO move to sockets service??
const disconnectAllSockets = (io: SocketIO.Server) => {
  const connectedSockets: Array<SocketIO.Socket> = Object.values(io.of('/').connected);
  connectedSockets.forEach((socket) => {
    socket.disconnect(true);
  });
};

// TODO move to user service??
const resetTimer = (socket: SocketIO.Socket) => {
  const { id } = socket;
  let currentuser = findUserById(id);

  if (currentuser) {
    const index = findUserIndexById(id);
    currentuser.inactivityTimer && clearTimeout(currentuser.inactivityTimer);
    currentuser.inactivityTimer = setTimeout(() => {
      // TODO seperate function
      socket.broadcast.emit('user-disconnected', currentuser && currentuser.name); // TODO 'timeout' event
      currentuser && logger.info(`User inactive: ${currentuser.name}`);
      index !== -1 && removeUserByIndex(index);
    }, constants.INACTIVITY_LIMIT); // TODO change to suitable time
    updateUserByIndex(index, currentuser);
  }
};