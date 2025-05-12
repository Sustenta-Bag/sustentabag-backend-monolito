import swaggerAutogen from "swagger-autogen";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Configurar variáveis de ambiente
dotenv.config();

// Obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuração do Swagger
const doc = {
  info: {
    title: "Sustentabag API",
    version: "1.0.0",
    description:
      "API completa para gerenciamento de sacolas misteriosas e serviços de localização do sistema Sustenta Bag",
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
      description: "Servidor de desenvolvimento",
    }
  ],
  securityDefinitions: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
  components: {
    schemas: {
      AddressInput: {
        zipCode: "12345678",
        state: "SP",
        city: "São Paulo",
        street: "Av. Paulista",
        number: "123",
        complement: "Apto 45",
      },
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
      }
    }
  }
};

// Caminho para o arquivo de saída
const outputFile = join(__dirname, "../../config/swagger.json");

// Arquivos a serem analisados
const endpointsFiles = [
  join(__dirname, "../../server.js"),
  join(__dirname, "../routes.js"),
  join(__dirname, "../../application/modules/*.js"),
  join(__dirname, "../docs/*.js"),
];

// Gerar documentação
console.log("Gerando documentação Swagger...");
swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc)
  .then(() => {
    console.log(`Documentação Swagger gerada com sucesso: ${outputFile}`);
    console.log("\nPara visualizar a documentação, inicie o servidor e acesse:");
    console.log(`http://localhost:${process.env.PORT || 4041}/swagger\n`);
  })
  .catch((error) => {
    console.error("Erro ao gerar documentação Swagger:", error);
  });
