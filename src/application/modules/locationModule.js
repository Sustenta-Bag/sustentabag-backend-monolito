import express from 'express';
import { setupLocationRoutes } from '../../presentation/routes/locationRoutes.js';
import { errorHandler } from '../../presentation/middleware/errorHandler.js';

export const setupLocationModule = (router, { sequelize }) => {
  setupLocationRoutes(router, { sequelize });
  
  router.use(errorHandler);
  
  return router;
};

export const locationModuleConfig = {
  name: 'location',
  routePrefix: '/api/location',
};