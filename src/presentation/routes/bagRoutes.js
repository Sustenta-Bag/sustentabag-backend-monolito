import BagController from '../controllers/BagController.js';
import BagService from '../../application/services/BagService.js';
import PostgresBagRepository from '../../infrastructure/repositories/PostgresBagRepository.js';
import { 
  validateCreateBag, 
  validateUpdateBag, 
  validateBagId, 
  validateStatusUpdate
} from '../middleware/bagValidation.js';
import { 
  authenticate, 
  requireBusinessRole, 
  requireAnyRole 
} from '../middleware/authMiddleware.js';

export const setupBagRoutes = (router, options = {}) => {
  const bagRepository = options.bagRepository || new PostgresBagRepository();
  const favoriteRepository = options.favoriteRepository;
  const authRepository = options.authRepository;
  
  const bagService = options.bagService || new BagService(bagRepository, favoriteRepository, authRepository);
  const bagController = new BagController(bagService);
  
  router.post(`/`,
    /*
    #swagger.path = '/api/bags'
    #swagger.tags = ["Bag"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#components/schemas/Bag' }
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
    requireBusinessRole,
    validateCreateBag, 
    bagController.createBag.bind(bagController));
  
  router.get(`/`,
    /*
    #swagger.path = '/api/bags'
    #swagger.tags = ["Bag"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    */
    authenticate,
    requireAnyRole,
    bagController.getAllBags.bind(bagController));

  router.get('/tags',
    /*
    #swagger.path = '/api/bags/tags'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.tags = ["Bag"]
    #swagger.description = "Retorna a lista de tags permitidas para sacolas"
    #swagger.responses[200] = {
      description: "Lista de tags permitidas",
      schema: {
        type: "array",
        items: {
          type: "string"
        },
        example: ["PODE_CONTER_GLUTEN", "PODE_CONTER_LACTOSE"]
      }
    }
    */
    authenticate,
    requireAnyRole,
    bagController.getAllowedTags.bind(bagController)
  );
  
  router.get(`/:id`,
    /*
    #swagger.path = '/api/bags/{id}'
    #swagger.tags = ["Bag"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[404] = {
      description: "Not Found - Bag not found",
      schema: { $ref: "#/components/schemas/NotFoundError" }
    }
    */
    authenticate,
    requireAnyRole,
    validateBagId, 
    bagController.getBag.bind(bagController));
  
  router.put(`/:id`,
    /*
    #swagger.path = '/api/bags/{id}'
    #swagger.tags = ["Bag"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#components/schemas/Bag' },
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
      description: "Not Found - Bag not found",
      schema: { $ref: "#/components/schemas/NotFoundError" }
    }
    */
    authenticate,
    requireBusinessRole,
    validateUpdateBag, 
    bagController.updateBag.bind(bagController));
  
  router.delete(`/:id`,
    /*
    #swagger.path = '/api/bags/{id}'
    #swagger.tags = ["Bag"]
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
      description: "Not Found - Bag not found",
      schema: { $ref: "#/components/schemas/NotFoundError" }
    }
    */
    authenticate,
    requireBusinessRole,
    validateBagId, 
    bagController.deleteBag.bind(bagController));

  router.patch(`/:id/status`,
    /*
    #swagger.path = '/api/bags/{id}/status'
    #swagger.tags = ["Bag"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#components/schemas/StatusUpdate' }
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
    */
    authenticate,
    requireBusinessRole,
    validateStatusUpdate, 
    bagController.changeBagStatus.bind(bagController));

  return router;
};