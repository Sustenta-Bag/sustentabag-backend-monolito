import * as addressModule from './modules/addressModule.js';
import * as bagModule from './modules/bagModule.js';
import * as businessModule from './modules/businessModule.js';
import * as authModule from './modules/authModule.js';
import * as clientModule from './modules/clientModule.js';
import * as orderModule from './modules/orderModule.js';
import * as favoriteModule from './modules/favoriteModule.js';
import * as reviewModule from './modules/reviewModule.js';
import setupAssociations from '../infrastructure/database/associations.js';

export const initializeModels = (sequelize) => {
    const bagModels = bagModule.initializeModels(sequelize);
    const clientModels = clientModule.initializeModels(sequelize);
    const addressModels = addressModule.initializeModels(sequelize);
    const businessModels = businessModule.initializeModels(sequelize);
    const authModels = authModule.initializeModels(sequelize);
    const orderModels = orderModule.initializeModels(sequelize);
    const favoriteModels = favoriteModule.initializeModels(sequelize);
    const reviewModels = reviewModule.initializeModels(sequelize);
    
    const allModels = {
        ...bagModels,
        ...clientModels,
        ...addressModels,
        ...businessModels,
        ...authModels,
        ...orderModels,
        ...favoriteModels,
        ...reviewModels,
    };

    setupAssociations(allModels);

    return {
        models: allModels,
    };
};

export const setupModuleRouters = () =>({
    addressRouter,
    bagRouter,
    businessRouter,
    authRouter,
    clientRouter,
    orderRouter,
    favoriteRouter,
    reviewRouter
});