import express from 'express';
import UserModel from '../../domain/models/UserModel.js';
import UserRepository from '../../infrastructure/repositories/UserRepository.js';
import AuthService from '../services/AuthService.js';
import AuthController from '../../presentation/controllers/AuthController.js';
import authRoutes from '../../presentation/routes/authRoutes.js';

export const initializeModels = (sequelize) => {
  const userModel = UserModel.init(sequelize);
  
  return {
    UserModel: userModel
  };
};

export const setupAuthModule = (options = {}) => {
  const sequelize = options.sequelizeInstance;
  
  const clientRepository = options.clientRepository;
  const businessRepository = options.businessRepository;
  
  if (!clientRepository || !businessRepository) {
    console.warn('Auth module requires client and business repositories');
  }
  
  UserModel.init(sequelize);
  
  const userRepository = new UserRepository(UserModel);
  
  const authService = new AuthService(
    userRepository, 
    clientRepository, 
    businessRepository
  );
  
  const authController = new AuthController(authService);
  
  const router = express.Router();
  authRoutes(authController)(router);
  
  return router;
};