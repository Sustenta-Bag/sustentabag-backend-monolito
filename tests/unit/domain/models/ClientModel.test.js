// filepath: d:\Faculdade\Integrador\sustentabag-backend-monolito\tests\unit\domain\models\ClientModel.test.js
import ClientModel from '../../../../src/domain/models/ClientModel.js';
import { Sequelize } from 'sequelize';

describe('ClientModel Unit Tests', () => {
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
      const clientModel = ClientModel.init(sequelize);
      
      // Verificar se o modelo foi inicializado corretamente
      expect(clientModel).toBeDefined();
      expect(clientModel).toBe(ClientModel);
      
      // Verificar se os atributos foram definidos corretamente
      const attributes = ClientModel.rawAttributes;
      
      expect(attributes.id).toBeDefined();
      expect(attributes.name).toBeDefined();
      expect(attributes.email).toBeDefined();
      expect(attributes.cpf).toBeDefined();
      expect(attributes.phone).toBeDefined();
      expect(attributes.status).toBeDefined();
      expect(attributes.createdAt).toBeDefined();
      expect(attributes.updatedAt).toBeDefined();
      
      // Verificar configurações específicas
      expect(attributes.id.primaryKey).toBe(true);
      expect(attributes.id.field).toBe('idCliente');
      expect(attributes.name.field).toBe('nome');
      expect(attributes.phone.field).toBe('telefone');
      expect(attributes.email.unique).toBe(true);
      expect(attributes.cpf.unique).toBe(true);
    });
  });

  describe('CRUD operations', () => {
    beforeEach(async () => {
      ClientModel.init(sequelize);
      await sequelize.sync({ force: true });
    });

    test('should create a client with valid data', async () => {
      const clientData = {
        name: 'Cliente Teste',
        email: 'cliente@teste.com',
        cpf: '12345678901',
        phone: '11999998888',
        status: 1
      };

      const client = await ClientModel.create(clientData);

      expect(client).toBeDefined();
      expect(client.id).toBeDefined();
      expect(client.name).toBe(clientData.name);
      expect(client.email).toBe(clientData.email);
      expect(client.cpf).toBe(clientData.cpf);
      expect(client.phone).toBe(clientData.phone);
      expect(client.status).toBe(clientData.status);
      expect(client.createdAt).toBeInstanceOf(Date);
      expect(client.updatedAt).toBeInstanceOf(Date);
    });

    test('should find a client by id', async () => {
      const createdClient = await ClientModel.create({
        name: 'Cliente Teste',
        email: 'cliente@teste.com',
        cpf: '12345678901',
        phone: '11999998888',
        status: 1
      });

      const foundClient = await ClientModel.findByPk(createdClient.id);

      expect(foundClient).toBeDefined();
      expect(foundClient.id).toBe(createdClient.id);
      expect(foundClient.name).toBe(createdClient.name);
      expect(foundClient.email).toBe(createdClient.email);
    });

    test('should update a client', async () => {
      const createdClient = await ClientModel.create({
        name: 'Cliente Teste',
        email: 'cliente@teste.com',
        cpf: '12345678901',
        phone: '11999998888',
        status: 1
      });

      const newName = 'Cliente Atualizado';
      await createdClient.update({ name: newName });

      const updatedClient = await ClientModel.findByPk(createdClient.id);

      expect(updatedClient).toBeDefined();
      expect(updatedClient.name).toBe(newName);
      expect(updatedClient.email).toBe(createdClient.email); // outros campos não alterados
    });

    test('should delete a client', async () => {
      const createdClient = await ClientModel.create({
        name: 'Cliente Teste',
        email: 'cliente@teste.com',
        cpf: '12345678901',
        phone: '11999998888',
        status: 1
      });

      await createdClient.destroy();

      const deletedClient = await ClientModel.findByPk(createdClient.id);
      expect(deletedClient).toBeNull();
    });

    test('should reject duplicate email', async () => {
      await ClientModel.create({
        name: 'Cliente 1',
        email: 'mesmo@email.com',
        cpf: '12345678901',
        status: 1
      });

      await expect(ClientModel.create({
        name: 'Cliente 2',
        email: 'mesmo@email.com', // email duplicado
        cpf: '98765432109',
        status: 1
      })).rejects.toThrow();
    });

    test('should reject duplicate CPF', async () => {
      await ClientModel.create({
        name: 'Cliente 1',
        email: 'cliente1@teste.com',
        cpf: '12345678901',
        status: 1
      });

      await expect(ClientModel.create({
        name: 'Cliente 2',
        email: 'cliente2@teste.com',
        cpf: '12345678901', // CPF duplicado
        status: 1
      })).rejects.toThrow();
    });
  });
});