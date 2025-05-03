import PostgresClientRepository from '../../../../src/infrastructure/repositories/PostgresClientRepository.js';
import Client from '../../../../src/domain/entities/Client.js';
import { jest } from '@jest/globals';

describe('PostgresClientRepository', () => {
  let mockClientModel;
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
    mockClientModel = {
      create: jest.fn(),
      findByPk: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn()
    };
    
    repository = new PostgresClientRepository(mockClientModel);
  });

  // describe('create', () => {
  //   test('should create a client and return domain entity', async () => {
  //     const mockClientRecord = {
  //       ...clientData,
  //       toJSON: () => clientData
  //     };
      
  //     mockClientModel.create.mockResolvedValue(mockClientRecord);
      
  //     const result = await repository.create(clientData);
      
  //     expect(mockClientModel.create).toHaveBeenCalledWith(clientData);
  //     expect(result).toBeInstanceOf(Client);
  //     expect(result.id).toBe(clientData.id);
  //     expect(result.name).toBe(clientData.name);
  //     expect(result.email).toBe(clientData.email);
  //     expect(result.cpf).toBe(clientData.cpf);
  //     expect(result.password).toBe(clientData.password);
  //     expect(result.phone).toBe(clientData.phone);
  //     expect(result.status).toBe(clientData.status);
  //     expect(result.createdAt).toEqual(clientData.createdAt);
  //   });
  // });

  describe('findById', () => {
    test('should find a client by id and return domain entity', async () => {
      const mockClientRecord = {
        ...clientData,
        toJSON: () => clientData
      };
      
      mockClientModel.findByPk.mockResolvedValue(mockClientRecord);
      
      const result = await repository.findById(1);
      
      expect(mockClientModel.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBeInstanceOf(Client);
      expect(result.id).toBe(clientData.id);
    });
    
    test('should return null when client not found', async () => {
      mockClientModel.findByPk.mockResolvedValue(null);
      
      const result = await repository.findById(999);
      
      expect(mockClientModel.findByPk).toHaveBeenCalledWith(999);
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
      
      const result = await repository.findByCpf('12345678901');
      
      expect(mockClientModel.findOne).toHaveBeenCalledWith({
        where: { cpf: '12345678901' }
      });
      expect(result).toBeInstanceOf(Client);
      expect(result.cpf).toBe('12345678901');
    });
    
    test('should return null when client not found by CPF', async () => {
      mockClientModel.findOne.mockResolvedValue(null);
      
      const result = await repository.findByCpf('99988877766');
      
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
      
      const result = await repository.findByEmail('joao.silva@email.com');
      
      expect(mockClientModel.findOne).toHaveBeenCalledWith({
        where: { email: 'joao.silva@email.com' }
      });
      expect(result).toBeInstanceOf(Client);
      expect(result.email).toBe('joao.silva@email.com');
    });
    
    test('should return null when client not found by email', async () => {
      mockClientModel.findOne.mockResolvedValue(null);
      
      const result = await repository.findByEmail('naoexiste@email.com');
      
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
      
      mockClientModel.findAll.mockResolvedValue(mockClientRecords);
      
      const results = await repository.findAll();
      
      expect(mockClientModel.findAll).toHaveBeenCalled();
      expect(results).toHaveLength(2);
      expect(results[0]).toBeInstanceOf(Client);
      expect(results[1]).toBeInstanceOf(Client);
      expect(results[0].id).toBe(1);
      expect(results[1].id).toBe(2);
    });
    
    test('should return empty array when no clients found', async () => {
      mockClientModel.findAll.mockResolvedValue([]);
      
      const results = await repository.findAll();
      
      expect(mockClientModel.findAll).toHaveBeenCalled();
      expect(results).toEqual([]);
    });
  });

  describe('update', () => {
    // test('should update a client and return domain entity', async () => {
    //   const updateData = { name: 'João Santos Silva', phone: '11999998888' };
    //   const updatedClientData = { ...clientData, ...updateData };
    //   const mockClientRecord = {
    //     ...updatedClientData,
    //     toJSON: () => updatedClientData
    //   };
      
    //   mockClientModel.update.mockResolvedValue([1]);
    //   mockClientModel.findByPk.mockResolvedValue(mockClientRecord);
      
    //   const result = await repository.update(1, updateData);
      
    //   expect(mockClientModel.update).toHaveBeenCalledWith(updateData, { where: { id: 1 } });
    //   expect(mockClientModel.findByPk).toHaveBeenCalledWith(1);
    //   expect(result).toBeInstanceOf(Client);
    //   expect(result.name).toBe(updateData.name);
    //   expect(result.phone).toBe(updateData.phone);
    // });
    
    test('should return null when client not found after update', async () => {
      mockClientModel.update.mockResolvedValue([1]);
      mockClientModel.findByPk.mockResolvedValue(null);
      
      const result = await repository.update(999, { name: 'Novo Nome' });
      
      expect(mockClientModel.update).toHaveBeenCalledWith({ name: 'Novo Nome' }, { where: { id: 999 } });
      expect(mockClientModel.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    test('should return true when client successfully deleted', async () => {
      mockClientModel.destroy.mockResolvedValue(1);
      
      const result = await repository.delete(1);
      
      expect(mockClientModel.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(true);
    });
    
    test('should return false when client not found for deletion', async () => {
      mockClientModel.destroy.mockResolvedValue(0);
      
      const result = await repository.delete(999);
      
      expect(mockClientModel.destroy).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(result).toBe(false);
    });
  });

  describe('findActiveClients', () => {
    // test('should find active clients and return domain entities', async () => {
    //   const mockClientRecords = [
    //     {
    //       ...clientData,
    //       id: 1,
    //       status: 1,
    //       toJSON: () => ({ ...clientData, id: 1, status: 1 })
    //     },
    //     {
    //       ...clientData,
    //       id: 2,
    //       cpf: '98765432101',
    //       email: 'outro@email.com',
    //       status: 1,
    //       toJSON: () => ({ ...clientData, id: 2, cpf: '98765432101', email: 'outro@email.com', status: 1 })
    //     }
    //   ];
      
    //   mockClientModel.findAll.mockResolvedValue(mockClientRecords);
      
    //   const results = await repository.findActiveClients();
      
    //   expect(mockClientModel.findAll).toHaveBeenCalledWith({
    //     where: { status: 1 }
    //   });
    //   expect(results).toHaveLength(2);
    //   expect(results[0]).toBeInstanceOf(Client);
    //   expect(results[1]).toBeInstanceOf(Client);
    //   expect(results[0].status).toBe(1);
    //   expect(results[1].status).toBe(1);
    // });
    
    test('should return empty array when no active clients found', async () => {
      mockClientModel.findAll.mockResolvedValue([]);
      
      const results = await repository.findActiveClients();
      
      expect(mockClientModel.findAll).toHaveBeenCalledWith({
        where: { status: 1 }
      });
      expect(results).toEqual([]);
    });
  });
});