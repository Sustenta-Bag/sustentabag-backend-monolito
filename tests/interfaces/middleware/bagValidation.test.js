import { validateCreateBag, validateStatusUpdate } from '../../../src/presentation/middleware/bagValidation.js';
import AppError from '../../../src/infrastructure/errors/AppError.js';
import { handleValidationErrors } from '../../../src/presentation/middleware/errorHandler.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

jest.mock('../../../src/presentation/middleware/errorHandler.js', () => ({
  handleValidationErrors: jest.fn()
}));

describe('Bag Validation Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateCreateBag', () => {
    test('deve ser um array com as validações corretas', () => {
      expect(Array.isArray(validateCreateBag)).toBe(true);
      
      expect(validateCreateBag.length).toBeGreaterThanOrEqual(6);
      
      expect(validateCreateBag[validateCreateBag.length - 1]).toBe(handleValidationErrors);
    });

    test('deve incluir o middleware handleValidationErrors', () => {
      expect(validateCreateBag).toContain(handleValidationErrors);
    });
  });
  
  describe('validateStatusUpdate', () => {
    test('deve ser um array com as validações corretas', () => {
      expect(Array.isArray(validateStatusUpdate)).toBe(true);
      
      expect(validateStatusUpdate.length).toBeGreaterThanOrEqual(2);
      
      expect(validateStatusUpdate[validateStatusUpdate.length - 1]).toBe(handleValidationErrors);
    });

    test('deve incluir o middleware handleValidationErrors', () => {
      expect(validateStatusUpdate).toContain(handleValidationErrors);
    });
  });

  describe('Estrutura do middleware de validação', () => {
    const validationFilePath = path.join(__dirname, '../../../src/presentation/middleware/bagValidation.js');
    const validationFileContent = fs.readFileSync(validationFilePath, 'utf8');
    
    test('validateCreateBag deve conter regras para todos os campos da sacola', () => {
      const validationFields = ['type', 'price', 'description', 'companyId', 'status'];
      
      validationFields.forEach(field => {
        expect(validationFileContent).toContain(`body('${field}')`);
      });
    });
    
    test('validateStatusUpdate deve conter regras para o campo status', () => {
      expect(validationFileContent).toContain(`body('status')`);
      expect(validationFileContent).toContain(`exists()`);
    });
  });
});