import Client from '../../../../src/domain/entities/Client.js';

describe('Client Entity Unit Tests', () => {
  // Dados de teste para reuso
  const clientData = {
    id: 1,
    name: 'João Silva',
    email: 'joao@email.com',
    cpf: '12345678901',
    phone: '11987654321',
    status: 1,
    createdAt: new Date('2023-01-01')
  };

  describe('Constructor', () => {    test('should initialize with all properties correctly', () => {
      const client = new Client(
        clientData.id,
        clientData.name,
        clientData.email,
        clientData.cpf,
        clientData.phone,
        null, // idAddress
        clientData.status,
        clientData.createdAt
      );

      expect(client.id).toBe(clientData.id);
      expect(client.name).toBe(clientData.name);
      expect(client.email).toBe(clientData.email);
      expect(client.cpf).toBe(clientData.cpf);
      expect(client.phone).toBe(clientData.phone);
      expect(client.idAddress).toBeNull();
      expect(client.status).toBe(clientData.status);
      expect(client.createdAt).toEqual(clientData.createdAt);
    });

    test('should initialize with default status when not provided', () => {
      const client = new Client(
        clientData.id, 
        clientData.name,
        clientData.email,
        clientData.cpf,
        clientData.phone
      );

      expect(client.status).toBe(1);
    });

    test('should initialize with default createdAt when not provided', () => {
      const beforeCreation = new Date();
      const client = new Client(
        clientData.id,
        clientData.name,
        clientData.email,
        clientData.cpf,
        clientData.phone,
        clientData.status
      );
      const afterCreation = new Date();

      expect(client.createdAt).toBeInstanceOf(Date);
      expect(client.createdAt >= beforeCreation).toBeTruthy();
      expect(client.createdAt <= afterCreation).toBeTruthy();
    });
  });

  describe('Methods', () => {
    test('updateStatus should change status and return this', () => {
      const client = new Client(
        clientData.id,
        clientData.name,
        clientData.email,
        clientData.cpf,
        clientData.phone,
        1
      );
      
      const returnValue = client.updateStatus(0);
      
      expect(client.status).toBe(0);
      expect(returnValue).toBe(client); // Should return this for method chaining
    });

    test('updateName should change name and return this', () => {
      const client = new Client(
        clientData.id,
        clientData.name,
        clientData.email,
        clientData.cpf,
        clientData.phone
      );
      
      const newName = 'Maria Silva';
      const returnValue = client.updateName(newName);
      
      expect(client.name).toBe(newName);
      expect(returnValue).toBe(client); // Should return this for method chaining
    });

    test('updateEmail should change email and return this', () => {
      const client = new Client(
        clientData.id,
        clientData.name,
        clientData.email,
        clientData.cpf,
        clientData.phone
      );
      
      const newEmail = 'joao.updated@email.com';
      const returnValue = client.updateEmail(newEmail);
      
      expect(client.email).toBe(newEmail);
      expect(returnValue).toBe(client); // Should return this for method chaining
    });

    test('updatePhone should change phone and return this', () => {
      const client = new Client(
        clientData.id,
        clientData.name,
        clientData.email,
        clientData.cpf,
        clientData.phone
      );
      
      const newPhone = '11999998888';
      const returnValue = client.updatePhone(newPhone);
      
      expect(client.phone).toBe(newPhone);
      expect(returnValue).toBe(client); // Should return this for method chaining
    });

    test('updateIdAddress should change idAddress and return this', () => {
      const client = new Client(
        clientData.id,
        clientData.name,
        clientData.email,
        clientData.cpf,
        clientData.phone,
        null,
        clientData.status,
        clientData.createdAt
      );
      
      const newIdAddress = 2;
      const returnValue = client.updateIdAddress(newIdAddress);
      
      expect(client.idAddress).toBe(newIdAddress);
      expect(returnValue).toBe(client); // Should return this for method chaining
    });

    test('deactivate should set status to 0 and return this', () => {
      const client = new Client(
        clientData.id,
        clientData.name,
        clientData.email,
        clientData.cpf,
        clientData.phone,
        1 // Active status
      );
      
      const returnValue = client.deactivate();
      
      expect(client.status).toBe(0);
      expect(returnValue).toBe(client); // Should return this for method chaining
    });

    test('activate should set status to 1 and return this', () => {
      const client = new Client(
        clientData.id,
        clientData.name,
        clientData.email,
        clientData.cpf,
        clientData.phone,
        0 // Inactive status
      );
      
      const returnValue = client.activate();
      
      expect(client.status).toBe(1);
      expect(returnValue).toBe(client); // Should return this for method chaining
    });
    
    test('methods should support chaining', () => {
      const client = new Client(
        clientData.id,
        clientData.name,
        clientData.email,
        clientData.cpf,
        clientData.phone,
        1
      );
      
      client
        .updateName('New Name')
        .updateEmail('new@email.com')
        .updatePhone('11922223333')
        .deactivate();
      
      expect(client.name).toBe('New Name');
      expect(client.email).toBe('new@email.com');
      expect(client.phone).toBe('11922223333');
      expect(client.status).toBe(0);
      
      client.activate().updateName('Reactivated Client');
      
      expect(client.status).toBe(1);
      expect(client.name).toBe('Reactivated Client');
    });
  });
});