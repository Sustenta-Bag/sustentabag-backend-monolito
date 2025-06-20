import AppError from '../../infrastructure/errors/AppError.js';

class BusinessController {
    constructor(businessService) {
      this.businessService = businessService;
    }
  
    async createBusiness(req, res, next) {
      /*
      #swagger.tags = ["Business"]
      #swagger.consumes = ['multipart/form-data']
      #swagger.requestBody = {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                legalName: { type: "string", example: "Sustenta Bag LTDA" },
                cnpj: { type: "string", example: "12345678000195" },
                appName: { type: "string", example: "Sustenta Bag - Centro" },
                cellphone: { type: "string", example: "11987654321" },
                description: { type: "string", example: "Empresa especializada em sacolas" },
                openingHours: { type: "string", example: "08:00-18:00" },
                password: { type: "string", example: "senha123" },
                delivery: { type: "boolean", example: true },
                deliveryTax: { type: "number", example: 5.99 },
                develiveryTime: { type: "integer", example: 30 },
                idAddress: { type: "integer", example: 1 },
                logo: { type: "string", format: "binary" }
              },
              required: ["legalName", "cnpj", "appName", "cellphone", "password", "openingHours", "idAddress", "delivery"]
            }
          }
        }
      }
      #swagger.responses[201]
      */
      try {
        await this.businessService.createBusiness(req.body, req.file);
        return res.created();
      } catch (error) {
        next(error);
      }
    }
  
    async getBusiness(req, res, next) {
      /*
      #swagger.tags = ["Business"]
      #swagger.parameters['id'] = { description: 'ID da empresa' }
      #swagger.responses[200]
      #swagger.responses[404] = {
        description: "Empresa não encontrada",
        schema: { $ref: "#/components/schemas/NotFoundError" }
      }
      */
      try {
        let includeAddress = req.query.includeAddress;
        includeAddress = includeAddress === true || includeAddress === 'true' || includeAddress === 1 || includeAddress === '1';
        const business = await this.businessService.getBusiness(req.params.id, includeAddress);
        return res.hateoasItem(business);
      } catch (error) {
        next(error);
      }
    }
  
    async listBusinesses(req, res, next) {
      /*
      #swagger.tags = ["Business"]
      #swagger.responses[200]
      */
      try {
        const { page, limit, onlyActive } = req.query;
        const businesses = await this.businessService.listBusinesses(
          page ? parseInt(page) : 1,
          limit ? parseInt(limit) : 10,
          onlyActive === true || 'true' || 1 ? true : false, 
        );
        return res.hateoasList(businesses.data, businesses.pages);
      } catch (error) {
        next(error);
      }
    }
  
    async updateBusiness(req, res, next) {
      /*
      #swagger.tags = ["Business"]
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.requestBody = {
        required: true,
        schema: { $ref: '#components/schemas/Business' },
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
      */
      try {
        checkBusinessOwnership(req.params.id, req.user.entityId);
        const business = await this.businessService.updateBusiness(req.params.id, req.body, req.file);
        return res.ok(business);
      } catch (error) {
        next(error);
      }
    }
  
    async deleteBusiness(req, res, next) {
      /*
      #swagger.tags = ["Business"]
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.responses[200]
      #swagger.responses[401] = {
        description: "Unauthorized - Authentication required or invalid token",
        schema: { $ref: "#/components/schemas/UnauthorizedError" }
      }
      #swagger.responses[403] = {
        description: "Forbidden - Insufficient permissions",
        schema: { $ref: "#/components/schemas/ForbiddenError" }
      }
      */
      try {
        checkBusinessOwnership(req.params.id, req.user.entityId);
        await this.businessService.deleteBusiness(req.params.id);
        return res.no_content();
      } catch (error) {
        next(error);
      }
    }
  
    async changeBusinessStatus(req, res, next) {
      /*
      #swagger.tags = ["Business"]
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
      */
      try {
        if (req.body.status === undefined) {
          throw new AppError('Status não fornecido', 'MISSING_STATUS');
        }
        checkBusinessOwnership(req.params.id, req.user.entityId);
        const status = req.body.status === true || req.body.status === 'true' || req.body.status === 1 ? true : false;
        const business = await this.businessService.changeBusinessStatus(req.params.id, status);
        return res.ok(business);
      } catch (error) {
        next(error);
      }
    }
}

function checkBusinessOwnership(idParam, idUser) {
  if (idUser !== parseInt(idParam)) {
    throw new AppError('Você não tem permissão para alterar o status desta empresa', 'FORBIDDEN');
  }
}

export default BusinessController;