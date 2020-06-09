import assert from 'assert';
import {
  addUser,
  removeAllUser,
  findUserById,
  findUserIndexById,
  getUsers,
  userExists,
  removeUserByIndex,
} from './service.user';

describe('Service User Module', () => {
  beforeEach(() => {
    removeAllUser();
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
  });

  describe('See if a user exists', () => {
    it('should return true', () => {
      const id = '1';
      addUser(id, 'dan');
      const exists = userExists(id);
      assert.strictEqual(exists, true);
    });
    it('should return false', () => {
      const id = '1';
      addUser(id, 'dan');
      const exists = userExists('2');
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
});
