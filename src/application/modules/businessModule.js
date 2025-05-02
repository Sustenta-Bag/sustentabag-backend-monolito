import dotenv from 'dotenv';
import express from 'express';
import { setupBusinessRoutes } from '../../presentation/routes/businessRoutes.js';
import { errorHandler } from '../../presentation/middleware/errorHandler.js';
import BusinessModel from '../../domain/models/BusinessModel.js';

dotenv.config();

export const setupBusinessModule = (options = {}) => {
  const router = express.Router();
  
  setupBusinessRoutes(router, options);
  
  router.use(errorHandler);
  
  return router;
};

export const initializeModels = (sequelizeInstance) => {
  if (!sequelizeInstance) {
    throw new Error('É necessário fornecer uma instância do Sequelize para inicializar os modelos');
  }
  
  BusinessModel.init(sequelizeInstance);
  
  return {
    BusinessModel
  };
};

export const businessModuleConfig = {
  name: 'business',
  routePrefix: '/api/businesses',
  description: 'Módulo de gerenciamento das empresas',
  dependencies: [
    'sequelize'
  ]
};