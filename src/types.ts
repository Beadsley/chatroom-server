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
