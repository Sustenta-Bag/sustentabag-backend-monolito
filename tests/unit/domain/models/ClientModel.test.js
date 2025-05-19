// filepath: d:\Faculdade\Integrador\sustentabag-backend-monolito\tests\unit\domain\models\ClientModel.test.js
import { Sequelize } from 'sequelize';
import ClientModel from '../../../../src/domain/models/ClientModel.js';
import { jest } from '@jest/globals';

describe('ClientModel Unit Tests', () => {
  let sequelize;
  let model;

  beforeAll(async () => {
    // Create an in-memory SQLite database for testing
    sequelize = new Sequelize('sqlite::memory:', {
      logging: false,
      dialect: 'sqlite'
    });

    // Initialize the model with the test database
    model = await ClientModel.init(sequelize);
    if (!model) {
      throw new Error('Failed to initialize ClientModel');
    }
  });

  afterAll(async () => {
    // Close the database connection
    if (sequelize) {
      await sequelize.close();
    }
  });

  beforeEach(async () => {
    // Clear the table before each test
    await model.destroy({ where: {}, force: true, truncate: true });
    // Ensure model is properly initialized
    if (!model.initialized) {
      model = await ClientModel.init(sequelize);
    }
  });

  describe('Model initialization', () => {
    test('should initialize model with correct attributes', async () => {
      // Ensure model is initialized before testing attributes
      if (!model.initialized) {
        model = await ClientModel.init(sequelize);
      }
      expect(model).toBeDefined();
      
      const attributes = model.rawAttributes;
      
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

  describe('CRUD operations', () => {
    beforeEach(async () => {
      // Ensure model is initialized before each CRUD test
      if (!model.initialized) {
        model = await ClientModel.init(sequelize);
      }
    });

    test('should create a client with valid data', async () => {
      // Ensure model is initialized
      if (!model.initialized) {
        model = await ClientModel.init(sequelize);
      }
      expect(model).toBeDefined();

      const clientData = {
        name: 'Cliente Teste',
        email: 'cliente@teste.com',
        cpf: '12345678901',
        phone: '11999999999',
        status: 1
      };

      const client = await model.create(clientData);

      expect(client).toBeDefined();
      expect(client.id).toBeDefined();
      expect(client.name).toBe(clientData.name);
      expect(client.email).toBe(clientData.email);
      expect(client.cpf).toBe(clientData.cpf);
      expect(client.phone).toBe(clientData.phone);
      expect(client.status).toBe(clientData.status);
      expect(client.createdAt).toBeDefined();
      expect(client.updatedAt).toBeDefined();
    });

    test('should find a client by id', async () => {
      expect(model).toBeDefined();

      const clientData = {
        name: 'Cliente Teste',
        email: 'cliente@teste.com',
        cpf: '12345678901',
        phone: '11999999999',
        status: 1
      };

      const createdClient = await model.create(clientData);
      const foundClient = await model.findByPk(createdClient.id);

      expect(foundClient).toBeDefined();
      expect(foundClient.id).toBe(createdClient.id);
      expect(foundClient.name).toBe(clientData.name);
      expect(foundClient.email).toBe(clientData.email);
      expect(foundClient.cpf).toBe(clientData.cpf);
    });

    test('should update a client', async () => {
      expect(model).toBeDefined();

      const clientData = {
        name: 'Cliente Teste',
        email: 'cliente@teste.com',
        cpf: '12345678901',
        phone: '11999999999',
        status: 1
      };

      const createdClient = await model.create(clientData);
      const updateData = { name: 'Cliente Atualizado' };

      await createdClient.update(updateData);
      const updatedClient = await model.findByPk(createdClient.id);

      expect(updatedClient.name).toBe(updateData.name);
      expect(updatedClient.email).toBe(clientData.email); // Other fields unchanged
      expect(updatedClient.cpf).toBe(clientData.cpf);
    });

    test('should delete a client', async () => {
      expect(model).toBeDefined();

      const clientData = {
        name: 'Cliente Teste',
        email: 'cliente@teste.com',
        cpf: '12345678901',
        phone: '11999999999',
        status: 1
      };

      const createdClient = await model.create(clientData);
      await createdClient.destroy();

      const deletedClient = await model.findByPk(createdClient.id);
      expect(deletedClient).toBeNull();
    });

    test('should reject duplicate email', async () => {
      expect(model).toBeDefined();

      const clientData = {
        name: 'Cliente 1',
        email: 'mesmo@email.com',
        cpf: '12345678901',
        phone: '11999999999',
        status: 1
      };

      await model.create(clientData);

      const duplicateData = {
        ...clientData,
        cpf: '98765432101' // Different CPF
      };

      await expect(model.create(duplicateData))
        .rejects.toThrow();
    });

    test('should reject duplicate CPF', async () => {
      expect(model).toBeDefined();

      const clientData = {
        name: 'Cliente 1',
        email: 'cliente1@teste.com',
        cpf: '12345678901',
        phone: '11999999999',
        status: 1
      };

      await model.create(clientData);

      const duplicateData = {
        ...clientData,
        email: 'cliente2@teste.com' // Different email
      };

      await expect(model.create(duplicateData))
        .rejects.toThrow();
    });
  });
});