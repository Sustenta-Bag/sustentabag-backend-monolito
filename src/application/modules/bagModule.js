import dotenv from 'dotenv';
import express from 'express';
import { setupRoutes } from '../../presentation/routes/bagRoutes.js';
import { errorHandler } from '../../presentation/middleware/errorHandler.js';
import BagModel from '../../domain/models/BagModel.js';

dotenv.config();

export const setupBagModule = (options = {}) => {
  const router = express.Router();
  
  setupRoutes(router, options);
  
  router.use(errorHandler);
  
  return router;
};

export const initializeModels = (sequelizeInstance) => {
  if (!sequelizeInstance) {
    throw new Error('É necessário fornecer uma instância do Sequelize para inicializar os modelos');
  }
  
  BagModel.init(sequelizeInstance);
  
  return {
    BagModel
  };
};

export const bagModuleConfig = {
  name: 'bags',
  routePrefix: '/api/bags',
  description: 'Módulo de gerenciamento de sacolas ecológicas',
  dependencies: [
    'sequelize'
  ]
};