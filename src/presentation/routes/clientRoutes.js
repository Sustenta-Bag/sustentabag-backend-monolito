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

export const setupClientRoutes = (router, options = {}) => {
  const clientRepository = options.clientRepository || new PostgresClientRepository();
  const clientService = new ClientService(clientRepository);
  const clientController = new ClientController(clientService);
  
  router.post(`/auth/login`,
    /*
    #swagger.path = '/api/clients/auth/login'
    #swagger.tags = ["Client"]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#components/schemas/LoginInput' },
    }
    #swagger.responses[200]
    */
    validateLogin, 
    clientController.login.bind(clientController)
  );

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
  
  router.get(`/`,
    /*
    #swagger.path = '/api/clients'
    #swagger.tags = ["Client"]
    #swagger.responses[200]
    */
    clientController.getAllClients.bind(clientController)
  );
  
  router.get(`/active`,
    /*
    #swagger.path = '/api/clients/active'
    #swagger.tags = ["Client"]
    #swagger.responses[200]
    */
    clientController.getActiveClients.bind(clientController)
  );
  
  router.get(`/:id`,
    /*
    #swagger.path = '/api/clients/{id}'
    #swagger.tags = ["Client"]
    #swagger.responses[200]
    */
    validateClientId,
    clientController.getClient.bind(clientController)
  );
  
  router.put(`/:id`,
    /*
    #swagger.path = '/api/clients/{id}'
    #swagger.tags = ["Client"]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#components/schemas/ClientInput' },
    }
    #swagger.responses[200]
    */
    validateUpdateClient,
    clientController.updateClient.bind(clientController)
  );
  
  router.delete(`/:id`,
    /*
    #swagger.path = '/api/clients/{id}'
    #swagger.tags = ["Client"]
    #swagger.responses[200]
    */
    validateClientId, 
    clientController.deleteClient.bind(clientController)
  );
  
  router.patch(`/:id/status`, 
    /*
    #swagger.path = '/api/clients/{id}/status'
    #swagger.tags = ["Client"]
    #swagger.responses[200]
    */
    validateStatusUpdate,
    clientController.changeClientStatus.bind(clientController)
  );
};