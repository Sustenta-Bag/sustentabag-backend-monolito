import multer from 'multer';
import { multerConfig } from '../../config/multer.js';
import { DiskStorage } from '../../infrastructure/storage/diskStorage.js';

import BusinessController from '../controllers/BusinessController.js';
import BusinessService from '../../application/services/BusinessService.js';
import PostgresBusinessRepository from '../../infrastructure/repositories/PostgresBusinessRepository.js';
import PostgresAddressRepository from '../../infrastructure/repositories/PostgresAddressRepository.js';
import {
  validateCreateBusiness,
  validateUpdateBusiness,
  validateBusinessId,
  validateStatusUpdate,
} from '../middleware/businessValidation.js';

const upload = multer(multerConfig);

export const setupBusinessRoutes = (router, options = {}) => {
  const businessRepository = options.businessRepository || new PostgresBusinessRepository();
  const addressRepository = options.addressRepository || new PostgresAddressRepository();
  const diskStorage = options.diskStorage || new DiskStorage();
  const businessService = new BusinessService(businessRepository, addressRepository, diskStorage);
  const businessController = new BusinessController(businessService);

  router.post(`/`,
/*
  #swagger.path = '/api/businesses'
  #swagger.tags = ["Business"]
  #swagger.consumes = ['multipart/form-data']
  #swagger.requestBody = {
    required: true,
    content: {
      "multipart/form-data": {
        schema: {
          type: "object",
          properties: {
            legalName: { type: "string", example: "Sustenta Bag LTDA" },
            cnpj: { type: "string", example: "12345678000195" },
            appName: { type: "string", example: "Sustenta Bag - Centro" },
            cellphone: { type: "string", example: "11987654321" },
            description: { type: "string", example: "Empresa especializada em sacolas" },
            password: { type: "string", example: "senha123" },
            delivery: { type: "boolean", example: true },
            deliveryTax: { type: "number", example: 5.99 },
            idAddress: { type: "integer", example: 1 },
            logo: { type: "string", format: "binary" }
          },
          required: ["legalName", "cnpj", "appName", "cellphone", "password"]
        }
      }
    }
  }
  #swagger.responses[201]
*/
   upload.single('logo'),
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
    upload.single('logo'),
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