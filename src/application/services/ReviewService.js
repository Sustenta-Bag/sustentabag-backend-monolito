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
            throw new Error('Order already reviewed');
        }

        const order = await this.reviewRepository.orderRepository.findById(data.idOrder);
        if(!order) {
            throw new Error('Order not found');
        }

        if(order.status !== 'entregue') {
            throw new Error('Order not delivered yet');
        }

        return await this.reviewRepository.create(data);
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