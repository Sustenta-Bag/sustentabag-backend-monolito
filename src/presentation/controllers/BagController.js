import AppError from "../../infrastructure/errors/AppError.js";
import RabbitMQPublisher from "../../application/services/RabbitMQPublisher.js";
import { getRepositoryService } from "../../application/services/RepositoryService.js";

class BagController {
  constructor(bagService) {
    this.bagService = bagService;
    this.repositoryService = getRepositoryService();
  }  async createBag(req, res, next) {
    try {
      const bag = await this.bagService.createBag(req.body);

      try {
        const userId = req.user.userId;
        const userRepository = this.repositoryService.getUserRepository();

        console.log("User ID:", userId);
        console.log(userRepository)
        // TODO - OBS: Essa parte do código deve ser implmentada para utilizar a lista de usuários
        // que estão na lista de favoritos da empresa. Como não foi implementado eu deixei
        // o to: como o FCM Token de um usuário específico para teste.
         const data = {
              to: "c0_upvfUQr62sCIQOfCfrl:APA91bFgN19CkI73zEpcoeY1VjbB2ZbSZrK2xHDPBU3oTMY-0Uet1JVbf1tOAzrEtP08uJrliS2KVd-Vp80_YW2pA_RyKs_YQPz58WZhwJ0xaqJ1Ag4msRE",
              notification: {
                title: "Novo produto criado",
                body: `Uma nova bolsa do tipo ${bag.type} foi criada.`,
              },
              type: "single",
              data: {
                type: "BAG_CREATED",
                payload: {
                  type: bag.type,
                  bagId: bag.id,
                },
              },
            };

            await RabbitMQPublisher(data);

        // if (userRepository) {
        //   const user = await userRepository.findById(userId);
          
          
        //   // Se o usuário tiver um token FCM, enviamos a notificação
        //   if (user && user.fcmToken) {
        //     const data = {
        //       to: user.fcmToken,
        //       notification: {
        //         title: "Novo produto criado",
        //         body: `Uma nova bolsa do tipo ${bag.type} foi criada.`,
        //       },
        //       type: "single",
        //       data: {
        //         type: "BAG_CREATED",
        //         payload: {
        //           type: bag.type,
        //           bagId: bag.id,
        //         },
        //       },
        //     };

        //     await RabbitMQPublisher(data);
        //     console.log(`Notificação enviada para o usuário ${userId} com token ${user.fcmToken}`);
        //   } else {
        //     console.log(`Usuário ${userId} não possui token FCM para notificações`);
        //   }
        // }
      } catch (notificationError) {
        // Não falha a criação da sacola se a notificação falhar
        console.error("Erro ao enviar notificação:", notificationError);
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
