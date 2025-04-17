import { Sequelize } from 'sequelize';
import request from 'supertest';
import { app } from '../../src/app.js';
import BagModel from '../../src/domain/models/BagModel.js';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
});

const setupModels = async () => {
  BagModel.init(sequelize);
  
  const originalFindByPk = BagModel.findByPk;
  const originalCreate = BagModel.create;
  const originalFindAll = BagModel.findAll;
  const originalUpdate = BagModel.update;
  const originalDestroy = BagModel.destroy;

  BagModel._originalMethods = {
    findByPk: originalFindByPk,
    create: originalCreate,
    findAll: originalFindAll,
    update: originalUpdate,
    destroy: originalDestroy
  };
};

const setupDatabase = async () => {
  try {
    await setupModels();
    await sequelize.sync({ force: true });
    console.log('Modelos sincronizados com banco de dados de teste em memória.');
  } catch (error) {
    console.error('Não foi possível configurar o banco de dados de teste:', error);
    throw error;
  }
};

const clearDatabase = async () => {
  try {
    await sequelize.truncate({ cascade: true });
  } catch (error) {
    console.error('Erro ao limpar banco de dados de teste:', error);
  }
};

const teardownDatabase = async () => {
  try {
    await sequelize.close();
    console.log('Conexão com banco de dados de teste encerrada.');
  } catch (error) {
    console.error('Erro ao encerrar conexão com banco de dados de teste:', error);
  }
};

const getTestClient = () => {
  return request(app);
};

export {
  sequelize,
  setupDatabase,
  clearDatabase,
  teardownDatabase,
  getTestClient
};