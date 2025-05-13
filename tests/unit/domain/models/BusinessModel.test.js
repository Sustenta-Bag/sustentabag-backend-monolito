// filepath: d:\Faculdade\Integrador\sustentabag-backend-monolito\tests\unit\domain\models\BusinessModel.test.js
import { Sequelize, DataTypes } from 'sequelize';
import BusinessModel from '../../../../src/domain/models/BusinessModel.js';
import { jest } from '@jest/globals';

describe('BusinessModel Unit Tests', () => {
  let sequelize;

  beforeEach(() => {
    // Configurar uma instância de Sequelize com SQLite em memória para testes
    sequelize = new Sequelize('sqlite::memory:', {
      logging: false
    });
  });

  afterEach(async () => {
    await sequelize.close();
  });

  describe('Model initialization', () => {
    test('should throw error when sequelize instance is not provided', () => {
      expect(() => {
        BusinessModel.init();
      }).toThrow('É necessário fornecer uma instância do Sequelize para inicializar o modelo BusinessModel');
    });

    test('should initialize model with correct attributes', async () => {
      // Inicializar o modelo
      const model = BusinessModel.init(sequelize);
      
      // Verificar se o modelo foi inicializado corretamente
      expect(model).toBe(BusinessModel);
      
      // Verificar se os atributos foram definidos corretamente
      const attributes = BusinessModel.rawAttributes;
      
      expect(attributes.idBusiness).toBeDefined();
      expect(attributes.legalName).toBeDefined();
      expect(attributes.cnpj).toBeDefined();
      expect(attributes.appName).toBeDefined();
      expect(attributes.cellphone).toBeDefined();
      expect(attributes.description).toBeDefined();
      expect(attributes.logo).toBeDefined();
      expect(attributes.delivery).toBeDefined();
      expect(attributes.deliveryTax).toBeDefined();
      expect(attributes.idAddress).toBeDefined();
      expect(attributes.status).toBeDefined();
      expect(attributes.firebaseId).toBeDefined();
      expect(attributes.createdAt).toBeDefined();
      expect(attributes.updatedAt).toBeDefined();
      
      // Verificar configurações específicas
      expect(attributes.idBusiness.primaryKey).toBe(true);
      expect(attributes.idBusiness.field).toBe('idEmpresa');
      expect(attributes.legalName.field).toBe('razaoSocial');
      expect(attributes.cnpj.field).toBe('cnpj');
      expect(attributes.appName.field).toBe('nomeApp');
      expect(attributes.status.defaultValue).toBe(true);
    });
  });

  describe('Validation', () => {
    // Instead of using actual DB operations, we'll mock the validation behavior
    test('should validate cnpj format', () => {
      // Get the validation rules directly
      const cnpjValidation = BusinessModel.rawAttributes.cnpj.validate;
      
      // Should pass with valid CNPJ
      expect(() => {
        if (cnpjValidation && cnpjValidation.is) {
          const regex = new RegExp(cnpjValidation.is);
          if (!regex.test('12345678901234')) {
            throw new Error('Validation failed');
          }
        }
      }).not.toThrow();
      
      // Should fail with invalid CNPJ (too short)
      expect(() => {
        if (cnpjValidation && cnpjValidation.is) {
          const regex = new RegExp(cnpjValidation.is);
          if (!regex.test('1234567890123')) {
            throw new Error('Validation failed');
          }
        }
      }).toThrow();
      
      // Should fail with invalid CNPJ (non-numeric)
      expect(() => {
        if (cnpjValidation && cnpjValidation.is) {
          const regex = new RegExp(cnpjValidation.is);
          if (!regex.test('1234567890123A')) {
            throw new Error('Validation failed');
          }
        }
      }).toThrow();
    });
    
    test('should validate cellphone format', () => {
      // Get the validation rules directly
      const cellphoneValidation = BusinessModel.rawAttributes.cellphone.validate;
      
      // Should pass with valid cellphone
      expect(() => {
        if (cellphoneValidation && cellphoneValidation.is) {
          const regex = new RegExp(cellphoneValidation.is);
          if (!regex.test('11987654321')) {
            throw new Error('Validation failed');
          }
        }
      }).not.toThrow();
      
      // Should fail with invalid cellphone (too short)
      expect(() => {
        if (cellphoneValidation && cellphoneValidation.is) {
          const regex = new RegExp(cellphoneValidation.is);
          if (!regex.test('1198765432')) {
            throw new Error('Validation failed');
          }
        }
      }).toThrow();
      
      // Should fail with invalid cellphone (non-numeric)
      expect(() => {
        if (cellphoneValidation && cellphoneValidation.is) {
          const regex = new RegExp(cellphoneValidation.is);
          if (!regex.test('1198765432A')) {
            throw new Error('Validation failed');
          }
        }
      }).toThrow();
    });
    
    test('should set default values correctly', () => {
      // Check default values directly from model definition
      expect(BusinessModel.rawAttributes.status.defaultValue).toBe(true);
      expect(BusinessModel.rawAttributes.delivery.defaultValue).toBe(false);
      expect(BusinessModel.rawAttributes.createdAt.defaultValue).toBeDefined();
      expect(BusinessModel.rawAttributes.updatedAt.defaultValue).toBeDefined();
    });
  });

  describe('Associations', () => {
    test('should associate with address model correctly', () => {
      // Mock the belongsTo method
      const belongsToMock = jest.fn();
      const originalBelongsTo = BusinessModel.belongsTo;
      BusinessModel.belongsTo = belongsToMock;
      
      try {
        // Mock models object with AddressModel
        const models = {
          AddressModel: {}
        };
        
        // Call the associate method
        BusinessModel.associate(models);
        
        // Verify belongsTo was called with correct parameters
        expect(belongsToMock).toHaveBeenCalledWith(models.AddressModel, {
          foreignKey: 'idAddress',
          as: 'address'
        });
      } finally {
        // Restore original method
        BusinessModel.belongsTo = originalBelongsTo;
      }
    });
    
    test('should not associate when AddressModel is missing', () => {
      // Mock the belongsTo method
      const belongsToMock = jest.fn();
      const originalBelongsTo = BusinessModel.belongsTo;
      BusinessModel.belongsTo = belongsToMock;
      
      try {
        // Mock models object without AddressModel
        const models = {
          OtherModel: {}
        };
        
        // Call the associate method
        BusinessModel.associate(models);
        
        // Verify belongsTo was not called
        expect(belongsToMock).not.toHaveBeenCalled();
      } finally {
        // Restore original method
        BusinessModel.belongsTo = originalBelongsTo;
      }
    });
  });
});