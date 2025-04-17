import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sustentabag API',
      version: '1.0.0',
      description: 'API completa para gerenciamento de sacolas ecológicas do sistema Sustenta Bag',
      contact: {
        name: 'Equipe Sustenta Bag',
        url: 'https://github.com/Sustenta-Bag',
        email: 'contato@sustentabag.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: '/',
        description: 'Servidor de API'
      }
    ],
    components: {
      schemas: {
        Bag: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único da sacola (idSacola)',
              example: 1
            },
            type: {
              type: 'string',
              enum: ['Doce', 'Salgada', 'Mista'],
              description: 'Tipo da sacola',
              example: 'Doce'
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Preço da sacola',
              example: 10.99
            },
            description: {
              type: 'string',
              description: 'Descrição da sacola',
              example: 'Sacola com diversos doces e sobremesas'
            },
            companyId: {
              type: 'integer',
              description: 'ID da empresa (referência)',
              example: 1
            },
            status: {
              type: 'integer',
              enum: [0, 1],
              description: 'Status da sacola: 0 para inativo, 1 para ativo',
              example: 1
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do registro',
              example: '2025-04-10T14:30:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização do registro',
              example: '2025-04-10T16:45:00Z'
            }
          },
          required: ['type', 'price', 'companyId']
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único do usuário',
              example: '64a78b2e9d7fc43c87f05f12'
            },
            name: {
              type: 'string',
              description: 'Nome do usuário',
              example: 'João Silva'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário (único)',
              example: 'joao.silva@email.com'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Senha do usuário (min 6 caracteres)',
              example: '123456'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do usuário',
              example: '2025-04-10T14:30:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização do usuário',
              example: '2025-04-10T16:45:00Z'
            }
          },
          required: ['name', 'email', 'password']
        },
        LoginRequest: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário',
              example: 'joao.silva@email.com'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Senha do usuário',
              example: '123456'
            }
          },
          required: ['email', 'password']
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'Token JWT de autenticação',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
          }
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
              description: 'Código específico do erro',
              example: 'BAG_NOT_FOUND'
            },
            message: {
              type: 'string',
              description: 'Mensagem descritiva do erro',
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
              description: 'Data e hora do erro',
              example: '2025-04-10T14:30:00Z'
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
              description: 'Código de erro específico',
              example: 'VALIDATION_ERROR'
            },
            message: {
              type: 'string',
              description: 'Mensagem descritiva do erro',
              example: 'Erro de validação dos dados de entrada'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    description: 'Campo com erro',
                    example: 'type'
                  },
                  message: {
                    type: 'string',
                    description: 'Mensagem de erro específica',
                    example: 'Tipo da sacola deve ser Doce, Salgada ou Mista'
                  }
                }
              },
              description: 'Lista de erros de validação'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Data e hora do erro',
              example: '2025-04-10T14:30:00Z'
            }
          },
          required: ['statusCode', 'errorCode', 'message', 'errors', 'timestamp']
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT com o prefixo Bearer. Exemplo: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."'
        }
      }
    },
    tags: [
      {
        name: 'Sacolas',
        description: 'Operações relacionadas a sacolas ecológicas'
      },
      {
        name: 'Autenticação',
        description: 'Operações de login e autenticação'
      },
      {
        name: 'Usuários',
        description: 'Gerenciamento de usuários'
      }
    ],
    paths: {
      '/login': {
        post: {
          tags: ['Autenticação'],
          summary: 'Autenticar usuário',
          description: 'Realiza o login do usuário e retorna um token JWT',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginRequest'
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Login realizado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/LoginResponse'
                  }
                }
              }
            },
            '401': {
              description: 'Credenciais inválidas',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      },
      '/api/users': {
        get: {
          tags: ['Usuários'],
          summary: 'Listar todos os usuários',
          description: 'Retorna uma lista paginada de usuários',
          parameters: [
            {
              name: '_page',
              in: 'query',
              schema: {
                type: 'integer',
                minimum: 1
              },
              description: 'Página atual para paginação'
            },
            {
              name: '_size',
              in: 'query',
              schema: {
                type: 'integer',
                minimum: 1
              },
              description: 'Quantidade de itens por página'
            },
            {
              name: '_order',
              in: 'query',
              schema: {
                type: 'string'
              },
              description: 'Ordenação no formato "campo asc/desc"'
            }
          ],
          security: [
            {
              bearerAuth: []
            }
          ],
          responses: {
            '200': {
              description: 'Lista de usuários retornada com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/User'
                        }
                      },
                      _page: {
                        type: 'object',
                        properties: {
                          current: {
                            type: 'integer',
                            example: 1
                          },
                          total: {
                            type: 'integer',
                            example: 5
                          },
                          size: {
                            type: 'integer',
                            example: 10
                          }
                        }
                      },
                      _links: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            rel: {
                              type: 'string',
                              example: 'next'
                            },
                            href: {
                              type: 'string',
                              example: '/api/users?_page=2&_size=10'
                            },
                            method: {
                              type: 'string',
                              example: 'GET'
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Não autorizado - Token JWT inválido ou expirado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Usuários'],
          summary: 'Criar um novo usuário',
          description: 'Cria um novo usuário no sistema',
          security: [
            {
              bearerAuth: []
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Usuário criado com sucesso'
            },
            '400': {
              description: 'Dados inválidos',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ValidationError'
                  }
                }
              }
            },
            '401': {
              description: 'Não autorizado - Token JWT inválido ou expirado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      },
      '/api/users/{_id}': {
        get: {
          tags: ['Usuários'],
          summary: 'Obter um usuário pelo ID',
          description: 'Retorna os detalhes de um usuário específico',
          parameters: [
            {
              name: '_id',
              in: 'path',
              required: true,
              schema: {
                type: 'string'
              },
              description: 'ID único do usuário'
            }
          ],
          security: [
            {
              bearerAuth: []
            }
          ],
          responses: {
            '200': {
              description: 'Usuário retornado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User'
                  }
                }
              }
            },
            '401': {
              description: 'Não autorizado - Token JWT inválido ou expirado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '404': {
              description: 'Usuário não encontrado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        },
        put: {
          tags: ['Usuários'],
          summary: 'Atualizar um usuário',
          description: 'Atualiza os dados de um usuário existente',
          parameters: [
            {
              name: '_id',
              in: 'path',
              required: true,
              schema: {
                type: 'string'
              },
              description: 'ID único do usuário'
            }
          ],
          security: [
            {
              bearerAuth: []
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Usuário atualizado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User'
                  }
                }
              }
            },
            '400': {
              description: 'Dados inválidos',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ValidationError'
                  }
                }
              }
            },
            '401': {
              description: 'Não autorizado - Token JWT inválido ou expirado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '404': {
              description: 'Usuário não encontrado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        },
        delete: {
          tags: ['Usuários'],
          summary: 'Excluir um usuário',
          description: 'Remove um usuário do sistema',
          parameters: [
            {
              name: '_id',
              in: 'path',
              required: true,
              schema: {
                type: 'string'
              },
              description: 'ID único do usuário'
            }
          ],
          security: [
            {
              bearerAuth: []
            }
          ],
          responses: {
            '204': {
              description: 'Usuário excluído com sucesso'
            },
            '401': {
              description: 'Não autorizado - Token JWT inválido ou expirado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '404': {
              description: 'Usuário não encontrado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      },
      '/api/bags': {
        post: {
          tags: ['Sacolas'],
          summary: 'Criar uma nova sacola',
          description: 'Cria uma nova sacola ecológica no sistema',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['type', 'price', 'companyId'],
                  properties: {
                    type: {
                      type: 'string',
                      enum: ['Doce', 'Salgada', 'Mista'],
                      example: 'Doce'
                    },
                    price: {
                      type: 'number',
                      format: 'float',
                      example: 10.99
                    },
                    description: {
                      type: 'string',
                      example: 'Sacola com diversos doces e sobremesas'
                    },
                    companyId: {
                      type: 'integer',
                      example: 1
                    },
                    status: {
                      type: 'integer',
                      enum: [0, 1],
                      default: 1,
                      example: 1
                    }
                  }
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Sacola criada com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Bag'
                  }
                }
              }
            },
            '400': {
              description: 'Dados inválidos',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ValidationError'
                  }
                }
              }
            },
            '500': {
              description: 'Erro do servidor',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        },
        get: {
          tags: ['Sacolas'],
          summary: 'Listar todas as sacolas',
          description: 'Retorna uma lista de todas as sacolas cadastradas no sistema',
          responses: {
            '200': {
              description: 'Lista de sacolas retornada com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Bag'
                    }
                  }
                }
              }
            },
            '500': {
              description: 'Erro do servidor',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      },
      '/api/bags/{id}': {
        get: {
          tags: ['Sacolas'],
          summary: 'Obter detalhes de uma sacola',
          description: 'Retorna os dados completos de uma sacola específica',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer'
              },
              description: 'ID da sacola'
            }
          ],
          responses: {
            '200': {
              description: 'Detalhes da sacola retornados com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Bag'
                  }
                }
              }
            },
            '404': {
              description: 'Sacola não encontrada',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '500': {
              description: 'Erro do servidor',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        },
        put: {
          tags: ['Sacolas'],
          summary: 'Atualizar uma sacola',
          description: 'Atualiza os dados de uma sacola existente',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer'
              },
              description: 'ID da sacola'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    type: {
                      type: 'string',
                      enum: ['Doce', 'Salgada', 'Mista'],
                      example: 'Salgada'
                    },
                    price: {
                      type: 'number',
                      format: 'float',
                      example: 15.99
                    },
                    description: {
                      type: 'string',
                      example: 'Sacola atualizada com salgados variados'
                    },
                    companyId: {
                      type: 'integer',
                      example: 1
                    },
                    status: {
                      type: 'integer',
                      enum: [0, 1],
                      example: 1
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Sacola atualizada com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Bag'
                  }
                }
              }
            },
            '400': {
              description: 'Dados inválidos',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ValidationError'
                  }
                }
              }
            },
            '404': {
              description: 'Sacola não encontrada',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '500': {
              description: 'Erro do servidor',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        },
        delete: {
          tags: ['Sacolas'],
          summary: 'Remover uma sacola',
          description: 'Remove permanentemente uma sacola do sistema',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer'
              },
              description: 'ID da sacola'
            }
          ],
          responses: {
            '204': {
              description: 'Sacola removida com sucesso'
            },
            '404': {
              description: 'Sacola não encontrada',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '500': {
              description: 'Erro do servidor',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      },
      '/api/company/{companyId}/bags': {
        get: {
          tags: ['Sacolas'],
          summary: 'Listar sacolas de uma empresa',
          description: 'Retorna todas as sacolas associadas a uma empresa específica',
          parameters: [
            {
              name: 'companyId',
              in: 'path',
              required: true,
              schema: {
                type: 'integer'
              },
              description: 'ID da empresa'
            }
          ],
          responses: {
            '200': {
              description: 'Lista de sacolas retornada com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Bag'
                    }
                  }
                }
              }
            },
            '400': {
              description: 'ID da empresa inválido',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '500': {
              description: 'Erro do servidor',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      },
      '/api/company/{companyId}/bags/active': {
        get: {
          tags: ['Sacolas'],
          summary: 'Listar sacolas ativas de uma empresa',
          description: 'Retorna apenas as sacolas ativas (status=1) associadas a uma empresa específica',
          parameters: [
            {
              name: 'companyId',
              in: 'path',
              required: true,
              schema: {
                type: 'integer'
              },
              description: 'ID da empresa'
            }
          ],
          responses: {
            '200': {
              description: 'Lista de sacolas ativas retornada com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Bag'
                    }
                  }
                }
              }
            },
            '400': {
              description: 'ID da empresa inválido',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '500': {
              description: 'Erro do servidor',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      },
      '/api/bags/{id}/status': {
        patch: {
          tags: ['Sacolas'],
          summary: 'Alterar status de uma sacola',
          description: 'Atualiza apenas o status de uma sacola (ativo ou inativo)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer'
              },
              description: 'ID da sacola'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: {
                    status: {
                      type: 'integer',
                      enum: [0, 1],
                      description: 'Status da sacola: 0 para inativo, 1 para ativo',
                      example: 0
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Status da sacola alterado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Bag'
                  }
                }
              }
            },
            '400': {
              description: 'Status inválido',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ValidationError'
                  }
                }
              }
            },
            '404': {
              description: 'Sacola não encontrada',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '500': {
              description: 'Erro do servidor',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: [
    './src/presentation/routes/*.js', 
    './src/presentation/controllers/*.js',
    './src/infrastructure/routes/*.js'
  ],
};

const swaggerSpec = swaggerJSDoc(options);

/**
 * Configura o middleware Swagger para a aplicação Express
 * @param {Object} app - Instância do Express
 */
const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Sustentabag API - Documentação',
    customfavIcon: '/favicon.ico'
  }));
  
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log('📚 Documentação Swagger disponível em /api-docs');
};

export { setupSwagger };