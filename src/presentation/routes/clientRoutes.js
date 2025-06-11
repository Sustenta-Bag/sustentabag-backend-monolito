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

export const setupClientRoutes = (router, options = {}) => {
  const clientRepository = options.clientRepository || new PostgresClientRepository();
  const userRepository = options.userRepository || new UserRepository();
  const businessRepository = options.businessRepository || new PostgresBusinessRepository();

  const authService = new AuthService(userRepository, clientRepository, businessRepository);
  const clientService = new ClientService(clientRepository, authService);
  const clientController = new ClientController(clientService);
  

  router.post(`/`,
    /*
    #swagger.path = '/api/clients'
    #swagger.tags = ["Client"]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#components/schemas/Client' },
    }
    #swagger.responses[201]
    */
    validateCreateClient, 
    clientController.createClient.bind(clientController)
  );
  
   router.get(`/`,
    /*
    #swagger.path = '/api/clients'
    #swagger.tags = ["Client"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/ForbiddenError" }
    }
    */
    authenticate,
    requireBusinessRole,
    clientController.getAllClients.bind(clientController)
  );
  
  router.get(`/:id`,
    /*
    #swagger.path = '/api/clients/{id}'
    #swagger.tags = ["Client"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/ForbiddenError" }
    }
    */
    authenticate,
    requireAnyRole,
    validateClientId,
    clientController.getClient.bind(clientController)
  );
  
  router.put(`/:id`,
    /*
    #swagger.path = '/api/clients/{id}'
    #swagger.tags = ["Client"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#components/schemas/Client' },
    }
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/ForbiddenError" }
    }
    */
    authenticate,
    requireClientRole,
    validateUpdateClient,
    clientController.updateClient.bind(clientController)
  );
  
  router.delete(`/:id`,
    /*
    #swagger.path = '/api/clients/{id}'
    #swagger.tags = ["Client"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/ForbiddenError" }
    }
    */
    authenticate,
    requireClientRole,
    validateClientId, 
    clientController.deleteClient.bind(clientController)
  );
  
  router.patch(`/:id/status`, 
    /*
    #swagger.path = '/api/clients/{id}/status'
    #swagger.tags = ["Client"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#components/schemas/UpdateStatus' },
    }
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/ForbiddenError" }
    }
    */
    authenticate,
    requireClientRole,
    validateStatusUpdate,
    clientController.updateStatus.bind(clientController)
  );
};