import AppError from "../../infrastructure/errors/AppError.js";
import RabbitMQPublisher from "../../application/services/RabbitMQPublisher.js";

class BagController {
  constructor(bagService) {
    this.bagService = bagService;
  }
  async createBag(req, res, next) {
    try {
      const bagData = {
        ...req.body,
        idBusiness: req.user.entityId,
      };
      const bag = await this.bagService.createBag(bagData);
      try {
        const usersFavorites =
          await this.bagService.getUsersFavoritesByBusinessId(
            req.user.entityId
          );

        if (usersFavorites && usersFavorites.length > 0) {

          const fcmTokens = usersFavorites
            .map((user) => user.fcmToken)
            .filter((token) => token);
          if (fcmTokens.length > 0) {
            const notificationData = {
              to: fcmTokens,
              notification: {
                title: "Novo produto criado",
                body: `Uma nova bolsa do tipo ${bag.type} foi criada por uma empresa que você favorita.`,
              },
              type: "BAG_CREATED",
              payload: {
                bagType: bag.type,
              },
            };

            await RabbitMQPublisher(notificationData);
          } else {
            console.log(
              "Nenhum usuário tem FCM token válido para receber notificações"
            );
          }
        } else {
          console.log("Nenhum usuário favoritou esta empresa");
        }
      } catch (notificationError) {
        console.error("Erro ao enviar notificações:", notificationError);
        if (
          notificationError.message &&
          notificationError.message.includes("Favoritos")
        ) {
          console.log(
            "Esta empresa ainda não possui usuários que a favoritaram"
          );
        }
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
      const bagData = {
        ...req.body,
        idBusiness: req.user.entityId,
      };
      const bag = await this.bagService.updateBag(req.params.id, bagData);
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

  async getAllowedTags(req, res, next) {
    try {
      const ALLOWED_TAGS = [
        "PODE_CONTER_GLUTEN",
        "PODE_CONTER_LACTOSE",
        "PODE_CONTER_LEITE",
        "PODE_CONTER_OVOS",
        "PODE_CONTER_AMENDOIM",
        "PODE_CONTER_CASTANHAS",
        "PODE_CONTER_NOZES",
        "PODE_CONTER_SOJA",
        "PODE_CONTER_PEIXE",
        "PODE_CONTER_FRUTOS_DO_MAR",
        "PODE_CONTER_CRUSTACEOS",
        "PODE_CONTER_GERGELIM",
        "PODE_CONTER_SULFITOS",
        "PODE_CONTER_CARNE",
      ];
      return res.json(ALLOWED_TAGS);
    } catch (error) {
      next(error);
    }
  }
}

export default BagController;
