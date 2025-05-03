import { 
  validateRegisterInput, 
  validateLoginInput, 
  validateFirebaseLoginInput,
  validateChangePasswordInput 
} from '../middleware/authValidation.js';
import { authenticate } from '../middleware/authMiddleware.js';

export default (authController) => (router) => {
  // Public routes
  router.post(
    '/register', 
    /*
    #swagger.path = '/api/auth/register'
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Registrar um novo usuário'
    #swagger.description = 'Registra um novo usuário (cliente ou empresa) no sistema'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              entityType: { 
                type: "string", 
                enum: ["client", "business"],
                example: "client" 
              },
              userData: {
                type: "object",
                properties: {
                  email: { type: "string", example: "usuario@example.com" },
                  password: { type: "string", example: "senha123" }
                },
                required: ["email", "password"]
              },
              entityData: {
                oneOf: [
                  {
                    type: "object",
                    title: "Cliente",
                    properties: {
                      name: { type: "string", example: "Maria Silva Oliveira" },
                      cpf: { type: "string", example: "12345678909" },
                      phone: { type: "string", example: "11987654321" },
                      status: { type: "integer", example: 1 }
                    },
                    required: ["name", "cpf"]
                  },
                  {
                    type: "object",
                    title: "Empresa",
                    properties: {
                      legalName: { type: "string", example: "Sustenta Bag LTDA" },
                      cnpj: { type: "string", example: "12345678000195" },
                      appName: { type: "string", example: "Sustenta Bag - Centro" },
                      cellphone: { type: "string", example: "11987654321" },
                      description: { type: "string", example: "Empresa especializada em sacolas sustentáveis" },
                      delivery: { type: "boolean", example: true },
                      deliveryTax: { type: "number", example: 5.99 },
                      idAddress: { type: "integer", example: 1 },
                      status: { type: "integer", example: 1 }
                    },
                    required: ["legalName", "cnpj", "appName", "cellphone"]
                  }
                ]
              }
            },
            required: ["entityType", "userData", "entityData"]
          },
          examples: {
            "Cliente": {
              value: {
                "entityType": "client",
                "userData": {
                  "email": "usuario@example.com",
                  "password": "senha123"
                },
                "entityData": {
                  "name": "Maria Silva Oliveira",
                  "cpf": "12345678909",
                  "phone": "11987654321",
                  "status": 1
                }
              }
            },
            "Empresa": {
              value: {
                "entityType": "business",
                "userData": {
                  "email": "empresa@example.com",
                  "password": "senha123"
                },
                "entityData": {
                  "legalName": "Sustenta Bag LTDA",
                  "cnpj": "12345678000195",
                  "appName": "Sustenta Bag - Centro",
                  "cellphone": "11987654321",
                  "description": "Empresa especializada em sacolas sustentáveis",
                  "delivery": true,
                  "deliveryTax": 5.99,
                  "idAddress": 1,
                  "status": 1
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: 'Usuário registrado com sucesso',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              user: { 
                type: "object",
                properties: {
                  id: { type: "integer" },
                  email: { type: "string" },
                  role: { type: "string" },
                  firebaseId: { type: "string" }
                }
              },
              entity: { 
                type: "object",
                description: "Dados da entidade criada (cliente ou empresa)"
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Dados inválidos',
      schema: { $ref: "#/components/schemas/ValidationError" }
    }
    */
    validateRegisterInput,
    authController.registerUser.bind(authController)
  );
  
  router.post(
    '/login', 
    /*
    #swagger.path = '/api/auth/login'
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Autenticar usuário'
    #swagger.description = 'Realiza login de um usuário com email e senha'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: { type: "string", example: "usuario@example.com" },
              password: { type: "string", example: "senha123" }
            },
            required: ["email", "password"]
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Login realizado com sucesso',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              user: { 
                type: "object",
                properties: {
                  id: { type: "integer" },
                  email: { type: "string" },
                  role: { type: "string" }
                }
              },
              entity: { 
                type: "object",
                description: "Dados da entidade (cliente ou empresa)"
              },
              token: { 
                type: "string", 
                description: "JWT para autenticação em rotas protegidas" 
              }
            }
          }
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
  
  // router.post(
  //   '/login/firebase', 
  //   /*
  //   #swagger.path = '/api/auth/login/firebase'
  //   #swagger.tags = ['Authentication']
  //   #swagger.summary = 'Autenticar com Firebase'
  //   #swagger.description = 'Realiza login usando token do Firebase'
  //   #swagger.requestBody = {
  //     required: true,
  //     content: {
  //       "application/json": {
  //         schema: {
  //           type: "object",
  //           properties: {
  //             firebaseToken: { 
  //               type: "string", 
  //               example: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlOTczZWUwZTE..." 
  //             }
  //           },
  //           required: ["firebaseToken"]
  //         }
  //       }
  //     }
  //   }
  //   #swagger.responses[200] = {
  //     description: 'Login realizado com sucesso',
  //     content: {
  //       "application/json": {
  //         schema: {
  //           type: "object",
  //           properties: {
  //             user: { type: "object" },
  //             entity: { type: "object" },
  //             token: { type: "string" }
  //           }
  //         }
  //       }
  //     }
  //   }
  //   #swagger.responses[401] = {
  //     description: 'Token inválido',
  //     schema: { $ref: "#/components/schemas/Error" }
  //   }
  //   */
  //   validateFirebaseLoginInput,
  //   authController.loginWithFirebase.bind(authController)
  // );
  
  // Protected routes
  router.post(
    '/change-password', 
    /*
    #swagger.path = '/api/auth/change-password'
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Alterar senha'
    #swagger.description = 'Altera a senha do usuário autenticado'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              currentPassword: { type: "string", example: "senha123" },
              newPassword: { type: "string", example: "novaSenha456" }
            },
            required: ["currentPassword", "newPassword"]
          }
        }
      }
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
  
  return router;
};