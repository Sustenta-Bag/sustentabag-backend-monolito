import express from 'express';
import UserModel from '../../domain/models/UserModel.js';
import UserRepository from '../../infrastructure/repositories/UserRepository.js';
import AuthService from '../services/AuthService.js';
import AuthController from '../../presentation/controllers/AuthController.js';
import authRoutes from '../../presentation/routes/authRoutes.js';

// Initialize models function for bootstrap.js
export const initializeModels = (sequelize) => {
  const userModel = UserModel.init(sequelize);
  
  return {
    UserModel: userModel
  };
};

// Setup module function for bootstrap.js
export const setupAuthModule = (options = {}) => {
  // Get repositories from options or create new ones
  const sequelize = options.sequelizeInstance;
  
  // These repositories should be injected from the bootstrap
  const clientRepository = options.clientRepository;
  const businessRepository = options.businessRepository;
  
  if (!clientRepository || !businessRepository) {
    console.warn('Auth module requires client and business repositories');
  }
  
  // Initialize models if not already done
  UserModel.init(sequelize);
  
  // Create repository
  const userRepository = new UserRepository(UserModel);
  
  // Create service
  const authService = new AuthService(
    userRepository, 
    clientRepository, 
    businessRepository
  );
  
  // Create controller
  const authController = new AuthController(authService);
  
  // Setup routes - the key fix is here
  const router = express.Router();
  authRoutes(authController)(router);
  
  return router;
};