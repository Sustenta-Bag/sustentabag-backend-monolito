import ClientController from '../../../../src/presentation/controllers/ClientController.js';
import Client from '../../../../src/domain/entities/Client.js';
import AppError from '../../../../src/infrastructure/errors/AppError.js';
import { jest } from '@jest/globals';

// Mock do jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mocked_token')
}));

describe('ClientController', () => {
  let mockClientService;
  let clientController;
  let mockUserRepository;
  let mockRequest;
  let mockResponse;
  let mockNext;
  
  beforeEach(() => {
    mockClientService = {
      createClient: jest.fn(),
      getClient: jest.fn(),
      getAllClients: jest.fn(),
      updateClient: jest.fn(),
      deleteClient: jest.fn(),
      getActiveClients: jest.fn(),
      changeClientStatus: jest.fn(),
      authenticateClient: jest.fn(),
      findByCpf: jest.fn()
    };
    
    mockUserRepository = {
      findByEntityId: jest.fn()
    };
    
    clientController = new ClientController(mockClientService);
    clientController.userRepository = mockUserRepository;
    
    mockRequest = {
      params: {},
      body: {}
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
    
    mockNext = jest.fn();
  });
  
  describe('createClient', () => {
    test('should create a client and return it without password', async () => {
      const clientData = {
        name: 'Test Client',
        cpf: '12345678900',
        email: 'test@example.com',
        password: 'password123'
      };
      
      const createdClient = {
        id: 1,
        name: 'Test Client',
        cpf: '12345678900',
        email: 'test@example.com',
        password: 'hashedPassword',
        status: true
      };
      
      mockRequest.body = clientData;
      mockClientService.createClient.mockResolvedValue(createdClient);
      
      await clientController.createClient(mockRequest, mockResponse, mockNext);
      
      expect(mockClientService.createClient).toHaveBeenCalledWith(clientData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Test Client',
        cpf: '12345678900',
        email: 'test@example.com',
        status: true
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    test('should call next with error when createClient fails', async () => {
      const error = new Error('Service error');
      mockRequest.body = { name: 'Test Client' };
      mockClientService.createClient.mockRejectedValue(error);
      
      await clientController.createClient(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
  
  describe('getClient', () => {
    test('should get a client by id and return it without password', async () => {
      const client = {
        id: 1,
        name: 'Test Client',
        email: 'test@example.com',
        password: 'hashedPassword',
        status: true
      };
      
      mockRequest.params.id = '1';
      mockClientService.getClient.mockResolvedValue(client);
      
      await clientController.getClient(mockRequest, mockResponse, mockNext);
      
      expect(mockClientService.getClient).toHaveBeenCalledWith('1');
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Test Client',
        email: 'test@example.com',
        status: true
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    test('should call next with error when getClient fails', async () => {
      const error = new Error('Service error');
      mockRequest.params.id = '1';
      mockClientService.getClient.mockRejectedValue(error);
      
      await clientController.getClient(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
  
  describe('getAllClients', () => {
    test('should get all clients and return them without passwords', async () => {
      const clients = [
        {
          id: 1,
          name: 'Client 1',
          email: 'client1@example.com',
          password: 'hashedPassword1',
          status: true
        },
        {
          id: 2,
          name: 'Client 2',
          email: 'client2@example.com',
          password: 'hashedPassword2',
          status: false
        }
      ];
      
      mockClientService.getAllClients.mockResolvedValue(clients);
      
      await clientController.getAllClients(mockRequest, mockResponse, mockNext);
      
      expect(mockClientService.getAllClients).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith([
        {
          id: 1,
          name: 'Client 1',
          email: 'client1@example.com',
          status: true
        },
        {
          id: 2,
          name: 'Client 2',
          email: 'client2@example.com',
          status: false
        }
      ]);
    });
    
    test('should call next with error when getAllClients fails', async () => {
      const error = new Error('Service error');
      mockClientService.getAllClients.mockRejectedValue(error);
      
      await clientController.getAllClients(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
  
  describe('updateClient', () => {
    test('should update a client and return it without password', async () => {
      const updateData = {
        name: 'Updated Client'
      };
      
      const updatedClient = {
        id: 1,
        name: 'Updated Client',
        email: 'test@example.com',
        password: 'hashedPassword',
        status: true
      };
      
      mockRequest.params.id = '1';
      mockRequest.body = updateData;
      mockClientService.updateClient.mockResolvedValue(updatedClient);
      
      await clientController.updateClient(mockRequest, mockResponse, mockNext);
      
      expect(mockClientService.updateClient).toHaveBeenCalledWith('1', updateData);
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Updated Client',
        email: 'test@example.com',
        status: true
      });
    });
    
    test('should call next with error when updateClient fails', async () => {
      const error = new Error('Service error');
      mockRequest.params.id = '1';
      mockRequest.body = { name: 'Updated Client' };
      mockClientService.updateClient.mockRejectedValue(error);
      
      await clientController.updateClient(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
  
  describe('deleteClient', () => {
    test('should delete a client and return 204 status', async () => {
      mockRequest.params.id = '1';
      mockClientService.deleteClient.mockResolvedValue(true);
      
      await clientController.deleteClient(mockRequest, mockResponse, mockNext);
      
      expect(mockClientService.deleteClient).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });
    
    test('should call next with error when deleteClient fails', async () => {
      const error = new Error('Service error');
      mockRequest.params.id = '1';
      mockClientService.deleteClient.mockRejectedValue(error);
      
      await clientController.deleteClient(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
  
  describe('getActiveClients', () => {
    test('should get all active clients and return them without passwords', async () => {
      const clients = [
        {
          id: 1,
          name: 'Client 1',
          email: 'client1@example.com',
          password: 'hashedPassword1',
          status: true
        },
        {
          id: 3,
          name: 'Client 3',
          email: 'client3@example.com',
          password: 'hashedPassword3',
          status: true
        }
      ];
      
      mockClientService.getActiveClients.mockResolvedValue(clients);
      
      await clientController.getActiveClients(mockRequest, mockResponse, mockNext);
      
      expect(mockClientService.getActiveClients).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith([
        {
          id: 1,
          name: 'Client 1',
          email: 'client1@example.com',
          status: true
        },
        {
          id: 3,
          name: 'Client 3',
          email: 'client3@example.com',
          status: true
        }
      ]);
    });
    
    test('should call next with error when getActiveClients fails', async () => {
      const error = new Error('Service error');
      mockClientService.getActiveClients.mockRejectedValue(error);
      
      await clientController.getActiveClients(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
  
  describe('changeClientStatus', () => {
    test('should change client status and return updated client without password', async () => {
      const updatedClient = {
        id: 1,
        name: 'Test Client',
        email: 'test@example.com',
        password: 'hashedPassword',
        status: false
      };
      
      mockRequest.params.id = '1';
      mockRequest.body = { status: false };
      mockClientService.changeClientStatus.mockResolvedValue(updatedClient);
      
      await clientController.changeClientStatus(mockRequest, mockResponse, mockNext);
      
      expect(mockClientService.changeClientStatus).toHaveBeenCalledWith('1', false);
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Test Client',
        email: 'test@example.com',
        status: false
      });
    });
    
    test('should throw error when status is not provided', async () => {
      mockRequest.params.id = '1';
      mockRequest.body = {}; // Missing status
      
      await clientController.changeClientStatus(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Status não fornecido');
    });
    
    test('should call next with error when changeClientStatus fails', async () => {
      const error = new Error('Service error');
      mockRequest.params.id = '1';
      mockRequest.body = { status: true };
      mockClientService.changeClientStatus.mockRejectedValue(error);
      
      await clientController.changeClientStatus(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
  
  describe('login', () => {
    test('should throw error when cpf or password is missing', async () => {
      // Test missing CPF
      mockRequest.body = { password: 'password123' };
      
      await clientController.login(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      let error = mockNext.mock.calls[0][0];
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('CPF e senha são obrigatórios');
      
      // Reset mocks
      mockNext.mockClear();
      
      // Test missing password
      mockRequest.body = { cpf: '12345678900' };
      
      await clientController.login(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      error = mockNext.mock.calls[0][0];
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('CPF e senha são obrigatórios');
    });
    
    test('should throw error when client is not found', async () => {
      mockRequest.body = { cpf: '12345678900', password: 'password123' };
      mockClientService.findByCpf.mockResolvedValue(null);
      
      await clientController.login(mockRequest, mockResponse, mockNext);
      
      expect(mockClientService.findByCpf).toHaveBeenCalledWith('12345678900');
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Credenciais inválidas');
    });
    
    test('should throw error when user is not found', async () => {
      const client = {
        id: 1,
        name: 'Test Client',
        cpf: '12345678900'
      };
      
      mockRequest.body = { cpf: '12345678900', password: 'password123' };
      mockClientService.findByCpf.mockResolvedValue(client);
      mockUserRepository.findByEntityId.mockResolvedValue(null);
      
      await clientController.login(mockRequest, mockResponse, mockNext);
      
      expect(mockUserRepository.findByEntityId).toHaveBeenCalledWith(1, 'client');
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Usuário não encontrado');
    });
  });
});