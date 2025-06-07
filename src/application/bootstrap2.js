import * as addressModule from './modules/addressModule.js';
import setupAssociations from '../infrastructure/database/associations.js';
import addressRouter from '../presentation/routes/addressRoutes2.js';

export const initializeModules = (sequelize) => {
  const addressModels = addressModule.initializeModels(sequelize);
  
  const allModels = {
    ...addressModels,
  };
  
  setupAssociations(allModels);
  
  return {
    models: allModels
  };
};

export const setupModuleRouters = () => ({
  addressRouter
});