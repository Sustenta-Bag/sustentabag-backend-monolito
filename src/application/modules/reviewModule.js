import dotenv from 'dotenv';
import express from 'express';
import { setupReviewRoutes } from '../../presentation/routes/reviewRoutes.js';
import { errorHandler } from '../../presentation/middleware/errorHandler.js';
import ReviewModel from '../../domain/models/ReviewModel.js';

dotenv.config();

export const setupReviewModule = (options = {}) => {
    const router = express.Router();
    
    setupReviewRoutes(router, options);
    
    router.use(errorHandler);
    
    return router;
}

export const initializeModels = (sequelizeInstance) => {
    if (!sequelizeInstance) {
        throw new Error('É necessário fornecer uma instância do Sequelize para inicializar os modelos');
    }
    
    ReviewModel.init(sequelizeInstance);
    
    return {
        ReviewModel
    };
};

export const reviewModuleConfig = {
    name: 'reviews',
    routePrefix: '/api/reviews',
    description: 'Módulo de gerenciamento de avaliações',
    dependencies: [
        'sequelize'
    ]
};