import express from 'express';
import BagController from '../controllers/BagController.js';
import BagService from '../../application/services/BagService.js';
import PostgresBagRepository from '../../infrastructure/repositories/PostgresBagRepository.js';
import { 
  validateCreateBag, 
  validateUpdateBag, 
  validateBagId, 
  validateCompanyId,
  validateStatusUpdate
} from '../middleware/bagValidation.js';
import { authenticate } from '../middleware/authMiddleware.js';


export const setupRoutes = (router, options = {}) => {
  const bagRepository = options.bagRepository || new PostgresBagRepository();
  const bagService = new BagService(bagRepository);
  const bagController = new BagController(bagService);

  const routePrefix = '/bags';
  
  router.post(`${routePrefix}`, authenticate, validateCreateBag, bagController.createBag.bind(bagController));
  
  router.get(`${routePrefix}`, authenticate, bagController.getAllBags.bind(bagController));
  
  router.get(`${routePrefix}/:id`, authenticate, validateBagId, bagController.getBag.bind(bagController));
  
  router.put(`${routePrefix}/:id`, authenticate, validateUpdateBag, bagController.updateBag.bind(bagController));
  
  router.delete(`${routePrefix}/:id`, authenticate, validateBagId, bagController.deleteBag.bind(bagController));

  router.get(`/company/:companyId${routePrefix}`, authenticate, validateCompanyId, bagController.getBagsByCompany.bind(bagController));

  router.get(`/company/:companyId${routePrefix}/active`, authenticate, validateCompanyId, bagController.getActiveBagsByCompany.bind(bagController));

  router.patch(`${routePrefix}/:id/status`, authenticate, validateStatusUpdate, bagController.changeBagStatus.bind(bagController));
};