import assert from 'assert';
import {
  addUser,
  removeAllUsers,
  findUserById,
  findUserIndexById,
  getUsers,
  userExists,
  removeUserByIndex,
  updateUserByIndex,
} from './service.user';

describe('Service User Module', () => {
  beforeEach(() => {
    removeAllUsers();
  });

  describe('Add User', () => {
    it('should add one user', () => {
      addUser('1', 'dan');
      assert.strictEqual(getUsers().length, 1);
    });
    it('should add two users', () => {
      addUser('1', 'dan');
      addUser('2', 'charlie');
      assert.strictEqual(getUsers().length, 2);
    });
  });

  describe('Find a user by id', () => {
    it('should return a user obj', () => {
      const id = 'sddn1';
      addUser(id, 'dan');
      const expected = {
        id,
        name: 'dan',
        inactivityTimer: undefined,
      };
      const user = findUserById(id);
      assert.deepEqual(user, expected);
    });
    it('should return user index', () => {
      addUser('1', 'dan');
      addUser('2', 'charlie');
      const user1index = findUserIndexById('1');
      const user2index = findUserIndexById('2');
      const noUser = findUserIndexById('3');
      assert.strictEqual(user1index, 0);
      assert.strictEqual(user2index, 1);
      assert.strictEqual(noUser, -1);
    });
    it('should return undefined', () => {
      const id = 'sddn1';
      addUser(id, 'dan');
      const user = findUserById(id + 'not');
      assert.deepEqual(user, undefined);
    });
  });

  describe('See if a user exists', () => {
    it('should return true', () => {
      const id = '1';
      addUser(id, 'dan');
      const exists = userExists('dan');
      assert.strictEqual(exists, true);
    });
    it('should return false', () => {
      const id = '1';
      addUser(id, 'dan');
      const exists = userExists('sam');
      assert.strictEqual(exists, false);
    });
  });
  describe('Remove a user', () => {
    it('should remove 1 user from array', () => {
      addUser('1', 'dan');
      addUser('2', 'charlie');
      removeUserByIndex(1);
      const exists = userExists('2');
      assert.strictEqual(getUsers().length, 1);
      assert.strictEqual(exists, false);
    });
  });
  describe('Update a user', () => {
    it('should update user name', () => {
      const id = '1';
      let user = addUser(id, 'charlie');
      const newUserInfo = {
        ...user,
        name: 'dan',
      };
      updateUserByIndex(0, newUserInfo);
      const updateduser = findUserById(id);
      updateduser && assert.strictEqual(updateduser.name, 'dan');
    });
  });
});
