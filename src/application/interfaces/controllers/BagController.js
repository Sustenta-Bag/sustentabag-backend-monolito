const AppError = require('../../../infrastructure/errors/AppError');

class BagController {
  constructor(bagService) {
    this.bagService = bagService;
  }

  async createBag(req, res, next) {
    try {
      const bag = await this.bagService.createBag(req.body);
      return res.status(201).json(bag);
    } catch (error) {
      next(error);
    }
  }

  async getBag(req, res, next) {
    try {
      const bag = await this.bagService.getBag(req.params.id);
      return res.json(bag);
    } catch (error) {
      next(error);
    }
  }

  async getAllBags(req, res, next) {
    try {
      const bags = await this.bagService.getAllBags();
      return res.json(bags);
    } catch (error) {
      next(error);
    }
  }

  async updateBag(req, res, next) {
    try {
      const bag = await this.bagService.updateBag(req.params.id, req.body);
      return res.json(bag);
    } catch (error) {
      next(error);
    }
  }

  async deleteBag(req, res, next) {
    try {
      await this.bagService.deleteBag(req.params.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getBagsByCompany(req, res, next) {
    try {
      const bags = await this.bagService.getBagsByCompanyId(req.params.companyId);
      return res.json(bags);
    } catch (error) {
      next(error);
    }
  }

  async getActiveBagsByCompany(req, res, next) {
    try {
      const bags = await this.bagService.getActiveBagsByCompanyId(req.params.companyId);
      return res.json(bags);
    } catch (error) {
      next(error);
    }
  }

  async changeBagStatus(req, res, next) {
    try {
      if (req.body.status === undefined) {
        throw new AppError('Status não fornecido', 'MISSING_STATUS');
      }
      
      const bag = await this.bagService.changeBagStatus(req.params.id, req.body.status);
      return res.json(bag);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BagController;