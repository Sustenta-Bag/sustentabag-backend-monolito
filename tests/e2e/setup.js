const { Sequelize } = require('sequelize');
const request = require('supertest');
const { app } = require('../../src/index');
const BagModel = require('../../src/infrastructure/database/models/BagModel');

// Configuração do banco de dados de teste com SQLite em memória
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
});

// Inicialização dos modelos no banco de testes
const setupModels = async () => {
  // Registramos os modelos na instância do Sequelize de teste
  BagModel.init(sequelize);
  
  // Sobrescrevemos a instância do modelo para os testes
  // Isso garante que as consultas durante os testes usem a conexão SQLite
  const originalFindByPk = BagModel.findByPk;
  const originalCreate = BagModel.create;
  const originalFindAll = BagModel.findAll;
  const originalUpdate = BagModel.update;
  const originalDestroy = BagModel.destroy;

  // Preservamos os métodos originais para restauração posterior
  BagModel._originalMethods = {
    findByPk: originalFindByPk,
    create: originalCreate,
    findAll: originalFindAll,
    update: originalUpdate,
    destroy: originalDestroy
  };
};

// Função para configurar o banco de dados de teste
const setupDatabase = async () => {
  try {
    await setupModels();
    // Sincroniza os modelos com o banco de dados (força a recriação das tabelas)
    await sequelize.sync({ force: true });
    console.log('Modelos sincronizados com banco de dados de teste em memória.');
  } catch (error) {
    console.error('Não foi possível configurar o banco de dados de teste:', error);
    throw error;
  }
};

// Função para limpar o banco de dados entre os testes
const clearDatabase = async () => {
  try {
    // Limpa todas as tabelas entre os testes
    await sequelize.truncate({ cascade: true });
  } catch (error) {
    console.error('Erro ao limpar banco de dados de teste:', error);
  }
};

// Função para encerrar a conexão com o banco após os testes
const teardownDatabase = async () => {
  try {
    await sequelize.close();
    console.log('Conexão com banco de dados de teste encerrada.');
  } catch (error) {
    console.error('Erro ao encerrar conexão com banco de dados de teste:', error);
  }
};

// Retorna um cliente de teste para fazer requisições HTTP
const getTestClient = () => {
  return request(app);
};

module.exports = {
  sequelize,
  setupDatabase,
  clearDatabase,
  teardownDatabase,
  getTestClient
};