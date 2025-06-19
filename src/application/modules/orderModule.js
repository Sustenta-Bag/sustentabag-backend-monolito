import OrderModel from '../../domain/models/OrderModel.js';
import OrderItemModel from '../../domain/models/OrderItemModel.js';
import PostgresOrderRepository from '../../infrastructure/repositories/postgresOrderRepository.js';

export const getOrderRepository = (sequelizeInstance) => {
  OrderModel.init(sequelizeInstance);
  OrderItemModel.init(sequelizeInstance);
  return new PostgresOrderRepository(OrderModel, OrderItemModel);
};

export const initializeModels = (sequelizeInstance) => {
  if (!sequelizeInstance) {
    throw new Error('Sequelize instance is required to initialize models');
  }
  OrderModel.init(sequelizeInstance);
  OrderItemModel.init(sequelizeInstance);
  return {
    OrderModel,
    OrderItemModel
  };
};