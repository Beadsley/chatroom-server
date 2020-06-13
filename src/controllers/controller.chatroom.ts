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
import { Message } from '../types';

export const handleNewUser = (socket: SocketIO.Socket) => (name: string): void => {
  const { id } = socket;
  if (userExists(name)) {
    // TODO an error could be thrown instead
    logger.error(constants.USER_EXISTS_MESSAGE);

    // socket.emit('login_error', constants.USER_EXISTS_MESSAGE);
    socket.emit('login_error', {
      type: constants.LOG_IN_ERROR,
      message: constants.USER_EXISTS_MESSAGE,
    });
  } else {
    logger.info(`New user: ${name}, ${id}`);
    const newUser = addUser(id, name);
    resetTimer(socket);
    socket.emit('login_success', name);
    socket.emit(
      'current-users',
      getUsers().map((user) => ({ name: user.name, joined: user.joined }))
    );
    socket.broadcast.emit('user-connected', { name: newUser.name, joined: newUser.joined });
  }
};

export const handleMessage = (socket: SocketIO.Socket) => (message: Message): void => {
  resetTimer(socket);
  logger.info(`New message: ${message.text}, ${message.sender}`);
  socket.broadcast.emit('chat-message', message);
};

export const handleDisconnect = (socket: SocketIO.Socket) => (): void => {
  const { id } = socket;
  const currentuser = findUserById(id);
  currentuser && socket.broadcast.emit('user-disconnected', currentuser.name);
  currentuser && logger.info(`User left the chat: ${currentuser.name}`);
  const index = findUserIndexById(id);
  index !== -1 && removeUserByIndex(index);
  socket.disconnect(true);
};

export const handleTermination = (io: SocketIO.Server, server: http.Server) => (signal: string): void => {
  logger.info(`${signal} signal recieved`);
  logger.info('Closing http server.');
  disconnectAllSockets(io);
  server.close(() => {
    logger.info('Server closed.');
  });
};

// TODO move to sockets service??
const disconnectAllSockets = (io: SocketIO.Server): void => {
  const connectedSockets: Array<SocketIO.Socket> = Object.values(io.of('/').connected);
  connectedSockets.forEach((socket) => {
    socket.disconnect(true);
  });
};

// TODO move to user service??
const resetTimer = (socket: SocketIO.Socket): void => {
  const { id } = socket;
  let currentuser = findUserById(id);

  if (currentuser) {
    const index = findUserIndexById(id);
    currentuser.inactivityTimer && clearTimeout(currentuser.inactivityTimer);
    currentuser.inactivityTimer = setTimeout(() => {
      // TODO seperate function
      currentuser && socket.emit('user-inactive', currentuser.name); // TODO 'timeout' event
      currentuser && socket.broadcast.emit('user-inactive', currentuser.name); // TODO 'timeout' event
      currentuser && logger.info(`User inactive: ${currentuser.name}`);
      index !== -1 && removeUserByIndex(index);
      socket.disconnect(true);
    }, constants.INACTIVITY_LIMIT); // TODO change to suitable time
    updateUserByIndex(index, currentuser);
  }
};
