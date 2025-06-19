import { Router } from 'express';
import LocationController from '../controllers/LocationController.js';
import LocationService from '../../application/services/LocationService.js';
import PostgresAddressRepository from '../../infrastructure/repositories/PostgresAddressRepository.js';
import PostgresBusinessRepository from '../../infrastructure/repositories/PostgresBusinessRepository.js';
import PostgresClientRepository from '../../infrastructure/repositories/PostgresClientRepository.js';
import PostgresBagRepository from '../../infrastructure/repositories/PostgresBagRepository.js';
import {
  authenticate,
  requireClientRole
} from '../middleware/authMiddleware.js';

export default (options = {}) => {
  const addressRepository = options.addressRepository || new PostgresAddressRepository();
  const businessRepository = options.businessRepository || new PostgresBusinessRepository();
  const clientRepository = options.clientRepository || new PostgresClientRepository();
  const bagRepository = options.bagRepository || new PostgresBagRepository();
  const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;

  const locationService = options.locationService || new LocationService(
    businessRepository,
    addressRepository,
    clientRepository,
    mapboxToken
  );
  const locationController = new LocationController(locationService);

  const router = Router();

  router.post('/geocode', locationController.geocodeAddress.bind(locationController));
  router.get('/nearby/client', authenticate, requireClientRole, locationController.findNearbyBusinessesByClient.bind(locationController));
  router.get('/nearby/client/bags', authenticate, requireClientRole, locationController.findNearbyAvailableBagsByClient.bind(locationController));
  router.get('/nearby/:idAddress', locationController.findNearbyBusinesses.bind(locationController));

  return router;
};
