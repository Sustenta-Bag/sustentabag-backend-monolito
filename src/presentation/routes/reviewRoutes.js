import ReviewController from '../controllers/reviewController.js';
import ReviewService from '../../application/services/ReviewService.js';
import PostgresReviewRepository from '../../infrastructure/repositories/PostgresReviewRepository.js';
import PostgresOrderRepository from '../../infrastructure/repositories/PostgresOrderRepository.js';
import {
    authenticate,
    requireClientRole
} from '../middleware/authMiddleware.js';

export const setupReviewRoutes = (router, options = {}) => {
    const orderRepository = options.orderRepository || new PostgresOrderRepository();
    const reviewRepository = options.reviewRepository || new PostgresReviewRepository(undefined, orderRepository);
    const reviewService = new ReviewService(reviewRepository);
    const reviewController = new ReviewController(reviewService);

    router.get(
        /*
        #swagger.path = '/api/reviews'
        #swagger.tags = ["Reviews"]
        #swagger.consumes = ['application/json']
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['idClient'] = {
            in: 'query',
            description: 'ID of the client to filter reviews',
            required: false,
            type: 'integer'
        }
        #swagger.parameters['idBusiness'] = {
            in: 'query',
            description: 'ID of the business to filter reviews',
            required: false,
            type: 'integer'
        }
        #swagger.responses[200]
        */
        '/',
        authenticate,
        requireClientRole,
        reviewController.listReviews.bind(reviewController)
    );

    router.post(
        /*
        #swagger.path = '/api/reviews'
        #swagger.tags = ["Reviews"]
        #swagger.consumes = ['application/json']
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.requestBody = {
            required: true,
            schema: { $ref: '#/components/schemas/Review' },
        }
        #swagger.responses[201]
        */
        '/',
        authenticate,
        requireClientRole,
        reviewController.createReview.bind(reviewController)
    );

    router.delete(
        /*
        #swagger.path = '/api/reviews/{id}'
        #swagger.tags = ["Reviews"]
        #swagger.consumes = ['application/json']
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID of the review to delete',
            required: true,
            type: 'integer'
        }
        #swagger.responses[204]
        */
        '/:id',
        authenticate,
        requireClientRole,
        reviewController.deleteReview.bind(reviewController)
    );
}