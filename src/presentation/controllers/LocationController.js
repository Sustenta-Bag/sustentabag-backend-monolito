class LocationController {
  constructor(locationService) {
    this.locationService = locationService;
  }

  async findNearbyBusinesses(req, res, next) {
    try {
      const { addressId } = req.params;
      const { radius, limit } = req.query;

      const options = {
        radius: radius ? parseFloat(radius) : 10,
        limit: limit ? parseInt(limit) : 10
      };

      const businesses = await this.locationService.findNearbyBusinesses(
        parseInt(addressId),
        options
      );

      return res.json({
        count: businesses.length,
        data: businesses.map(business => ({
          id: business.id,
          name: business.appName,
          legalName: business.legalName,
          logo: business.logo,
          distance: parseFloat(business.distance.toFixed(2)),
          address: business.address ? {
            street: business.address.street,
            number: business.address.number,
            city: business.address.city,
            state: business.address.state,
            zipCode: business.address.zipCode
          } : null
        }))
      });
    } catch (error) {
      next(error);
    }
  }

  async findNearbyBusinessesByClient(req, res, next) {
    console.log('Entrou em findNearbyBusinessesByClient no LocationController');
    try {
      const { radius, limit } = req.query;
      const clientId = req.user.entityId;

      if (!clientId) {
        throw new AppError('ID do cliente não encontrado no token', 'CLIENT_ID_NOT_FOUND', 401);
      }

      if (req.user.role !== 'client') {
        throw new AppError('Acesso permitido apenas para clientes', 'ACCESS_DENIED', 403);
      }

      const options = {
        radius: radius ? parseFloat(radius) : 10,
        limit: limit ? parseInt(limit) : 10
      };

      const businesses = await this.locationService.findNearbyBusinessesByClient(
        clientId,
        options
      );

      return res.json({
        count: businesses.length,
        data: businesses.map(business => ({
          id: business.id,
          name: business.appName,
          legalName: business.legalName,
          logo: business.logo,
          distance: parseFloat(business.distance.toFixed(2)),
          address: business.address ? {
            street: business.address.street,
            number: business.address.number,
            city: business.address.city,
            state: business.address.state,
            zipCode: business.address.zipCode
          } : null
        }))
      });
    } catch (error) {
      next(error);
    }
  }

  async geocodeAddress(req, res, next) {
    try {
      const address = req.body;
      
      const processedAddress = await this.locationService.processAddress(address);
      
      return res.json({
        latitude: processedAddress.latitude,
        longitude: processedAddress.longitude,
        fullAddress: `${processedAddress.street}, ${processedAddress.number}, ${processedAddress.city}, ${processedAddress.state}, ${processedAddress.zipCode}`
      });
    } catch (error) {
      next(error);
    }
  }

  async findNearbyAvailableBagsByClient(req, res, next) {
    console.log('Entrou em findNearbyAvailableBagsByClient no LocationController');
    try {
      const { radius, limit } = req.query;
      const clientId = req.user.entityId;

      if (!clientId) {
        throw new AppError('ID do cliente não encontrado no token', 'CLIENT_ID_NOT_FOUND', 401);
      }

      if (req.user.role !== 'client') {
        throw new AppError('Acesso permitido apenas para clientes', 'ACCESS_DENIED', 403);
      }

      const options = {
        radius: radius ? parseFloat(radius) : 10,
        limit: limit ? parseInt(limit) : 50
      };

      const bags = await this.locationService.findNearbyAvailableBagsByClient(
        clientId,
        req.bagRepository,
        options
      );

      return res.json({
        count: bags.length,
        data: bags.map(bag => ({
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
            address: bag.business.address ? {
              street: bag.business.address.street,
              number: bag.business.address.number,
              city: bag.business.address.city,
              state: bag.business.address.state,
              zipCode: bag.business.address.zipCode
            } : null
          }
        }))
      });
    } catch (error) {
      next(error);
    }
  }
}

export default LocationController;
