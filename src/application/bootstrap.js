import express from 'express';
import * as bagModule from './modules/bagModule.js';
import * as clientModule from './modules/clientModule.js';
import * as addressModule from './modules/addressModule.js';
import * as businessModule from './modules/businessModule.js';
import * as authModule from './modules/authModule.js';
import * as locationModule from './modules/locationModule.js';
import LocationService from './services/LocationService.js';
import * as orderModule from './modules/orderModule.js';
import setupAssociations from '../infrastructure/database/associations.js';

export const initializeModules = (sequelize) => {
  const bagModels = bagModule.initializeModels(sequelize);
  const clientModels = clientModule.initializeModels(sequelize);
  const addressModels = addressModule.initializeModels(sequelize);
  const businessModels = businessModule.initializeModels(sequelize);
  const authModels = authModule.initializeModels(sequelize);
  const orderModels = orderModule.initializeModels(sequelize);
  
  const allModels = {
    ...bagModels,
    ...clientModels,
    ...addressModels,
    ...businessModels,
    ...authModels,
    ...orderModels
  };
  
  setupAssociations(allModels);
  
  return {
    models: allModels
  };
};

export const setupModuleRouters = (options = {}) => {
  if (!options.sequelizeInstance) {
    throw new Error('Sequelize instance is required to set up module routers');
  }
  const clientRepository = clientModule.getClientRepository(options.sequelizeInstance);
  const businessRepository = businessModule.getBusinessRepository(options.sequelizeInstance);
  const addressRepository = addressModule.getAddressRepository(options.sequelizeInstance);
  
  const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;
  const locationService = new LocationService(
    businessRepository,
    addressRepository,
    clientRepository,
    mapboxToken
  );
  
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
  });  const authRouter = authModule.setupAuthModule({
  });

  const authRouter = authModule.setupAuthModule({
    sequelizeInstance: options.sequelizeInstance,
    clientRepository: clientRepository,
    businessRepository: businessRepository,
    addressRepository: addressRepository,
    locationService: locationService
  });
  
  const locationRouter = locationModule.setupLocationRoutes(express.Router(), {
    sequelize: options.sequelizeInstance
  });

  const orderRouter = orderModule.setupOrderModule({
    sequelizeInstance: options.sequelizeInstance,
    bagService: bagModule.getBagService(options.sequelizeInstance)
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
    locationRouter,
    orderRouter
  };
};