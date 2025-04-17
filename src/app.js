import dotenv from "dotenv";

import { configureExpress } from "./infrastructure/config/express.js";
import { setupSwagger } from "./presentation/http/swagger.js";
import { connectDatabase, syncDatabase, sequelize } from './infrastructure/database/connection.js';
import { errorHandler } from './presentation/middleware/errorHandler.js';
import { initializeModules, setupModuleRouters } from './application/bootstrap.js';
import routes from "./presentation/routes.js";

dotenv.config();

initializeModules(sequelize);

const app = configureExpress();

setupSwagger(app);

app.use(routes);

setupModuleRouters(app, { sequelizeInstance: sequelize });

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDatabase();
    await syncDatabase(); 
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Documentação Swagger disponível em http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  start();
}

export { app, start };
