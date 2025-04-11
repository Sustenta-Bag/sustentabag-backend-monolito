const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Sacolas Ecológicas',
      version: '1.0.0',
      description: 'Documentação da API para gerenciamento de sacolas ecológicas',
      contact: {
        name: 'Equipe Sacola Service',
        url: 'https://github.com/Sustenta-Bag/sacola-service',
      },
    },
    servers: [
      {
        url: '/api',
        description: 'Servidor de API',
      },
    ],
    components: {
      schemas: {
        Bag: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único da sacola (idSacola)',
            },
            type: {
              type: 'string',
              enum: ['Doce', 'Salgada', 'Mista'],
              description: 'Tipo da sacola',
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Preço da sacola',
            },
            description: {
              type: 'string',
              description: 'Descrição da sacola',
            },
            companyId: {
              type: 'integer',
              description: 'ID da empresa (referência ao microserviço de empresa)',
            },
            status: {
              type: 'integer',
              enum: [0, 1],
              description: 'Status da sacola: 0 para inativo, 1 para ativo',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do registro',
            },
          },
          required: ['type', 'price', 'companyId'],
        },
        Error: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'integer',
              description: 'Código de status HTTP do erro',
              example: 400
            },
            errorCode: {
              type: 'string',
              description: 'Código de erro específico da aplicação',
              example: 'BAG_NOT_FOUND'
            },
            message: {
              type: 'string',
              description: 'Mensagem de erro descritiva',
              example: 'Sacola não encontrada com o ID fornecido'
            },
            details: {
              type: 'object',
              description: 'Detalhes adicionais do erro',
              nullable: true
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Data e hora em que o erro ocorreu',
              example: '2025-04-10T21:00:00.000Z'
            }
          },
          required: ['statusCode', 'errorCode', 'message', 'timestamp']
        },
        ValidationError: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'integer',
              description: 'Código de status HTTP do erro',
              example: 400
            },
            errorCode: {
              type: 'string',
              description: 'Código de erro específico da aplicação',
              example: 'VALIDATION_ERROR'
            },
            message: {
              type: 'string',
              description: 'Mensagem de erro descritiva',
              example: 'Erro de validação dos dados de entrada'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    description: 'Campo que falhou na validação',
                    example: 'type'
                  },
                  message: {
                    type: 'string',
                    description: 'Mensagem de erro específica para o campo',
                    example: 'Tipo da sacola deve ser Doce, Salgada ou Mista'
                  }
                }
              },
              description: 'Lista de erros de validação'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Data e hora em que o erro ocorreu',
              example: '2025-04-10T21:00:00.000Z'
            }
          },
          required: ['statusCode', 'errorCode', 'message', 'errors', 'timestamp']
        }
      },
    },
  },
  apis: ['./src/interfaces/routes/*.js'], // Caminhos para os arquivos com anotações JSDoc
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  // Rota para a documentação do Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // Rota para obter o arquivo swagger.json
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log('Documentação Swagger disponível em /api-docs');
};

module.exports = { setupSwagger };