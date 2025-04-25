import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";

import swaggerFile from "./config/swagger.json" with { type: "json" };

import { connectDatabase, syncDatabase, sequelize } from './infrastructure/database/connection.js';
import { errorHandler } from './presentation/middleware/errorHandler.js';
import { initializeModules } from './application/bootstrap.js';
import routes from "./presentation/routes.js";

dotenv.config();
initializeModules(sequelize);

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(routes);
app.use(errorHandler);

connectDatabase()
    .then(() => syncDatabase(false))
    .then(() => {
        console.log("Banco de dados conectado e sincronizado com sucesso.");
    })
    .catch((error) => {
        console.error("Erro ao conectar ou sincronizar o banco de dados:", error);
    });

export default app;