import { Router } from 'express';
import ClientController from '../controllers/ClientController.js';
import ClientService from '../../application/services/ClientService.js';
import PostgresClientRepository from '../../infrastructure/repositories/PostgresClientRepository.js';
import AuthService from '../../application/services/AuthService.js';
import UserRepository from '../../infrastructure/repositories/UserRepository.js';
import PostgresBusinessRepository from '../../infrastructure/repositories/PostgresBusinessRepository.js';
import {
  validateCreateClient,
  validateUpdateClient,
  validateClientId,
  validateStatusUpdate,
} from '../middleware/clientValidation.js';
import {
  authenticate,
  requireBusinessRole,
  requireClientRole,
  requireAnyRole
} from '../middleware/authMiddleware.js';

export default (options = {}) => {
  const clientRepository = options.clientRepository || new PostgresClientRepository();
  const userRepository = options.userRepository || new UserRepository();
  const businessRepository = options.businessRepository || new PostgresBusinessRepository();

  const authService = new AuthService(userRepository, clientRepository, businessRepository);
  const clientService = new ClientService(clientRepository, authService);
  const clientController = new ClientController(clientService);

  const router = Router();

  router.post(`/`, validateCreateClient, clientController.createClient.bind(clientController));
  router.get(`/`, authenticate, requireBusinessRole, clientController.getAllClients.bind(clientController));
  router.get(`/:id`, authenticate, requireAnyRole, validateClientId, clientController.getClient.bind(clientController));
  router.put(`/:id`, authenticate, requireClientRole, validateUpdateClient, clientController.updateClient.bind(clientController));
  router.delete(`/:id`, authenticate, requireClientRole, validateClientId, clientController.deleteClient.bind(clientController));
  router.patch(`/:id/status`, authenticate, requireClientRole, validateStatusUpdate, clientController.updateStatus.bind(clientController));

  return router;
};