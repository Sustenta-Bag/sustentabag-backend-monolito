import { Router } from 'express';
import ReviewController from '../controllers/reviewController.js';
import ReviewService from '../../application/services/ReviewService.js';
import PostgresReviewRepository from '../../infrastructure/repositories/PostgresReviewRepository.js';
import PostgresOrderRepository from '../../infrastructure/repositories/PostgresOrderRepository.js';
import {
    authenticate,
    requireClientRole
} from '../middleware/authMiddleware.js';

export default (options = {}) => {
    const orderRepository = options.orderRepository || new PostgresOrderRepository();
    const reviewRepository = options.reviewRepository || new PostgresReviewRepository(undefined, orderRepository);
    const reviewService = new ReviewService(reviewRepository);
    const reviewController = new ReviewController(reviewService);

    const router = Router();

    router.get('/', authenticate, requireClientRole, reviewController.listReviews.bind(reviewController));
    router.post('/', authenticate, requireClientRole, reviewController.createReview.bind(reviewController));
    router.delete('/:id', authenticate, requireClientRole, reviewController.deleteReview.bind(reviewController));

    return router;
}