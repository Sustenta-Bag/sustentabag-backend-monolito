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
    */
    authenticate,
    requireAnyRole,
    validateOrderId,
    orderController.cancelOrder.bind(orderController));
}; 