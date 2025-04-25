import AppError from '../../infrastructure/errors/AppError.js';

class BusinessController {
    constructor(businessService) {
      this.businessService = businessService;
    }
  
    async createBusiness(req, res, next) {
      try {
        const business = await this.businessService.createBusiness(req.body);
        return res.status(201).json(business);
      } catch (error) {
        next(error);
      }
    }
  
    async getBusiness(req, res, next) {
      try {
        const includeAddress = req.query.includeAddress === 'true';
        const business = await this.businessService.getBusiness(req.params.id, { includeAddress });
        return res.json(business);
      } catch (error) {
        next(error);
      }
    }
  
    async listBusinesses(req, res, next) {
      try {
        const { page, limit, onlyActive } = req.query;
        const businesses = await this.businessService.listBusinesses({
          page: page ? parseInt(page) : 1,
          limit: limit ? parseInt(limit) : 10,
          onlyActive: onlyActive === 'true'
        });
        return res.json(businesses);
      } catch (error) {
        next(error);
      }
    }
  
    async updateBusiness(req, res, next) {
      try {
        const business = await this.businessService.updateBusiness(req.params.id, req.body);
        return res.json(business);
      } catch (error) {
        next(error);
      }
    }
  
    async deleteBusiness(req, res, next) {
      try {
        await this.businessService.deleteBusiness(req.params.id);
        return res.status(204).send();
      } catch (error) {
        next(error);
      }
    }
  
    async getActiveBusiness(req, res, next) {
      try {
        const businesses = await this.businessService.getActiveBusiness();
        return res.json(businesses);
      } catch (error) {
        next(error);
      }
    }
  
    async changeBusinessStatus(req, res, next) {
      try {
        if (req.body.status === undefined) {
          throw new AppError('Status não fornecido', 'MISSING_STATUS');
        }
        const business = await this.businessService.changeBusinessStatus(req.params.id, req.body.status);
        return res.json(business);
      } catch (error) {
        next(error);
      }
    }
  
    async authenticateBusiness(req, res, next) {
      try {
        const { cnpj, password } = req.body;
        if (!cnpj || !password) {
          throw new AppError('CNPJ e senha são obrigatórios', 'MISSING_CREDENTIALS');
        }
        const business = await this.businessService.authenticateBusiness(cnpj, password);
        return res.json(business);
      } catch (error) {
        next(error);
      }
    }
  
    async changePassword(req, res, next) {
      try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
          throw new AppError('Senha atual e nova senha são obrigatórias', 'MISSING_PASSWORD');
        }
        await this.businessService.changePassword(req.params.id, currentPassword, newPassword);
        return res.status(204).send();
      } catch (error) {
        next(error);
      }
    }
}

export default BusinessController;