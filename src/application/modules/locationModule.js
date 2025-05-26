import express from 'express';
import LocationController from '../../presentation/controllers/LocationController.js';
import LocationService from '../../application/services/LocationService.js';
import PostgresAddressRepository from '../../infrastructure/repositories/PostgresAddressRepository.js';
import PostgresBusinessRepository from '../../infrastructure/repositories/PostgresBusinessRepository.js';
import PostgresClientRepository from '../../infrastructure/repositories/PostgresClientRepository.js';
import PostgresBagRepository from '../../infrastructure/repositories/PostgresBagRepository.js';
import AddressModel from '../../domain/models/AddressModel.js';
import BusinessModel from '../../domain/models/BusinessModel.js';
import ClientModel from '../../domain/models/ClientModel.js';
import BagModel from '../../domain/models/BagModel.js';
import { authenticate, requireClientRole } from '../../presentation/middleware/authMiddleware.js';

export const setupLocationRoutes = (router, { sequelize }) => {
  const addressRepository = new PostgresAddressRepository(AddressModel);
  const businessRepository = new PostgresBusinessRepository(BusinessModel, AddressModel);
  const clientRepository = new PostgresClientRepository(ClientModel, AddressModel);
  const bagRepository = new PostgresBagRepository(BagModel);
  
  const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;
  if (!mapboxToken) {
    console.warn('Warning: MAPBOX_ACCESS_TOKEN not set in environment variables');
  }
  
  const locationService = new LocationService(
    businessRepository,
    addressRepository,
    clientRepository,
    mapboxToken
  );
  
  const locationController = new LocationController(locationService);

  router.get(
    '/nearby/client',
    /*
    #swagger.path = '/api/location/nearby/client'
    #swagger.tags = ["Location"]
    #swagger.summary = "Find businesses near the logged-in client's address"
    #swagger.description = "Returns a list of nearby businesses based on the address of the authenticated client."
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['radius'] = {
      in: 'query',
      description: 'Search radius in kilometers',
      required: false,
      type: 'number',
      default: 10
    }
    #swagger.parameters['limit'] = {
      in: 'query',
      description: 'Maximum number of results to return',
      required: false,
      type: 'integer',
      default: 10
    }
    #swagger.responses[200] = {
      description: 'List of nearby businesses',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              count: { type: "integer" },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    name: { type: "string" },
                    legalName: { type: "string" },
                    logo: { type: "string" },
                    distance: { type: "number" },
                    address: {
                      type: "object",
                      properties: {
                        street: { type: "string" },
                        number: { type: "string" },
                        city: { type: "string" },
                        state: { type: "string" },
                        zipCode: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: "Client has no address",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/Error" }
        }
      }
    }
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/Error" }
        }
      }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Access allowed only for clients",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/Error" }
        }
      }
    }
    */
    authenticate,
    requireClientRole,
    (req, res, next) => locationController.findNearbyBusinessesByClient(req, res, next)
  );

  router.get(
    '/nearby/:addressId',
    /*
    #swagger.path = '/api/location/nearby/{addressId}'
    #swagger.tags = ["Location"]
    #swagger.summary = "Find businesses near an address"
    #swagger.description = "Returns a list of nearby businesses based on an address ID"
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['addressId'] = {
      in: 'path',
      description: 'ID of the reference address',
      required: true,
      type: 'integer'
    }
    #swagger.parameters['radius'] = {
      in: 'query',
      description: 'Search radius in kilometers',
      required: false,
      type: 'number',
      default: 10
    }
    #swagger.parameters['limit'] = {
      in: 'query',
      description: 'Maximum number of results to return',
      required: false,
      type: 'integer',
      default: 10
    }
    #swagger.responses[200] = {
      description: 'List of nearby businesses',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              count: {
                type: "integer",
                description: "Total number of businesses found"
              },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "integer",
                      description: "Business ID"
                    },
                    name: {
                      type: "string",
                      description: "Business name"
                    },
                    legalName: {
                      type: "string",
                      description: "Business legal name"
                    },
                    logo: {
                      type: "string",
                      description: "URL to business logo"
                    },
                    distance: {
                      type: "number",
                      description: "Distance in kilometers"
                    },
                    address: {
                      type: "object",
                      properties: {
                        street: { type: "string" },
                        number: { type: "string" },
                        city: { type: "string" },
                        state: { type: "string" },
                        zipCode: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/Error" }
        }
      }
    }
    #swagger.responses[404] = {
      description: "Address not found", 
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/Error" }
        }
      }
    }
    */
    (req, res, next) => locationController.findNearbyBusinesses(req, res, next)
  );
  
  router.post(
    '/geocode',
    /*
    #swagger.path = '/api/location/geocode'
    #swagger.tags = ["Location"]
    #swagger.summary = "Geocode an address"
    #swagger.description = "Convert an address to geographic coordinates"
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              street: { type: "string" },
              number: { type: "string" },
              city: { type: "string" },
              state: { type: "string" },
              zipCode: { type: "string" }
            },
            required: ["street", "number", "city", "state", "zipCode"]
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Successfully geocoded address',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              latitude: { type: "number" },
              longitude: { type: "number" },
              fullAddress: { type: "string" }
            }
          }
        }
      }
    }    #swagger.responses[400] = {
      description: "Invalid address data",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/Error" }
        }
      }
    }
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/Error" }
        }
      }
    }
    #swagger.responses[500] = {
      description: "Server error or geocoding error",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/Error" }
        }
      }
    }
    */
    (req, res, next) => locationController.geocodeAddress(req, res, next)
  );

  router.get(
    '/nearby/client/bags',
    /*
    #swagger.path = '/api/location/nearby/client/bags'
    #swagger.tags = ["Location"]
    #swagger.summary = "Find available bags from businesses near the logged-in client's address"
    #swagger.description = "Returns a list of available bags from nearby businesses based on the address of the authenticated client."
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['radius'] = {
      in: 'query',
      description: 'Search radius in kilometers',
      required: false,
      type: 'number',
      default: 10
    }
    #swagger.parameters['limit'] = {
      in: 'query',
      description: 'Maximum number of bags to return',
      required: false,
      type: 'integer',
      default: 50
    }
    #swagger.responses[200] = {
      description: 'List of available bags from nearby businesses',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              count: { type: "integer" },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    type: { type: "string" },
                    price: { type: "number" },
                    description: { type: "string" },
                    createdAt: { type: "string", format: "date-time" },
                    business: {
                      type: "object",
                      properties: {
                        id: { type: "integer" },
                        name: { type: "string" },
                        legalName: { type: "string" },
                        logo: { type: "string" },
                        distance: { type: "number" },
                        address: {
                          type: "object",
                          properties: {
                            street: { type: "string" },
                            number: { type: "string" },
                            city: { type: "string" },
                            state: { type: "string" },
                            zipCode: { type: "string" }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: "Client has no address",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/Error" }
        }
      }
    }
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/Error" }
        }
      }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Access allowed only for clients",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/Error" }
        }
      }
    }
    */
    authenticate,
    requireClientRole,
    (req, res, next) => {
      req.bagRepository = bagRepository;
      locationController.findNearbyAvailableBagsByClient(req, res, next);
    }
  );

  return router;
};

export const locationModuleConfig = {
  name: 'location',
  routePrefix: '/api/location',
};
