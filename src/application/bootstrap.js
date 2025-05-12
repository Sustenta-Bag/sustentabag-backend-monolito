import express from 'express';
import * as bagModule from './modules/bagModule.js';
import * as clientModule from './modules/clientModule.js';
import * as addressModule from './modules/addressModule.js';
import * as businessModule from './modules/businessModule.js';
import * as authModule from './modules/authModule.js';
import * as locationModule from './modules/locationModule.js';

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
  if (!options.sequelizeInstance) {
    throw new Error('Sequelize instance is required to set up module routers');
  }
  
  const clientRepository = clientModule.getClientRepository(options.sequelizeInstance);
  const businessRepository = businessModule.getBusinessRepository(options.sequelizeInstance);
  
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
  
  const locationRouter = locationModule.setupLocationRoutes(express.Router(), {
    sequelize: options.sequelizeInstance
  });
  
  if (!authRouter) {
    console.error('Auth router setup failed!');
  }

  return {
    bagRouter,
    clientRouter,
    addresRouter,
    businessRouter,
    authRouter,
    locationRouter
  };
};