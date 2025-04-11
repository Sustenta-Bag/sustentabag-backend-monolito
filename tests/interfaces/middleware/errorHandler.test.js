const { handleValidationErrors, errorHandler } = require('../../../src/application/interfaces/middleware/errorHandler');
const AppError = require('../../../src/infrastructure/errors/AppError');
const { validationResult } = require('express-validator');

// Mock do express-validator
jest.mock('express-validator', () => ({
  validationResult: jest.fn()
}));

describe('Error Handler Middleware', () => {
  let req, res, next;
  
  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });
  
  describe('handleValidationErrors', () => {
    test('deve chamar next() quando não há erros de validação', () => {
      // Simula validationResult sem erros
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(true),
        array: jest.fn().mockReturnValue([])
      });
      
      handleValidationErrors(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
    
    test('deve retornar status 400 e erros formatados quando houver erros de validação', () => {
      // Simula erros de validação
      const mockValidationErrors = [
        { param: 'type', msg: 'Tipo inválido' },
        { param: 'price', msg: 'Preço deve ser positivo' }
      ];
      
      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue(mockValidationErrors)
      });
      
      handleValidationErrors(req, res, next);
      
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          errorCode: 'VALIDATION_ERROR',
          errors: expect.arrayContaining([
            { field: 'type', message: 'Tipo inválido' },
            { field: 'price', message: 'Preço deve ser positivo' }
          ])
        })
      );
    });
  });
  
  describe('errorHandler', () => {
    test('deve tratar AppError corretamente', () => {
      const appError = new AppError('Erro de teste', 'TEST_ERROR', 422);
      
      errorHandler(appError, req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 422,
          errorCode: 'TEST_ERROR',
          message: 'Erro de teste'
        })
      );
    });
    
    test('deve tratar erro de "Sacola não encontrada" especificamente', () => {
      const error = new Error('Sacola não encontrada');
      req.params = { id: '999' };
      
      errorHandler(error, req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
          errorCode: 'SACOLA_NOT_FOUND'
        })
      );
    });
    
    test('deve tratar erros genéricos como erros internos do servidor', () => {
      const error = new Error('Erro desconhecido');
      
      errorHandler(error, req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 500,
          errorCode: 'INTERNAL_SERVER_ERROR',
          message: 'Ocorreu um erro interno no servidor'
        })
      );
    });
    
    test('deve incluir detalhes do erro em ambiente não-produção', () => {
      // Salvar o NODE_ENV original
      const originalNodeEnv = process.env.NODE_ENV;
      // Definir ambiente para desenvolvimento
      process.env.NODE_ENV = 'development';
      
      const error = new Error('Detalhes do erro');
      error.stack = 'Stack trace simulada';
      
      errorHandler(error, req, res, next);
      
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            originalMessage: 'Detalhes do erro'
          })
        })
      );
      
      // Restaurar NODE_ENV original
      process.env.NODE_ENV = originalNodeEnv;
    });
  });
});