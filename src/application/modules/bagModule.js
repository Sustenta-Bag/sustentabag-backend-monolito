import BagModel from '../../domain/models/BagModel.js';
import PostgresBagRepository from '../../infrastructure/repositories/PostgresBagRepository.js';
import BagService from '../services/BagService.js';

export const getBagRepository = (sequelizeInstance) => {
  BagModel.init(sequelizeInstance);
  return new PostgresBagRepository(BagModel);
};

export const initializeModels = (sequelizeInstance) => {
  if(!sequelizeInstance) {
    throw new Error('Sequelize instance is required to initialize models');
  }
  BagModel.init(sequelizeInstance);
  return {
    BagModel
  };
}

export const getBagService = (bagRepository) => {
  if (!bagRepository) {
    throw new Error('Bag repository is required to create BagService');
  }
  return new BagService(bagRepository);
}