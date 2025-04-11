const request = require('supertest');
const express = require('express');
const BagController = require('../../../src/application/interfaces/controllers/BagController');
const BagService = require('../../../src/application/services/BagService');
const { setupRoutes } = require('../../../src/application/interfaces/routes');

// Mock do controlador
jest.mock('../../../src/application/interfaces/controllers/BagController');

// Mock dos middlewares
jest.mock('../../../src/application/interfaces/middleware/bagValidation', () => ({
  validateBagInput: jest.fn((req, res, next) => next()),
  validateStatusUpdate: jest.fn((req, res, next) => next()),
  validateCreateBag: jest.fn((req, res, next) => next()),
  validateUpdateBag: jest.fn((req, res, next) => next()),
  validateBagId: jest.fn((req, res, next) => next()),
  validateCompanyId: jest.fn((req, res, next) => next())
}));

describe('Bag Routes', () => {
  let app;
  
  beforeEach(() => {
    // Limpar todos os mocks
    jest.clearAllMocks();
    
    // Mock das implementações dos métodos do controlador
    BagController.prototype.createBag = jest.fn((req, res) => {
      return res.status(201).json({ id: 1, type: 'Doce', price: 10.99 });
    });
    
    BagController.prototype.getBag = jest.fn((req, res) => {
      return res.json({ id: req.params.id, type: 'Doce', price: 10.99 });
    });
    
    BagController.prototype.getAllBags = jest.fn((req, res) => {
      return res.json([{ id: 1, type: 'Doce' }, { id: 2, type: 'Salgada' }]);
    });
    
    BagController.prototype.updateBag = jest.fn((req, res) => {
      return res.json({ id: req.params.id, ...req.body });
    });
    
    BagController.prototype.deleteBag = jest.fn((req, res) => {
      return res.status(204).send();
    });
    
    BagController.prototype.getBagsByCompany = jest.fn((req, res) => {
      return res.json([{ id: 1, companyId: req.params.companyId }]);
    });
    
    BagController.prototype.getActiveBagsByCompany = jest.fn((req, res) => {
      return res.json([{ id: 1, companyId: req.params.companyId, status: 1 }]);
    });
    
    BagController.prototype.changeBagStatus = jest.fn((req, res) => {
      return res.json({ id: req.params.id, status: req.body.status });
    });
    
    // Criar uma aplicação Express para testes
    app = express();
    app.use(express.json());
    setupRoutes(app);
  });
  
  describe('GET /api/bags', () => {
    test('deve retornar status 200 e listar todas as sacolas', async () => {
      const response = await request(app).get('/api/bags');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(BagController.prototype.getAllBags).toHaveBeenCalled();
    });
  });
  
  describe('GET /api/bags/:id', () => {
    test('deve retornar status 200 e detalhes da sacola', async () => {
      const response = await request(app).get('/api/bags/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', '1');
      expect(BagController.prototype.getBag).toHaveBeenCalled();
    });
  });
  
  describe('POST /api/bags', () => {
    test('deve retornar status 201 e criar uma nova sacola', async () => {
      const bagData = {
        type: 'Doce',
        price: 10.99,
        description: 'Sacola com doces',
        companyId: 1
      };
      
      const response = await request(app)
        .post('/api/bags')
        .send(bagData);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(BagController.prototype.createBag).toHaveBeenCalled();
    });
  });
  
  describe('PUT /api/bags/:id', () => {
    test('deve retornar status 200 e atualizar uma sacola existente', async () => {
      const updateData = {
        price: 15.99,
        description: 'Sacola atualizada'
      };
      
      const response = await request(app)
        .put('/api/bags/1')
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', '1');
      expect(response.body).toHaveProperty('price', 15.99);
      expect(BagController.prototype.updateBag).toHaveBeenCalled();
    });
  });
  
  describe('DELETE /api/bags/:id', () => {
    test('deve retornar status 204 ao deletar uma sacola', async () => {
      const response = await request(app).delete('/api/bags/1');
      
      expect(response.status).toBe(204);
      expect(BagController.prototype.deleteBag).toHaveBeenCalled();
    });
  });
  
  describe('GET /api/company/:companyId/bags', () => {
    test('deve retornar status 200 e listar sacolas da empresa', async () => {
      const response = await request(app).get('/api/company/1/bags');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(BagController.prototype.getBagsByCompany).toHaveBeenCalled();
    });
  });
  
  describe('GET /api/company/:companyId/bags/active', () => {
    test('deve retornar status 200 e listar sacolas ativas da empresa', async () => {
      const response = await request(app).get('/api/company/1/bags/active');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(BagController.prototype.getActiveBagsByCompany).toHaveBeenCalled();
    });
  });
  
  describe('PATCH /api/bags/:id/status', () => {
    test('deve retornar status 200 e atualizar o status da sacola', async () => {
      const statusData = { status: 0 };
      
      const response = await request(app)
        .patch('/api/bags/1/status')
        .send(statusData);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', '1');
      expect(response.body).toHaveProperty('status', 0);
      expect(BagController.prototype.changeBagStatus).toHaveBeenCalled();
    });
  });
});