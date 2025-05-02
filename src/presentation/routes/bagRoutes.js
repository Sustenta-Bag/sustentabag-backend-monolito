import BagController from '../controllers/BagController.js';
import BagService from '../../application/services/BagService.js';
import PostgresBagRepository from '../../infrastructure/repositories/PostgresBagRepository.js';
import { 
  validateCreateBag, 
  validateUpdateBag, 
  validateBagId, 
  validateBusinessId,
  validateStatusUpdate
} from '../middleware/bagValidation.js';
import { 
  authenticate, 
  requireBusinessRole, 
  requireClientRole, 
  requireAnyRole 
} from '../middleware/authMiddleware.js';

export const setupBagRoutes = (router, options = {}) => {
  const bagRepository = options.bagRepository || new PostgresBagRepository();
  const bagService = new BagService(bagRepository);
  const bagController = new BagController(bagService);
  
  // Create bag - Business only
  router.post(`/`,
    /*
    #swagger.path = '/api/bags'
    #swagger.tags = ["Bag"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#components/schemas/BagInput' },
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
    requireBusinessRole,
    validateCreateBag, 
    bagController.createBag.bind(bagController));
  
  // Get all bags - Any authenticated user
  router.get(`/`,
    /*
    #swagger.path = '/api/bags'
    #swagger.tags = ["Bag"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/Error" }
    }
    */
    authenticate,
    requireAnyRole,
    bagController.getAllBags.bind(bagController));
  
  // Get bag by ID - Any authenticated user
  router.get(`/:id`,
    /*
    #swagger.path = '/api/bags/{id}'
    #swagger.tags = ["Bag"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/Error" }
    }
    #swagger.responses[404] = {
      description: "Not Found - Bag not found",
      schema: { $ref: "#/components/schemas/Error" }
    }
    */
    authenticate,
    requireAnyRole,
    validateBagId, 
    bagController.getBag.bind(bagController));
  
  // Update bag - Business only
  router.put(`/:id`,
    /*
    #swagger.path = '/api/bags/{id}'
    #swagger.tags = ["Bag"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#components/schemas/BagInput' },
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
      description: "Not Found - Bag not found",
      schema: { $ref: "#/components/schemas/Error" }
    }
    */
    authenticate,
    requireBusinessRole,
    validateUpdateBag, 
    bagController.updateBag.bind(bagController));
  
  // Delete bag - Business only
  router.delete(`/:id`,
    /*
    #swagger.path = '/api/bags/{id}'
    #swagger.tags = ["Bag"]
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
      description: "Not Found - Bag not found",
      schema: { $ref: "#/components/schemas/Error" }
    }
    */
    authenticate,
    requireBusinessRole,
    validateBagId, 
    bagController.deleteBag.bind(bagController));

  // Get bags by business ID - Any authenticated user
  router.get(`/business/:idBusiness`,
    /*
    #swagger.path = '/api/bags/business/{idBusiness}'
    #swagger.tags = ["Bag"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/Error" }
    }
    */
    authenticate,
    requireAnyRole,
    validateBusinessId, 
    bagController.getBagsByBusiness.bind(bagController));

  // Get active bags by business ID - Any authenticated user
  router.get(`/business/:idBusiness/active`,
    /*
    #swagger.path = '/api/bags/business/{idBusiness}/active'
    #swagger.tags = ["Bag"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/Error" }
    }
    */
    authenticate,
    requireAnyRole,
    validateBusinessId, 
    bagController.getActiveBagsByBusiness.bind(bagController));

  // Change bag status - Business only
  router.patch(`/:id/status`,
    /*
    #swagger.path = '/api/bags/{id}/status'
    #swagger.tags = ["Bag"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "integer",
                enum: [0, 1],
                description: "0 for inactive, 1 for active"
              }
            },
            required: ["status"]
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
    */
    authenticate,
    requireBusinessRole,
    validateStatusUpdate, 
    bagController.changeBagStatus.bind(bagController));
};