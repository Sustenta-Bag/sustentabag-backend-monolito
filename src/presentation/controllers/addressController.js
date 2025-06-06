class AddressController {
  constructor(addressService) {
    this.addressService = addressService;
  }

  async createAddress(req, res, next) {
    try {
      const address = await this.addressService.createAddress(req.body);
      return res.ok(address);
    } catch (error) {
      next(error);
    }
  }

  async getAddress(req, res, next) {
    try {
      const address = await this.addressService.getAddress(req.params.id);
      return res.hateoasItem(address);
    } catch (error) {
      next(error);
    }
  }

  async listAddresses(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const filters = {
        city: req.query.city || '',
        state: req.query.state || '',
        zipCode: req.query.zipCode || ''
      }
      const addresses = await this.addressService.listAddresses(page, limit, filters);
      const totalPages = addresses.pages
      return res.hateoasList(addresses.data, totalPages);
    } catch (error) {
      next(error);
    }
  }

  async updateAddress(req, res, next) {
    try {
      const address = await this.addressService.updateAddress(req.params.id, req.body);
      return res.hateoasItem(address);
    } catch (error) {
      next(error);
    }
  }

  async deleteAddress(req, res, next) {
    try {
      await this.addressService.deleteAddress(req.params.id);
      return res.no_content();
    } catch (error) {
      next(error);
    }
  }

  async updateAddressStatus(req, res, next) {
    try {
      const { id } = req.params;
      let { status } = req.body;

      status === false ? status = 0 : status = 1;

      const address = await this.addressService.updateAddressStatus(id, status);
      return res.hateoasItem(address);
    } catch (error) {
      next(error);
    }
  }
}

export default AddressController;