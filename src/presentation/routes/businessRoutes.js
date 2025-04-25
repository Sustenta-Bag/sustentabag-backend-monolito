import BusinessController from '../controllers/BusinessController.js';
import BusinessService from '../../application/services/BusinessService.js';
import PostgresBusinessRepository from '../../infrastructure/repositories/PostgresBusinessRepository.js';
import PostgresAddressRepository from '../../infrastructure/repositories/PostgresAddressRepository.js';
import {
  validateCreateBusiness,
  validateUpdateBusiness,
  validateBusinessId,
  validateStatusUpdate,
  validateAuthenticateBusiness
} from '../middleware/businessValidation.js';

export const setupBusinessRoutes = (router, options = {}) => {
  const businessRepository = options.businessRepository || new PostgresBusinessRepository();
  const addressRepository = options.addressRepository || new PostgresAddressRepository();
  const businessService = new BusinessService(businessRepository, addressRepository);
  const businessController = new BusinessController(businessService);

  router.post(`/`,
    /*
    #swagger.path = '/api/businesses'
    #swagger.tags = ["Business"]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#components/schemas/BusinessInput' },
    }
    #swagger.responses[201]
    */
    validateCreateBusiness,
    businessController.createBusiness.bind(businessController)
  );

  router.get(`/`,
    /*
    #swagger.path = '/api/businesses'
    #swagger.tags = ["Business"]
    #swagger.responses[200]
    */
    businessController.listBusinesses.bind(businessController)
  );

  router.get(`/:id`,
    /*
    #swagger.path = '/api/businesses/{id}'
    #swagger.tags = ["Business"]
    #swagger.responses[200]
    */
    validateBusinessId,
    businessController.getBusiness.bind(businessController)
  );

  router.put(`/:id`,
    /*
    #swagger.path = '/api/businesses/{id}'
    #swagger.tags = ["Business"]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#components/schemas/BusinessInput' },
    }
    #swagger.responses[200]
    */
    validateBusinessId,
    validateUpdateBusiness,
    businessController.updateBusiness.bind(businessController)
  );

  router.delete(`/:id`,
    /*
    #swagger.path = '/api/businesses/{id}'
    #swagger.tags = ["Business"]
    #swagger.responses[200]
    */
    validateBusinessId,
    businessController.deleteBusiness.bind(businessController)
  );

  router.get(`/active`,
    /*
    #swagger.path = '/api/businesses/active'
    #swagger.tags = ["Business"]
    #swagger.responses[200]
    */
    businessController.getActiveBusiness.bind(businessController)
  );

  router.patch(
    `/:id/status`,
    /*
    #swagger.path = '/api/businesses/{id}/status'
    #swagger.tags = ["Business"]
    #swagger.responses[200]
    */
    validateBusinessId,
    validateStatusUpdate,
    businessController.changeBusinessStatus.bind(businessController)
  );
};