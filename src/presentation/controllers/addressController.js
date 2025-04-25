class AddressController {
  constructor(addressService) {
    this.addressService = addressService;
  }

  async createAddress(req, res, next) {
    try {
      const address = await this.addressService.createAddress(req.body);
      return res.status(201).json(address);
    } catch (error) {
      next(error);
    }
  }

  async getAddress(req, res, next) {
    try {
      const address = await this.addressService.getAddress(req.params.id);
      return res.json(address);
    } catch (error) {
      next(error);
    }
  }

  async listAddresses(req, res, next) {
    try {
      const addresses = await this.addressService.listAddresses(req.query);
      return res.json(addresses);
    } catch (error) {
      next(error);
    }
  }

  async updateAddress(req, res, next) {
    try {
      const address = await this.addressService.updateAddress(req.params.id, req.body);
      return res.json(address);
    } catch (error) {
      next(error);
    }
  }

  async deleteAddress(req, res, next) {
    try {
      await this.addressService.deleteAddress(req.params.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default AddressController;