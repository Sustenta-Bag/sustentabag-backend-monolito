import FavoriteModel from '../../domain/models/FavoriteModel.js';
import PostgresFavoriteRepository from '../../infrastructure/repositories/postgresFavoriteRepository.js';

export const getFavoriteRepository = (sequelizeInstance) => {
    FavoriteModel.init(sequelizeInstance);
    return new PostgresFavoriteRepository(FavoriteModel);
}

export const initializeModels = (sequelizeInstance) => {
    if(!sequelizeInstance) {
        throw new Error('É necessário fornecer uma instância do Sequelize para inicializar os modelos');
    }
    FavoriteModel.init(sequelizeInstance);
    return {
        FavoriteModel
    };
}