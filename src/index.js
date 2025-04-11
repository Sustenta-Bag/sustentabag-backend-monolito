require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { setupRoutes } = require('./application/interfaces/routes');
const { connectDatabase, syncDatabase } = require('./infrastructure/database/connection');
const { setupSwagger } = require('./infrastructure/http/swagger');
const { errorHandler } = require('./application/interfaces/middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Configurar documentação Swagger
setupSwagger(app);

// Configurar rotas
setupRoutes(app);

// Middleware de tratamento de erros (deve ser registrado após as rotas)
app.use(errorHandler);

// Conectar ao banco de dados e iniciar servidor
const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDatabase();
    await syncDatabase(); // Sincronizar modelos do banco de dados
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Documentação Swagger disponível em http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
};

// Iniciar servidor apenas se este arquivo for executado diretamente
if (require.main === module) {
  start();
}

// Exportar app para testes
module.exports = { app, start };