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
      changeClientStatus: jest.fn(),
      findByEmail: jest.fn()
    };

    clientController = new ClientController(mockClientService);

    mockRequest = {
      params: {},
      body: {},
      query: {},
      user: {
        entityId: '1'
      }
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      created: jest.fn(),
      ok: jest.fn(),
      no_content: jest.fn(),
      hateoasItem: jest.fn(),
      hateoasList: jest.fn()
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
      expect(mockResponse.created).toHaveBeenCalled();
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
      expect(mockResponse.created).not.toHaveBeenCalled();
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
      expect(mockResponse.created).not.toHaveBeenCalled();
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
      
      expect(mockClientService.getClient).toHaveBeenCalledWith('1', true);
      expect(mockResponse.hateoasItem).toHaveBeenCalledWith(client);
    });

    test('should get client by id with address when includeAddress is true', async () => {
      const client = {
        id: 1,
        name: 'Client 1',
        email: 'client1@example.com',
        password: 'hashedPassword1',
        status: true
      };
      
      mockRequest.params.id = '1';
      mockRequest.query.includeAddress = 'true';
      mockClientService.getClient.mockResolvedValue(client);
      
      await clientController.getClient(mockRequest, mockResponse, mockNext);
      
      expect(mockClientService.getClient).toHaveBeenCalledWith('1', true);
      expect(mockResponse.hateoasItem).toHaveBeenCalledWith(client);
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
      const clients = {
        data: [
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
        ],
        pages: { current: 1, total: 1 }
      };
      
      mockRequest.query.includeAddress = 'false';
      mockClientService.getAllClients.mockResolvedValue(clients);
      
      await clientController.getAllClients(mockRequest, mockResponse, mockNext);
      
      expect(mockClientService.getAllClients).toHaveBeenCalledWith(1, 10, {
        includeAddress: false,
        name: '',
        email: '',
        cpf: '',
        phone: '',
        status: ''
      });
      expect(mockResponse.hateoasList).toHaveBeenCalledWith(clients.data, clients.pages);
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
      expect(mockResponse.ok).toHaveBeenCalledWith(updatedClient);
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
      expect(mockResponse.ok).not.toHaveBeenCalled();
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
      expect(mockResponse.no_content).toHaveBeenCalled();
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
      mockRequest.user.entityId = 1;
      mockRequest.body = { status: false };
      mockClientService.changeClientStatus.mockResolvedValue(updatedClient);
      
      await clientController.updateStatus(mockRequest, mockResponse, mockNext);
      
      expect(mockClientService.changeClientStatus).toHaveBeenCalledWith('1', false);
      expect(mockResponse.ok).toHaveBeenCalledWith(updatedClient);
    });

    test('should call next with error when status is not provided', async () => {
      mockRequest.params.id = '1';
      mockRequest.user.entityId = 1;
      mockRequest.body = {};
      
      await clientController.updateStatus(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].message).toBe('Status é obrigatório');
      expect(mockNext.mock.calls[0][0].errorCode).toBe('MISSING_STATUS');
    });

    test('should call next with error when service fails', async () => {
      mockRequest.params.id = '1';
      mockRequest.user.entityId = 1;
      mockRequest.body = { status: true };
      const error = new Error('Service error');
      mockClientService.changeClientStatus.mockRejectedValue(error);
      
      await clientController.updateStatus(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

});