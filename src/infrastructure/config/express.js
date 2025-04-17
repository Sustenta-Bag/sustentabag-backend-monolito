import express from "express";
import compression from "compression";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

/**
 * Configura a aplicação Express com middlewares padrão
 * @returns {Object} Aplicação Express configurada
 */
export const configureExpress = () => {
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  return app;
}; 