import dotenv from 'dotenv';
import express from 'express';
import { setupOrderRoutes } from '../../presentation/routes/orderRoutes.js';
import { errorHandler } from '../../presentation/middleware/errorHandler.js';
import OrderModel from '../../domain/models/OrderModel.js';
import OrderItemModel from '../../domain/models/OrderItemModel.js';
import PostgresOrderRepository from '../../infrastructure/repositories/PostgresOrderRepository.js';
import OrderService from '../../application/services/OrderService.js';

dotenv.config();

export const initializeModels = (sequelizeInstance) => {
  if (!sequelizeInstance) {
    throw new Error('É necessário fornecer uma instância do Sequelize para inicializar os modelos');
  }
  
  OrderModel.init(sequelizeInstance);
  OrderItemModel.init(sequelizeInstance);
  
  return {
    OrderModel,
    OrderItemModel
  };
};

export const orderModuleConfig = {
  name: 'orders',
  routePrefix: '/api/orders',
  description: 'Módulo de gerenciamento de pedidos',
  dependencies: [
    'sequelize',
    'bagService'
  ]
};

export const setupOrderModule = (options = {}) => {
  const router = express.Router();
  
  if (!options.sequelizeInstance) {
    throw new Error('Sequelize instance is required to set up order module');
  }
  
  if (!options.bagService) {
    throw new Error('Bag service is required to set up order module');
  }
  
  const orderRepository = new PostgresOrderRepository(
    options.OrderModel || OrderModel,
    options.OrderItemModel || OrderItemModel
  );
  
  setupOrderRoutes(router, {
    orderRepository,
    bagService: options.bagService
  });
  
  return router;
}; 