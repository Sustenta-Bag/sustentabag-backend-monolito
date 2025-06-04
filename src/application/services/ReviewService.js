import Review from '../../domain/entities/Review.js';

class ReviewService {
    constructor(reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    async createReview(data) {
        const review = new Review(data.idOrder, data.idClient, data.rating, data.comment);
        return await this.reviewRepository.create(review);
    }

    async listReviews({ page = 1, limit = 10, idClient, idBusiness }) {
        const offset = (page - 1) * limit;
        const options = { offset, limit };
        
        return await this.reviewRepository.findAll(options, idClient, idBusiness);
    }

    async deleteReview(id) {
        return await this.reviewRepository.delete(id);
    }
}

export default ReviewService;