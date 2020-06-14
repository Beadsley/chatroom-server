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
import { User } from '../types';

const testuser1: User = {
  id: 'testuser1',
  name: 'DAN',
  inactivityTimer: undefined,
  joined: new Date(),
};

const testuser2: User = {
  id: 'testuser2',
  name: 'CHARLIE',
  inactivityTimer: undefined,
  joined: new Date(),
};

describe('Service User Module', () => {
  beforeEach(() => {
    removeAllUsers();
  });

  describe('Add User', () => {
    it('should add one user', () => {
      addUser(testuser1.id, testuser1.name);
      assert.strictEqual(getUsers().length, 1);
    });
    it('should add two users', () => {
      addUser(testuser1.id, testuser1.name);
      addUser(testuser2.id, testuser2.name);
      assert.strictEqual(getUsers().length, 2);
    });
  });

  describe('Find a user by id', () => {
    it('should return a user obj', () => {
      addUser(testuser1.id, testuser1.name);
      const user = findUserById(testuser1.id);
      user &&
        assert.deepEqual(
          { id: user.id, name: user.name },
          { id: testuser1.id, name: testuser1.name }
        );
    });
    it('should return user index', () => {
      addUser(testuser1.id, testuser1.name);
      addUser(testuser2.id, testuser2.name);
      const user1index = findUserIndexById(testuser1.id);
      const user2index = findUserIndexById(testuser2.id);
      const noUser = findUserIndexById('not null');
      assert.strictEqual(user1index, 0);
      assert.strictEqual(user2index, 1);
      assert.strictEqual(noUser, -1);
    });
    it('should return undefined', () => {
      addUser(testuser1.id, testuser1.name);
      const user = findUserById(testuser1.id + 'not');
      assert.deepEqual(user, undefined);
    });
  });

  describe('See if a user exists', () => {
    it('should return true', () => {
      addUser(testuser1.id, testuser1.name);
      const exists = userExists(testuser1.name);
      assert.strictEqual(exists, true);
    });
    it('should return false', () => {
      const exists = userExists('sam');
      assert.strictEqual(exists, false);
    });
  });
  describe('Remove a user', () => {
    it('should remove 1 user from array', () => {
      addUser(testuser1.id, testuser1.name);
      addUser(testuser2.id, testuser2.name);
      removeUserByIndex(1);
      const user1Exists = userExists(testuser1.name);
      const user2Exists = userExists(testuser2.name);
      assert.strictEqual(getUsers().length, 1);
      assert.strictEqual(user2Exists, false);
      assert.strictEqual(user1Exists, true);
    });
  });
  describe('Update a user', () => {
    it('should update user name', () => {
      addUser(testuser1.id, testuser1.name);
      const newUserInfo = {
        ...testuser1,
        name: 'dan',
      };
      updateUserByIndex(0, newUserInfo);
      const updateduser = findUserById(testuser1.id);
      updateduser && assert.strictEqual(updateduser.name, 'dan');
    });
  });
});
 