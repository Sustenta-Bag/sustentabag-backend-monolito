import reviewRepository from '../repositories/ReviewRepository.js';
import Review from '../../domain/entities/Review.js';
import ReviewModel from '../../domain/models/ReviewModel.js';
import OrderRepository from '../repositories/OrderRepository.js';

class PostgresReviewRepository extends reviewRepository {
    constructor(reviewModel = ReviewModel, orderRepository) {
        super();
        this.ReviewModel = reviewModel;
        this.orderRepository = orderRepository;
    }

    async create(reviewData) {
        const reviewRecord = await this.ReviewModel.create(reviewData);
        return this._mapToDomainEntity(reviewRecord);
    }

    async delete(id) {
        const rows = await this.ReviewModel.destroy({
            where: { idReview: id }
        });
        return rows > 0;
    }

    async findAll(options = {}, idClient, idBusiness) {
        if (idClient) {
            options.where = { idClient };
        }
        if(idBusiness) {
            return await this._findAllByBusiness(idBusiness);
        }
        const records = await this.ReviewModel.findAll(options);
        return records.map(r => this._mapToDomainEntity(r));
    }

    async _findAllByBusiness(idBusiness) {
        const orders = await this.orderRepository.findByBusinessId(idBusiness);
        const orderIds = orders.map(order => order.id);

        if(orderIds.length === 0) 
            return { reviews: [], total: 0, message: 'Empresa sem pedidos' };

        const reviews = await this.ReviewModel.findAll({
            where: { idOrder: orderIds }
        });

        if (reviews.length === 0) {
            return { reviews: [], total: 0, message: 'Empresa sem nenhuma avaliação' };
        }

        return {
            reviews: reviews.map(r => this._mapToDomainEntity(r)),
            total: reviews.length
        };
    }

    _mapToDomainEntity(record) {
        return new Review(
            record.idOrder,
            record.idClient,
            record.rating,
            record.comment,
            record.createdAt,
            record.updatedAt
        );
    }
}

export default PostgresReviewRepository;