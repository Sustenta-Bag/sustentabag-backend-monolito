// filepath: d:\Faculdade\Integrador\sustentabag-backend-monolito\tests\unit\infrastructure\errors\AppError.test.js
import AppError from '../../../../src/infrastructure/errors/AppError.js';
import { jest } from '@jest/globals';

describe('AppError', () => {
  describe('constructor', () => {
    test('should initialize with provided values', () => {
      const message = 'Test error message';
      const errorCode = 'TEST_ERROR';
      const statusCode = 404;
      const details = { field: 'test' };
      
      const error = new AppError(message, errorCode, statusCode, details);
      
      expect(error.message).toBe(message);
      expect(error.errorCode).toBe(errorCode);
      expect(error.statusCode).toBe(statusCode);
      expect(error.details).toBe(details);
      expect(error.timestamp).toBeDefined();
      expect(error.name).toBe('AppError');
    });
    
    test('should initialize with default values when not provided', () => {
      const message = 'Test error message';
      const errorCode = 'TEST_ERROR';
      
      const error = new AppError(message, errorCode);
      
      expect(error.message).toBe(message);
      expect(error.errorCode).toBe(errorCode);
      expect(error.statusCode).toBe(400); // Default status code
      expect(error.details).toBeNull(); // Default details
      expect(error.timestamp).toBeDefined();
    });
  });
  
  describe('toJSON', () => {
    test('should return JSON representation with all fields', () => {
      const message = 'Test error message';
      const errorCode = 'TEST_ERROR';
      const statusCode = 404;
      const details = { field: 'test' };
      
      const error = new AppError(message, errorCode, statusCode, details);
      const json = error.toJSON();
      
      expect(json).toEqual({
        statusCode: statusCode,
        errorCode: errorCode,
        message: message,
        details: details,
        timestamp: error.timestamp
      });
    });
    
    test('should return JSON representation without details when not provided', () => {
      const message = 'Test error message';
      const errorCode = 'TEST_ERROR';
      const statusCode = 404;
      
      const error = new AppError(message, errorCode, statusCode);
      const json = error.toJSON();
      
      expect(json).toEqual({
        statusCode: statusCode,
        errorCode: errorCode,
        message: message,
        timestamp: error.timestamp
      });
      
      // Verify details is not included
      expect(json.details).toBeUndefined();
    });
  });
  
  describe('static factory methods', () => {
    test('notFound should create appropriate error', () => {
      const entityName = 'User';
      const id = 123;
      
      const error = AppError.notFound(entityName, id);
      
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('User não encontrada com o ID: 123');
      expect(error.errorCode).toBe('USER_NOT_FOUND');
      expect(error.statusCode).toBe(404);
    });
    
    test('validationError should create error with formatted validation errors', () => {
      const validationErrors = [
        { param: 'email', msg: 'Invalid email' },
        { param: 'password', msg: 'Password too short' }
      ];
      
      const error = AppError.validationError(validationErrors);
      
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Erro de validação dos dados de entrada');
      expect(error.errorCode).toBe('VALIDATION_ERROR');
      expect(error.statusCode).toBe(400);
      expect(error.errors).toEqual([
        { field: 'email', message: 'Invalid email' },
        { field: 'password', message: 'Password too short' }
      ]);
    });
    
    test('internal should create internal server error', () => {
      const message = 'Database connection failed';
      
      const error = AppError.internal(message);
      
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe(message);
      expect(error.errorCode).toBe('INTERNAL_SERVER_ERROR');
      expect(error.statusCode).toBe(500);
    });
    
    test('internal should include original error details in non-production environment', () => {
      const message = 'Database connection failed';
      const originalError = new Error('Original error');
      originalError.stack = 'Stack trace';
      
      // Store original NODE_ENV
      const originalNodeEnv = process.env.NODE_ENV;
      // Set to development for test
      process.env.NODE_ENV = 'development';
      
      const error = AppError.internal(message, originalError);
      
      expect(error.details).toEqual({
        originalMessage: 'Original error',
        stack: 'Stack trace'
      });
      
      // Restore original NODE_ENV
      process.env.NODE_ENV = originalNodeEnv;
    });
    
    test('internal should not include original error details in production environment', () => {
      const message = 'Database connection failed';
      const originalError = new Error('Original error');
      
      // Store original NODE_ENV
      const originalNodeEnv = process.env.NODE_ENV;
      // Set to production for test
      process.env.NODE_ENV = 'production';
      
      const error = AppError.internal(message, originalError);
      
      expect(error.details).toBeNull();
      
      // Restore original NODE_ENV
      process.env.NODE_ENV = originalNodeEnv;
    });
    
    test('internal should use default message if none provided', () => {
      const error = AppError.internal();
      
      expect(error.message).toBe('Erro interno do servidor');
    });
  });
  
  describe('integration with Error class', () => {
    test('should properly extend Error class', () => {
      const error = new AppError('Test', 'CODE');
      
      expect(error).toBeInstanceOf(Error);
      expect(error.stack).toBeDefined();
    });
    
    test('should capture stack trace if available', () => {
      // Mock Error.captureStackTrace if needed
      const originalCaptureStackTrace = Error.captureStackTrace;
      Error.captureStackTrace = jest.fn();
      
      new AppError('Test', 'CODE');
      
      expect(Error.captureStackTrace).toHaveBeenCalled();
      
      // Restore original method
      Error.captureStackTrace = originalCaptureStackTrace;
    });
  });
});