import { Router } from 'express';
import multer from 'multer';
import { multerConfig } from '../../config/multer.js';
import { DiskStorage } from '../../infrastructure/storage/diskStorage.js';

import BusinessController from '../controllers/businessController.js';
import BusinessService from '../../application/services/BusinessService.js';
import PostgresBusinessRepository from '../../infrastructure/repositories/PostgresBusinessRepository.js';
import PostgresAddressRepository from '../../infrastructure/repositories/PostgresAddressRepository.js';
import {
  validateCreateBusiness,
  validateUpdateBusiness,
  validateBusinessId,
  validateStatusUpdate,
} from '../middleware/businessValidation.js';
import { 
  authenticate, 
  requireBusinessRole,
} from '../middleware/authMiddleware.js';

export default (options = {}) => {
  const businessRepository = options.businessRepository || new PostgresBusinessRepository();
  const addressRepository = options.addressRepository || new PostgresAddressRepository();
  const diskStorage = options.diskStorage || new DiskStorage();
  const businessService = new BusinessService(businessRepository, addressRepository, diskStorage);
  const businessController = new BusinessController(businessService);
  const upload = multer(multerConfig);

  const router = Router();

  router.post(`/`, upload.single('logo'), validateCreateBusiness, businessController.createBusiness.bind(businessController));
  router.get(`/`, businessController.listBusinesses.bind(businessController));
  router.get(`/:id`, validateBusinessId, businessController.getBusiness.bind(businessController));
  router.put(`/:id`, authenticate, requireBusinessRole, upload.single('logo'), validateBusinessId, validateUpdateBusiness, businessController.updateBusiness.bind(businessController));
  router.delete(`/:id`, authenticate, requireBusinessRole, validateBusinessId, businessController.deleteBusiness.bind(businessController));
  router.patch(`/:id/status`, authenticate, requireBusinessRole, validateBusinessId, validateStatusUpdate, businessController.changeBusinessStatus.bind(businessController));

  return router;
};