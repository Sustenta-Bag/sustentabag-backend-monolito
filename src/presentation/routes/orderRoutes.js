import OrderController from '../controllers/OrderController.js';
import OrderService from '../../application/services/OrderService.js';
import PostgresOrderRepository from '../../infrastructure/repositories/PostgresOrderRepository.js';
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

export const setupOrderRoutes = (router, options = {}) => {
  const orderRepository = options.orderRepository || new PostgresOrderRepository();
  const orderService = new OrderService(orderRepository, options.bagService);
  const orderController = new OrderController(orderService);
  
  // Create a new order
  router.post('/',
    /*
    #swagger.path = '/api/orders'
    #swagger.tags = ["Order"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: "#/components/schemas/Order" }
    }
    #swagger.responses[201]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/ForbiddenError" }
    }
    */
    authenticate,
    requireClientRole,
    validateCreateOrder,
    orderController.createOrder.bind(orderController));
  
  // Get all orders (admin only)
  router.get('/',
    /*
    #swagger.path = '/api/orders'
    #swagger.tags = ["Order"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/ForbiddenError" }
    }
    */
    authenticate,
    requireBusinessRole,
    orderController.getAllOrders.bind(orderController));
  
  // Get order history by business (with filters and pagination)
  router.get('/history',
    /*
    #swagger.path = '/api/orders/history'
    #swagger.tags = ["Order History"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    */
    authenticate,
    requireAnyRole,
    orderController.getOrderHistory.bind(orderController));

  // Get order statistics for business
  router.get('/stats',
    /*
    #swagger.path = '/api/orders/stats'
    #swagger.tags = ["Order Statistics"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    */
    authenticate,
    requireAnyRole,
    orderController.getOrderStats.bind(orderController));

  // Get orders by date range
  router.get('/date-range',
    /*
    #swagger.path = '/api/orders/date-range'
    #swagger.tags = ["Order"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['startDate'] = {
      in: 'query',
      description: 'Start date (YYYY-MM-DD)',
      required: false,
      type: 'string'
    }
    #swagger.parameters['endDate'] = {
      in: 'query',
      description: 'End date (YYYY-MM-DD)',
      required: false,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: "Orders filtered by date range retrieved successfully"
    }
    */
    authenticate,
    requireBusinessRole,
    orderController.getOrdersByDateRange.bind(orderController));
  
  // Get order by ID
  router.get('/:id',
    /*
    #swagger.path = '/api/orders/{id}'
    #swagger.tags = ["Order"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[404] = {
      description: "Not Found - Order not found",
      schema: { $ref: "#/components/schemas/NotFoundError" }
    }
    */
    authenticate,
    requireAnyRole,
    validateOrderId,
    orderController.getOrder.bind(orderController));
  
  // Update order status
  router.patch('/:id/status',
    /*
    #swagger.path = '/api/orders/{id}/status'
    #swagger.tags = ["Order"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: "#/components/schemas/OrderStatusUpdate" }
    }
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/ForbiddenError" }
    }
    #swagger.responses[404] = {
      description: "Not Found - Order not found",
      schema: { $ref: "#/components/schemas/NotFoundError" }
    }
    */
    authenticate,
    requireBusinessRole,
    validateOrderStatus,
    orderController.updateOrderStatus.bind(orderController));
  
  // Add item to order
  router.post('/:idOrder/items',
    /*
    #swagger.path = '/api/orders/{idOrder}/items'
    #swagger.tags = ["Order"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: "#/components/schemas/OrderItens" }
    }
    #swagger.responses[201]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/ForbiddenError" }
    }
    #swagger.responses[404] = {
      description: "Not Found - Order not found",
      schema: { $ref: "#/components/schemas/NotFoundError" }
    }
    */
    authenticate,
    requireClientRole,
    validateAddItem,
    orderController.addItemToOrder.bind(orderController));
  
  // Remove item from order
  router.delete('/:idOrder/items/:idItem',
    /*
    #swagger.path = '/api/orders/{idOrder}/items/{idItem}'
    #swagger.tags = ["Order"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[204]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/ForbiddenError" }
    }
    #swagger.responses[404] = {
      description: "Not Found - Order or item not found",
      schema: { $ref: "#/components/schemas/NotFoundError" }
    }
    */
    authenticate,
    requireClientRole,
    validateRemoveItem,
    orderController.removeItemFromOrder.bind(orderController));
  
  // Update item quantity
  router.patch('/:idOrder/items/:idItem/quantity',
    /*
    #swagger.path = '/api/orders/{idOrder}/items/{idItem}/quantity'
    #swagger.tags = ["Order"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: "#/components/schemas/ItemQuantity" }
    }
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/ForbiddenError" }
    }
    #swagger.responses[404] = {
      description: "Not Found - Order or item not found",
      schema: { $ref: "#/components/schemas/NotFoundError" }
    }
    */
    authenticate,
    requireClientRole,
    validateUpdateItemQuantity,
    orderController.updateItemQuantity.bind(orderController));
};