import AppError from "../../infrastructure/errors/AppError.js";
import RabbitMQPublisher from "../../application/services/RabbitMQPublisher.js";

class BagController {
  constructor(bagService) {
    this.bagService = bagService;
  }

  async createBag(req, res, next) {
    try {
      const bag = await this.bagService.createBag(req.body);

      if (res.status(201)) {
        const data = {
          to: "GG7YEvoNUYh1qohZUmTSJRHu9fa2",
          notification: {
            title: "Novo produto criado",
            body: `Uma nova bolsa do tipo ${bag.type} foi criada.`,
          },
          data: {
            type: "BAG_CREATED",
            payload: {
              type: bag.type,
            },
          },
        };

        await RabbitMQPublisher(data);
      }

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

  async getBagsByBusiness(req, res, next) {
    try {
      const bags = await this.bagService.getBagsByBusinessId(
        req.params.idBusiness
      );
      return res.json(bags);
    } catch (error) {
      next(error);
    }
  }

  async getActiveBagsByBusiness(req, res, next) {
    try {
      const bags = await this.bagService.getActiveBagsByBusinessId(
        req.params.idBusiness
      );
      return res.json(bags);
    } catch (error) {
      next(error);
    }
  }

  async changeBagStatus(req, res, next) {
    try {
      if (req.body.status === undefined) {
        throw new AppError("Status não fornecido", "MISSING_STATUS");
      }

      const bag = await this.bagService.changeBagStatus(
        req.params.id,
        req.body.status
      );
      return res.json(bag);
    } catch (error) {
      next(error);
    }
  }
}

export default BagController;
