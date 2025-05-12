import dotenv from 'dotenv';
import express from 'express';
import { setupClientRoutes } from '../../presentation/routes/clientRoutes.js';
import { errorHandler } from '../../presentation/middleware/errorHandler.js';
import ClientModel from '../../domain/models/ClientModel.js';
import PostgresClientRepository from '../../infrastructure/repositories/PostgresClientRepository.js';

dotenv.config();

export const setupClientModule = (options = {}) => {
  const router = express.Router();
  
  setupClientRoutes(router, options);
  
  router.use(errorHandler);
  
  return router;
};

export const getClientRepository = (sequelize) => {
  if (!sequelize) {
    throw new Error('Sequelize instance is required to get client repository');
  }
  
  ClientModel.init(sequelize);
  return new PostgresClientRepository(ClientModel);
};

export const initializeModels = (sequelizeInstance) => {
  if (!sequelizeInstance) {
    throw new Error('É necessário fornecer uma instância do Sequelize para inicializar os modelos');
  }
  
  ClientModel.init(sequelizeInstance);
  
  return {
    ClientModel
  };
};

export const clientModuleConfig = {
  name: 'clients',
  routePrefix: '/api/clients',
  description: 'Módulo de gerenciamento de clientes',
  dependencies: [
    'sequelize'
  ]
};