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
      authenticateClient: jest.fn()
    };
    
    clientController = new ClientController(mockClientService);
    
    mockRequest = {
      params: {},
      body: {}
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    
    mockNext = jest.fn();
  });
  
  describe('createClient', () => {
    // test('should create client and return 201 status code', async () => {
    //   const clientData = {
    //     name: 'João Silva',
    //     email: 'joao.silva@email.com',
    //     cpf: '12345678901',
    //     password: 'senha123',
    //     phone: '11987654321'
    //   };
      
    //   const createdClient = new Client(
    //     1, 
    //     'João Silva', 
    //     'joao.silva@email.com', 
    //     '12345678901', 
    //     'hashed_password', 
    //     '11987654321', 
    //     1, 
    //     new Date()
    //   );
      
    //   mockRequest.body = clientData;
    //   mockClientService.createClient.mockResolvedValue(createdClient);
      
    //   await clientController.createClient(mockRequest, mockResponse, mockNext);
      
    //   expect(mockClientService.createClient).toHaveBeenCalledWith(clientData);
    //   expect(mockResponse.status).toHaveBeenCalledWith(201);
    //   expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
    //     id: 1,
    //     name: 'João Silva',
    //     email: 'joao.silva@email.com',
    //     cpf: '12345678901',
    //     phone: '11987654321',
    //     status: 1
    //   }));
    //   expect(mockResponse.json.mock.calls[0][0]).not.toHaveProperty('password');
    // });
    
    test('should call next with error when service throws', async () => {
      const error = new AppError('Erro ao criar cliente', 'CREATE_ERROR');
      
      mockClientService.createClient.mockRejectedValue(error);
      
      await clientController.createClient(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
  
  describe('getClient', () => {
    // test('should return client by id', async () => {
    //   const client = new Client(
    //     1, 
    //     'João Silva', 
    //     'joao.silva@email.com', 
    //     '12345678901', 
    //     'hashed_password', 
    //     '11987654321', 
    //     1, 
    //     new Date()
    //   );
      
    //   mockRequest.params = { id: '1' };
    //   mockClientService.getClient.mockResolvedValue(client);
      
    //   await clientController.getClient(mockRequest, mockResponse, mockNext);
      
    //   expect(mockClientService.getClient).toHaveBeenCalledWith('1');
    //   expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
    //     id: 1,
    //     name: 'João Silva',
    //     email: 'joao.silva@email.com',
    //     cpf: '12345678901',
    //     phone: '11987654321',
    //     status: 1
    //   }));
    //   expect(mockResponse.json.mock.calls[0][0]).not.toHaveProperty('password');
    // });
    
    test('should call next with error when service throws', async () => {
      const error = new AppError('Cliente não encontrado', 'NOT_FOUND', 404);
      
      mockRequest.params = { id: '999' };
      mockClientService.getClient.mockRejectedValue(error);
      
      await clientController.getClient(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
  
  describe('getAllClients', () => {
    test('should return all clients', async () => {
      const clients = [
        new Client(1, 'João Silva', 'joao@email.com', '12345678901', 'hash1', '11987654321'),
        new Client(2, 'Maria Santos', 'maria@email.com', '98765432101', 'hash2', '11999998888')
      ];
      
      mockClientService.getAllClients.mockResolvedValue(clients);
      
      await clientController.getAllClients(mockRequest, mockResponse, mockNext);
      
      expect(mockClientService.getAllClients).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            name: 'João Silva',
            email: 'joao@email.com',
            cpf: '12345678901'
          }),
          expect.objectContaining({
            id: 2,
            name: 'Maria Santos',
            email: 'maria@email.com',
            cpf: '98765432101'
          })
        ])
      );
      
      // Verifica que nenhum dos objetos retornados tem a propriedade password
      const returnedClients = mockResponse.json.mock.calls[0][0];
      expect(returnedClients[0]).not.toHaveProperty('password');
      expect(returnedClients[1]).not.toHaveProperty('password');
    });
    
    test('should call next with error when service throws', async () => {
      const error = new Error('Erro interno');
      
      mockClientService.getAllClients.mockRejectedValue(error);
      
      await clientController.getAllClients(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
  
  describe('updateClient', () => {
    // test('should update client and return updated data', async () => {
    //   const updateData = {
    //     name: 'João Santos Silva',
    //     phone: '11999998888'
    //   };
      
    //   const updatedClient = new Client(
    //     1, 
    //     'João Santos Silva', 
    //     'joao@email.com', 
    //     '12345678901', 
    //     'hashed_password', 
    //     '11999998888', 
    //     1, 
    //     new Date()
    //   );
      
    //   mockRequest.params = { id: '1' };
    //   mockRequest.body = updateData;
    //   mockClientService.updateClient.mockResolvedValue(updatedClient);
      
    //   await clientController.updateClient(mockRequest, mockResponse, mockNext);
      
    //   expect(mockClientService.updateClient).toHaveBeenCalledWith('1', updateData);
    //   expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
    //     id: 1,
    //     name: 'João Santos Silva',
    //     phone: '11999998888'
    //   }));
    //   expect(mockResponse.json.mock.calls[0][0]).not.toHaveProperty('password');
    // });
    
    test('should call next with error when service throws', async () => {
      const error = new AppError('Cliente não encontrado', 'NOT_FOUND', 404);
      
      mockRequest.params = { id: '999' };
      mockRequest.body = { name: 'Nome Novo' };
      mockClientService.updateClient.mockRejectedValue(error);
      
      await clientController.updateClient(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
  
  describe('deleteClient', () => {
    test('should delete client and return 204 status code', async () => {
      mockRequest.params = { id: '1' };
      mockClientService.deleteClient.mockResolvedValue(true);
      
      await clientController.deleteClient(mockRequest, mockResponse, mockNext);
      
      expect(mockClientService.deleteClient).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });
    
    test('should call next with error when service throws', async () => {
      const error = new AppError('Cliente não encontrado', 'NOT_FOUND', 404);
      
      mockRequest.params = { id: '999' };
      mockClientService.deleteClient.mockRejectedValue(error);
      
      await clientController.deleteClient(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
  
  describe('getActiveClients', () => {
    // test('should return active clients', async () => {
    //   const activeClients = [
    //     new Client(1, 'João Silva', 'joao@email.com', '12345678901', 'hash1', '11987654321', 1),
    //     new Client(2, 'Maria Santos', 'maria@email.com', '98765432101', 'hash2', '11999998888', 1)
    //   ];
      
    //   mockClientService.getActiveClients.mockResolvedValue(activeClients);
      
    //   await clientController.getActiveClients(mockRequest, mockResponse, mockNext);
      
    //   expect(mockClientService.getActiveClients).toHaveBeenCalled();
    //   expect(mockResponse.json).toHaveBeenCalledWith(
    //     expect.arrayContaining([
    //       expect.objectContaining({
    //         id: 1,
    //         status: 1
    //       }),
    //       expect.objectContaining({
    //         id: 2,
    //         status: 1
    //       })
    //     ])
    //   );
      
    //   const returnedClients = mockResponse.json.mock.calls[0][0];
    //   expect(returnedClients[0]).not.toHaveProperty('password');
    //   expect(returnedClients[1]).not.toHaveProperty('password');
    // });
    
    test('should call next with error when service throws', async () => {
      const error = new Error('Erro interno');
      
      mockClientService.getActiveClients.mockRejectedValue(error);
      
      await clientController.getActiveClients(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
  
  describe('changeClientStatus', () => {
    // test('should change client status and return updated client', async () => {
    //   const updatedClient = new Client(
    //     1, 
    //     'João Silva', 
    //     'joao@email.com', 
    //     '12345678901', 
    //     'hashed_password', 
    //     '11987654321', 
    //     0, 
    //     new Date()
    //   );
      
    //   mockRequest.params = { id: '1' };
    //   mockRequest.body = { status: 0 };
    //   mockClientService.changeClientStatus.mockResolvedValue(updatedClient);
      
    //   await clientController.changeClientStatus(mockRequest, mockResponse, mockNext);
      
    //   expect(mockClientService.changeClientStatus).toHaveBeenCalledWith('1', 0);
    //   expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
    //     id: 1,
    //     status: 0
    //   }));
    //   expect(mockResponse.json.mock.calls[0][0]).not.toHaveProperty('password');
    // });
    
    test('should throw error when status is not provided', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = {}; // Sem status
      
      await clientController.changeClientStatus(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockClientService.changeClientStatus).not.toHaveBeenCalled();
    });
    
    test('should call next with error when service throws', async () => {
      const error = new AppError('Cliente não encontrado', 'NOT_FOUND', 404);
      
      mockRequest.params = { id: '999' };
      mockRequest.body = { status: 1 };
      mockClientService.changeClientStatus.mockRejectedValue(error);
      
      await clientController.changeClientStatus(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
  
  describe('login', () => {
    // test('should authenticate client and return token', async () => {
    //     const client = new Client(
    //       1, 
    //       'João Silva', 
    //       'joao@email.com', 
    //       '12345678901', 
    //       'hashed_password', 
    //       '11987654321', 
    //       1, 
    //       new Date()
    //     );
        
    //     mockRequest.body = {
    //       cpf: '12345678901',
    //       password: 'senha123'
    //     };
        
    //     mockClientService.authenticateClient.mockResolvedValue(client);
        
    //     await clientController.login(mockRequest, mockResponse, mockNext);
        
    //     expect(mockClientService.authenticateClient).toHaveBeenCalledWith('12345678901', 'senha123');
        
    //     // Verifica que foi chamado com um objeto que tem client e token
    //     expect(mockResponse.json).toHaveBeenCalled();
    //     const responseData = mockResponse.json.mock.calls[0][0];
        
    //     // Verificações mais flexíveis
    //     expect(responseData).toHaveProperty('client');
    //     expect(responseData).toHaveProperty('token');
    //     expect(responseData.client.id).toBe(1);
    //     expect(responseData.client.name).toBe('João Silva');
    //     expect(typeof responseData.token).toBe('string');
        
    //     // Verifica que o cliente retornado não contém a senha
    //     expect(responseData.client).not.toHaveProperty('password');
    //   });
    
    test('should throw error when cpf or password is missing', async () => {
      mockRequest.body = {
        cpf: '12345678901'
        // Senha ausente
      };
      
      await clientController.login(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockClientService.authenticateClient).not.toHaveBeenCalled();
      
      // Teste com CPF ausente
      mockNext.mockClear();
      mockRequest.body = {
        password: 'senha123'
        // CPF ausente
      };
      
      await clientController.login(mockRequest, mockResponse, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockClientService.authenticateClient).not.toHaveBeenCalled();
    });
    
    // test('should call next with error when service throws', async () => {
    //   const error = new AppError('Credenciais inválidas', 'INVALID_CREDENTIALS', 401);
      
    //   mockRequest.body = {
    //     cpf: '12345678901',
    //     password: 'senha_errada'
    //   };
      
    //   mockClientService.authenticateClient.mockRejectedValue(error);
      
    //   await clientController.login(mockRequest, mockResponse, mockNext);
      
    //   expect(mockNext).toHaveBeenCalledWith(error);
    // });
  });
});