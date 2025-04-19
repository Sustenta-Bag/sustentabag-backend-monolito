import express from 'express';
import ClientController from '../controllers/ClientController.js';
import ClientService from '../../application/services/ClientService.js';
import PostgresClientRepository from '../../infrastructure/repositories/PostgresClientRepository.js';
import { 
  validateCreateClient, 
  validateUpdateClient, 
  validateClientId, 
  validateStatusUpdate,
  validateLogin 
} from '../middleware/clientValidation.js';
import { authenticate } from '../middleware/authMiddleware.js';

export const setupClientRoutes = (router, options = {}) => {
  const clientRepository = options.clientRepository || new PostgresClientRepository();
  const clientService = new ClientService(clientRepository);
  const clientController = new ClientController(clientService);

  const routePrefix = '/clients';
  
  // Public routes
  router.post(`/auth/login`, validateLogin, clientController.login.bind(clientController));
  router.post(`${routePrefix}`, validateCreateClient, clientController.createClient.bind(clientController));
  
  // Protected routes
  router.get(`${routePrefix}`, authenticate, clientController.getAllClients.bind(clientController));
  router.get(`${routePrefix}/active`, authenticate, clientController.getActiveClients.bind(clientController));
  router.get(`${routePrefix}/:id`, authenticate, validateClientId, clientController.getClient.bind(clientController));
  router.put(`${routePrefix}/:id`, authenticate, validateUpdateClient, clientController.updateClient.bind(clientController));
  router.delete(`${routePrefix}/:id`, authenticate, validateClientId, clientController.deleteClient.bind(clientController));
  router.patch(`${routePrefix}/:id/status`, authenticate, validateStatusUpdate, clientController.changeClientStatus.bind(clientController));

  return router;
};