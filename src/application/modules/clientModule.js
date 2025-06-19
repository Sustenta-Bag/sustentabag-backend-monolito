import ClientModel from '../../domain/models/ClientModel.js';
import PostgresClientRepository from '../../infrastructure/repositories/PostgresClientRepository.js';

export const getClientRepository = (sequelizeInstance) => {
  ClientModel.init(sequelizeInstance);
  return new PostgresClientRepository(ClientModel);
}

export const initializeModels = (sequelizeInstance) => {
  if(!sequelizeInstance) {
    throw new Error('Sequelize instance is required to initialize models');
  }
  ClientModel.init(sequelizeInstance);
  return {
    ClientModel
  };
}