import express from 'express';
// Remova a importação das rotas de sacola
// import { setupRoutes as setupBagRoutes } from './routes/index.js';

/**
 * Configuração centralizada de todas as rotas da aplicação
 */
const router = express.Router();

// Remova a chamada para setupBagRoutes
// setupBagRoutes(router);
// As rotas de sacolas são configuradas em src/application/bootstrap.js com o prefixo /api

export default router; 