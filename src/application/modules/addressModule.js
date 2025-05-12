import dotenv from 'dotenv';
import express from 'express';
import { setupAddressRoutes } from '../../presentation/routes/addressRoutes.js';
import { errorHandler } from '../../presentation/middleware/errorHandler.js';
import AddressModel from '../../domain/models/AddressModel.js';
import PostgresAddressRepository from '../../infrastructure/repositories/PostgresAddressRepository.js';

dotenv.config();

export const getAddressRepository = (sequelize) => {
  AddressModel.init(sequelize);
  return new PostgresAddressRepository(AddressModel);
};

export const setupAddressModule = (options = {}) => {
  const router = express.Router();
  
  setupAddressRoutes(router, options);
  
  router.use(errorHandler);
  
  return router;
};

export const initializeModels = (sequelizeInstance) => {
  if (!sequelizeInstance) {
    throw new Error('É necessário fornecer uma instância do Sequelize para inicializar os modelos');
  }
  
  AddressModel.init(sequelizeInstance);
  
  return {
    AddressModel
  };
};