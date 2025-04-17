import * as bagModule from './modules/bagModule.js';

export const initializeModules = (sequelize) => {
  const models = bagModule.initializeModels(sequelize);
  
  return {
    models
  };
};

export const setupModuleRouters = (app, options = {}) => {
  const bagRouter = bagModule.setupBagModule({
    sequelizeInstance: options.sequelizeInstance
  });
  
  app.use('/api', bagRouter);
  
  return app;
}; 