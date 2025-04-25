import AddressController from '../controllers/AddressController.js';
import AddressService from '../../application/services/AddressService.js';
import PostgresAddressRepository from '../../infrastructure/repositories/PostgresAddressRepository.js';
import {
  validateCreateAddress,
  validateUpdateAddress,
  validateAddressId,
} from '../middleware/addressValidation.js';

export const setupAddressRoutes = (router, options = {}) => {
  const addressRepository = options.addressRepository || new PostgresAddressRepository();
  const addressService = new AddressService(addressRepository);
  const addressController = new AddressController(addressService);

  router.post('/',
  /*
  #swagger.path = '/api/addresses'
  #swagger.tags = ["Address"]
  #swagger.requestBody = {
    required: true,
    schema: { $ref: '#components/schemas/AddressInput' },
  }
  #swagger.responses[201]
  */
    validateCreateAddress,
    addressController.createAddress.bind(addressController)
  );

  router.get('/',
  /*
  #swagger.path = '/api/addresses'
  #swagger.tags = ["Address"]
  #swagger.responses[200]
  */
    // authenticate,
    addressController.listAddresses.bind(addressController)
  );

  router.get(
    /*
    #swagger.path = '/api/addresses/{id}'
    #swagger.tags = ["Address"]
    #swagger.responses[200]
    */
    `/:id`,
    validateAddressId,
    addressController.getAddress.bind(addressController)
  );

  router.put(
    /*
    #swagger.path = '/api/addresses/{id}'
    #swagger.tags = ["Address"]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#components/schemas/AddressInput' },
    }
    #swagger.responses[200]
    */
    `/:id`,
    validateUpdateAddress,
    addressController.updateAddress.bind(addressController)
  );

  router.delete(
    /*
    #swagger.path = '/api/addresses/{id}'
    #swagger.tags = ["Address"]
    #swagger.responses[204]
    */
    `/:id`,
    validateAddressId,
    addressController.deleteAddress.bind(addressController)
  );
};