import PostgresClientRepository from '../../../../src/infrastructure/repositories/PostgresClientRepository.js';
import Client from '../../../../src/domain/entities/Client.js';
import Address from '../../../../src/domain/entities/Address.js';
import { jest } from '@jest/globals';

describe('PostgresClientRepository', () => {
  let mockClientModel;
  let mockAddressModel;
  let repository;

  const clientData = {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@email.com',
    cpf: '12345678901',
    password: 'hashed_password',
    phone: '11987654321',
    status: 1,
    createdAt: new Date('2023-01-01')
  };

  beforeEach(() => {
    mockAddressModel = {
      id: 1,
      street: 'Test Street',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345678'
    };

    mockClientModel = {
      create: jest.fn(),
      findByPk: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
      belongsTo: jest.fn(),
      hasOne: jest.fn(),
      associations: {
        address: {
          target: mockAddressModel
        }
      }
    };

    Object.defineProperty(mockClientModel, 'AddressModel', {
      get: () => mockAddressModel
    });
    
    repository = new PostgresClientRepository(mockClientModel);
    
    repository.ClientModel = mockClientModel;
    repository.AddressModel = mockAddressModel;
  });

  describe('create', () => {
    test('should create a client and return domain entity', async () => {
      const mockClientRecord = {
        ...clientData,
        toJSON: () => ({ ...clientData })
      };
      
      mockClientModel.create.mockResolvedValue(mockClientRecord);
      
      const result = await repository.create(clientData);
      
      expect(mockClientModel.create).toHaveBeenCalledWith(clientData);
      expect(result).toBeInstanceOf(Client);
      expect(result.id).toBe(clientData.id);
      expect(result.name).toBe(clientData.name);
      expect(result.email).toBe(clientData.email);
      expect(result.cpf).toBe(clientData.cpf);
      expect(result.phone).toBe(clientData.phone);
      expect(result.status).toBe(clientData.status);
      expect(result.createdAt).toEqual(clientData.createdAt);
      expect(result.password).toBeUndefined();
    });

    it('should throw an error when create fails', async () => {
      const clientData = {
        name: 'Test Client',
        email: 'test@example.com',
        cpf: '12345678901',
        phone: '11999999999'
      };
      
      mockClientModel.create.mockRejectedValue(new Error('Database error'));
      
      await expect(repository.create(clientData)).rejects.toThrow('Database error');
    });

    it('should create a client with address data', async () => {
      const clientData = {
        name: 'Test Client',
        email: 'test@example.com',
        cpf: '12345678901',
        phone: '11999999999',
        idAddress: 1
      };
      
      const mockClientRecord = {
        id: 1,
        name: 'Test Client',
        email: 'test@example.com',
        cpf: '12345678901',
        phone: '11999999999',
        idAddress: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockClientModel.create.mockResolvedValue(mockClientRecord);
      
      const result = await repository.create(clientData);
      
      expect(result).toBeInstanceOf(Client);
      expect(result.id).toBe(1);
      expect(result.idAddress).toBe(1);
    });
  });

  describe('getClient', () => {
    test('should find a client by id and return domain entity', async () => {
      const mockClientRecord = {
        ...clientData,
        toJSON: () => clientData
      };
      
      mockClientModel.findOne.mockResolvedValue(mockClientRecord);
      
      const result = await repository.getClient({ id: 1 });
      
      expect(mockClientModel.findOne).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(result).toBeInstanceOf(Client);
      expect(result.id).toBe(clientData.id);
    });
    
    test('should return null when client not found', async () => {
      mockClientModel.findOne.mockResolvedValue(null);
      
      const result = await repository.getClient({ id: 999 });
      
      expect(mockClientModel.findOne).toHaveBeenCalledWith({
        where: { id: 999 }
      });
      expect(result).toBeNull();
    });
  });

  describe('findByCpf', () => {
    test('should find a client by CPF and return domain entity', async () => {
      const mockClientRecord = {
        ...clientData,
        toJSON: () => clientData
      };
      
      mockClientModel.findOne.mockResolvedValue(mockClientRecord);
      
      const result = await repository.getClient({ cpf: '12345678901' });
      
      expect(mockClientModel.findOne).toHaveBeenCalledWith({
        where: { cpf: '12345678901' }
      });
      expect(result).toBeInstanceOf(Client);
      expect(result.cpf).toBe('12345678901');
    });
    
    test('should return null when client not found by CPF', async () => {
      mockClientModel.findOne.mockResolvedValue(null);
      
      const result = await repository.getClient({ cpf: '99988877766' });
      
      expect(mockClientModel.findOne).toHaveBeenCalledWith({
        where: { cpf: '99988877766' }
      });
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    test('should find a client by email and return domain entity', async () => {
      const mockClientRecord = {
        ...clientData,
        toJSON: () => clientData
      };
      
      mockClientModel.findOne.mockResolvedValue(mockClientRecord);
      
      const result = await repository.getClient({ email: 'joao.silva@email.com' });
      
      expect(mockClientModel.findOne).toHaveBeenCalledWith({
        where: { email: 'joao.silva@email.com' }
      });
      expect(result).toBeInstanceOf(Client);
      expect(result.email).toBe('joao.silva@email.com');
    });
    
    test('should return null when client not found by email', async () => {
      mockClientModel.findOne.mockResolvedValue(null);
      
      const result = await repository.getClient({ email: 'naoexiste@email.com' });
      
      expect(mockClientModel.findOne).toHaveBeenCalledWith({
        where: { email: 'naoexiste@email.com' }
      });
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    test('should return all clients as domain entities', async () => {
      const mockClientRecords = [
        {
          ...clientData,
          id: 1,
          toJSON: () => ({ ...clientData, id: 1 })
        },
        {
          ...clientData,
          id: 2,
          cpf: '98765432101',
          email: 'outro@email.com',
          toJSON: () => ({ ...clientData, id: 2, cpf: '98765432101', email: 'outro@email.com' })
        }
      ];
      
      mockClientModel.findAndCountAll.mockResolvedValue({
        count: 2,
        rows: mockClientRecords
      });
      
      const results = await repository.findAll(0, 10);
      
      expect(mockClientModel.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        offset: 0,
        limit: 10,
      });
      expect(results.count).toBe(2);
      expect(results.rows).toHaveLength(2);
      expect(results.rows[0]).toBeInstanceOf(Client);
      expect(results.rows[1]).toBeInstanceOf(Client);
      expect(results.rows[0].id).toBe(1);
      expect(results.rows[1].id).toBe(2);
    });
    
    test('should return empty array when no clients found', async () => {
      mockClientModel.findAndCountAll.mockResolvedValue({
        count: 0,
        rows: []
      });
      
      const results = await repository.findAll(0, 10);
      
      expect(mockClientModel.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        offset: 0,
        limit: 10,
      });
      expect(results.count).toBe(0);
      expect(results.rows).toEqual([]);
    });
  });

  describe('findByIdWithAddress', () => {
    test('should find a client by id with address and return domain entity', async () => {
      const mockClientRecord = {
        ...clientData,
        address: mockAddressModel,
        toJSON: () => ({
          ...clientData,
          address: mockAddressModel
        })
      };
      
      mockClientModel.findByPk.mockResolvedValue(mockClientRecord);
      
      const result = await repository.findByIdWithAddress(1);
      
      expect(mockClientModel.findByPk).toHaveBeenCalledWith(1, {
        include: [{ 
          model: mockAddressModel, 
          as: 'address',
          required: false 
        }]
      });
      expect(result).toBeInstanceOf(Client);
      expect(result.id).toBe(clientData.id);
      expect(result.address).toBeDefined();
      expect(result.address.street).toBe('Test Street');
    });
    
    test('should return null when client not found with address', async () => {
      mockClientModel.findByPk.mockResolvedValue(null);
      
      const result = await repository.findByIdWithAddress(999);
      
      expect(mockClientModel.findByPk).toHaveBeenCalledWith(999, {
        include: [{ 
          model: mockAddressModel, 
          as: 'address',
          required: false 
        }]
      });
      expect(result).toBeNull();
    });

    test('should throw error when findByIdWithAddress fails', async () => {
      const error = new Error('Database error');
      mockClientModel.findByPk.mockRejectedValue(error);
      
      await expect(repository.findByIdWithAddress(1)).rejects.toThrow(error);
    });
  });

  describe('findAllWithAddress', () => {
    test('should return all clients with addresses as domain entities', async () => {
      const mockClientRecords = [
        {
          ...clientData,
          id: 1,
          address: mockAddressModel,
          toJSON: () => ({
            ...clientData,
            id: 1,
            address: mockAddressModel
          })
        },
        {
          ...clientData,
          id: 2,
          cpf: '98765432101',
          email: 'outro@email.com',
          address: {
            ...mockAddressModel,
            id: 2,
            street: 'Test Street 2',
            zipCode: '87654321'
          },
          toJSON: () => ({
            ...clientData,
            id: 2,
            cpf: '98765432101',
            email: 'outro@email.com',
            address: {
              ...mockAddressModel,
              id: 2,
              street: 'Test Street 2',
              zipCode: '87654321'
            }
          })
        }
      ];
      
      mockClientModel.findAll.mockResolvedValue(mockClientRecords);
      
      const results = await repository.findAllWithAddress();
      
      expect(mockClientModel.findAll).toHaveBeenCalledWith({
        include: [{ 
          model: mockAddressModel, 
          as: 'address',
          required: false 
        }]
      });
      expect(results).toHaveLength(2);
      expect(results[0]).toBeInstanceOf(Client);
      expect(results[1]).toBeInstanceOf(Client);
      expect(results[0].address).toBeDefined();
      expect(results[1].address).toBeDefined();
      expect(results[0].address.street).toBe('Test Street');
      expect(results[1].address.street).toBe('Test Street 2');
    });
    
    test('should return empty array when no clients found with addresses', async () => {
      mockClientModel.findAll.mockResolvedValue([]);
      
      const results = await repository.findAllWithAddress();
      
      expect(mockClientModel.findAll).toHaveBeenCalledWith({
        include: [{ 
          model: mockAddressModel, 
          as: 'address',
          required: false 
        }]
      });
      expect(results).toEqual([]);
    });

    it('should throw error when findAllWithAddress fails', async () => {
      mockClientModel.associations = null;
      mockClientModel.belongsTo.mockImplementation(() => {});
      mockClientModel.findAll.mockRejectedValue(new Error('Database error'));
      
      await expect(repository.findAllWithAddress()).rejects.toThrow('Database error');
    });
  });

  describe('update', () => {
    test('should update a client and return domain entity', async () => {
      const updateData = { name: 'João Silva Updated', phone: '11999998888' };
      const updatedClientData = { ...clientData, ...updateData };
      const mockClientRecord = {
        ...updatedClientData,
        toJSON: () => updatedClientData
      };
      
      mockClientModel.update.mockResolvedValue([1]);
      mockClientModel.findByPk.mockResolvedValue(mockClientRecord);
      
      const result = await repository.update(1, updateData);
      
      expect(mockClientModel.update).toHaveBeenCalledWith(updateData, { where: { id: 1 } });
      expect(mockClientModel.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBeInstanceOf(Client);
      expect(result.name).toBe(updateData.name);
      expect(result.phone).toBe(updateData.phone);
    });
    
    it('should return null when client not found after update', async () => {
      const clientData = { name: 'Updated Client' };
      
      mockClientModel.update.mockResolvedValue([0]); // 0 rows affected
      mockClientModel.findByPk.mockResolvedValue(null);
      
      const result = await repository.update(1, clientData);
      
      expect(result).toBeNull();
    });

    it('should update client with includeAddress option', async () => {
      const clientData = { name: 'Updated Client' };
      const mockClientRecord = {
        id: 1,
        name: 'Updated Client',
        email: 'test@example.com',
        cpf: '12345678901',
        phone: '11999999999',
        idAddress: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        address: {
          id: 1,
          zipCode: '12345-678',
          state: 'SP',
          city: 'São Paulo',
          street: 'Rua Teste',
          number: '123',
          complement: null,
          latitude: -23.5505,
          longitude: -46.6333,
          status: 1,
          createdAt: new Date()
        }
      };
      
      mockClientModel.update.mockResolvedValue([1]);
      mockClientModel.associations = null;
      mockClientModel.belongsTo.mockImplementation(() => {});
      mockClientModel.findByPk.mockResolvedValue(mockClientRecord);
      
      const result = await repository.update(1, clientData, { includeAddress: true });
      
      expect(result).toBeInstanceOf(Client);
      expect(result.name).toBe('Updated Client');
      expect(result.address).toBeInstanceOf(Address);
    });

    it('should handle update error', async () => {
      const clientData = { name: 'Updated Client' };
      
      mockClientModel.update.mockRejectedValue(new Error('Update failed'));
      
      await expect(repository.update(1, clientData)).rejects.toThrow('Update failed');
    });

    it('should handle findByPk error after update', async () => {
      const clientData = { name: 'Updated Client' };
      
      mockClientModel.update.mockResolvedValue([1]);
      mockClientModel.findByPk.mockRejectedValue(new Error('Find failed'));
      
      await expect(repository.update(1, clientData)).rejects.toThrow('Find failed');
    });
  });

  describe('delete', () => {
    test('should return true when client successfully deleted', async () => {
      mockClientModel.destroy.mockResolvedValue(1);
      
      const result = await repository.delete(1);
      
      expect(mockClientModel.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(1);
    });
    
    test('should return false when client not found for deletion', async () => {
      mockClientModel.destroy.mockResolvedValue(0);
      
      const result = await repository.delete(999);
      
      expect(mockClientModel.destroy).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(result).toBe(0);
    });
  });

  describe('findActiveClients', () => {
    test('should find active clients and return domain entities', async () => {
      const mockClientRecords = [
        {
          ...clientData,
          id: 1,
          status: 1,
          toJSON: () => ({ ...clientData, id: 1, status: 1 })
        },
        {
          ...clientData,
          id: 2,
          cpf: '98765432101',
          email: 'outro@email.com',
          status: 1,
          toJSON: () => ({ ...clientData, id: 2, cpf: '98765432101', email: 'outro@email.com', status: 1 })
        }
      ];
      
      mockClientModel.findAll.mockResolvedValue(mockClientRecords);
      
      const results = await repository.findAllWithAddress();
      
      expect(mockClientModel.findAll).toHaveBeenCalledWith({
        include: [{ 
          model: mockAddressModel, 
          as: 'address',
          required: false 
        }]
      });
      expect(results).toHaveLength(2);
      expect(results[0]).toBeInstanceOf(Client);
      expect(results[1]).toBeInstanceOf(Client);
      expect(results[0].status).toBe(1);
      expect(results[1].status).toBe(1);
    });
    
    test('should throw an error when findActiveClients fails', async () => {
      const error = new Error('Database error');
      mockClientModel.findAll.mockRejectedValue(error);
      
      await expect(repository.findAllWithAddress()).rejects.toThrow(error);
    });
  });

  describe('findAllWithAddressAndCount', () => {
    it('should find all clients with address and count', async () => {
      const mockClient1 = {
        id: 1,
        name: 'Client 1',
        email: 'client1@example.com',
        cpf: '12345678901',
        phone: '11999999999',
        idAddress: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        address: {
          id: 1,
          zipCode: '12345-678',
          state: 'SP',
          city: 'São Paulo',
          street: 'Rua Teste',
          number: '123',
          complement: null,
          latitude: -23.5505,
          longitude: -46.6333,
          status: 1,
          createdAt: new Date()
        }
      };
      
      const mockClient2 = {
        id: 2,
        name: 'Client 2',
        email: 'client2@example.com',
        cpf: '98765432109',
        phone: '11888888888',
        idAddress: null,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        address: null
      };
      
      mockClientModel.associations = null;
      mockClientModel.belongsTo.mockImplementation(() => {});
      mockClientModel.findAndCountAll.mockResolvedValue({
        count: 2,
        rows: [mockClient1, mockClient2]
      });
      
      const result = await repository.findAllWithAddressAndCount(0, 10, { status: 1 });
      
      expect(result.count).toBe(2);
      expect(result.rows).toHaveLength(2);
      expect(result.rows[0]).toBeInstanceOf(Client);
      expect(result.rows[0].address).toBeInstanceOf(Address);
      expect(result.rows[1]).toBeInstanceOf(Client);
      expect(result.rows[1].address).toBeUndefined();
    });

    it('should find all clients with address and count with pagination', async () => {
      const mockClient = {
        id: 1,
        name: 'Client 1',
        email: 'client1@example.com',
        cpf: '12345678901',
        phone: '11999999999',
        idAddress: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        address: {
          id: 1,
          zipCode: '12345-678',
          state: 'SP',
          city: 'São Paulo',
          street: 'Rua Teste',
          number: '123',
          complement: null,
          latitude: -23.5505,
          longitude: -46.6333,
          status: 1,
          createdAt: new Date()
        }
      };
      
      mockClientModel.associations = null;
      mockClientModel.belongsTo.mockImplementation(() => {});
      mockClientModel.findAndCountAll.mockResolvedValue({
        count: 1,
        rows: [mockClient]
      });
      
      const result = await repository.findAllWithAddressAndCount(5, 5, { status: 1 });
      
      expect(result.count).toBe(1);
      expect(result.rows).toHaveLength(1);
      expect(mockClientModel.findAndCountAll).toHaveBeenCalledWith({
        where: { status: 1 },
        offset: 5,
        limit: 5,
        include: [{
          model: mockAddressModel,
          as: 'address',
          required: false
        }]
      });
    });

    it('should throw error when findAllWithAddressAndCount fails', async () => {
      mockClientModel.associations = null;
      mockClientModel.belongsTo.mockImplementation(() => {});
      mockClientModel.findAndCountAll.mockRejectedValue(new Error('Database error'));
      
      await expect(repository.findAllWithAddressAndCount()).rejects.toThrow('Database error');
    });
  });
});