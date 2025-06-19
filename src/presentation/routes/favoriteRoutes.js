import { Router } from 'express';
import FavoriteController from '../controllers/favoriteController.js';
import FavoriteService from '../../application/services/FavoriteService.js';
import PostgresFavoriteRepository from '../../infrastructure/repositories/PostgresFavoriteRepository.js';
import {
  authenticate,
  requireClientRole
} from '../middleware/authMiddleware.js';

export default (options = {}) => {
  const favoriteRepository = options.favoriteRepository || new PostgresFavoriteRepository();
  const favoriteService = options.favoriteService || new FavoriteService(favoriteRepository);
  const favoriteController = new FavoriteController(favoriteService);

  const router = Router();

  router.get("/", authenticate, requireClientRole, favoriteController.listFavorites.bind(favoriteController));
  router.post("/", authenticate, requireClientRole, favoriteController.createFavorite.bind(favoriteController));
  router.delete("/:id", authenticate, requireClientRole, favoriteController.deleteFavorite.bind(favoriteController));
  router.delete("/business/:idBusiness", authenticate, requireClientRole, favoriteController.deleteFavoriteByBusiness.bind(favoriteController));

  return router;
};