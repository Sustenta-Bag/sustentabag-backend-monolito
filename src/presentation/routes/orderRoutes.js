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
      schema: {
        type: "object",
        properties: {
          userId: { type: "integer", example: 1 },
          businessId: { type: "integer", example: 1 },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                bagId: { type: "integer", example: 1 },
                quantity: { type: "integer", example: 2 }
              }
            }
          }
        }
      }
    }
    #swagger.responses[201]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/Error" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/Error" }
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
      schema: { $ref: "#/components/schemas/Error" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/Error" }
    }
    */
    authenticate,
    requireBusinessRole,
    orderController.getAllOrders.bind(orderController));
  
  // Get order by ID
  router.get('/:id',
    /*
    #swagger.path = '/api/orders/{id}'
    #swagger.tags = ["Order"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/Error" }
    }
    #swagger.responses[404] = {
      description: "Not Found - Order not found",
      schema: { $ref: "#/components/schemas/Error" }
    }
    */
    authenticate,
    requireAnyRole,
    validateOrderId,
    orderController.getOrder.bind(orderController));
  
  // Get orders by user ID
  router.get('/user/:userId',
    /*
    #swagger.path = '/api/orders/user/{userId}'
    #swagger.tags = ["Order"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/Error" }
    }
    */
    authenticate,
    requireAnyRole,
    orderController.getOrdersByUser.bind(orderController));
  
  // Get orders by business ID
  router.get('/business/:businessId',
    /*
    #swagger.path = '/api/orders/business/{businessId}'
    #swagger.tags = ["Order"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/Error" }
    }
    */
    authenticate,
    requireBusinessRole,
    orderController.getOrdersByBusiness.bind(orderController));
  
  // Update order status
  router.patch('/:id/status',
    /*
    #swagger.path = '/api/orders/{id}/status'
    #swagger.tags = ["Order"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: {
        type: "object",
        properties: {
          status: { 
            type: "string",
            enum: ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"],
            example: "confirmed"
          }
        }
      }
    }
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/Error" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/Error" }
    }
    #swagger.responses[404] = {
      description: "Not Found - Order not found",
      schema: { $ref: "#/components/schemas/Error" }
    }
    */
    authenticate,
    requireBusinessRole,
    validateOrderStatus,
    orderController.updateOrderStatus.bind(orderController));
  
  // Add item to order
  router.post('/:orderId/items',
    /*
    #swagger.path = '/api/orders/{orderId}/items'
    #swagger.tags = ["Order"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: {
        type: "object",
        properties: {
          bagId: { type: "integer", example: 1 },
          quantity: { type: "integer", example: 2 }
        }
      }
    }
    #swagger.responses[201]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/Error" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/Error" }
    }
    #swagger.responses[404] = {
      description: "Not Found - Order not found",
      schema: { $ref: "#/components/schemas/Error" }
    }
    */
    authenticate,
    requireClientRole,
    validateAddItem,
    orderController.addItemToOrder.bind(orderController));
  
  // Remove item from order
  router.delete('/:orderId/items/:itemId',
    /*
    #swagger.path = '/api/orders/{orderId}/items/{itemId}'
    #swagger.tags = ["Order"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[204]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/Error" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/Error" }
    }
    #swagger.responses[404] = {
      description: "Not Found - Order or item not found",
      schema: { $ref: "#/components/schemas/Error" }
    }
    */
    authenticate,
    requireClientRole,
    validateRemoveItem,
    orderController.removeItemFromOrder.bind(orderController));
  
  // Update item quantity
  router.patch('/:orderId/items/:itemId/quantity',
    /*
    #swagger.path = '/api/orders/{orderId}/items/{itemId}/quantity'
    #swagger.tags = ["Order"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: {
        type: "object",
        properties: {
          quantity: { type: "integer", example: 3 }
        }
      }
    }
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/Error" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/Error" }
    }
    #swagger.responses[404] = {
      description: "Not Found - Order or item not found",
      schema: { $ref: "#/components/schemas/Error" }
    }
    */
    authenticate,
    requireClientRole,
    validateUpdateItemQuantity,
    orderController.updateItemQuantity.bind(orderController));
  
  // Cancel order
  router.post('/:id/cancel',
    /*
    #swagger.path = '/api/orders/{id}/cancel'
    #swagger.tags = ["Order"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/Error" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/Error" }
    }
    #swagger.responses[404] = {
      description: "Not Found - Order not found",
      schema: { $ref: "#/components/schemas/Error" }
    }
    */    authenticate,
    requireAnyRole,
    validateOrderId,
    orderController.cancelOrder.bind(orderController));

  // Get order history by user (with filters and pagination)
  router.get('/history/user/:userId',
    /*
    #swagger.path = '/api/orders/history/user/{userId}'
    #swagger.tags = ["Order History"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['userId'] = {
      in: 'path',
      description: 'User ID',
      required: true,
      type: 'integer'
    }
    #swagger.parameters['status'] = {
      in: 'query',
      description: 'Filter by order status',
      required: false,
      type: 'string',
      enum: ['pendente', 'confirmado', 'preparando', 'pronto', 'entregue', 'cancelado']
    }
    #swagger.parameters['startDate'] = {
      in: 'query',
      description: 'Filter from date (YYYY-MM-DD)',
      required: false,
      type: 'string'
    }
    #swagger.parameters['endDate'] = {
      in: 'query',
      description: 'Filter to date (YYYY-MM-DD)',
      required: false,
      type: 'string'
    }
    #swagger.parameters['limit'] = {
      in: 'query',
      description: 'Number of orders per page',
      required: false,
      type: 'integer',
      default: 10
    }
    #swagger.parameters['offset'] = {
      in: 'query',
      description: 'Number of orders to skip',
      required: false,
      type: 'integer',
      default: 0
    }
    #swagger.responses[200] = {
      description: "User order history retrieved successfully",
      schema: {
        type: "object",
        properties: {
          orders: { type: "array", items: { $ref: "#/components/schemas/Order" } },
          total: { type: "integer" },
          hasMore: { type: "boolean" }
        }
      }
    }
    */
    authenticate,
    requireAnyRole,
    orderController.getOrderHistoryByUser.bind(orderController));

  // Get order history by business (with filters and pagination)
  router.get('/history/business/:businessId',
    /*
    #swagger.path = '/api/orders/history/business/{businessId}'
    #swagger.tags = ["Order History"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['businessId'] = {
      in: 'path',
      description: 'Business ID',
      required: true,
      type: 'integer'
    }
    #swagger.responses[200] = {
      description: "Business order history retrieved successfully"
    }
    */
    authenticate,
    requireBusinessRole,
    orderController.getOrderHistoryByBusiness.bind(orderController));

  // Get order statistics for user
  router.get('/stats/user/:userId',
    /*
    #swagger.path = '/api/orders/stats/user/{userId}'
    #swagger.tags = ["Order Statistics"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = {
      description: "User order statistics retrieved successfully",
      schema: {
        type: "object",
        properties: {
          total: { type: "integer" },
          byStatus: { type: "object" },
          totalAmount: { type: "number" },
          lastOrderDate: { type: "string" }
        }
      }
    }
    */
    authenticate,
    requireAnyRole,
    orderController.getOrderStatsForUser.bind(orderController));

  // Get order statistics for business
  router.get('/stats/business/:businessId',
    /*
    #swagger.path = '/api/orders/stats/business/{businessId}'
    #swagger.tags = ["Order Statistics"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = {
      description: "Business order statistics retrieved successfully",
      schema: {
        type: "object",
        properties: {
          total: { type: "integer" },
          byStatus: { type: "object" },
          totalRevenue: { type: "number" },
          lastOrderDate: { type: "string" }
        }
      }
    }
    */
    authenticate,
    requireBusinessRole,
    orderController.getOrderStatsForBusiness.bind(orderController));

  // Get orders by status
  router.get('/status/:status',
    /*
    #swagger.path = '/api/orders/status/{status}'
    #swagger.tags = ["Order"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['status'] = {
      in: 'path',
      description: 'Order status',
      required: true,
      type: 'string',
      enum: ['pendente', 'confirmado', 'preparando', 'pronto', 'entregue', 'cancelado']
    }
    #swagger.responses[200] = {
      description: "Orders filtered by status retrieved successfully"
    }
    */
    authenticate,
    requireBusinessRole,
    orderController.getOrdersByStatus.bind(orderController));

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
};