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
}

export default LocationController;
