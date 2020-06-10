interface User {
  id: string;
  name: string;
  inactivityTimer: NodeJS.Timeout | undefined;
}

let users: Array<User> = [];

export const addUser = (id: string, name: string): User => {
  const user = {
    id,
    name,
    inactivityTimer: undefined,
  };
  users.push(user);
  return user;
};

export const findUserById = (id: string): User | undefined => users.find((user) => user.id === id);

export const findUserIndexById = (id: string): number => getUsers().findIndex((user) => user.id === id);

export const removeUserByIndex = (index: number): void => {
  users.splice(index, 1);
};

export const getUsers = (): Array<User> => users;

export const userExists = (name: string): boolean => users.some((user) => user.name === name);

export const removeAllUser = (): void => {
  users.length = 0;
};

export const updateUserByIndex = (index: number, user: User) => {
  users.splice(index, 1, user);
}