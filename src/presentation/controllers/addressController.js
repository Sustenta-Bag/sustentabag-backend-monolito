class AddressController {
  constructor(addressService) {
    this.addressService = addressService;
  }

  async createAddress(req, res, next) {
    /*
    #swagger.tags = ["Address"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
    required: true,
    schema: { $ref: '#components/schemas/Address' },
    }
    #swagger.responses[201]
    #swagger.responses[401] = {
    description: "Unauthorized - Authentication required or invalid token",
    schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    */
    try {
      const address = await this.addressService.createAddress(req.body);
      return res.ok(address);
    } catch (error) {
      next(error);
    }
  }

  async getAddress(req, res, next) {
    /*
    #swagger.tags = ["Address"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[401] = {
        description: "Unauthorized - Authentication required or invalid token",
        schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[404] = {
        description: "Not Found - Address not found",
        schema: { $ref: "#/components/schemas/NotFoundError" }
    }
    */
    try {
      const address = await this.addressService.getAddress(req.params.id);
      return res.hateoasItem(address);
    } catch (error) {
      next(error);
    }
  }

  async listAddresses(req, res, next) {
    /*
    #swagger.tags = ["Address"]
    #swagger.security = [{ "bearerAuth": [] }]
        #swagger.responses[200]
    #swagger.responses[401] = {
    description: "Unauthorized - Authentication required or invalid token",
    schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    */
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
    /*
    #swagger.tags = ["Address"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: { $ref: '#components/schemas/Address' },
    }
    #swagger.responses[200]
    #swagger.responses[401] = {
        description: "Unauthorized - Authentication required or invalid token",
        schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[403] = {
        description: "Forbidden - Insufficient permissions",
        schema: { $ref: "#/components/schemas/ForbiddenError" }
    }
    #swagger.responses[404] = {
        description: "Not Found - Address not found",
        schema: { $ref: "#/components/schemas/NotFoundError" }
    }
    */
    try {
      const address = await this.addressService.updateAddress(req.params.id, req.body);
      return res.hateoasItem(address);
    } catch (error) {
      next(error);
    }
  }

  async deleteAddress(req, res, next) {
    /*
    #swagger.tags = ["Address"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[204]
    #swagger.responses[401] = {
        description: "Unauthorized - Authentication required or invalid token",
        schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[403] = {
        description: "Forbidden - Insufficient permissions",
        schema: { $ref: "#/components/schemas/ForbiddenError" }
    }
    #swagger.responses[404] = {
        description: "Not Found - Address not found",
        schema: { $ref: "#/components/schemas/NotFoundError" }
    }
    */
    try {
      await this.addressService.deleteAddress(req.params.id);
      return res.no_content();
    } catch (error) {
      next(error);
    }
  }

  async updateAddressStatus(req, res, next) {
    /*
    #swagger.tags = ["Address"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: { $ref: '#components/schemas/UpdateStatus' },
    }
    #swagger.responses[200]
    #swagger.responses[401] = {
        description: "Unauthorized - Authentication required or invalid token",
        schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[403] = {
        description: "Forbidden - Insufficient permissions",
        schema: { $ref: "#/components/schemas/ForbiddenError" }
    }
    #swagger.responses[404] = {
        description: "Not Found - Address not found",
        schema: { $ref: "#/components/schemas/NotFoundError" }
    }
    */
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