import AppError from "../../infrastructure/errors/AppError.js";
import jwt from "jsonwebtoken";

class ClientController {
  constructor(clientService) {
    this.clientService = clientService;
  }

  async createClient(req, res, next) {
    try {
      const client = await this.clientService.createClient(req.body);

      // Remove sensitive data before sending response
      const { password, ...clientData } = client;

      return res.status(201).json(clientData);
    } catch (error) {
      next(error);
    }
  }

  async getClient(req, res, next) {
    try {
      const client = await this.clientService.getClient(req.params.id);

      // Remove sensitive data before sending response
      const { password, ...clientData } = client;

      return res.json(clientData);
    } catch (error) {
      next(error);
    }
  }

  async getAllClients(req, res, next) {
    try {
      const clients = await this.clientService.getAllClients();

      // Remove sensitive data before sending response
      const clientsData = clients.map((client) => {
        const { password, ...clientData } = client;
        return clientData;
      });

      return res.json(clientsData);
    } catch (error) {
      next(error);
    }
  }

  async updateClient(req, res, next) {
    try {
      const client = await this.clientService.updateClient(
        req.params.id,
        req.body
      );

      // Remove sensitive data before sending response
      const { password, ...clientData } = client;

      return res.json(clientData);
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
  }

  async getActiveClients(req, res, next) {
    try {
      const clients = await this.clientService.getActiveClients();

      // Remove sensitive data before sending response
      const clientsData = clients.map((client) => {
        const { password, ...clientData } = client;
        return clientData;
      });

      return res.json(clientsData);
    } catch (error) {
      next(error);
    }
  }

  async changeClientStatus(req, res, next) {
    try {
      if (req.body.status === undefined) {
        throw new AppError("Status não fornecido", "MISSING_STATUS");
      }

      const client = await this.clientService.changeClientStatus(
        req.params.id,
        req.body.status
      );

      // Remove sensitive data before sending response
      const { password, ...clientData } = client;

      return res.json(clientData);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { cpf, password } = req.body;
  
      if (!cpf || !password) {
        throw new AppError(
          "CPF e senha são obrigatórios",
          "MISSING_CREDENTIALS",
          400
        );
      }
  
      const client = await this.clientService.findByCpf(cpf);
      if (!client) {
        throw new AppError("Credenciais inválidas", "INVALID_CREDENTIALS", 401);
      }
  
      // Find the user associated with this client
      const user = await this.userRepository.findByEntityId(client.id, "client");
      if (!user) {
        throw new AppError("Usuário não encontrado", "USER_NOT_FOUND", 404);
      }
  
      // Verify password from user record
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new AppError("Credenciais inválidas", "INVALID_CREDENTIALS", 401);
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role, 
          entityId: client.id,
          firebaseId: user.firebaseId
        },
        process.env.JWT_SECRET || "sustentabag_secret_key",
        { expiresIn: process.env.JWT_EXPIRATION || "24h" }
      );
  
      return res.json({
        user,
        client,
        token,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default ClientController;
