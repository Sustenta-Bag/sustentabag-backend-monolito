import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import path from "path";

import swaggerFile from "./config/swagger.json" with { type: "json" };

import hateoas from './presentation/middleware/hateoas.js';
import handlers from './presentation/middleware/handlers.js';

import { connectDatabase, syncDatabase, sequelize } from './infrastructure/database/connection.js';
import { errorHandler } from './presentation/middleware/errorHandler.js';
import { initializeModels } from './application/bootstrap.js';
import routes from "./presentation/routes.js";

dotenv.config();

if (!process.env.MAPBOX_ACCESS_TOKEN) {
  console.warn("Warning: MAPBOX_ACCESS_TOKEN environment variable is not set.");
  console.warn("Location services will be limited. Please add it to your .env file.");
  console.warn("You can get a Mapbox token at https://account.mapbox.com/access-tokens/");
}

initializeModels(sequelize);

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(handlers);
app.use(hateoas);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/uploads", express.static(path.resolve(process.cwd(), "src", "uploads")));
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