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
  ],
  components: {
    schemas: {
      Bag: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'ID único da sacola (idSacola)', example: 1 },
          type: { type: 'string', enum: ['Doce', 'Salgada', 'Mista'], description: 'Tipo da sacola', example: 'Doce' },
          price: { type: 'number', format: 'float', description: 'Preço da sacola', example: 10.99 },
          description: { type: 'string', description: 'Descrição da sacola', example: 'Sacola com diversos doces e sobremesas' },
          idBusiness: { type: 'integer', description: 'ID da empresa (referência)', example: 1 },
          status: { type: 'integer', enum: [0, 1], description: 'Status da sacola: 0 para inativo, 1 para ativo', example: 1 },
          createdAt: { type: 'string', format: 'date-time', description: 'Data de criação do registro', example: '2025-04-10T14:30:00Z' },
          updatedAt: { type: 'string', format: 'date-time', description: 'Data de atualização do registro', example: '2025-04-10T16:45:00Z' }
        },
        example: {
          id: 1,
          type: 'Doce',
          price: 10.99,
          description: 'Sacola com diversos doces e sobremesas',
          idBusiness: 1,
          status: 1,
          createdAt: '2025-04-10T14:30:00Z',
          updatedAt: '2025-04-10T16:45:00Z'
        },
        required: ['type', 'price', 'idBusiness']
      },
      BagInput: {
        type: 'Doce',
        price: 10.99,
        description: 'Sacola com diversos doces e sobremesas',
        idBusiness: 1,
        status: 1
      },
      Business: {
        type: 'object',
        properties: {
          idBusiness: { type: 'integer', description: 'ID único da empresa', example: 1 },
          legalName: { type: 'string', description: 'Razão social da empresa', example: 'Sustenta Bag LTDA' },
          CNPJ: { type: 'string', description: 'CNPJ da empresa (14 dígitos)', example: '12345678000195' },
          appName: { type: 'string', description: 'Nome dentro do aplicativo', example: 'Sustenta Bag - Centro' },
          cellphone: { type: 'string', description: 'Número de celular da empresa', example: '11987654321' },
          description: { type: 'string', description: 'Descrição da empresa', example: 'Empresa especializada em sacolas ecológicas' },
          logo: { type: 'string', format: 'binary', description: 'Arquivo de imagem do logo da empresa', example: 'Logo.png' },
          password: { type: 'string', format: 'password', description: 'Senha de acesso da empresa', example: 'senha123' },
          delivery: { type: 'boolean', description: 'Indica se a empresa realiza entregas', example: true },
          deliveryTax: { type: 'number', format: 'float', description: 'Taxa de entrega da empresa', example: 5.99 },
          idAddress: { type: 'integer', description: 'ID do endereço da empresa (referência)', example: 1 },
          status: { type: 'integer', enum: [0, 1], description: 'Status da empresa: 0 para inativa, 1 para ativa', example: 1 },
          createdAt: { type: 'string', format: 'date-time', description: 'Data de criação do registro', example: '2025-04-10T14:30:00Z' },
          updatedAt: { type: 'string', format: 'date-time', description: 'Data de atualização do registro', example: '2025-04-10T16:45:00Z' }
        },
        example: {
          idBusiness: 1,
          legalName: 'Sustenta Bag LTDA',
          CNPJ: '12345678000195',
          appName: 'Sustenta Bag - Centro',
          cellphone: '11987654321',
          description: 'Empresa especializada em sacolas ecológicas',
          logo: 'Logo.png',
          password: 'senha123',
          delivery: true,
          deliveryTax: 5.99,
          idAddress: 1,
          status: 1,
          createdAt: '2025-04-10T14:30:00Z',
          updatedAt: '2025-04-10T16:45:00Z'
        },
        required: ['legalName', 'CNPJ', 'appName', 'cellphone', 'password']
      },
      BusinessInput: {
        legalName: 'Sustenta Bag LTDA',
        cnpj: '12345678000195',
        appName: 'Sustenta Bag - Centro',
        cellphone: '11987654321',
        description: 'Empresa especializada em sacolas',
        password: 'senha123',
        delivery: true,
        deliveryTax: 5.99,
        idAddress: 1,
      },
      Address: {
        type: 'object',
        required: ['zipCode','State','city','Street','Number'],
        properties: {
          zipCode: { type:'string', example:'12345-678' },
          State:   { type:'string', example:'PR' },
          city:    { type:'string', example:'Curitiba' },
          Street:  { type:'string', example:'Rua das Flores' },
          Number:  { type:'string', example:'123' },
          Complement: { type:'string', example:'Apto 45' }
        },
        example: {
          zipCode: "12345678",
          State: "PR",
          city: "Curitiba",
          Street: "Rua das Flores",
          Number: "123",
          Complement: "Apto 45"
        }
      },
      AddressInput: {
        zipCode: "12345678",
        state: "PR",
        city: "Curitiba",
        street: "Rua das Flores",
        number: "123",
        complement: "Apto 45"
      },
      Client: {
        type: "object",
        properties: {
          id: { type: "integer", description: "ID único do cliente", example: 1, },
          name: { type: "string", description: "Nome do cliente", example: "João Silva", },
          email: { type: "string", format: "email", description: "Email do cliente", example: "joao.silva@email.com",},
          cpf: { type: "string", description: "CPF do cliente (11 dígitos)", example: "12345678901", },
          phone: { type: "string", description: "Telefone do cliente", example: "11987654321", },
          password: { type: "string", format: "password", description: "Senha do cliente", example: "senha123", },
          status: { type: "integer", enum: [0, 1], description: "Status do cliente: 0 para inativo, 1 para ativo", example: 1, },
          createdAt: { type: "string", format: "date-time", description: "Data de criação do registro", example: "2023-01-01T00:00:00Z", },
        },
        required: ["name", "email", "cpf", "password", "phone"],
      },
      ClientInput: {
        name: "Gabriel da Silva Costa",
        email: "silva@gabriel.com",
        cpf: "12345678901",
        phone: "11987654321",
        password: "senha123",
      },
      LoginRequest: {
        type: "object",
        properties: {
          cpf: {
            type: "string",
            description: "CPF do cliente (11 dígitos)",
            example: "12345678901",
          },
          password: {
            type: "string",
            format: "password",
            description: "Senha do cliente",
            example: "senha123",
          },
        },
        required: ["cpf", "password"],
      },
      LoginResponse: {
        type: "object",
        properties: {
          client: {
            $ref: "#/components/schemas/Client",
          },
          token: {
            type: "string",
            description: "Token JWT de autenticação",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          statusCode: {
            type: "integer",
            description: "Código de status HTTP do erro",
            example: 400,
          },
          errorCode: {
            type: "string",
            description: "Código específico do erro",
            example: "BAG_NOT_FOUND",
          },
          message: {
            type: "string",
            description: "Mensagem descritiva do erro",
            example: "Sacola não encontrada com o ID fornecido",
          },
          details: {
            type: "object",
            description: "Detalhes adicionais do erro",
            nullable: true,
          },
          timestamp: {
            type: "string",
            format: "date-time",
            description: "Data e hora do erro",
            example: "2025-04-10T14:30:00Z",
          },
        },
        required: ["statusCode", "errorCode", "message", "timestamp"],
      },
      ValidationError: {
        type: "object",
        properties: {
          statusCode: {
            type: "integer",
            description: "Código de status HTTP do erro",
            example: 400,
          },
          errorCode: {
            type: "string",
            description: "Código de erro específico",
            example: "VALIDATION_ERROR",
          },
          message: {
            type: "string",
            description: "Mensagem descritiva do erro",
            example: "Erro de validação dos dados de entrada",
          },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: {
                  type: "string",
                  description: "Campo com erro",
                  example: "type",
                },
                message: {
                  type: "string",
                  description: "Mensagem de erro específica",
                  example: "Tipo da sacola deve ser Doce, Salgada ou Mista",
                },
              },
            },
            description: "Lista de erros de validação",
          },
          timestamp: {
            type: "string",
            format: "date-time",
            description: "Data e hora do erro",
            example: "2025-04-10T14:30:00Z",
          },
        },
        required: [
          "statusCode",
          "errorCode",
          "message",
          "errors",
          "timestamp",
        ],
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          'Insira o token JWT com o prefixo Bearer. Exemplo: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."',
      },
    },
  },
};

const outputFile = "../../config/swagger.json";
const endpointsFiles = [
  "../routes.js",
  "../routes/*.js"
];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc)
  .then(async () => {
    await import("../../server.js");
  });