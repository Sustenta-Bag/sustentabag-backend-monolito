import express from 'express';
import * as bagModule from './modules/bagModule.js';
import * as clientModule from './modules/clientModule.js';
import * as addressModule from './modules/addressModule.js';
import * as businessModule from './modules/businessModule.js';
import * as authModule from './modules/authModule.js';

export const initializeModules = (sequelize) => {
  const bagModels = bagModule.initializeModels(sequelize);
  const clientModels = clientModule.initializeModels(sequelize);
  const addressModels = addressModule.initializeModels(sequelize);
  const businessModels = businessModule.initializeModels(sequelize);
  const authModels = authModule.initializeModels(sequelize);
  
  return {
    models: {
      ...bagModels,
      ...clientModels,
      ...addressModels,
      ...businessModels,
      ...authModels
    }
  };
};

export const setupModuleRouters = (options = {}) => {
  // Ensure we have a Sequelize instance
  if (!options.sequelizeInstance) {
    throw new Error('Sequelize instance is required to set up module routers');
  }
  
  // Initialize client and business repositories first
  const clientRepository = clientModule.getClientRepository(options.sequelizeInstance);
  const businessRepository = businessModule.getBusinessRepository(options.sequelizeInstance);
  
  // Set up routers with proper dependencies
  const bagRouter = bagModule.setupBagModule({
    sequelizeInstance: options.sequelizeInstance
  });
  
  const clientRouter = clientModule.setupClientModule({
    sequelizeInstance: options.sequelizeInstance
  });
  
  const addresRouter = addressModule.setupAddressModule({
    sequelizeInstance: options.sequelizeInstance
  });

  const businessRouter = businessModule.setupBusinessModule({
    sequelizeInstance: options.sequelizeInstance
  });

  const authRouter = authModule.setupAuthModule({
    sequelizeInstance: options.sequelizeInstance,
    clientRepository: clientRepository,
    businessRepository: businessRepository
  });
  
  if (!authRouter) {
    console.error('Auth router setup failed!');
  }

  return {
    bagRouter,
    clientRouter,
    addresRouter,
    businessRouter,
    authRouter
  };
};