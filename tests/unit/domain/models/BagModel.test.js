import BagModel from '../../../../src/domain/models/BagModel.js';
import { Sequelize } from 'sequelize';
import { jest } from '@jest/globals';

describe('BagModel Unit Tests', () => {
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
    test('should initialize model with correct attributes', () => {
      // Inicializar o modelo
      const bagModel = BagModel.init(sequelize);
      
      // Verificar se o modelo foi inicializado corretamente
      expect(bagModel).toBe(BagModel);
      
      // Verificar se os atributos foram definidos corretamente
      const attributes = BagModel.rawAttributes;
      
      expect(attributes.id).toBeDefined();
      expect(attributes.type).toBeDefined();
      expect(attributes.price).toBeDefined();
      expect(attributes.description).toBeDefined();
      expect(attributes.status).toBeDefined();
      expect(attributes.createdAt).toBeDefined();
      
      // Verificar configurações específicas
      expect(attributes.id.primaryKey).toBe(true);
      expect(attributes.id.field).toBe('idSacola');
      expect(attributes.type.field).toBe('tipo');
      expect(attributes.price.field).toBe('preco');
      expect(attributes.status.defaultValue).toBe(1);
    });

    test('should throw error when sequelize instance is not provided', () => {
      expect(() => {
        BagModel.init();
      }).toThrow('É necessário fornecer uma instância do Sequelize para inicializar o modelo BagModel');
    });
  });

  describe('Validation', () => {
    test('should have correct validation for type', async () => {
      // Inicializar o modelo e criar businessId mock
      BagModel.init(sequelize);
      
      // Criar tabela de negócio mock para satisfazer a FK
      const BusinessModel = sequelize.define('Business', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          field: 'idEmpresa'
        },
        name: Sequelize.STRING
      }, {
        tableName: 'empresas'
      });
      
      // Definir associação
      BusinessModel.hasMany(BagModel, { foreignKey: 'idBusiness' });
      BagModel.belongsTo(BusinessModel, { foreignKey: 'idBusiness' });
      
      await sequelize.sync({ force: true });
      
      // Criar um business para associar às sacolas
      const business = await BusinessModel.create({ name: 'Negócio Teste' });
      
      // Testar validação do tipo com valor inválido
      await expect(BagModel.create({
        type: 'TipoInvalido',  // valor inválido
        price: 25.50,
        description: 'Sacola com produtos diversos',
        idBusiness: business.id
      })).rejects.toThrow();

      // Testar valores válidos
      const validBag1 = await BagModel.create({
        type: 'Doce',
        price: 25.50,
        description: 'Sacola com produtos diversos',
        idBusiness: business.id
      });
      
      expect(validBag1).toBeDefined();
      expect(validBag1.type).toBe('Doce');
      
      const validBag2 = await BagModel.create({
        type: 'Salgada',
        price: 30.00,
        description: 'Sacola com produtos salgados',
        idBusiness: business.id
      });
      
      expect(validBag2).toBeDefined();
      expect(validBag2.type).toBe('Salgada');
      
      const validBag3 = await BagModel.create({
        type: 'Mista',
        price: 35.50,
        description: 'Sacola com produtos mistos',
        idBusiness: business.id
      });
      
      expect(validBag3).toBeDefined();
      expect(validBag3.type).toBe('Mista');
    });

    test('should have correct validation for status', async () => {
      // Inicializar o modelo e criar businessId mock
      BagModel.init(sequelize);
      
      // Criar tabela de negócio mock para satisfazer a FK
      const BusinessModel = sequelize.define('Business', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          field: 'idEmpresa'
        },
        name: Sequelize.STRING
      }, {
        tableName: 'empresas'
      });
      
      // Definir associação
      BusinessModel.hasMany(BagModel, { foreignKey: 'idBusiness' });
      BagModel.belongsTo(BusinessModel, { foreignKey: 'idBusiness' });
      
      await sequelize.sync({ force: true });
      
      // Criar um business para associar às sacolas
      const business = await BusinessModel.create({ name: 'Negócio Teste' });
      
      // Testar validação do status com valor inválido
      await expect(BagModel.create({
        type: 'Doce',
        price: 25.50,
        description: 'Sacola com produtos diversos',
        status: 2,  // valor inválido
        idBusiness: business.id
      })).rejects.toThrow();

      // Testar valor válido (ativo)
      const activeBag = await BagModel.create({
        type: 'Doce',
        price: 25.50,
        description: 'Sacola com produtos diversos',
        status: 1,
        idBusiness: business.id
      });
      
      expect(activeBag).toBeDefined();
      expect(activeBag.status).toBe(1);

      // Testar valor válido (inativo)
      const inactiveBag = await BagModel.create({
        type: 'Doce',
        price: 25.50,
        description: 'Sacola com produtos diversos',
        status: 0,
        idBusiness: business.id
      });
      
      expect(inactiveBag).toBeDefined();
      expect(inactiveBag.status).toBe(0);
    });

    test('should set default values correctly', async () => {
      // Inicializar o modelo e criar businessId mock
      BagModel.init(sequelize);
      
      // Criar tabela de negócio mock para satisfazer a FK
      const BusinessModel = sequelize.define('Business', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          field: 'idEmpresa'
        },
        name: Sequelize.STRING
      }, {
        tableName: 'empresas'
      });
      
      // Definir associação
      BusinessModel.hasMany(BagModel, { foreignKey: 'idBusiness' });
      BagModel.belongsTo(BusinessModel, { foreignKey: 'idBusiness' });
      
      await sequelize.sync({ force: true });
      
      // Criar um business para associar às sacolas
      const business = await BusinessModel.create({ name: 'Negócio Teste' });
      
      const bag = await BagModel.create({
        type: 'Doce',
        price: 25.50,
        description: 'Sacola com produtos diversos',
        idBusiness: business.id
      });
      
      expect(bag.status).toBe(1); // Status padrão é 1 (ativo)
      expect(bag.createdAt).toBeInstanceOf(Date); // createdAt deve ser uma data
    });
  });

  describe('Associations', () => {
    test('should associate with business correctly', () => {
      // Directly test the static associate method without actually creating sequelize instances
      // Mock the belongsTo method on BagModel
      const belongsToMock = jest.fn();
      const originalBelongsTo = BagModel.belongsTo;
      BagModel.belongsTo = belongsToMock;
      
      try {
        // Create a mock models object with BusinessModel
        const models = {
          BusinessModel: {}
        };
        
        // Call the associate method
        BagModel.associate(models);
        
        // Verify belongsTo was called with correct parameters
        expect(belongsToMock).toHaveBeenCalledWith(models.BusinessModel, {
          foreignKey: 'idBusiness',
          as: 'business'
        });
      } finally {
        // Restore the original method
        BagModel.belongsTo = originalBelongsTo;
      }
    });
  });
});