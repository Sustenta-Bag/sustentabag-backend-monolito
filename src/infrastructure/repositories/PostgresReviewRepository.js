import reviewRepository from '../repositories/ReviewRepository.js';
import Review from '../../domain/entities/Review.js';
import ReviewModel from '../../domain/models/ReviewModel.js';
import ClientModel from '../../domain/models/ClientModel.js';

class PostgresReviewRepository extends reviewRepository {
    constructor(reviewModel = ReviewModel, orderRepository, clientModel = ClientModel) {
        super();
        this.ReviewModel = reviewModel;
        this.orderRepository = orderRepository;
        this.ClientModel = clientModel;
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

    async findAll(options = {}, idClient, idBusiness, rating) {
        if (idClient) {
            options.where = { idClient };
        }
        if(idBusiness) {
            return await this._findAllByBusiness(idBusiness);
        }
        if(rating) {
            return this._findBusinessesByRating(rating);
        }

        options.include = [{
            model: this.ClientModel,
            as: 'client',
            attributes: ['name']
        }];

        const records = await this.ReviewModel.findAll(options);
        return records.map(r => ({
            clientName: r.client ? r.client.name : null,
            ...this._mapToDomainEntity(r)
        }));
    }

    async _findAllByBusiness(idBusiness) {
        const orders = await this.orderRepository.findAll({ idBusiness: idBusiness });
        const orderIds = orders.rows.map(order => order.id);

        if (orderIds.length === 0) 
            return { reviews: [], total: 0, message: 'Empresa sem pedidos' };

        const reviews = await this.ReviewModel.findAll({
            where: { idOrder: orderIds },
            include: [{
                model: this.ClientModel,
                as: 'client',
                attributes: ['name']
            }]
        });

        if (reviews.length === 0) {
            return { reviews: [], total: 0, message: 'Empresa sem nenhuma avaliação' };
        }

        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

        return {
            reviews: reviews.map(r => ({
                clientName: r.client ? r.client.name : null,
                ...this._mapToDomainEntity(r)
            })),
            total: reviews.length,
            avgRating: avgRating.toFixed(2),
        };
    }

    async _findBusinessesByRating(rating) {
        const businesses = await this.orderRepository.findAllBusinessWithOrders();

        const result = [];

        for (const business of businesses) {
            const { avgRating } = await this._findAllByBusiness(business.businessId);
            if (avgRating !== null && avgRating >= rating) {
                result.push({
                    businessId: business.businessId,
                    avgRating
                });
            }
        }

        return result;
}

    _mapToDomainEntity(record) {
        return new Review(
            record.idOrder,
            record.idClient,
            record.rating,
            record.comment,
            record.createdAt,
            record.updatedAt,
            record.idReview,
        );
    }
}

export default PostgresReviewRepository;