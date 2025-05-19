import AppError from "../../infrastructure/errors/AppError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

class ClientController {
  constructor(clientService) {
    this.clientService = clientService;
  }

  async createClient(req, res, next) {
    try {
      const client = await this.clientService.createClient(req.body);
      return res.status(201).json(client);
    } catch (error) {
      next(error);
    }
  }  async getClient(req, res, next) {
    try {
      const includeAddress = req.query.includeAddress === 'true';
      const client = await this.clientService.getClient(req.params.id, { includeAddress });
      
      if (!client) {
        return next(new AppError('Cliente não encontrado', 'CLIENT_NOT_FOUND', 404));
      }
      
      return res.json(client);
    } catch (error) {
      next(error);
    }
  }

  async getAllClients(req, res, next) {
    try {
      const includeAddress = req.query.includeAddress === 'true';
      const clients = await this.clientService.getAllClients({ includeAddress });
      return res.json(clients);
    } catch (error) {
      next(error);
    }
  }  async updateClient(req, res, next) {
    try {
      const client = await this.clientService.updateClient(req.params.id, req.body);
      
      if (!client) {
        return next(new AppError('Cliente não encontrado', 'CLIENT_NOT_FOUND', 404));
      }
      
      return res.json(client);
    } catch (error) {
      next(error);
    }
  }

  async deleteClient(req, res, next) {
    try {
      await this.clientService.deleteClient(req.params.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }  async updateStatus(req, res, next) {
    try {
      if (req.body.status === undefined) {
        return next(new AppError('Status é obrigatório', 'MISSING_STATUS', 400));
      }
      
      const client = await this.clientService.updateStatus(req.params.id, req.body.status);
      
      if (!client) {
        return next(new AppError('Cliente não encontrado', 'CLIENT_NOT_FOUND', 404));
      }
      
      return res.json(client);
    } catch (error) {
      next(error);
    }
  }

  async getActiveClients(req, res, next) {
    try {
      const includeAddress = req.query.includeAddress === 'true';
      const clients = await this.clientService.getActiveClients({ includeAddress });
      return res.json(clients);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const client = await this.clientService.findByEmail(email);
      if (!client) {
        throw new AppError("Email ou senha inválidos", "INVALID_CREDENTIALS");
      }

      const isValid = await bcrypt.compare(password, client.password);
      if (!isValid) {
        throw new AppError("Email ou senha inválidos", "INVALID_CREDENTIALS");
      }

      const token = jwt.sign(
        { id: client.id, role: "client" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        token,
        client: {
          id: client.id,
          name: client.name,
          email: client.email,
          cpf: client.cpf,
          phone: client.phone,
          status: client.status
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default ClientController;
