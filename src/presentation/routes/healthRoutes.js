import express from 'express';
import { sequelize } from '../../infrastructure/database/connection.js';

export default () => {
  const router = express.Router();

  /**
   * @route GET /api/health
   * @description Verificação do estado da API e suas conexões
   * @access Public
   */
  router.get('/', async (req, res, next) => {
    /*
    #swagger.ignore = true
    */
    try {
      // Testar a conexão com o banco de dados
      await sequelize.authenticate();
      
      // Verificar variáveis de ambiente essenciais
      const envCheck = {
        database: !!process.env.DB_NAME,
        jwt: !!process.env.JWT_SECRET,
        firebase: !!process.env.FIREBASE_API_KEY,
        mapbox: !!process.env.MAPBOX_ACCESS_TOKEN
      };
      
      res.ok({
        status: 'UP',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        connections: {
          database: 'OK',
          firebase: envCheck.firebase ? 'CONFIGURED' : 'NOT CONFIGURED',
          mapbox: envCheck.mapbox ? 'CONFIGURED' : 'NOT CONFIGURED'
        },
        bypassFirebase: process.env.BYPASS_FIREBASE === 'true'
      });
    } catch (error) {
      console.error('Health check failed:', error);
      next({
        status: 'DOWN',
        timestamp: new Date().toISOString(),
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

  return router;
};
