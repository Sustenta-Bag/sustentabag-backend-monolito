import express from 'express';
import UserModel from '../../domain/models/UserModel.js';
import UserRepository from '../../infrastructure/repositories/UserRepository.js';
import AuthService from '../services/AuthService.js';
import AuthController from '../../presentation/controllers/authController.js';
import authRoutes from '../../presentation/routes/authRoutes.js';

export const getAuthRepository = (sequelizeInstance) => {
  UserModel.init(sequelizeInstance);
  return new UserRepository(UserModel);
};

export const initializeModels = (sequelizeInstance) => {
  if (!sequelizeInstance) {
    throw new Error('Sequelize instance is required to initialize models');
  }
  UserModel.init(sequelizeInstance);
  return {
    UserModel
  };
};

export const setupAuthModule = (options = {}) => {
  const sequelize = options.sequelizeInstance;
  
  const clientRepository = options.clientRepository;
  const businessRepository = options.businessRepository;
  const addressRepository = options.addressRepository;
  const locationService = options.locationService;
  
  if (!clientRepository || !businessRepository) {
    console.warn('Auth module requires client and business repositories');
  }
  
  if (!addressRepository) {
    console.warn('Auth module requires address repository for address creation');
  }
  
  UserModel.init(sequelize);
  
  const userRepository = new UserRepository(UserModel);
  
  const authService = new AuthService(
    userRepository, 
    clientRepository, 
    businessRepository,
    addressRepository,
    locationService
  );
  
  const authController = new AuthController(authService);
  
  const router = express.Router();
  authRoutes(authController)(router);
  
  return router;
};