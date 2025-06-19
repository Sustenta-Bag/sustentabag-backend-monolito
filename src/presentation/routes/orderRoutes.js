import { Router } from 'express';
import OrderController from '../controllers/OrderController.js';
import OrderService from '../../application/services/OrderService.js';
import PostgresOrderRepository from '../../infrastructure/repositories/postgresOrderRepository.js';
import BagService from '../../application/services/BagService.js';
import PostgresBagRepository from '../../infrastructure/repositories/PostgresBagRepository.js';
import {
  validateCreateOrder,
  validateOrderId,
  validateOrderStatus,
  validateAddItem,
  validateUpdateItemQuantity,
  validateRemoveItem
} from '../middleware/orderValidation.js';
import {
  authenticate,
  requireBusinessRole,
  requireClientRole,
  requireAnyRole
} from '../middleware/authMiddleware.js';

export default (options = {}) => {
  const orderRepository = options.orderRepository || new PostgresOrderRepository();
  const bagRepository = options.bagRepository || new PostgresBagRepository();
  const bagService = options.bagService || new BagService(bagRepository);
  const orderService = new OrderService(orderRepository, bagService);
  const orderController = new OrderController(orderService);

  const router = Router();

  router.post('/', authenticate, requireClientRole, validateCreateOrder, orderController.createOrder.bind(orderController));
  router.get('/', authenticate, requireBusinessRole, orderController.getAllOrders.bind(orderController));
  router.get('/history', authenticate, requireAnyRole, orderController.getOrderHistory.bind(orderController));
  router.get('/stats', authenticate, requireAnyRole, orderController.getOrderStats.bind(orderController));
  router.get('/date-range', authenticate, requireBusinessRole, orderController.getOrdersByDateRange.bind(orderController));
  router.get('/:id', authenticate, requireAnyRole, validateOrderId, orderController.getOrder.bind(orderController));
  router.patch('/:id/status', authenticate, requireBusinessRole, validateOrderStatus, orderController.updateOrderStatus.bind(orderController));
  router.post('/:idOrder/items', authenticate, requireClientRole, validateAddItem, orderController.addItemToOrder.bind(orderController));
  router.delete('/:idOrder/items/:idItem', authenticate, requireClientRole, validateRemoveItem, orderController.removeItemFromOrder.bind(orderController));
  router.patch('/:idOrder/items/:idItem/quantity', authenticate, requireClientRole, validateUpdateItemQuantity, orderController.updateItemQuantity.bind(orderController));

  return router;
};