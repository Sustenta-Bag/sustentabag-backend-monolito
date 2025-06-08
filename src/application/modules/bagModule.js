import dotenv from 'dotenv';
import express from 'express';
import { setupBagRoutes } from '../../presentation/routes/bagRoutes.js';
import { errorHandler } from '../../presentation/middleware/errorHandler.js';
import BagModel from '../../domain/models/BagModel.js';
import PostgresBagRepository from '../../infrastructure/repositories/PostgresBagRepository.js';
import BagService from '../../application/services/BagService.js';

dotenv.config();

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

export const setupBagModule = (options = {}) => {
  const router = express.Router();
  
  if (!options.sequelizeInstance) {
    throw new Error('Sequelize instance is required to set up bag module');
  }
  
  const bagRepository = new PostgresBagRepository(
    options.BagModel || BagModel
  );
  const favoriteRepository = options.favoriteRepository;
  const authRepository = options.authRepository;
    const bagService = new BagService(
    bagRepository,
    favoriteRepository,
    authRepository
  );
  
  setupBagRoutes(router, {
    bagService,
    bagRepository,
    favoriteRepository,
    authRepository
  });
  
  return router;
};

export const getBagService = (sequelizeInstance, favoriteRepository, authRepository) => {
  if (!sequelizeInstance) {
    throw new Error('Sequelize instance is required to get bag service');
  }
  
  const bagRepository = new PostgresBagRepository(BagModel);

  return new BagService(bagRepository, favoriteRepository, authRepository);
};