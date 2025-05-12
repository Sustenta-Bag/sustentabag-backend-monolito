// filepath: d:\Faculdade\Integrador\sustentabag-backend-monolito\tests\unit\infrastructure\errors\AppError.test.js
import AppError from '../../../../src/infrastructure/errors/AppError.js';

describe('AppError Unit Tests', () => {
  describe('Constructor', () => {
    test('should initialize with provided values', () => {
      const message = 'Erro de teste';
      const errorCode = 'TEST_ERROR';
      const statusCode = 400;
      const details = { field: 'name', issue: 'required' };
      
      const error = new AppError(message, errorCode, statusCode, details);
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe(message);
      expect(error.errorCode).toBe(errorCode);
      expect(error.statusCode).toBe(statusCode);
      expect(error.details).toBe(details);
      expect(error.timestamp).toBeDefined();
      expect(error.stack).toBeDefined();
    });
    
    test('should initialize with default values when not provided', () => {
      const message = 'Erro de teste';
      const errorCode = 'TEST_ERROR';
      
      const error = new AppError(message, errorCode);
      
      expect(error.statusCode).toBe(400); // Valor padrão
      expect(error.details).toBeNull(); // Valor padrão
    });
  });

  describe('toJSON method', () => {
    test('should return JSON with all error properties', () => {
      const message = 'Erro de teste';
      const errorCode = 'TEST_ERROR';
      const statusCode = 400;
      const details = { field: 'name', issue: 'required' };
      
      const error = new AppError(message, errorCode, statusCode, details);
      const jsonOutput = error.toJSON();
      
      expect(jsonOutput).toEqual({
        statusCode,
        errorCode,
        message,
        timestamp: error.timestamp,
        details
      });
    });
    
    test('should return JSON without details when details is null', () => {
      const message = 'Erro de teste';
      const errorCode = 'TEST_ERROR';
      const statusCode = 400;
      
      const error = new AppError(message, errorCode, statusCode);
      const jsonOutput = error.toJSON();
      
      expect(jsonOutput).toEqual({
        statusCode,
        errorCode,
        message,
        timestamp: error.timestamp
      });
      expect(jsonOutput.details).toBeUndefined();
    });
  });

  describe('Static Methods', () => {
    describe('notFound', () => {
      test('should create error with correct properties', () => {
        const entityName = 'User';
        const id = 123;
        
        const error = AppError.notFound(entityName, id);
        
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe('User não encontrada com o ID: 123');
        expect(error.errorCode).toBe('USER_NOT_FOUND');
        expect(error.statusCode).toBe(404);
      });
    });
    
    describe('validationError', () => {
      test('should create error with formatted validation errors', () => {
        const validationErrors = [
          { param: 'name', msg: 'Nome é obrigatório' },
          { param: 'email', msg: 'Email inválido' }
        ];
        
        const error = AppError.validationError(validationErrors);
        
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe('Erro de validação dos dados de entrada');
        expect(error.errorCode).toBe('VALIDATION_ERROR');
        expect(error.statusCode).toBe(400);
        expect(error.errors).toEqual([
          { field: 'name', message: 'Nome é obrigatório' },
          { field: 'email', message: 'Email inválido' }
        ]);
      });
    });
    
    describe('internal', () => {
      beforeEach(() => {
        process.env.NODE_ENV = 'development';
      });
      
      afterEach(() => {
        delete process.env.NODE_ENV;
      });
      
      test('should create error with provided message', () => {
        const message = 'Erro interno personalizado';
        
        const error = AppError.internal(message);
        
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe(message);
        expect(error.errorCode).toBe('INTERNAL_SERVER_ERROR');
        expect(error.statusCode).toBe(500);
      });
      
      test('should create error with default message when not provided', () => {
        const error = AppError.internal();
        
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe('Erro interno do servidor');
        expect(error.errorCode).toBe('INTERNAL_SERVER_ERROR');
        expect(error.statusCode).toBe(500);
      });
      
      test('should include original error details in development mode', () => {
        const originalError = new Error('Erro original');
        originalError.stack = 'Stack trace de teste';
        
        const error = AppError.internal('Erro interno personalizado', originalError);
        
        expect(error.details).toEqual({
          originalMessage: 'Erro original',
          stack: 'Stack trace de teste'
        });
      });
      
      test('should not include original error details in production mode', () => {
        process.env.NODE_ENV = 'production';
        const originalError = new Error('Erro original');
        
        const error = AppError.internal('Erro interno personalizado', originalError);
        
        expect(error.details).toBeNull();
      });
    });
  });
});