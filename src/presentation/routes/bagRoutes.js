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

export const setupBagRoutes = (router, options = {}) => {
  const bagRepository = options.bagRepository || new PostgresBagRepository();
  const bagService = new BagService(bagRepository);
  const bagController = new BagController(bagService);
  
  router.post(`/`,
    /*
    #swagger.path = '/api/bags'
    #swagger.tags = ["Bag"]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#components/schemas/BagInput' },
    }
    #swagger.responses[201]
    */
    validateCreateBag, 
    bagController.createBag.bind(bagController));
  
  router.get(`/`,
    /*
    #swagger.path = '/api/bags'
    #swagger.tags = ["Bag"]
    #swagger.responses[200]
    */
    bagController.getAllBags.bind(bagController));
  
  router.get(`/:id`,
    /*
    #swagger.path = '/api/bags/{id}'
    #swagger.tags = ["Bag"]
    #swagger.responses[200]
    */
    validateBagId, 
    bagController.getBag.bind(bagController));
  
  router.put(`/:id`,
    /*
    #swagger.path = '/api/bags/{id}'
    #swagger.tags = ["Bag"]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#components/schemas/BagInput' },
    }
    #swagger.responses[200]
    */
    validateUpdateBag, 
    bagController.updateBag.bind(bagController));
  
  router.delete(`/:id`,
    /*
    #swagger.path = '/api/bags/{id}'
    #swagger.tags = ["Bag"]
    #swagger.responses[200]
    */
    validateBagId, 
    bagController.deleteBag.bind(bagController));

  router.get(`/:idBusiness`,
    /*
    #swagger.path = '/api/bags/{idBusiness}'
    #swagger.tags = ["Bag"]
    #swagger.responses[200]
    */
    validateBusinessId, 
    bagController.getBagsByBusiness.bind(bagController));

  router.get(`/:idBusiness/active`,
    /*
    #swagger.path = '/api/bags/{idBusiness}/active'
    #swagger.tags = ["Bag"]
    #swagger.responses[200]
    */
    validateBusinessId, 
    bagController.getActiveBagsByBusiness.bind(bagController));

  router.patch(`/:id/status`,
    /*
    #swagger.path = '/api/bags/{id}/status'
    #swagger.tags = ["Bag"]
    */
    validateStatusUpdate, 
    bagController.changeBagStatus.bind(bagController));
};