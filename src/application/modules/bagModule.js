import dotenv from 'dotenv';
import express from 'express';
import { setupRoutes } from '../../presentation/routes/index.js';
import { errorHandler } from '../../presentation/middleware/errorHandler.js';
import BagModel from '../../domain/models/BagModel.js';

dotenv.config();

/**
 * Configura e retorna o roteador para o módulo de Bags
 * @param {Object} options - Opções de configuração
 * @param {Object} options.sequelizeInstance - Instância do Sequelize do monolito
 * @returns {Object} Router do Express configurado para o módulo de Bags
 */
export const setupBagModule = (options = {}) => {
  const router = express.Router();
  
  setupRoutes(router, options);
  
  router.use(errorHandler);
  
  return router;
};

/**
 * Inicializa os modelos de banco de dados do módulo de Bags
 * @param {Object} sequelizeInstance - Instância do Sequelize do monolito
 */
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