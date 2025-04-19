import dotenv from 'dotenv';
import express from 'express';
import { setupClientRoutes } from '../../presentation/routes/clientRoutes.js';
import { errorHandler } from '../../presentation/middleware/errorHandler.js';
import ClientModel from '../../domain/models/ClientModel.js';

dotenv.config();

export const setupClientModule = (options = {}) => {
  const router = express.Router();
  
  setupClientRoutes(router, options);
  
  router.use(errorHandler);
  
  return router;
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