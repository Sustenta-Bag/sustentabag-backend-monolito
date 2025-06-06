import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Sustentabag API",
    version: "1.0.0",
    description:
      "API completa para gerenciamento de sacolas misteriosas do sistema Sustenta Bag",
    contact: {
      name: "Equipe Sustenta Bag",
      url: "https://github.com/Sustenta-Bag",
      email: "contato@sustentabag.com",
    },
    license: {
      name: "ISC",
      url: "https://opensource.org/licenses/ISC",
    },
  },
  servers: [
    {
      url: "/",
      description: "Servidor de API",
    },
  ],  tags: [
    {
      name: "Base",
      description: "General API routes"
    },
    {
      name: "Location",
      description: "Operações relacionadas a localização geográfica"
    }
  ],
  components: {
    schemas: {
      NearbyBusinessesResponse: {
        count: 3,
        data: [{
          id: 1,
          name: "Example Business",
          legalName: "Example Business Ltd.",
          logo: "/uploads/logos/example.png",
          distance: 2.34,
          address: {
            street: "Main Street",
            number: "123",
            city: "Example City",
            state: "EX",
            zipCode: "12345678"
          }
        }]
      },
      
      AuthLoginRequest: {
        email: "usuario@example.com",
        password: "senha123"
      },
      
      AuthChangePasswordRequest: {
        currentPassword: "senha123",
        newPassword: "novaSenha456"
      },

      AuthLoginOk: {
        type: "object",
        properties: {
          user: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              email: { type: "string", example: "usuario@example.com" },
              role: { type: "string", example: "client" }
            }
          },
          entity: {
            type: "object",
            description: "Dados da entidade (cliente ou empresa)"
          },
          token: {
            type: "string",
            description: "JWT para autenticação em rotas protegidas",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          }
        }
      },

      DeviceToken: {
        deviceToken: "cSM76L5hQJKZZhXs-DsmFA:APA91bHgT1uQ..."  
      },
      
      User: {
        id: 1,
        email: "usuario@example.com",
        role: "client",
        entityId: 2,
        active: true,
        firebaseId: "firebase123",
        createdAt: "2023-01-01T00:00:00Z"
      },
      
      Bag: {
        id: 1,
        type: "Doce",
        price: 10.99,
        description: "Sacola com diversos doces e sobremesas",
        idBusiness: 1,
        status: 1,
        createdAt: "2023-01-01T00:00:00Z"
      },
      
      BagInput: {
        type: "Doce",
        price: 10.99,
        description: "Sacola com diversos doces e sobremesas",
        idBusiness: 1,
        status: 1
      },
      
      StatusUpdate: {
        status: 1
      },
      
      Business: {
        id: 1,
        legalName: "Sustenta Bag LTDA",
        cnpj: "12345678000195",
        appName: "Sustenta Bag - Centro",
        cellphone: "11987654321",
        description: "Empresa especializada em sacolas ecológicas",
        logo: "uploads/logos/logo123.png",
        delivery: true,
        deliveryTax: 5.99,
        idAddress: 1,
        status: 1,
        createdAt: "2023-01-01T00:00:00Z"
      },
      
      BusinessInput: {
        legalName: "Sustenta Bag LTDA",
        cnpj: "12345678000195",
        appName: "Sustenta Bag - Centro",
        cellphone: "11987654321",
        description: "Empresa especializada em sacolas",
        delivery: true,
        deliveryTax: 5.99,
        develiveryTime: 30,
        openingHours: "08:00-18:00",
        idAddress: 1,
        logo: "file_binary_data"
      },
      
      Address: {
        id: 1,
        zipCode: "12345678",
        state: "PR",
        city: "Curitiba",
        street: "Rua das Flores",
        number: "123",
        complement: "Apto 45",
        status: 1,
        createdAt: "2023-01-01T00:00:00Z"
      },
      
      AddressInput: {
        zipCode: "12345678",
        state: "PR",
        city: "Curitiba",
        street: "Rua das Flores",
        number: "123",
        complement: "Apto 45"
      },

      UpdateStatus: {
        status: true
      },
      
      Client: {
        id: 1,
        name: "João Silva",
        email: "joao.silva@email.com",
        cpf: "12345678901",
        phone: "11987654321",
        status: 1,
        createdAt: "2023-01-01T00:00:00Z"
      },
      
      ClientInput: {
        name: "Gabriel da Silva Costa",
        email: "silva@gabriel.com",
        cpf: "12345678901",
        phone: "11987654321"
      },
      
      ClientLoginRequest: {
        cpf: "12345678901",
        password: "senha123"
      },

      Favorite: {
        idBusiness: 1,
        idClient: 1
      },

      Review: {
        idOrder: 1,
        idClient: 1,
        rating: 5,
        comment: "Excelente sacola, muito bem feita!",
      },
      
      AuthResponse: {
        user: { 
          id: 1,
          email: "usuario@example.com",
          role: "client",
          entityId: 2,
          firebaseId: "firebase123"
        },
        entity: { 
          id: 2,
          name: "João Silva",
          cpf: "12345678901"
        },
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      },
      
      Error: {
        statusCode: 400,
        errorCode: "BAG_NOT_FOUND",
        message: "Sacola não encontrada com o ID fornecido",
        timestamp: "2023-01-01T00:00:00Z"
      },
      
      ValidationError: {
        statusCode: 400,
        errorCode: "VALIDATION_ERROR",
        message: "Erro de validação dos dados de entrada",
        errors: [
          {
            field: "type",
            message: "Tipo da sacola deve ser Doce, Salgada ou Mista"
          }
        ],
        timestamp: "2023-01-01T00:00:00Z"
      }
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: 'Insira o token JWT com o prefixo Bearer. Exemplo: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."'
      }
    }
  }
};

const outputFile = "../../config/swagger.json";
const endpointsFiles = [
  // "../routes2.js",
  "../routes/*.js",
  "../docs/*.js",
];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc)
  .then(async () => {
    await import("../../server.js");
  });