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

export const setupRoutes = (router, options = {}) => {
  const bagRepository = options.bagRepository || new PostgresBagRepository();
  const bagService = new BagService(bagRepository);
  const bagController = new BagController(bagService);

  const routePrefix = '/bags';
  
  router.post(`${routePrefix}`, validateCreateBag, bagController.createBag.bind(bagController));
  
  router.get(`${routePrefix}`, bagController.getAllBags.bind(bagController));
  
  router.get(`${routePrefix}/:id`, validateBagId, bagController.getBag.bind(bagController));
  
  router.put(`${routePrefix}/:id`, validateUpdateBag, bagController.updateBag.bind(bagController));
  
  router.delete(`${routePrefix}/:id`, validateBagId, bagController.deleteBag.bind(bagController));

  router.get(`/company/:companyId${routePrefix}`, validateCompanyId, bagController.getBagsByCompany.bind(bagController));

  router.get(`/company/:companyId${routePrefix}/active`, validateCompanyId, bagController.getActiveBagsByCompany.bind(bagController));

  router.patch(`${routePrefix}/:id/status`, validateStatusUpdate, bagController.changeBagStatus.bind(bagController));
};