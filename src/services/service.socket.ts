import {
  findUserById,
  findUserIndexById,
  removeUserByIndex,
  updateUserByIndex,
} from '../services/service.user';
import { constants } from '../types';
import logger from '../services/service.logger';

export const disconnectAllSockets = (io: SocketIO.Server): void => {
  const connectedSockets: Array<SocketIO.Socket> = Object.values(
    io.of('/').connected
  );

  connectedSockets.forEach((socket) => {
    socket.disconnect(true);
  });
};

const inactivityCallback = (socket: SocketIO.Socket) => () => {
  const { id } = socket;
  const currentuser = findUserById(id);

  if (currentuser) {
    const index = findUserIndexById(id);
    socket.emit('user-inactive', currentuser.name);
    socket.broadcast.emit('user-inactive', currentuser.name);
    logger.info(`User inactive: ${currentuser.name}`);

    if (index !== -1) {
      removeUserByIndex(index);
    }
  }

  socket.disconnect(true);
};

export const resetTimer = (socket: SocketIO.Socket): void => {
  const { id } = socket;
  const currentuser = findUserById(id);

  if (currentuser) {
    const index = findUserIndexById(id);

    if (currentuser.inactivityTimer) {
      clearTimeout(currentuser.inactivityTimer);
    }

    currentuser.inactivityTimer = setTimeout(
      inactivityCallback(socket),
      constants.INACTIVITY_LIMIT
    );

    updateUserByIndex(index, currentuser);
  }
};
