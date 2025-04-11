const { validateCreateBag, validateStatusUpdate } = require('../../../src/application/interfaces/middleware/bagValidation');
const AppError = require('../../../src/infrastructure/errors/AppError');
const { handleValidationErrors } = require('../../../src/application/interfaces/middleware/errorHandler');

// Mock do middleware de tratamento de erros
jest.mock('../../../src/application/interfaces/middleware/errorHandler', () => ({
  handleValidationErrors: jest.fn()
}));

describe('Bag Validation Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateCreateBag', () => {
    test('deve ser um array com as validações corretas', () => {
      // Verificamos se é um array e se tem o formato correto
      expect(Array.isArray(validateCreateBag)).toBe(true);
      
      // Deve ter pelo menos 6 elementos (5 validações + handleValidationErrors)
      expect(validateCreateBag.length).toBeGreaterThanOrEqual(6);
      
      // O último item deve ser o handleValidationErrors
      expect(validateCreateBag[validateCreateBag.length - 1]).toBe(handleValidationErrors);
    });

    test('deve incluir o middleware handleValidationErrors', () => {
      expect(validateCreateBag).toContain(handleValidationErrors);
    });
  });
  
  describe('validateStatusUpdate', () => {
    test('deve ser um array com as validações corretas', () => {
      expect(Array.isArray(validateStatusUpdate)).toBe(true);
      
      // Deve ter pelo menos 2 elementos (1 validação + handleValidationErrors)
      expect(validateStatusUpdate.length).toBeGreaterThanOrEqual(2);
      
      // O último item deve ser o handleValidationErrors
      expect(validateStatusUpdate[validateStatusUpdate.length - 1]).toBe(handleValidationErrors);
    });

    test('deve incluir o middleware handleValidationErrors', () => {
      expect(validateStatusUpdate).toContain(handleValidationErrors);
    });
  });

  // Testes adicionais para validar a estrutura do arquivo
  describe('Estrutura do middleware de validação', () => {
    // Carregamos o conteúdo do arquivo para verificar se contém as regras esperadas
    const fs = require('fs');
    const path = require('path');
    const validationFilePath = path.join(__dirname, '../../../src/application/interfaces/middleware/bagValidation.js');
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