import Review from '../../domain/entities/Review.js';

class ReviewService {
    constructor(reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    async createReview(data) {
        const existing = await this.reviewRepository.findAll({
            where: {
                idOrder: data.idOrder,
                idClient: data.idClient,
            }
        });

        if(existing && existing.length > 0) {
            throw new Error('Order already reviewed')
        }

        const review = new Review(data.idClient, data.idOrder, data.rating, data.comment);
        return await this.reviewRepository.create(review);
    }

    async listReviews({ page, limit, idClient, idBusiness, rating }) {
        const offset = (page - 1) * limit;
        const options = { offset, limit };
        
        return await this.reviewRepository.findAll(options, idClient, idBusiness, rating);
    }

    async deleteReview(id) {
        return await this.reviewRepository.delete(id);
    }
}

export default ReviewService;