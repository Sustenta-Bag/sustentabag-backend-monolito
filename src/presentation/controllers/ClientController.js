import AppError from "../../infrastructure/errors/AppError.js";

class ClientController {
  constructor(clientService) {
    this.clientService = clientService;
  }

  async createClient(req, res, next) {
    try {
      await this.clientService.createClient(req.body);
      return res.created();
    } catch (error) {
      next(error);
    }
  }  
  
  async getClient(req, res, next) {
    try {
      let includeAddress = req.query.includeAddress;
      includeAddress === true || 'true' ? includeAddress = true : includeAddress = false;
      const client = await this.clientService.getClient(req.params.id, includeAddress);
      
      if (!client) {
        return next(new AppError('Cliente não encontrado', 'CLIENT_NOT_FOUND', 404));
      }
      
      return res.hateoasItem(client);
    } catch (error) {
      next(error);
    }
  }

  async getAllClients(req, res, next) {
    try {
      const { page, limit } = req.query;
      const filters = {
        includeAddress: req.query.includeAddress === 'true' ? true : false,
        name: req.query.name || '',
        email: req.query.email || '',
        cpf: req.query.cpf || '',
        phone: req.query.phone || '',
        status: req.query.status || '',
      }

      const clients = await this.clientService.getAllClients(
        page ? parseInt(page) : 1,
        limit ? parseInt(limit) : 10,
        filters
      );

      return res.hateoasList(clients.data, clients.pages);
    } catch (error) {
      next(error);
    }
  }  
  
  async updateClient(req, res, next) {
    try {
      req.params.id = req.user.entityId;
      if (req.params.id !== req.user.entityId) {
        return next(new AppError('Você não tem permissão para atualizar este cliente', 'UNAUTHORIZED', 403));
      }
      const client = await this.clientService.updateClient(req.params.id, req.body);
      
      if (!client) {
        return next(new AppError('Cliente não encontrado', 'CLIENT_NOT_FOUND', 404));
      }
      
      return res.ok(client);
    } catch (error) {
      next(error);
    }
  }

  async deleteClient(req, res, next) {
    try {
      req.params.id = req.user.entityId;
      if (req.params.id !== req.user.entityId) {
        return next(new AppError('Você não tem permissão para deletar este cliente', 'UNAUTHORIZED', 403));
      }
      await this.clientService.deleteClient(req.params.id);
      return res.no_content();
    } catch (error) {
      next(error);
    }
  }  
  
  async updateStatus(req, res, next) {
    try {
      if (parseInt(req.params.id) !== req.user.entityId) {
        return next(new AppError('Você não tem permissão para atualizar o status deste cliente', 'UNAUTHORIZED', 403));
      }

      if (req.body.status === undefined) {
        return next(new AppError('Status é obrigatório', 'MISSING_STATUS', 400));
      }
      
      const client = await this.clientService.changeClientStatus(req.params.id, req.body.status);
      
      if (!client) {
        return next(new AppError('Cliente não encontrado', 'CLIENT_NOT_FOUND', 404));
      }
      
      return res.ok(client);
    } catch (error) {
      next(error);
    }
  }
}

export default ClientController;
