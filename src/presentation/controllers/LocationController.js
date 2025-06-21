import AppError from "../../infrastructure/errors/AppError.js";

class LocationController {
  constructor(locationService, bagRepository) {
    this.locationService = locationService;
    this.bagRepository = bagRepository;
  }

  async findNearbyBusinesses(req, res, next) {
    /*
    #swagger.tags = ["Location"]
    #swagger.summary = "Find businesses near an address"
    #swagger.description = "Returns a list of nearby businesses based on an address ID"
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/UnauthorizedError" }
        }
      }
    }
    #swagger.responses[404] = {
      description: "Address not found", 
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/NotFoundError" }
        }
      }
    }
    */
    try {
      const { idAddress } = req.params;
      const { radius, limit } = req.query;

      const options = {
        radius: radius ? parseFloat(radius) : 10,
        limit: limit ? parseInt(limit) : 10,
      };

      const businesses = await this.locationService.findNearbyBusinesses(
        parseInt(idAddress),
        options
      );

      return res.ok({
        count: businesses.length,
        data: businesses.map((business) => ({
          id: business.id,
          name: business.appName,
          legalName: business.legalName,
          logo: business.logo,
          distance: parseFloat(business.distance.toFixed(2)),
          address: business.address
            ? {
                street: business.address.street,
                number: business.address.number,
                city: business.address.city,
                state: business.address.state,
                zipCode: business.address.zipCode,
              }
            : null,
        })),
      });
    } catch (error) {
      next(error);
    }
  }

  async findNearbyBusinessesByClient(req, res, next) {
    /*
    #swagger.tags = ["Location"]
    #swagger.summary = "Find businesses near the logged-in client's address"
    #swagger.description = "Returns a list of nearby businesses based on the address of the authenticated client."
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[400] = {
      description: "Client has no address",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/NotFoundError" }
        }
      }
    }
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/UnauthorizedError" }
        }
      }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Access allowed only for clients",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ForbiddenError" }
        }
      }
    }
    */
    console.log("Entrou em findNearbyBusinessesByClient no LocationController");
    try {
      const { radius, limit } = req.query;
      const clientId = req.user.entityId;

      if (!clientId) {
        throw new AppError(
          "ID do cliente não encontrado no token",
          "CLIENT_ID_NOT_FOUND",
          401
        );
      }

      if (req.user.role !== "client") {
        throw new AppError(
          "Acesso permitido apenas para clientes",
          "ACCESS_DENIED",
          403
        );
      }

      const options = {
        radius: radius ? parseFloat(radius) : 10,
        limit: limit ? parseInt(limit) : 10,
      };

      const businesses =
        await this.locationService.findNearbyBusinessesByClient(
          clientId,
          options
        );

      return res.ok({
        count: businesses.length,
        data: businesses.map((business) => ({
          id: business.id,
          name: business.appName,
          legalName: business.legalName,
          logo: business.logo,
          distance: parseFloat(business.distance.toFixed(2)),
          address: business.address
            ? {
                street: business.address.street,
                number: business.address.number,
                city: business.address.city,
                state: business.address.state,
                zipCode: business.address.zipCode,
              }
            : null,
        })),
      });
    } catch (error) {
      next(error);
    }
  }

  async geocodeAddress(req, res, next) {
    /*
    #swagger.tags = ["Location"]
    #swagger.summary = "Geocode an address"
    #swagger.description = "Convert an address to geographic coordinates"
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: "#/components/schemas/Address" }
    }
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/UnauthorizedError" }
        }
      }
    }
    */
    try {
      const address = req.body;

      const processedAddress = await this.locationService.processAddress(
        address
      );

      return res.ok({
        latitude: processedAddress.latitude,
        longitude: processedAddress.longitude,
        fullAddress: `${processedAddress.street}, ${processedAddress.number}, ${processedAddress.city}, ${processedAddress.state}, ${processedAddress.zipCode}`,
      });
    } catch (error) {
      next(error);
    }
  }

  async findNearbyAvailableBagsByClient(req, res, next) {
    /*
    #swagger.tags = ["Location"]
    #swagger.summary = "Find available bags from businesses near the logged-in client's address"
    #swagger.description = "Returns a list of available bags from nearby businesses based on the address of the authenticated client."
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/UnauthorizedError" }
        }
      }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Access allowed only for clients",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ForbiddenError" }
        }
      }
    }
    */
    try {
      const { radius, limit } = req.query;
      const clientId = req.user.entityId;

      if (!clientId) {
        throw new AppError(
          "ID do cliente não encontrado no token",
          "CLIENT_ID_NOT_FOUND",
          401
        );
      }

      if (req.user.role !== "client") {
        throw new AppError(
          "Acesso permitido apenas para clientes",
          "ACCESS_DENIED",
          403
        );
      }
      const options = {
        radius: radius ? parseFloat(radius) : 10,
        limit: limit ? parseInt(limit) : 50,
      };

      const bags = await this.locationService.findNearbyAvailableBagsByClient(
        clientId,
        this.bagRepository,
        options
      );

      return res.ok({
        count: bags.length,
        data: bags.map((bag) => ({
          id: bag.id,
          type: bag.type,
          price: bag.price,
          description: bag.description,
          createdAt: bag.createdAt,
          business: {
            id: bag.business.id,
            name: bag.business.name,
            legalName: bag.business.legalName,
            logo: bag.business.logo,
            distance: parseFloat(bag.business.distance.toFixed(2)),
            address: bag.business.address
              ? {
                  street: bag.business.address.street,
                  number: bag.business.address.number,
                  city: bag.business.address.city,
                  state: bag.business.address.state,
                  zipCode: bag.business.address.zipCode,
                }
              : null,
          },
        })),
      });
    } catch (error) {
      next(error);
    }
  }
}

export default LocationController;
