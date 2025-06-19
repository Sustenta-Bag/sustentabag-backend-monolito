import { Router } from 'express';
import BagController from '../controllers/BagController.js';
import BagService from '../../application/services/BagService.js';
import PostgresBagRepository from '../../infrastructure/repositories/PostgresBagRepository.js';
import PostgresFavoriteRepository from '../../infrastructure/repositories/PostgresFavoriteRepository.js';
import UserRepository from '../../infrastructure/repositories/UserRepository.js';
import {
  validateCreateBag,
  validateUpdateBag,
  validateBagId,
  validateStatusUpdate
} from '../middleware/bagValidation.js';
import {
  authenticate,
  requireBusinessRole,
  requireAnyRole
} from '../middleware/authMiddleware.js';

export default (options = {}) => {
  const bagRepository = options.bagRepository || new PostgresBagRepository();
  const favoriteRepository = options.favoriteRepository || new PostgresFavoriteRepository();
  const authRepository = options.authRepository || new UserRepository();

  const bagService = options.bagService || new BagService(bagRepository, favoriteRepository, authRepository);
  const bagController = new BagController(bagService);

  const router = Router();

  router.post(`/`, authenticate, requireBusinessRole, validateCreateBag, bagController.createBag.bind(bagController));
  router.get(`/`, authenticate, requireAnyRole, bagController.getAllBags.bind(bagController));
  router.get('/tags', authenticate, requireAnyRole, bagController.getAllowedTags.bind(bagController));
  router.get(`/:id`, authenticate, requireAnyRole, validateBagId, bagController.getBag.bind(bagController));
  router.put(`/:id`, authenticate, requireBusinessRole, validateUpdateBag, bagController.updateBag.bind(bagController));
  router.delete(`/:id`, authenticate, requireBusinessRole, validateBagId, bagController.deleteBag.bind(bagController));
  router.patch(`/:id/status`, authenticate, requireBusinessRole, validateStatusUpdate, bagController.changeBagStatus.bind(bagController));

  return router;
};