const BagController = require('../../../src/application/interfaces/controllers/BagController');
const BagService = require('../../../src/application/services/BagService');
const AppError = require('../../../src/infrastructure/errors/AppError');
const Bag = require('../../../src/domain/entities/Bag');

// Mock do serviço
const mockBagService = {
  createBag: jest.fn(),
  getBag: jest.fn(),
  getAllBags: jest.fn(),
  updateBag: jest.fn(),
  deleteBag: jest.fn(),
  getBagsByCompanyId: jest.fn(),
  getActiveBagsByCompanyId: jest.fn(),
  changeBagStatus: jest.fn()
};

// Mock para objetos de requisição e resposta
const mockRequest = () => {
  const req = {};
  req.body = jest.fn().mockReturnValue(req);
  req.params = {};
  return req;
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

// Mock para a função next
const mockNext = jest.fn();

describe('BagController', () => {
  let bagController;
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();
    
    // Inicializar o controller com o serviço mockado
    bagController = new BagController(mockBagService);
    
    // Inicializar request, response e next para cada teste
    req = mockRequest();
    res = mockResponse();
    next = mockNext;
  });

  describe('createBag', () => {
    test('deve retornar status 201 e a sacola criada quando bem-sucedido', async () => {
      const mockBag = new Bag(1, 'Doce', 10.99, 'Descrição da sacola', 2, 1);
      const bagData = { 
        type: 'Doce', 
        price: 10.99, 
        description: 'Descrição da sacola', 
        companyId: 2 
      };
      
      req.body = bagData;
      mockBagService.createBag.mockResolvedValue(mockBag);

      await bagController.createBag(req, res);

      expect(mockBagService.createBag).toHaveBeenCalledWith(bagData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockBag);
    });

    test('deve retornar status 400 quando ocorrer um erro', async () => {
      const errorMessage = 'Erro ao criar sacola';
      req.body = {};
      mockBagService.createBag.mockRejectedValue(new Error(errorMessage));

      await bagController.createBag(req, res, next);

      expect(mockBagService.createBag).toHaveBeenCalledWith({});
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getBag', () => {
    test('deve retornar a sacola quando encontrada', async () => {
      const mockBag = new Bag(1, 'Doce', 10.99, 'Descrição da sacola', 2, 1);
      req.params.id = '1';
      mockBagService.getBag.mockResolvedValue(mockBag);

      await bagController.getBag(req, res);

      expect(mockBagService.getBag).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(mockBag);
    });

    test('deve retornar status 404 quando a sacola não for encontrada', async () => {
      const errorMessage = 'Sacola não encontrada';
      req.params.id = '999';
      mockBagService.getBag.mockRejectedValue(new Error(errorMessage));

      await bagController.getBag(req, res, next);

      expect(mockBagService.getBag).toHaveBeenCalledWith('999');
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getAllBags', () => {
    test('deve retornar todas as sacolas', async () => {
      const mockBags = [
        new Bag(1, 'Doce', 10.99, 'Descrição da sacola 1', 2, 1),
        new Bag(2, 'Salgada', 15.99, 'Descrição da sacola 2', 2, 1)
      ];
      mockBagService.getAllBags.mockResolvedValue(mockBags);

      await bagController.getAllBags(req, res, next);

      expect(mockBagService.getAllBags).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockBags);
    });

    test('deve retornar status 500 quando ocorrer um erro', async () => {
      const errorMessage = 'Erro interno do servidor';
      mockBagService.getAllBags.mockRejectedValue(new Error(errorMessage));

      await bagController.getAllBags(req, res, next);

      expect(mockBagService.getAllBags).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('updateBag', () => {
    test('deve atualizar e retornar a sacola quando encontrada', async () => {
      const mockBag = new Bag(1, 'Doce', 15.99, 'Nova descrição', 2, 1);
      const bagData = { price: 15.99, description: 'Nova descrição' };
      req.params.id = '1';
      req.body = bagData;
      mockBagService.updateBag.mockResolvedValue(mockBag);

      await bagController.updateBag(req, res, next);

      expect(mockBagService.updateBag).toHaveBeenCalledWith('1', bagData);
      expect(res.json).toHaveBeenCalledWith(mockBag);
    });

    test('deve retornar status 404 quando a sacola não for encontrada', async () => {
      const errorMessage = 'Sacola não encontrada';
      req.params.id = '999';
      req.body = { price: 15.99 };
      mockBagService.updateBag.mockRejectedValue(new Error(errorMessage));

      await bagController.updateBag(req, res, next);

      expect(mockBagService.updateBag).toHaveBeenCalledWith('999', { price: 15.99 });
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('deleteBag', () => {
    test('deve retornar status 204 quando deletar com sucesso', async () => {
      req.params.id = '1';
      mockBagService.deleteBag.mockResolvedValue(true);

      await bagController.deleteBag(req, res, next);

      expect(mockBagService.deleteBag).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    test('deve retornar status 404 quando a sacola não for encontrada', async () => {
      const errorMessage = 'Sacola não encontrada';
      req.params.id = '999';
      mockBagService.deleteBag.mockRejectedValue(new Error(errorMessage));

      await bagController.deleteBag(req, res, next);

      expect(mockBagService.deleteBag).toHaveBeenCalledWith('999');
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getBagsByCompany', () => {
    test('deve retornar sacolas de uma empresa específica', async () => {
      const mockBags = [
        new Bag(1, 'Doce', 10.99, 'Descrição da sacola 1', 2, 1),
        new Bag(2, 'Salgada', 15.99, 'Descrição da sacola 2', 2, 1)
      ];
      req.params.companyId = '2';
      mockBagService.getBagsByCompanyId.mockResolvedValue(mockBags);

      await bagController.getBagsByCompany(req, res, next);

      expect(mockBagService.getBagsByCompanyId).toHaveBeenCalledWith('2');
      expect(res.json).toHaveBeenCalledWith(mockBags);
    });

    test('deve retornar status 500 quando ocorrer um erro', async () => {
      const errorMessage = 'Erro interno do servidor';
      req.params.companyId = '2';
      mockBagService.getBagsByCompanyId.mockRejectedValue(new Error(errorMessage));

      await bagController.getBagsByCompany(req, res, next);

      expect(mockBagService.getBagsByCompanyId).toHaveBeenCalledWith('2');
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getActiveBagsByCompany', () => {
    test('deve retornar sacolas ativas de uma empresa específica', async () => {
      const mockBags = [
        new Bag(1, 'Doce', 10.99, 'Descrição da sacola 1', 2, 1)
      ];
      req.params.companyId = '2';
      mockBagService.getActiveBagsByCompanyId.mockResolvedValue(mockBags);

      await bagController.getActiveBagsByCompany(req, res, next);

      expect(mockBagService.getActiveBagsByCompanyId).toHaveBeenCalledWith('2');
      expect(res.json).toHaveBeenCalledWith(mockBags);
    });

    test('deve retornar status 500 quando ocorrer um erro', async () => {
      const errorMessage = 'Erro interno do servidor';
      req.params.companyId = '2';
      mockBagService.getActiveBagsByCompanyId.mockRejectedValue(new Error(errorMessage));

      await bagController.getActiveBagsByCompany(req, res, next);

      expect(mockBagService.getActiveBagsByCompanyId).toHaveBeenCalledWith('2');
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('changeBagStatus', () => {
    test('deve alterar o status de uma sacola e retorná-la', async () => {
      const mockBag = new Bag(1, 'Doce', 10.99, 'Descrição da sacola', 2, 0);
      req.params.id = '1';
      req.body = { status: 0 };
      mockBagService.changeBagStatus.mockResolvedValue(mockBag);

      await bagController.changeBagStatus(req, res, next);

      expect(mockBagService.changeBagStatus).toHaveBeenCalledWith('1', 0);
      expect(res.json).toHaveBeenCalledWith(mockBag);
    });

    test('deve retornar status 400 quando o status não for fornecido', async () => {
      req.params.id = '1';
      req.body = {}; // status não fornecido

      await bagController.changeBagStatus(req, res, next);

      expect(mockBagService.changeBagStatus).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    test('deve retornar status 404 quando a sacola não for encontrada', async () => {
      const errorMessage = 'Sacola não encontrada';
      req.params.id = '999';
      req.body = { status: 1 };
      mockBagService.changeBagStatus.mockRejectedValue(new Error(errorMessage));

      await bagController.changeBagStatus(req, res, next);

      expect(mockBagService.changeBagStatus).toHaveBeenCalledWith('999', 1);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});