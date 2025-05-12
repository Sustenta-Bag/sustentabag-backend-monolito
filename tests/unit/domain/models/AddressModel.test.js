// filepath: d:\Faculdade\Integrador\sustentabag-backend-monolito\tests\unit\domain\models\AddressModel.test.js
import AddressModel from '../../../../src/domain/models/AddressModel.js';
import { Sequelize } from 'sequelize';

describe('AddressModel Unit Tests', () => {
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
      const addressModel = AddressModel.init(sequelize);
      
      // Verificar se o modelo foi inicializado corretamente
      expect(addressModel).toBe(AddressModel);
      
      // Verificar se os atributos foram definidos corretamente
      const attributes = AddressModel.rawAttributes;
      
      expect(attributes.id).toBeDefined();
      expect(attributes.zipCode).toBeDefined();
      expect(attributes.state).toBeDefined();
      expect(attributes.city).toBeDefined();
      expect(attributes.street).toBeDefined();
      expect(attributes.number).toBeDefined();
      expect(attributes.complement).toBeDefined();
      expect(attributes.latitude).toBeDefined();
      expect(attributes.longitude).toBeDefined();
      expect(attributes.status).toBeDefined();
      expect(attributes.createdAt).toBeDefined();
      expect(attributes.updatedAt).toBeDefined();
      
      // Verificar configurações específicas
      expect(attributes.id.primaryKey).toBe(true);
      expect(attributes.id.field).toBe('idEndereco');
      expect(attributes.status.defaultValue).toBe(1);
      expect(attributes.zipCode.field).toBe('CEP');
    });

    test('should throw error when sequelize instance is not provided', () => {
      expect(() => {
        AddressModel.init();
      }).toThrow('É necessário fornecer uma instância do Sequelize para inicializar o modelo AddressModel');
    });
  });

  describe('Validation', () => {
    test('should have correct validation for zipCode', async () => {
      // Inicializar o modelo
      AddressModel.init(sequelize);
      await sequelize.sync({ force: true });
      
      // Testar validação do CEP com formato inválido
      try {
        await AddressModel.create({
          zipCode: 'abc12345',  // formato inválido
          state: 'SP',
          city: 'São Paulo',
          street: 'Avenida Paulista',
          number: '1000'
        });
        fail('Deve lançar erro de validação');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.name).toBe('SequelizeValidationError');
      }

      // Testar formato válido
      const validAddress = await AddressModel.create({
        zipCode: '12345678',
        state: 'SP',
        city: 'São Paulo',
        street: 'Avenida Paulista',
        number: '1000'
      });
      
      expect(validAddress).toBeDefined();
      expect(validAddress.zipCode).toBe('12345678');
    });

    test('should have correct validation for state', async () => {
      // Inicializar o modelo
      AddressModel.init(sequelize);
      await sequelize.sync({ force: true });
      
      // Testar validação do estado com formato inválido
      try {
        await AddressModel.create({
          zipCode: '12345678',
          state: 'São Paulo',  // formato inválido
          city: 'São Paulo',
          street: 'Avenida Paulista',
          number: '1000'
        });
        fail('Deve lançar erro de validação');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.name).toBe('SequelizeValidationError');
      }

      // Testar formato válido
      const validAddress = await AddressModel.create({
        zipCode: '12345678',
        state: 'SP',
        city: 'São Paulo',
        street: 'Avenida Paulista',
        number: '1000'
      });
      
      expect(validAddress).toBeDefined();
      expect(validAddress.state).toBe('SP');
    });

    test('should have correct validation for status', async () => {
      // Inicializar o modelo
      AddressModel.init(sequelize);
      await sequelize.sync({ force: true });
      
      // Testar validação do status com valor inválido
      try {
        await AddressModel.create({
          zipCode: '12345678',
          state: 'SP',
          city: 'São Paulo',
          street: 'Avenida Paulista',
          number: '1000',
          status: 2  // valor inválido
        });
        fail('Deve lançar erro de validação');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.name).toBe('SequelizeValidationError');
      }

      // Testar valor válido (ativo)
      const activeAddress = await AddressModel.create({
        zipCode: '12345678',
        state: 'SP',
        city: 'São Paulo',
        street: 'Avenida Paulista',
        number: '1000',
        status: 1
      });
      
      expect(activeAddress).toBeDefined();
      expect(activeAddress.status).toBe(1);

      // Testar valor válido (inativo)
      const inactiveAddress = await AddressModel.create({
        zipCode: '12345678',
        state: 'SP',
        city: 'São Paulo',
        street: 'Avenida Paulista',
        number: '1000',
        status: 0
      });
      
      expect(inactiveAddress).toBeDefined();
      expect(inactiveAddress.status).toBe(0);
    });
  });
});