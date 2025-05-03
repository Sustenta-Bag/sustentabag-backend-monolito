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
import { 
  authenticate, 
  requireBusinessRole, 
  requireClientRole, 
  requireAnyRole 
} from '../middleware/authMiddleware.js';

export const setupClientRoutes = (router, options = {}) => {
  const clientRepository = options.clientRepository || new PostgresClientRepository();
  const clientService = new ClientService(clientRepository);
  const clientController = new ClientController(clientService);
  
  // This route should be deprecated in favor of the unified auth system
  router.post(`/auth/login`,
    /*
    #swagger.path = '/api/clients/auth/login'
    #swagger.tags = ["Client"]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#components/schemas/LoginInput' },
    }
    #swagger.responses[200]
    #swagger.deprecated = true
    */
    validateLogin, 
    clientController.login.bind(clientController)
  );

  // Public route for registration
  router.post(`/`,
    /*
    #swagger.path = '/api/clients'
    #swagger.tags = ["Client"]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#components/schemas/ClientInput' },
    }
    #swagger.responses[201]
    */
    validateCreateClient, 
    clientController.createClient.bind(clientController)
  );
  
   // Admin or business route to get all clients
   router.get(`/`,
    /*
    #swagger.path = '/api/clients'
    #swagger.tags = ["Client"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/Error" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/Error" }
    }
    */
    authenticate,
    requireBusinessRole,
    clientController.getAllClients.bind(clientController)
  );
  
  // IMPORTANTE: Mover a rota /active para antes da rota /:id
  // Admin or business route to get active clients
  router.get(`/active`,
    /*
    #swagger.path = '/api/clients/active'
    #swagger.tags = ["Client"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.description = "Retorna apenas clientes ativos (status=1)"
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/Error" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/Error" }
    }
    */
    authenticate,
    requireBusinessRole,
    clientController.getActiveClients.bind(clientController)
  );
  
  // Client can get own data, business can view client data
  router.get(`/:id`,
    /*
    #swagger.path = '/api/clients/{id}'
    #swagger.tags = ["Client"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/Error" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/Error" }
    }
    */
    authenticate,
    requireAnyRole,
    validateClientId,
    clientController.getClient.bind(clientController)
  );
  
  // Client can update own data only
  router.put(`/:id`,
    /*
    #swagger.path = '/api/clients/{id}'
    #swagger.tags = ["Client"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#components/schemas/ClientInput' },
    }
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/Error" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/Error" }
    }
    */
    authenticate,
    requireClientRole,
    validateUpdateClient,
    clientController.updateClient.bind(clientController)
  );
  
  // Admin function
  router.delete(`/:id`,
    /*
    #swagger.path = '/api/clients/{id}'
    #swagger.tags = ["Client"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/Error" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/Error" }
    }
    */
    authenticate,
    requireClientRole,
    validateClientId, 
    clientController.deleteClient.bind(clientController)
  );
  
  // Client can disable own account, admin can disable any client
  router.patch(`/:id/status`, 
    /*
    #swagger.path = '/api/clients/{id}/status'
    #swagger.tags = ["Client"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/Error" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/Error" }
    }
    */
    authenticate,
    requireClientRole,
    validateStatusUpdate,
    clientController.changeClientStatus.bind(clientController)
  );
};