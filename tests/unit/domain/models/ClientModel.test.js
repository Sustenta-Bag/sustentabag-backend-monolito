// filepath: d:\Faculdade\Integrador\sustentabag-backend-monolito\tests\unit\domain\models\ClientModel.test.js
import { Sequelize } from 'sequelize';
import ClientModel from '../../../../src/domain/models/ClientModel';
import AddressModel from '../../../../src/domain/models/AddressModel';

describe('ClientModel Unit Tests', () => {
  let sequelize;
  let clientModel;
  let addressModel;

  beforeAll(async () => {
    // Create a new in-memory SQLite database for all tests
    sequelize = new Sequelize('sqlite::memory:', {
      logging: false,
      dialectOptions: {
        // Enable foreign keys for SQLite
        foreignKeys: true
      }
    });

    // Initialize both models with the same sequelize instance
    addressModel = AddressModel.init(sequelize);
    clientModel = ClientModel.init(sequelize);
    
    // Set up associations
    ClientModel.associate({ AddressModel });
  });

  afterAll(async () => {
    // Close the database connection after all tests
    await sequelize.close();
  });

  describe('Model initialization', () => {
    test('should throw error when sequelize instance is not provided', () => {
      expect(() => {
        ClientModel.init();
      }).toThrow('É necessário fornecer uma instância do Sequelize para inicializar o modelo ClientModel');
    });

    test('should initialize model with correct attributes', () => {
      expect(clientModel).toBeDefined();
      
      const attributes = clientModel.rawAttributes;
      
      expect(attributes).toHaveProperty('id');
      expect(attributes.id.field).toBe('idCliente');
      expect(attributes.id.primaryKey).toBe(true);
      
      expect(attributes).toHaveProperty('name');
      expect(attributes.name.field).toBe('nome');
      expect(attributes.name.allowNull).toBe(false);
      
      expect(attributes).toHaveProperty('email');
      expect(attributes.email.unique).toBe(true);
      expect(attributes.email.allowNull).toBe(false);
      
      expect(attributes).toHaveProperty('cpf');
      expect(attributes.cpf.unique).toBe(true);
      expect(attributes.cpf.allowNull).toBe(false);
      
      expect(attributes).toHaveProperty('phone');
      expect(attributes.phone.field).toBe('telefone');
      expect(attributes.phone.allowNull).toBe(true);
      
      expect(attributes).toHaveProperty('idAddress');
      expect(attributes.idAddress.field).toBe('idEndereco');
      expect(attributes.idAddress.allowNull).toBe(true);
      
      expect(attributes).toHaveProperty('status');
      expect(attributes.status.allowNull).toBe(false);
      
      expect(attributes).toHaveProperty('createdAt');
      expect(attributes.createdAt.field).toBe('dataCriacao');
      
      expect(attributes).toHaveProperty('updatedAt');
      expect(attributes.updatedAt.field).toBe('dataAtualizacao');
    });
  });

  describe('Model validation', () => {
    test('should validate model associations', () => {
      const associations = clientModel.associations;
      
      expect(associations).toHaveProperty('address');
      expect(associations.address.associationType).toBe('BelongsTo');
      expect(associations.address.target).toBe(AddressModel);
      expect(associations.address.foreignKey).toBe('idAddress');
    });
  });
});