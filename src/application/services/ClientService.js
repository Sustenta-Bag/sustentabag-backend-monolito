import AppError from "../../infrastructure/errors/AppError.js";
import bcrypt from "bcrypt";
import FirebaseService from "./FirebaseService.js";
import { Op } from "sequelize";

class ClientService {
  constructor(clientRepository, authService) {
    this.clientRepository = clientRepository;
    this.firebaseService = new FirebaseService();
    this.authService = authService;
  }

  async createClient(clientData, userData) {
    const existingCpf = await this.clientRepository.getClient({
      cpf: clientData.cpf
    });
    if (existingCpf) {
      throw new AppError("CPF já cadastrado", "CPF_ALREADY_EXISTS");
    }

    const existingEmail = await this.clientRepository.getClient({
      email: clientData.email
    });
    if (existingEmail) {
      throw new AppError("Email já cadastrado", "EMAIL_ALREADY_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(clientData.password, 10);

    let firebaseUser = null;
        try {
      console.log("Criando usuário no Firebase...");
      firebaseUser = await this.firebaseService.createUser({
        ...clientData,
        password: clientData.password,
      });
      
      if (firebaseUser && firebaseUser.uid) {
        console.log("Usuário criado no Firebase com ID:", firebaseUser.uid);
      } else {
        console.warn("Firebase não inicializado ou indisponível. Continuando sem integração Firebase.");
      }
    } catch (firebaseError) {
      console.error("Erro ao criar usuário no Firebase:", firebaseError);
      if (firebaseError.code === 'auth/invalid-api-key') {
        console.error("Erro na chave de API do Firebase. Verifique as variáveis de ambiente.");
      }
    }

    try {
      console.log("Tentando salvar no banco local...");
      const newClient = await this.clientRepository.create({
        ...clientData,
        password: hashedPassword,
        firebaseId: firebaseUser?.uid || null,
      });
      console.log("Usuário salvo no banco local com ID:", newClient.id);

      if (firebaseUser?.uid) {
        await this.firebaseService.updateLocalIdInFirestore(
          firebaseUser.uid,
          newClient.id
        );
      }

      this.authService.registerClient(clientData, userData)

    } catch (error) {
      console.error("Erro ao salvar usuário no banco local:", error);
      next(error);
      throw error;
    }
  }

  async getClient(id, includeAddress) {
    let client;
    if (includeAddress === true) {
      client = await this.clientRepository.findByIdWithAddress(id);
    } else {
      client = await this.clientRepository.getClient({where: id});
    }
    if (!client) {
      throw AppError.notFound("Cliente", id);
    }
    return client;
  }

  async getAllClients(page, limit, filters) {
    const offset = (page - 1) * limit;
    const where = {};
    if (filters.name) {
      where.name = { [Op.iLike]: `%${filters.name}%` };
    }
    if (filters.email) {
      where.email = { [Op.iLike]: `%${filters.email}%` };
    }
    if (filters.cpf) {
      where.cpf = { [Op.iLike]: `%${filters.cpf}%` };
    }
    if (filters.phone) {
      where.phone = { [Op.iLike]: `%${filters.phone}%` };
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if(filters.includeAddress === true) {
      const result = await this.clientRepository.findAllWithAddressAndCount(
        offset,
        limit,
        where
      );
      return {
        data: result.rows,
        pages: Math.ceil(result.count / limit),
        total: result.count
      }
    } else {
      const result = await this.clientRepository.findAll(offset, limit, where);
      return {
        data: result.rows,
        pages: Math.ceil(result.count / limit),
        total: result.count
      }
    }
  }

  async updateClient(id, clientData) {
    const existingClient = await this.clientRepository.getClient({id: id});
    if (!existingClient) {
      throw AppError.notFound("Cliente", id);
    }

    if (clientData.email && clientData.email !== existingClient.email) {
      const clientWithEmail = await this.clientRepository.getClient({
        email: clientData.email
      });
      if (clientWithEmail && clientWithEmail.id !== id) {
        throw new AppError(
          "Email já cadastrado por outro cliente",
          "EMAIL_ALREADY_EXISTS"
        );
      }
    }

    if (clientData.cpf && clientData.cpf !== existingClient.cpf) {
      const clientWithCpf = await this.clientRepository.getClient({
        cpf: clientData.cpf
      });
      if (clientWithCpf && clientWithCpf.id !== id) {
        throw new AppError(
          "CPF já cadastrado por outro cliente",
          "CPF_ALREADY_EXISTS"
        );
      }
    }

    if (clientData.password) {
      clientData.password = await bcrypt.hash(clientData.password, 10);
    }

    if (clientData.idAddress) {
      const address = await this.clientRepository.getAddress(clientData.idAddress);
      if (!address) {
        throw new AppError("Endereço não existe", "ADDRESS_NOT_FOUND");
      }
    }

    return await this.clientRepository.update(id, clientData);
  }

  async deleteClient(id) {
    const existing = await this.clientRepository.getClient({ id });
    if (!existing) {
      throw AppError.notFound("Cliente", id);
    }
    return await this.clientRepository.delete(id);
  }

  async changeClientStatus(id, status) {
    parseInt(status);
    if (status !== 0 && status !== 1) {
      throw new AppError(
        "Status inválido. Deve ser 0 (inativo) ou 1 (ativo)",
        "INVALID_STATUS"
      );
    }

    const client = await this.clientRepository.getClient({ id });
    if (!client) {
      throw AppError.notFound("Cliente", id);
    }

    return await this.clientRepository.update(id, { status });
  }

  async authenticateClient(cpf, password) {
    const client = await this.clientRepository.findByCpf(cpf);

    if (!client) {
      throw new AppError("Credenciais inválidas", "INVALID_CREDENTIALS", 401);
    }

    if (client.status !== 1) {
      throw new AppError("Conta inativa", "ACCOUNT_INACTIVE", 401);
    }

    const passwordMatch = await bcrypt.compare(password, client.password);

    if (!passwordMatch) {
      throw new AppError("Credenciais inválidas", "INVALID_CREDENTIALS", 401);
    }

    return client;
  }
}

export default ClientService;
