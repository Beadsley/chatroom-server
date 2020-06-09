interface User {
  id: string;
  name: string;
}

let users: Array<User> = [];

export const addUser = (id: string, name: string): void => {
  const user = {
    id,
    name,
  };
  users.push(user);
};

export const findUserById = (id: string): User | undefined => users.find((user) => (user.id = id));

export const findUserIndexById = (id: string): number => users.findIndex((user) => (user.id = id));

export const removeUserById = (index: number): void => {
  users.splice(index, 1);
};

export const getUsers = (): Array<User> => users;
