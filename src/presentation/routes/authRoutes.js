import {
  validateRegisterInput,
  validateLoginInput,
  validateFirebaseLoginInput,
  validateChangePasswordInput,
  validateDeviceTokenInput,
} from "../middleware/authValidation.js";
import { authenticate } from "../middleware/authMiddleware.js";

export default (authController) => (router) => {
  router.post(
    "/register",
    /*
    #swagger.path = '/api/auth/register'
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
    validateRegisterInput,
    authController.registerUser.bind(authController)
  );

  router.post(
    "/login",
    /*
    #swagger.path = '/api/auth/login'
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
      schema: { $ref: "#/components/schemas/Error" }
    }
    */
    validateLoginInput,
    authController.login.bind(authController)
  );

  router.post(
    "/change-password",
    /*
    #swagger.path = '/api/auth/change-password'
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
      schema: { $ref: "#/components/schemas/Error" }
    }
    #swagger.responses[400] = {
      description: 'Dados inválidos',
      schema: { $ref: "#/components/schemas/ValidationError" }
    }
    */
    authenticate,
    validateChangePasswordInput,
    authController.changePassword.bind(authController)
  );

  router.post(
    "/device-token",
    /*
    #swagger.path = '/api/auth/device-token'
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
      schema: { $ref: "#/components/schemas/Error" }
    }
    #swagger.responses[400] = {
      description: 'Dados inválidos',
      schema: { $ref: "#/components/schemas/ValidationError" }
    }
    */
    authenticate,
    validateDeviceTokenInput,
    authController.updateDeviceToken.bind(authController)
  );

  router.get(
    "/user/:userId/fcm-token",
    /*
    #swagger.path = '/api/auth/user/{userId}/fcm-token'
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Recuperar token FCM do usuário'
    #swagger.description = 'Recupera o token FCM associado a um usuário específico'
    #swagger.parameters[0] = {
      name: 'userId',
      in: 'path',
      description: 'ID do usuário',
      required: true,
      schema: {
        type: 'string'
      }
    }
    #swagger.responses[200] = {
      description: 'Token FCM recuperado com sucesso',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              token: { 
                type: "string", 
                example: "fcm-token-example",
                description: "Token FCM do usuário ou null se não encontrado"
              }
            }
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'Usuário não encontrado',
      schema: { $ref: "#/components/schemas/Error" }
    }
    #swagger.responses[400] = {
      description: 'ID do usuário inválido',
      schema: { $ref: "#/components/schemas/ValidationError" }
    }
    */
    authController.getUserFcmToken.bind(authController)
  );

  return router;
};
