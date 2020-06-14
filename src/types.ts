export enum constants {
  LOG_IN_ERROR = 'LOG_IN',
  USER_EXISTS_MESSAGE = 'Nickname already taken',
  INACTIVITY_LIMIT = 600000,
}

export interface Message {
  text: string;
  sender: string;
  timestamp: Date;
}

export interface User {
  id: string;
  name: string;
  inactivityTimer: NodeJS.Timeout | undefined;
  joined: Date;
}
