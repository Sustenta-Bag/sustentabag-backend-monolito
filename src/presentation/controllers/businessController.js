import AppError from '../../infrastructure/errors/AppError.js';

class BusinessController {
    constructor(businessService) {
      this.businessService = businessService;
    }
  
    async createBusiness(req, res, next) {
      try {
        await this.businessService.createBusiness(req.body, req.file);
        return res.created();
      } catch (error) {
        next(error);
      }
    }
  
    async getBusiness(req, res, next) {
      try {
        let includeAddress = req.query.includeAddress;
        includeAddress === true || 'true' ? includeAddress = true : includeAddress = false;
        const business = await this.businessService.getBusiness(req.params.id, includeAddress);
        return res.hateoasItem(business);
      } catch (error) {
        next(error);
      }
    }
  
    async listBusinesses(req, res, next) {
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
      try {
        checkBusinessOwnership(req.params.id, req.user.entityId);
        const business = await this.businessService.updateBusiness(req.params.id, req.body, req.file);
        return res.ok(business);
      } catch (error) {
        next(error);
      }
    }
  
    async deleteBusiness(req, res, next) {
      try {
        checkBusinessOwnership(req.params.id, req.user.entityId);
        await this.businessService.deleteBusiness(req.params.id);
        return res.no_content();
      } catch (error) {
        next(error);
      }
    }
  
    async changeBusinessStatus(req, res, next) {
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