import ReviewModel from "../../domain/models/ReviewModel.js";
import PostgresReviewRepository from "../../infrastructure/repositories/postgresReviewRepository.js";

export const getReviewRepository = (sequelizeInstance) => {
    ReviewModel.init(sequelizeInstance);
    return new PostgresReviewRepository(ReviewModel);
}

export const initializeModels = (sequelizeInstance) => {
    if (!sequelizeInstance) {
        throw new Error('É necessário fornecer uma instância do Sequelize para inicializar os modelos');
    }
    ReviewModel.init(sequelizeInstance);
    return {
        ReviewModel
    };
}