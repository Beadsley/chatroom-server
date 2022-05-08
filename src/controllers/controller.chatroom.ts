import logger from '../services/service.logger';
import {
  addUser,
  findUserById,
  findUserIndexById,
  removeUserByIndex,
  getUsers,
  userExists,
} from '../services/service.user';
import http from 'http';
import { Message, constants } from '../types';
import { resetTimer, disconnectAllSockets } from '../services/service.socket';

export const handleNewUser =
  (socket: SocketIO.Socket) =>
  (name: string): void => {
    const { id } = socket;

    // username already taken
    if (userExists(name)) {
      logger.error(constants.USER_EXISTS_MESSAGE);

      socket.emit('login_error', {
        type: constants.LOG_IN_ERROR,
        message: constants.USER_EXISTS_MESSAGE,
      });

      return;
    }

    //create user
    const newUser = addUser(id, name);
    resetTimer(socket);

    socket.emit('login_success', name);
    socket.emit(
      'current-users',
      getUsers().map((user) => ({ name: user.name, joined: user.joined }))
    );
    socket.broadcast.emit('user-connected', {
      name: newUser.name,
      joined: newUser.joined,
    });

    logger.info(`New user: ${name}, ${id}`);
  };

export const handleMessage =
  (socket: SocketIO.Socket) =>
  (message: Message): void => {
    resetTimer(socket);
    logger.info(`New message: ${message.text}, ${message.sender}`);
    socket.broadcast.emit('chat-message', message);
  };

export const handleDisconnect = (socket: SocketIO.Socket) => (): void => {
  const { id } = socket;
  const currentuser = findUserById(id);
  const index = findUserIndexById(id);

  // remove user
  if (index !== -1) {
    removeUserByIndex(index);
  }

  // disconnect user
  socket.disconnect(true);

  // notify that the user has been diconnected
  if (currentuser) {
    socket.broadcast.emit('user-disconnected', currentuser.name);
    logger.info(`User left the chat: ${currentuser.name}`);
  }
};

export const handleTermination =
  (io: SocketIO.Server, server: http.Server) =>
  (signal: string): void => {
    logger.info(`${signal} signal recieved`);
    logger.info('Closing http server.');
    disconnectAllSockets(io);

    server.close(() => {
      logger.info('Server closed.');
    });
  };
