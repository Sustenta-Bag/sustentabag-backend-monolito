import AppError from "../../infrastructure/errors/AppError.js";

class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  async registerUser(req, res, next) {
    /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Registrar um novo usuário'
    #swagger.description = 'Registra um novo usuário (cliente ou empresa) no sistema'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          examples: {
            Cliente: {
              value: {
                entityType: "client",
                userData: {
                  email: "usuario@example.com",
                  password: "senha123",
                },
                entityData: {
                  name: "Maria Silva Oliveira",
                  cpf: "12345678909",
                  phone: "11987654321",
                  idAddress: {
                    zipCode: "85937000",
                    state: "PR",
                    city: "Assis Chateaubriand",
                    street: "Avenida Paraná",
                    number: "72",
                    complement: "None",
                  },
                  status: 1,
                },
              },
            },
            Empresa: {
              value: {
                entityType: "business",
                userData: {
                  email: "empresa@example.com",
                  password: "senha123",
                },
                entityData: {
                  legalName: "Sustenta Bag LTDA",
                  cnpj: "12345678000195",
                  appName: "Sustenta Bag - Centro",
                  cellphone: "11987654321",
                  description: "Empresa especializada em sacolas sustentáveis",
                  delivery: true,
                  deliveryTax: 5.99,
                  deliveryTime: 30,
                  openingHours: "08:00-18:00",
                  idAddress: {
                    zipCode: "85937000",
                    state: "PR",
                    city: "Assis Chateaubriand",
                    street: "Avenida Paraná",
                    number: "72",
                    complement: "None",
                  },
                  status: 1,
                },
              },
            },
          },
        },
      }
    }
    #swagger.responses[201]
    #swagger.responses[402] = {
      description: 'Dados inválidos',
      schema: { $ref: "#/components/schemas/ValidationError" }
    }
    */
    try {
      const { entityType, userData, entityData } = req.body;

      if (!entityType || !["client", "business"].includes(entityType)) {
        throw new AppError(
          'Tipo de entidade inválido. Deve ser "client" ou "business"',
          "INVALID_ENTITY_TYPE",
          400
        );
      }

      if (!userData || !entityData) {
        throw new AppError(
          "Dados de usuário e entidade são obrigatórios",
          "MISSING_DATA",
          400
        );
      }

      let result;

      if (entityType === "client") {
        result = await this.authService.registerClient({...entityData, idAddress: entityData.idAddress }, userData);
      } else {
        result = await this.authService.registerBusiness(entityData, userData);
      }

      if (result.user && result.user.password) {
        delete result.user.password;
      }

      if (result.client && result.client.password) {
        delete result.client.password;
      }

      if (result.business && result.business.password) {
        delete result.business.password;
      }

      return res.created();
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Autenticar usuário'
    #swagger.description = 'Realiza login de um usuário com email e senha'
    #swagger.requestBody = {
      required: true,
      schema: { $ref: "#/components/schemas/AuthLoginRequest" }
    }
    #swagger.responses[200] = {
      description: 'Login realizado com sucesso',
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/AuthLoginOk" },
        }
      }
    }
    #swagger.responses[401] = {
      description: 'Credenciais inválidas',
      schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    */
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError(
          "Email e senha são obrigatórios",
          "MISSING_CREDENTIALS",
          400
        );
      }

      const result = await this.authService.login(email, password);

      const { password: _, ...userData } = result.user;

      return res.ok({
        user: userData,
        entity: result.entity,
        token: result.token,
      });
    } catch (error) {
      next(error);
    }
  }

  async loginWithFirebase(req, res, next) {
    try {
      const { firebaseToken } = req.body;

      if (!firebaseToken) {
        throw new AppError(
          "Token do Firebase é obrigatório",
          "MISSING_FIREBASE_TOKEN",
          400
        );
      }

      const result = await this.authService.loginWithFirebase(firebaseToken);

      const { password: _, ...userData } = result.user;

      return res.ok({
        user: userData,
        entity: result.entity,
        token: result.token,
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Alterar senha'
    #swagger.description = 'Altera a senha do usuário autenticado'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: "#/components/schemas/AuthChangePasswordRequest" }
    }
    #swagger.responses[204] = {
      description: 'Senha alterada com sucesso'
    }
    #swagger.responses[401] = {
      description: 'Não autenticado',
      schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[400] = {
      description: 'Dados inválidos',
      schema: { $ref: "#/components/schemas/ValidationError" }
    }
    */
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.userId;

      if (!currentPassword || !newPassword) {
        throw new AppError(
          "Senha atual e nova senha são obrigatórias",
          "MISSING_PASSWORD",
          400
        );
      }

      await this.authService.changePassword(
        userId,
        currentPassword,
        newPassword
      );

      return res.no_content();
    } catch (error) {
      next(error);
    }
  }
  async updateDeviceToken(req, res, next) {
    /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Registrar token do dispositivo'
    #swagger.description = 'Registra o token FCM do dispositivo para receber notificações'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: "#/components/schemas/DeviceToken" }
    }
    #swagger.responses[204] = {
      description: 'Token registrado com sucesso'
    }
    #swagger.responses[401] = {
      description: 'Não autenticado',
      schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[400] = {
      description: 'Dados inválidos',
      schema: { $ref: "#/components/schemas/ValidationError" }
    }
    */
    try {
      const { deviceToken } = req.body;
      const userId = req.user.userId;

      if (!deviceToken) {
        throw new AppError(
          "Token do dispositivo é obrigatório",
          "MISSING_DEVICE_TOKEN",
          400
        );
      }

      await this.authService.updateDeviceToken(userId, deviceToken);

      return res.no_content();
    } catch (error) {
      next(error);
    }
  }

  async getUserFcmToken(req, res, next) {
    /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Recuperar token FCM do usuário'
    #swagger.description = 'Recupera o token FCM associado a um usuário específico'
    #swagger.responses[200]
    #swagger.responses[404] = {
      description: 'Usuário não encontrado',
      schema: { $ref: "#/components/schemas/NotFoundError" }
    }
    #swagger.responses[400] = {
      description: 'ID do usuário inválido',
      schema: { $ref: "#/components/schemas/ValidationError" }
    }
    */
    try {
      const { userId } = req.params;

      if (!userId) {
        throw new AppError(
          "ID do usuário é obrigatório",
          "MISSING_USER_ID",
          400
        );
      }

      const fcmToken = await this.authService.getUserFcmToken(userId);

      return res.ok({
        token: fcmToken
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
