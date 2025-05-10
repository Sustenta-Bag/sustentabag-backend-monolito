import User from '../../../../src/domain/entities/User.js';

describe('User Entity Unit Tests', () => {
  // Dados de teste para reuso
  const userData = {
    id: 1,
    email: 'usuario@example.com',
    password: 'senha_hasheada',
    role: 'client',
    entityId: 2,
    active: true,
    firebaseId: 'firebase123',
    createdAt: new Date('2023-01-01')
  };

  describe('Constructor', () => {
    test('should initialize with all properties correctly', () => {
      const user = new User(
        userData.id,
        userData.email,
        userData.password,
        userData.role,
        userData.entityId,
        userData.active,
        userData.firebaseId,
        null, // fcmToken
        userData.createdAt
      );

      expect(user.id).toBe(userData.id);
      expect(user.email).toBe(userData.email);
      expect(user.password).toBe(userData.password);
      expect(user.role).toBe(userData.role);
      expect(user.entityId).toBe(userData.entityId);
      expect(user.active).toBe(userData.active);
      expect(user.firebaseId).toBe(userData.firebaseId);
      expect(user.fcmToken).toBeNull();
      expect(user.createdAt).toEqual(userData.createdAt);
    });

    test('should initialize with default values when not provided', () => {
      const user = new User(
        undefined,
        userData.email,
        userData.password,
        userData.role,
        userData.entityId
      );

      expect(user.id).toBeUndefined();
      expect(user.active).toBe(true);
      expect(user.firebaseId).toBeNull();
      expect(user.createdAt).toBeInstanceOf(Date);
    });
  });

  // describe('Methods', () => {
  //   test('updateEmail should change email and return this', () => {
  //     const user = new User(
  //       userData.id,
  //       userData.email,
  //       userData.password,
  //       userData.role,
  //       userData.entityId
  //     );
      
  //     const newEmail = 'novo@email.com';
  //     const returnValue = user.updateEmail(newEmail);
      
  //     expect(user.email).toBe(newEmail);
  //     expect(returnValue).toBe(user); // Deve retornar "this" para encadeamento
  //   });

  //   test('changePassword should change password and return this', () => {
  //     const user = new User(
  //       userData.id,
  //       userData.email,
  //       userData.password,
  //       userData.role,
  //       userData.entityId
  //     );
      
  //     const newPassword = 'nova_senha_hasheada';
  //     const returnValue = user.changePassword(newPassword);
      
  //     expect(user.password).toBe(newPassword);
  //     expect(returnValue).toBe(user);
  //   });

  //   test('deactivate should set active to false and return this', () => {
  //     const user = new User(
  //       userData.id,
  //       userData.email,
  //       userData.password,
  //       userData.role,
  //       userData.entityId,
  //       true
  //     );
      
  //     const returnValue = user.deactivate();
      
  //     expect(user.active).toBe(false);
  //     expect(returnValue).toBe(user);
  //   });

  //   test('activate should set active to true and return this', () => {
  //     const user = new User(
  //       userData.id,
  //       userData.email,
  //       userData.password,
  //       userData.role,
  //       userData.entityId,
  //       false
  //     );
      
  //     const returnValue = user.activate();
      
  //     expect(user.active).toBe(true);
  //     expect(returnValue).toBe(user);
  //   });

  //   test('methods should support chaining', () => {
  //     const user = new User(
  //       userData.id,
  //       userData.email,
  //       userData.password,
  //       userData.role,
  //       userData.entityId,
  //       true
  //     );
      
  //     user
  //       .updateEmail('another@email.com')
  //       .changePassword('other_password')
  //       .deactivate();
      
  //     expect(user.email).toBe('another@email.com');
  //     expect(user.password).toBe('other_password');
  //     expect(user.active).toBe(false);
  //   });
  // });
});