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
    // Reutiliza as definições existentes em swagger.js
    schemas: {}
  },
  securityDefinitions: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
};

const outputFile = "./src/config/swagger.json";
const endpointsFiles = [
  "./src/presentation/routes.js",
  "./src/presentation/routes/*.js",
  "./src/presentation/docs/*.js"
];

// Apenas gera o arquivo swagger sem iniciar o servidor
swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc)
  .then(() => {
    console.log('Documentação Swagger gerada com sucesso!');
  })
  .catch((error) => {
    console.error('Erro ao gerar documentação Swagger:', error);
  });
