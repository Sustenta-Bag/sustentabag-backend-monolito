import * as bagModule from './modules/bagModule.js';
import * as clientModule from './modules/clientModule.js';

export const initializeModules = (sequelize) => {
  const bagModels = bagModule.initializeModels(sequelize);
  const clientModels = clientModule.initializeModels(sequelize);
  
  return {
    models: {
      ...bagModels,
      ...clientModels
    }
  };
};

export const setupModuleRouters = (app, options = {}) => {
  const bagRouter = bagModule.setupBagModule({
    sequelizeInstance: options.sequelizeInstance
  });
  
  const clientRouter = clientModule.setupClientModule({
    sequelizeInstance: options.sequelizeInstance
  });
  
  app.use('/api', bagRouter);
  app.use('/api', clientRouter);
  
  return app;
};