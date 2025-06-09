import multer from 'multer';
import { multerConfig } from '../../config/multer.js';
import { DiskStorage } from '../../infrastructure/storage/diskStorage.js';

import BusinessController from '../controllers/businessController.js';
import BusinessService from '../../application/services/BusinessService.js';
import PostgresBusinessRepository from '../../infrastructure/repositories/PostgresBusinessRepository.js';
import PostgresAddressRepository from '../../infrastructure/repositories/PostgresAddressRepository.js';
import {
  validateCreateBusiness,
  validateUpdateBusiness,
  validateBusinessId,
  validateStatusUpdate,
} from '../middleware/businessValidation.js';
import { 
  authenticate, 
  requireBusinessRole,
} from '../middleware/authMiddleware.js';

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
            openingHours: { type: "string", example: "08:00-18:00" },
            password: { type: "string", example: "senha123" },
            delivery: { type: "boolean", example: true },
            deliveryTax: { type: "number", example: 5.99 },
            develiveryTime: { type: "integer", example: 30 },
            idAddress: { type: "integer", example: 1 },
            logo: { type: "string", format: "binary" }
          },
          required: ["legalName", "cnpj", "appName", "cellphone", "password", "openingHours", "idAddress", "delivery"]
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
    #swagger.parameters['id'] = { description: 'ID da empresa' }
    #swagger.responses[200]
    #swagger.responses[404] = {
      description: "Empresa não encontrada",
      schema: { $ref: "#/components/schemas/Error" }
    }
    */
    validateBusinessId,
    businessController.getBusiness.bind(businessController)
  );

  router.put(`/:id`,
    /*
    #swagger.path = '/api/businesses/{id}'
    #swagger.tags = ["Business"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#components/schemas/BusinessInput' },
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
    upload.single('logo'),
    validateBusinessId,
    validateUpdateBusiness,
    businessController.updateBusiness.bind(businessController)
  );

  router.delete(`/:id`,
    /*
    #swagger.path = '/api/businesses/{id}'
    #swagger.tags = ["Business"]
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
    validateBusinessId,
    businessController.deleteBusiness.bind(businessController)
  );

  router.patch(
    `/:id/status`,
    /*
    #swagger.path = '/api/businesses/{id}/status'
    #swagger.tags = ["Business"]
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
    validateBusinessId,
    validateStatusUpdate,
    businessController.changeBusinessStatus.bind(businessController)
  );
};