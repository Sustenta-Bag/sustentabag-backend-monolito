import express from 'express';
import LocationController from '../../presentation/controllers/LocationController.js';
import LocationService from '../../application/services/LocationService.js';
import PostgresAddressRepository from '../../infrastructure/repositories/PostgresAddressRepository.js';
import PostgresBusinessRepository from '../../infrastructure/repositories/PostgresBusinessRepository.js';
import AddressModel from '../../domain/models/AddressModel.js';
import BusinessModel from '../../domain/models/BusinessModel.js';

export const setupLocationRoutes = (router, { sequelize }) => {
  const addressRepository = new PostgresAddressRepository(AddressModel);
  const businessRepository = new PostgresBusinessRepository(BusinessModel, AddressModel);
  
  const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;
  if (!mapboxToken) {
    console.warn('Warning: MAPBOX_ACCESS_TOKEN not set in environment variables');
  }
  
  const locationService = new LocationService(
    businessRepository,
    addressRepository,
    mapboxToken
  );
  
  const locationController = new LocationController(locationService);

  router.get(
    '/nearby/:addressId',
    (req, res, next) => locationController.findNearbyBusinesses(req, res, next)
  );
  
  router.post(
    '/geocode',
    (req, res, next) => locationController.geocodeAddress(req, res, next)
  );

  return router;
};

export const locationModuleConfig = {
  name: 'location',
  routePrefix: '/api/location',
};
