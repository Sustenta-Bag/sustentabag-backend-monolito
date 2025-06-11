import AddressController from '../controllers/addressController.js';
import AddressService from '../../application/services/AddressService.js';
import LocationService from '../../application/services/LocationService.js';
import PostgresAddressRepository from '../../infrastructure/repositories/PostgresAddressRepository.js';
import PostgresBusinessRepository from '../../infrastructure/repositories/PostgresBusinessRepository.js';
import PostgresClientRepository from '../../infrastructure/repositories/PostgresClientRepository.js';
import {
  validateCreateAddress,
  validateUpdateAddress,
  validateAddressId,
} from '../middleware/addressValidation.js';
import { 
  authenticate, 
  requireBusinessRole, 
  requireClientRole, 
  requireAnyRole 
} from '../middleware/authMiddleware.js';

export const setupAddressRoutes = (router, options = {}) => {
  const addressRepository = options.addressRepository || new PostgresAddressRepository();
  const businessRepository = options.businessRepository || new PostgresBusinessRepository();
  const clientRepository = options.clientRepository || new PostgresClientRepository();
  
  const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;
  const locationService = new LocationService(
    businessRepository, 
    addressRepository, 
    clientRepository,
    mapboxToken
  );
  
  const addressService = new AddressService(addressRepository, locationService);
  const addressController = new AddressController(addressService);

  router.post('/',
  /*
  #swagger.path = '/api/addresses'
  #swagger.tags = ["Address"]
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.requestBody = {
    required: true,
    schema: { $ref: '#components/schemas/Address' },
  }
  #swagger.responses[201]
  #swagger.responses[401] = {
    description: "Unauthorized - Authentication required or invalid token",
    schema: { $ref: "#/components/schemas/UnauthorizedError" }
  }
  */
    authenticate,
    requireAnyRole,
    validateCreateAddress,
    addressController.createAddress.bind(addressController)
  );

  router.get('/',
  /*
  #swagger.path = '/api/addresses'
  #swagger.tags = ["Address"]
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.responses[200]
  #swagger.responses[401] = {
    description: "Unauthorized - Authentication required or invalid token",
    schema: { $ref: "#/components/schemas/UnauthorizedError" }
  }
  */
    authenticate,
    requireAnyRole,
    addressController.listAddresses.bind(addressController)
  );

  router.get(
    /*
    #swagger.path = '/api/addresses/{id}'
    #swagger.tags = ["Address"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[404] = {
      description: "Not Found - Address not found",
      schema: { $ref: "#/components/schemas/NotFoundError" }
    }
    */
    `/:id`,
    authenticate,
    requireAnyRole,
    validateAddressId,
    addressController.getAddress.bind(addressController)
  );

  router.put(
    /*
    #swagger.path = '/api/addresses/{id}'
    #swagger.tags = ["Address"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#components/schemas/Address' },
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
      description: "Not Found - Address not found",
      schema: { $ref: "#/components/schemas/NotFoundError" }
    }
    */
    `/:id`,
    authenticate,
    requireAnyRole,
    validateUpdateAddress,
    addressController.updateAddress.bind(addressController)
  );

  router.delete(
    /*
    #swagger.path = '/api/addresses/{id}'
    #swagger.tags = ["Address"]
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
      description: "Not Found - Address not found",
      schema: { $ref: "#/components/schemas/NotFoundError" }
    }
    */
    `/:id`,
    authenticate,
    requireAnyRole,
    validateAddressId,
    addressController.deleteAddress.bind(addressController)
  );

  router.patch(
    /*
    #swagger.path = '/api/addresses/{id}/status'
    #swagger.tags = ["Address"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#components/schemas/UpdateStatus' },
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
      description: "Not Found - Address not found",
      schema: { $ref: "#/components/schemas/NotFoundError" }
    }
    */
    `/:id/status`,
    authenticate,
    requireAnyRole,
    addressController.updateAddressStatus.bind(addressController)
  )
};