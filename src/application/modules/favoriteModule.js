import dotenv from 'dotenv';
import express from 'express';
import { setupFavoriteRoutes } from '../../presentation/routes/favoriteRoutes.js';
import { errorHandler } from '../../presentation/middleware/errorHandler.js';
import FavoriteModel from '../../domain/models/FavoriteModel.js';

dotenv.config();

export const setupFavoriteModule = (options = {}) => {
    const router = express.Router();
    
    setupFavoriteRoutes(router, options);
    
    router.use(errorHandler);
    
    return router;
};

export const initializeModels = (sequelizeInstance) => {
    if (!sequelizeInstance) {
        throw new Error('É necessário fornecer uma instância do Sequelize para inicializar os modelos');
    }
    
    FavoriteModel.init(sequelizeInstance);
    
    return {
        FavoriteModel
    };
};

export const favoriteModuleConfig = {
    name: 'favorites',
    routePrefix: '/api/favorites',
    description: 'Módulo de gerenciamento de favoritos',
    dependencies: [
        'sequelize'
    ]
};