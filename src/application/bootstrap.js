import * as bagModule from './modules/bagModule.js';
import * as clientModule from './modules/clientModule.js';
import * as addressModule from './modules/addressModule.js';
import * as businessModule from './modules/businessModule.js';

export const initializeModules = (sequelize) => {
  const bagModels = bagModule.initializeModels(sequelize);
  const clientModels = clientModule.initializeModels(sequelize);
  const addressModels = addressModule.initializeModels(sequelize);
  const businessModels = businessModule.initializeModels(sequelize);
  
  return {
    models: {
      ...bagModels,
      ...clientModels,
      ...addressModels,
      ...businessModels
    }
  };
};

export const setupModuleRouters = ( options = {}) => {
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

  return {
    bagRouter,
    clientRouter,
    addresRouter,
    businessRouter
  };
};