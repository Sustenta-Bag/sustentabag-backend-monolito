import AddressController from '../controllers/AddressController.js';
import AddressService from '../../application/services/AddressService.js';
import LocationService from '../../application/services/LocationService.js';
import PostgresAddressRepository from '../../infrastructure/repositories/PostgresAddressRepository.js';
import PostgresBusinessRepository from '../../infrastructure/repositories/PostgresBusinessRepository.js';
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
  
  // Create location service with Mapbox token if available
  const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;
  let locationService = null;
  if (mapboxToken) {
    locationService = new LocationService(businessRepository, addressRepository, mapboxToken);
  }
  
  const addressService = new AddressService(addressRepository, locationService);
  const addressController = new AddressController(addressService);

  router.post('/',
  /*
  #swagger.path = '/api/addresses'
  #swagger.tags = ["Address"]
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.requestBody = {
    required: true,
    schema: { $ref: '#components/schemas/AddressInput' },
  }
  #swagger.responses[201]
  #swagger.responses[401] = {
    description: "Unauthorized - Authentication required or invalid token",
    schema: { $ref: "#/components/schemas/Error" }
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
    schema: { $ref: "#/components/schemas/Error" }
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
      schema: { $ref: "#/components/schemas/Error" }
    }
    #swagger.responses[404] = {
      description: "Not Found - Address not found",
      schema: { $ref: "#/components/schemas/Error" }
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
      schema: { $ref: '#components/schemas/AddressInput' },
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
      description: "Not Found - Address not found",
      schema: { $ref: "#/components/schemas/Error" }
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
      schema: { $ref: "#/components/schemas/Error" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/Error" }
    }
    #swagger.responses[404] = {
      description: "Not Found - Address not found",
      schema: { $ref: "#/components/schemas/Error" }
    }
    */
    `/:id`,
    authenticate,
    requireAnyRole,
    validateAddressId,
    addressController.deleteAddress.bind(addressController)
  );
};