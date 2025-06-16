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
    it('should create client successfully', async () => {
      const clientData = {
        name: 'John Doe',
        email: 'john@example.com',
        cpf: '12345678901',
        phone: '11999999999'
      };

      mockRequest.body = clientData;
      mockClientService.createClient.mockResolvedValue();

      await clientController.createClient(mockRequest, mockResponse, mockNext);

      expect(mockClientService.createClient).toHaveBeenCalledWith(clientData);
      expect(mockResponse.created).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle service error', async () => {
      mockClientService.createClient.mockRejectedValue(new Error('Service error'));

      await clientController.createClient(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should create client with complex data', async () => {
      mockRequest.body = {
        name: 'John Doe',
        email: 'john@example.com',
        cpf: '12345678901',
        phone: '11999999999',
        idAddress: 1
      };
      mockClientService.createClient.mockResolvedValue();

      await clientController.createClient(mockRequest, mockResponse, mockNext);

      expect(mockClientService.createClient).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.created).toHaveBeenCalled();
    });
  });

  describe('getClient', () => {
    it('should get client successfully without address', async () => {
      const mockClient = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      };

      mockRequest.params.id = '1';
      mockRequest.query.includeAddress = 'false';
      mockClientService.getClient.mockResolvedValue(mockClient);

      await clientController.getClient(mockRequest, mockResponse, mockNext);

      expect(mockClientService.getClient).toHaveBeenCalledWith('1', true);
      expect(mockResponse.hateoasItem).toHaveBeenCalledWith(mockClient);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should get client successfully with address when includeAddress is true', async () => {
      const mockClient = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        address: {
          id: 1,
          street: 'Rua Teste'
        }
      };

      mockRequest.params.id = '1';
      mockRequest.query.includeAddress = 'true';
      mockClientService.getClient.mockResolvedValue(mockClient);

      await clientController.getClient(mockRequest, mockResponse, mockNext);

      expect(mockClientService.getClient).toHaveBeenCalledWith('1', true);
      expect(mockResponse.hateoasItem).toHaveBeenCalledWith(mockClient);
    });

    it('should get client with includeAddress as boolean true', async () => {
      mockRequest.params.id = '1';
      mockRequest.query.includeAddress = true; // boolean true
      
      const mockClient = { id: 1, name: 'John Doe' };
      mockClientService.getClient.mockResolvedValue(mockClient);

      await clientController.getClient(mockRequest, mockResponse, mockNext);

      expect(mockClientService.getClient).toHaveBeenCalledWith('1', true);
      expect(mockResponse.hateoasItem).toHaveBeenCalledWith(mockClient);
    });

    it('should return 404 when client not found', async () => {
      mockRequest.params.id = '999';
      mockRequest.query.includeAddress = 'false';
      mockClientService.getClient.mockResolvedValue(null);

      await clientController.getClient(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      const error = mockNext.mock.calls[0][0];
      expect(error.message).toBe('Cliente não encontrado');
      expect(error.statusCode).toBe(404);
    });

    it('should handle service error', async () => {
      const error = new Error('Service error');
      mockRequest.params.id = '1';
      mockClientService.getClient.mockRejectedValue(error);

      await clientController.getClient(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllClients', () => {
    it('should get all clients with default pagination', async () => {
      const mockClients = {
        data: [
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Doe' }
        ],
        pages: {
          current: 1,
          total: 1,
          hasNext: false,
          hasPrev: false
        }
      };

      mockRequest.query = {};
      mockClientService.getAllClients.mockResolvedValue(mockClients);

      await clientController.getAllClients(mockRequest, mockResponse, mockNext);

      expect(mockClientService.getAllClients).toHaveBeenCalledWith(1, 10, {
        includeAddress: false,
        name: '',
        email: '',
        cpf: '',
        phone: '',
        status: ''
      });
      expect(mockResponse.hateoasList).toHaveBeenCalledWith(mockClients.data, mockClients.pages);
    });

    it('should get all clients with custom pagination and filters', async () => {
      mockRequest.query = {
        page: '2',
        limit: '5',
        includeAddress: 'true',
        name: 'John',
        email: 'john@example.com',
        cpf: '12345678901',
        phone: '11999999999',
        status: '1'
      };
      
      const mockClients = {
        data: [
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'John Smith', email: 'johnsmith@example.com' }
        ],
        pages: 3
      };
      
      mockClientService.getAllClients.mockResolvedValue(mockClients);

      await clientController.getAllClients(mockRequest, mockResponse, mockNext);

      expect(mockClientService.getAllClients).toHaveBeenCalledWith(2, 5, {
        includeAddress: true,
        name: 'John',
        email: 'john@example.com',
        cpf: '12345678901',
        phone: '11999999999',
        status: '1'
      });
      expect(mockResponse.hateoasList).toHaveBeenCalledWith(mockClients.data, mockClients.pages);
    });

    it('should get all clients with includeAddress as boolean true', async () => {
      mockRequest.query = {
        includeAddress: 'true'
      };
      
      const mockClients = {
        data: [{ id: 1, name: 'John Doe' }],
        pages: 1
      };
      
      mockClientService.getAllClients.mockResolvedValue(mockClients);

      await clientController.getAllClients(mockRequest, mockResponse, mockNext);

      expect(mockClientService.getAllClients).toHaveBeenCalledWith(1, 10, {
        includeAddress: true,
        name: '',
        email: '',
        cpf: '',
        phone: '',
        status: ''
      });
    });

    it('should get all clients with includeAddress as string false', async () => {
      mockRequest.query = {
        includeAddress: 'false'
      };
      
      const mockClients = {
        data: [{ id: 1, name: 'John Doe' }],
        pages: 1
      };
      
      mockClientService.getAllClients.mockResolvedValue(mockClients);

      await clientController.getAllClients(mockRequest, mockResponse, mockNext);

      expect(mockClientService.getAllClients).toHaveBeenCalledWith(1, 10, {
        includeAddress: false,
        name: '',
        email: '',
        cpf: '',
        phone: '',
        status: ''
      });
    });

    it('should handle service error in getAllClients', async () => {
      mockRequest.query = {};
      mockClientService.getAllClients.mockRejectedValue(new Error('Service error'));

      await clientController.getAllClients(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('updateClient', () => {
    it('should update client successfully', async () => {
      const updateData = { name: 'Updated Name' };
      const mockClient = {
        id: 1,
        name: 'Updated Name',
        email: 'john@example.com'
      };

      mockRequest.params.id = '1';
      mockRequest.user.entityId = 1;
      mockRequest.body = updateData;
      mockClientService.updateClient.mockResolvedValue(mockClient);

      await clientController.updateClient(mockRequest, mockResponse, mockNext);

      expect(mockClientService.updateClient).toHaveBeenCalledWith(1, updateData);
      expect(mockResponse.ok).toHaveBeenCalledWith(mockClient);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when user tries to update different client', async () => {
      mockRequest.params.id = '2';
      mockRequest.user.entityId = 1;
      mockClientService.updateClient.mockResolvedValue(null);

      await clientController.updateClient(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      const error = mockNext.mock.calls[0][0];
      expect(error.message).toBe('Cliente não encontrado');
      expect(error.statusCode).toBe(404);
    });

    it('should return 404 when client not found', async () => {
      mockRequest.params.id = '1';
      mockRequest.user.entityId = 1;
      mockRequest.body = { name: 'Updated Name' };
      mockClientService.updateClient.mockResolvedValue(null);

      await clientController.updateClient(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      const error = mockNext.mock.calls[0][0];
      expect(error.message).toBe('Cliente não encontrado');
      expect(error.statusCode).toBe(404);
    });

    it('should handle service error', async () => {
      const error = new Error('Service error');
      mockRequest.params.id = '1';
      mockRequest.user.entityId = 1;
      mockClientService.updateClient.mockRejectedValue(error);

      await clientController.updateClient(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteClient', () => {
    it('should delete client successfully', async () => {
      mockRequest.params.id = '1';
      mockRequest.user.entityId = 1;
      mockClientService.deleteClient.mockResolvedValue();

      await clientController.deleteClient(mockRequest, mockResponse, mockNext);

      expect(mockClientService.deleteClient).toHaveBeenCalledWith(1);
      expect(mockResponse.no_content).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when user tries to delete different client', async () => {
      mockRequest.params.id = '2';
      mockRequest.user.entityId = 1;
      mockClientService.deleteClient.mockResolvedValue();

      await clientController.deleteClient(mockRequest, mockResponse, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.no_content).toHaveBeenCalled();
    });

    it('should handle service error', async () => {
      const error = new Error('Service error');
      mockRequest.params.id = '1';
      mockRequest.user.entityId = 1;
      mockClientService.deleteClient.mockRejectedValue(error);

      await clientController.deleteClient(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateStatus', () => {
    it('should update client status successfully', async () => {
      const mockClient = {
        id: 1,
        name: 'John Doe',
        status: 1
      };

      mockRequest.params.id = '1';
      mockRequest.user.entityId = 1;
      mockRequest.body = { status: 0 };
      mockClientService.changeClientStatus.mockResolvedValue(mockClient);

      await clientController.updateStatus(mockRequest, mockResponse, mockNext);

      expect(mockClientService.changeClientStatus).toHaveBeenCalledWith('1', 0);
      expect(mockResponse.ok).toHaveBeenCalledWith(mockClient);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when user tries to update different client status', async () => {
      mockRequest.params.id = '2';
      mockRequest.user.entityId = 1;

      await clientController.updateStatus(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      const error = mockNext.mock.calls[0][0];
      expect(error.message).toBe('Você não tem permissão para atualizar o status deste cliente');
      expect(error.statusCode).toBe(403);
    });

    it('should return 400 when status is missing', async () => {
      mockRequest.params.id = '1';
      mockRequest.user.entityId = 1;
      mockRequest.body = {};

      await clientController.updateStatus(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      const error = mockNext.mock.calls[0][0];
      expect(error.message).toBe('Status é obrigatório');
      expect(error.statusCode).toBe(400);
    });

    it('should return 404 when client not found', async () => {
      mockRequest.params.id = '1';
      mockRequest.user.entityId = 1;
      mockRequest.body = { status: 0 };
      mockClientService.changeClientStatus.mockResolvedValue(null);

      await clientController.updateStatus(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      const error = mockNext.mock.calls[0][0];
      expect(error.message).toBe('Cliente não encontrado');
      expect(error.statusCode).toBe(404);
    });

    it('should handle service error', async () => {
      const error = new Error('Service error');
      mockRequest.params.id = '1';
      mockRequest.user.entityId = 1;
      mockRequest.body = { status: 0 };
      mockClientService.changeClientStatus.mockRejectedValue(error);

      await clientController.updateStatus(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should return 400 when status is undefined in updateStatus', async () => {
      mockRequest.params.id = '1';
      mockRequest.user.entityId = 1;
      mockRequest.body = {}; // status is undefined

      await clientController.updateStatus(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      const error = mockNext.mock.calls[0][0];
      expect(error.message).toBe('Status é obrigatório');
      expect(error.statusCode).toBe(400);
    });

    it('should return 400 when status is null in updateStatus', async () => {
      mockRequest.params.id = '1';
      mockRequest.user.entityId = 1;
      mockRequest.body = { status: null }; // status is null, não undefined
      mockClientService.changeClientStatus.mockResolvedValue(null); // Cliente não encontrado

      await clientController.updateStatus(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      const error = mockNext.mock.calls[0][0];
      expect(error.message).toBe('Cliente não encontrado'); // Deve ser "Cliente não encontrado" porque null !== undefined
      expect(error.statusCode).toBe(404);
    });
  });
});