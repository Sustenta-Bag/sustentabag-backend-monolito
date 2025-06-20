import BusinessModel from '../../domain/models/BusinessModel.js';
import PostgresBusinessRepository from '../../infrastructure/repositories/PostgresBusinessRepository.js';

export const getBusinessRepository = (sequelizeInstance) => {
  BusinessModel.init(sequelizeInstance);
  return new PostgresBusinessRepository(BusinessModel);
}

export const initializeModels = (sequelizeInstance) => {
  if(!sequelizeInstance) {
    throw new Error('Sequelize instance is required to initialize models');
  }
  BusinessModel.init(sequelizeInstance);
  return {
    BusinessModel
  };
}