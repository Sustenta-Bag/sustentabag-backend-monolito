import ClientController from '../../../../src/presentation/controllers/ClientController.js';
import Client from '../../../../src/domain/entities/Client.js';
import AppError from '../../../../src/infrastructure/errors/AppError.js';
import { jest } from '@jest/globals';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock do jsonwebtoken
jest.mock('jsonwebtoken');
jest.mock('bcrypt');

describe('ClientController', () => {
  let mockClientService;
  let clientController;
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
      updateStatus: jest.fn(),
      getActiveClients: jest.fn(),
      findByEmail: jest.fn()
    };

    clientController = new ClientController(mockClientService);

    mockRequest = {
      params: {},
      body: {},
      query: {}
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };

    mockNext = jest.fn();

    // Setup bcrypt and jwt mocks
    bcrypt.compare = jest.fn();
    jwt.sign = jest.fn();
  });

  describe('createClient', () => {
    test('should create a client and return 201 status', async () => {
      const clientData = {
        name: 'New Client',
        email: 'new@example.com',
        password: 'password123',
        cpf: '12345678901',
        phone: '11987654321'
      };
      
      const createdClient = {
        id: 1,
        ...clientData,
        password: 'hashedPassword',
        status: true
      };
      
      mockRequest.body = clientData;
      mockClientService.createClient.mockResolvedValue(createdClient);
      
      await clientController.createClient(mockRequest, mockResponse, mockNext);
      
      expect(mockClientService.createClient).toHaveBeenCalledWith(clientData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdClient);
    });

    test('should call next with validation error when required fields are missing', async () => {
      mockRequest.body = {
        name: 'New Client'
        // missing required fields
      };
      
      const validationError = new Error('Validation error');
      validationError.name = 'ValidationError';
      mockClientService.createClient.mockRejectedValue(validationError);
      
      await clientController.createClient(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(validationError);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    test('should call next with error when service fails', async () => {
      mockRequest.body = {
        name: 'New Client',
        email: 'new@example.com',
        password: 'password123',
        cpf: '12345678901',
        phone: '11987654321'
      };
      
      const error = new Error('Service error');
      mockClientService.createClient.mockRejectedValue(error);
      
      await clientController.createClient(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('getClient', () => {
    test('should get client by id and return without password', async () => {
      const client = {
        id: 1,
        name: 'Client 1',
        email: 'client1@example.com',
        password: 'hashedPassword1',
        status: true
      };
      
      mockRequest.params.id = '1';
      mockRequest.query.includeAddress = 'false';
      mockClientService.getClient.mockResolvedValue(client);
      
      await clientController.getClient(mockRequest, mockResponse, mockNext);
      
      expect(mockClientService.getClient).toHaveBeenCalledWith('1', { includeAddress: false });
      expect(mockResponse.json).toHaveBeenCalledWith(client);
    });

    test('should call next with error when client not found', async () => {
      mockRequest.params.id = '999';
      mockRequest.query.includeAddress = 'false';
      mockClientService.getClient.mockResolvedValue(null);
      
      await clientController.getClient(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].message).toBe('Cliente não encontrado');
      expect(mockNext.mock.calls[0][0].errorCode).toBe('CLIENT_NOT_FOUND');
    });

    test('should call next with error when service fails', async () => {
      mockRequest.params.id = '1';
      mockRequest.query.includeAddress = 'false';
      const error = new Error('Service error');
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
      
      mockRequest.query.includeAddress = 'false';
      mockClientService.getAllClients.mockResolvedValue(clients);
      
      await clientController.getAllClients(mockRequest, mockResponse, mockNext);
      
      expect(mockClientService.getAllClients).toHaveBeenCalledWith({ includeAddress: false });
      expect(mockResponse.json).toHaveBeenCalledWith(clients);
    });
    
    test('should call next with error when service fails', async () => {
      mockRequest.query.includeAddress = 'false';
      const error = new Error('Service error');
      mockClientService.getAllClients.mockRejectedValue(error);
      
      await clientController.getAllClients(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateClient', () => {
    test('should update client and return updated data without password', async () => {
      const updateData = {
        name: 'Updated Name',
        phone: '11999998888'
      };
      
      const updatedClient = {
        id: 1,
        ...updateData,
        email: 'client1@example.com',
        password: 'hashedPassword1',
        status: true
      };
      
      mockRequest.params.id = '1';
      mockRequest.body = updateData;
      mockClientService.updateClient.mockResolvedValue(updatedClient);
      
      await clientController.updateClient(mockRequest, mockResponse, mockNext);
      
      expect(mockClientService.updateClient).toHaveBeenCalledWith('1', updateData);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedClient);
    });

    test('should call next with validation error when update data is invalid', async () => {
      mockRequest.params.id = '1';
      mockRequest.body = {
        email: 'invalid-email' // invalid email format
      };
      
      const validationError = new Error('Validation error');
      validationError.name = 'ValidationError';
      mockClientService.updateClient.mockRejectedValue(validationError);
      
      await clientController.updateClient(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(validationError);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    test('should call next with error when client not found', async () => {
      mockRequest.params.id = '999';
      mockRequest.body = { name: 'New Name' };
      mockClientService.updateClient.mockResolvedValue(null);
      
      await clientController.updateClient(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].message).toBe('Cliente não encontrado');
      expect(mockNext.mock.calls[0][0].errorCode).toBe('CLIENT_NOT_FOUND');
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

  describe('updateStatus', () => {
    test('should update client status and return updated client', async () => {
      const updatedClient = {
        id: 1,
        name: 'Client 1',
        email: 'client1@example.com',
        password: 'hashedPassword1',
        status: false
      };
      
      mockRequest.params.id = '1';
      mockRequest.body = { status: false };
      mockClientService.updateStatus.mockResolvedValue(updatedClient);
      
      await clientController.updateStatus(mockRequest, mockResponse, mockNext);
      
      expect(mockClientService.updateStatus).toHaveBeenCalledWith('1', false);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedClient);
    });

    test('should call next with error when status is not provided', async () => {
      mockRequest.params.id = '1';
      mockRequest.body = {};
      
      await clientController.updateStatus(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].message).toBe('Status é obrigatório');
      expect(mockNext.mock.calls[0][0].errorCode).toBe('MISSING_STATUS');
    });

    test('should call next with error when service fails', async () => {
      mockRequest.params.id = '1';
      mockRequest.body = { status: true };
      const error = new Error('Service error');
      mockClientService.updateStatus.mockRejectedValue(error);
      
      await clientController.updateStatus(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getActiveClients', () => {
    test('should get all active clients and return them without passwords', async () => {
      const clients = [
        {
          id: 1,
          name: 'Active Client 1',
          email: 'active1@example.com',
          password: 'hashedPassword1',
          status: true
        },
        {
          id: 2,
          name: 'Active Client 2',
          email: 'active2@example.com',
          password: 'hashedPassword2',
          status: true
        }
      ];
      
      mockRequest.query.includeAddress = 'false';
      mockClientService.getActiveClients.mockResolvedValue(clients);
      
      await clientController.getActiveClients(mockRequest, mockResponse, mockNext);
      
      expect(mockClientService.getActiveClients).toHaveBeenCalledWith({ includeAddress: false });
      expect(mockResponse.json).toHaveBeenCalledWith(clients);
    });
    
    test('should call next with error when service fails', async () => {
      mockRequest.query.includeAddress = 'false';
      const error = new Error('Service error');
      mockClientService.getActiveClients.mockRejectedValue(error);
      
      await clientController.getActiveClients(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('login', () => {
    test('should login successfully and return token and client data', async () => {
      const client = {
        id: 1,
        name: 'Client 1',
        email: 'client1@example.com',
        password: 'hashedPassword1',
        cpf: '12345678901',
        phone: '11987654321',
        status: true
      };
      
      mockRequest.body = {
        email: 'client1@example.com',
        password: 'password123'
      };
      
      mockClientService.findByEmail.mockResolvedValue(client);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fake-token');
      
      await clientController.login(mockRequest, mockResponse, mockNext);
      
      expect(mockClientService.findByEmail).toHaveBeenCalledWith('client1@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword1');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: client.id, role: 'client' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        token: 'fake-token',
        client: {
          id: client.id,
          name: client.name,
          email: client.email,
          cpf: client.cpf,
          phone: client.phone,
          status: client.status
        }
      });
    });

    test('should call next with error when client not found', async () => {
      mockRequest.body = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };
      
      mockClientService.findByEmail.mockResolvedValue(null);
      
      await clientController.login(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].message).toBe('Email ou senha inválidos');
      expect(mockNext.mock.calls[0][0].errorCode).toBe('INVALID_CREDENTIALS');
    });

    test('should call next with error when password is invalid', async () => {
      const client = {
        id: 1,
        name: 'Client 1',
        email: 'client1@example.com',
        password: 'hashedPassword1',
        status: true
      };
      
      mockRequest.body = {
        email: 'client1@example.com',
        password: 'wrong-password'
      };
      
      mockClientService.findByEmail.mockResolvedValue(client);
      bcrypt.compare.mockResolvedValue(false);
      
      await clientController.login(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].message).toBe('Email ou senha inválidos');
      expect(mockNext.mock.calls[0][0].errorCode).toBe('INVALID_CREDENTIALS');
    });

    test('should call next with error when service fails', async () => {
      mockRequest.body = {
        email: 'client1@example.com',
        password: 'password123'
      };
      
      const error = new Error('Service error');
      mockClientService.findByEmail.mockRejectedValue(error);
      
      await clientController.login(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});