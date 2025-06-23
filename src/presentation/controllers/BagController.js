import AppError from "../../infrastructure/errors/AppError.js";
import RabbitMQPublisher from "../../application/services/RabbitMQPublisher.js";

class BagController {
  constructor(bagService) {
    this.bagService = bagService;
  }
  async createBag(req, res, next) {
    /*
    #swagger.tags = ["Bag"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#components/schemas/Bag' }
    }
    #swagger.responses[201]
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
      const bagData = {
        ...req.body,
        idBusiness: req.user.entityId,
      };
      const idBusiness = req.user.entityId;
      if (idBusiness !== bagData.idBusiness) {
        throw new AppError('Você não tem permissão para criar uma bag para esta empresa', 'UNAUTHORIZED');
      }
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

      return res.created();
    } catch (error) {
      next(error);
    }
  }

  async getBag(req, res, next) {
    /*
    #swagger.tags = ["Bag"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[404] = {
      description: "Not Found - Bag not found",
      schema: { $ref: "#/components/schemas/NotFoundError" }
    }
    */
    try {
      const bag = await this.bagService.getBag(req.params.id);
      return res.hateoasItem(bag);
    } catch (error) {
      next(error);
    }
  }

  async getAllBags(req, res, next) {
    /*
    #swagger.tags = ["Bag"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    */
    try {
      const filters = {
        idBusiness: req.query.idBusiness,
        type: req.query.type
      }
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const bags = await this.bagService.getAllBags(page, limit, filters);
      const totalPages = bags.pages;
      return res.hateoasList(bags.data, totalPages);
    } catch (error) {
      next(error);
    }
  }

  async updateBag(req, res, next) {
    /*
    #swagger.tags = ["Bag"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#components/schemas/Bag' },
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
      description: "Not Found - Bag not found",
      schema: { $ref: "#/components/schemas/NotFoundError" }
    }
    */
    try {
      const bagData = {
        ...req.body,
        idBusiness: req.user.entityId,
      };
      const bag = await this.bagService.updateBag(req.params.id, bagData);
      return res.ok(bag);
    } catch (error) {
      next(error);
    }
  }

  async deleteBag(req, res, next) {
    /*
    #swagger.tags = ["Bag"]
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
      description: "Not Found - Bag not found",
      schema: { $ref: "#/components/schemas/NotFoundError" }
    }
    */
    try {
      const currentId = req.user.entityId;
      const bag = await this.bagService.getBag(req.params.id);
      if (bag.idBusiness !== currentId) {
        throw new AppError(
          "Você não tem permissão para excluir esta bag",
          "UNAUTHORIZED"
        );
      }
      await this.bagService.deleteBag(req.params.id);
      return res.no_content();
    } catch (error) {
      next(error);
    }
  }

  async changeBagStatus(req, res, next) {
    /*
    #swagger.tags = ["Bag"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#components/schemas/StatusUpdate' }
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
        throw new AppError("Status não fornecido", "MISSING_STATUS");
      }

      const currentId = req.user.entityId;
      const bag = await this.bagService.getBag(req.params.id);
      if (bag.idBusiness !== currentId) {
        throw new AppError(
          "Você não tem permissão para alterar o status desta bag",
          "UNAUTHORIZED"
        );
      }

      const newBag = await this.bagService.changeBagStatus(
        req.params.id,
        req.body.status
      );
      return res.ok(newBag);
    } catch (error) {
      next(error);
    }
  }

  async getAllowedTags(req, res, next) {
    /*
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.tags = ["Bag"]
    #swagger.description = "Retorna a lista de tags permitidas para sacolas"
    #swagger.responses[200]
    }
    */
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
      return res.ok(ALLOWED_TAGS);
    } catch (error) {
      next(error);
    }
  }
}

export default BagController;
