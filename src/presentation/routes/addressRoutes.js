import { Router } from 'express';
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

export default (options = {}) => {
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

  const router = Router();

  router.post('/', validateCreateAddress, addressController.createAddress.bind(addressController));
  router.get('/', addressController.listAddresses.bind(addressController));
  router.get(`/:id`, validateAddressId, addressController.getAddress.bind(addressController));
  router.put(`/:id`, validateUpdateAddress, addressController.updateAddress.bind(addressController));
  router.delete(`/:id`, validateAddressId, addressController.deleteAddress.bind(addressController));
  router.patch(`/:id/status`, addressController.updateAddressStatus.bind(addressController));

  return router;
};