import Client from "../../domain/entities/Client.js";
import AppError from "../../infrastructure/errors/AppError.js";
import bcrypt from "bcrypt";
import FirebaseService from "./FirebaseService.js";

class ClientService {
  constructor(clientRepository) {
    this.clientRepository = clientRepository;
    this.firebaseService = new FirebaseService();
  }

  async createClient(clientData, userData) {
    const existingClientByCpf = await this.clientRepository.findByCpf(
      clientData.cpf
    );
    if (existingClientByCpf) {
      throw new AppError("CPF já cadastrado", "CPF_ALREADY_EXISTS");
    }

    const existingClientByEmail = await this.clientRepository.findByEmail(
      clientData.email
    );
    if (existingClientByEmail) {
      throw new AppError("Email já cadastrado", "EMAIL_ALREADY_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(clientData.password, 10);

    let firebaseUser = null;
        try {
      console.log("Criando usuário no Firebase...");
      // Criar usuário no Firebase
      firebaseUser = await this.firebaseService.createUser({
        ...clientData,
        password: clientData.password,
      });
      
      // Check if Firebase user was created successfully
      if (firebaseUser && firebaseUser.uid) {
        console.log("Usuário criado no Firebase com ID:", firebaseUser.uid);
      } else {
        console.warn("Firebase não inicializado ou indisponível. Continuando sem integração Firebase.");
      }
    } catch (firebaseError) {
      console.error("Erro ao criar usuário no Firebase:", firebaseError);
      // Log specific error details but continue with local user creation
      if (firebaseError.code === 'auth/invalid-api-key') {
        console.error("Erro na chave de API do Firebase. Verifique as variáveis de ambiente.");
      }
      // Continuamos com a criação do usuário local mesmo se falhar no Firebase
    }

    try {
      console.log("Tentando salvar no banco local...");
      // Agora salvar no banco de dados local (com ou sem ID do Firebase)
      const newClient = await this.clientRepository.create({
        ...clientData,
        password: hashedPassword,
        firebaseId: firebaseUser?.uid || null,
      });
      console.log("Usuário salvo no banco local com ID:", newClient.id);

      // Atualizar o ID local no documento do Firestore (opcional, só se tiver firebaseUser)
      if (firebaseUser?.uid) {
        await this.firebaseService.updateLocalIdInFirestore(
          firebaseUser.uid,
          newClient.id
        );
      }

      this.authService.registerClient(clientData, userData)

    } catch (error) {
      console.error("Erro ao salvar usuário no banco local:", error);
      throw error;
    }
  }

  async getClient(id) {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw AppError.notFound("Cliente", id);
    }
    return client;
  }

  async getAllClients() {
    return await this.clientRepository.findAll();
  }

  async updateClient(id, clientData) {
    // Check if client exists
    const existingClient = await this.clientRepository.findById(id);
    if (!existingClient) {
      throw AppError.notFound("Cliente", id);
    }

    // If updating email, check if it's already used by another client
    if (clientData.email && clientData.email !== existingClient.email) {
      const clientWithEmail = await this.clientRepository.findByEmail(
        clientData.email
      );
      if (clientWithEmail && clientWithEmail.id !== id) {
        throw new AppError(
          "Email já cadastrado por outro cliente",
          "EMAIL_ALREADY_EXISTS"
        );
      }
    }

    // If updating CPF, check if it's already used by another client
    if (clientData.cpf && clientData.cpf !== existingClient.cpf) {
      const clientWithCpf = await this.clientRepository.findByCpf(
        clientData.cpf
      );
      if (clientWithCpf && clientWithCpf.id !== id) {
        throw new AppError(
          "CPF já cadastrado por outro cliente",
          "CPF_ALREADY_EXISTS"
        );
      }
    }

    // Hash password if it's being updated
    if (clientData.password) {
      clientData.password = await bcrypt.hash(clientData.password, 10);
    }

    const client = await this.clientRepository.update(id, clientData);
    return client;
  }

  async deleteClient(id) {
    const result = await this.clientRepository.delete(id);
    if (!result) {
      throw AppError.notFound("Cliente", id);
    }
    return result;
  }

  async getActiveClients() {
    return await this.clientRepository.findActiveClients();
  }

  async changeClientStatus(id, status) {
    if (typeof status === "boolean") {
      status = status ? 1 : 0;
    }

    if (status !== 0 && status !== 1) {
      throw new AppError(
        "Status inválido. Deve ser 0 (inativo) ou 1 (ativo)",
        "INVALID_STATUS"
      );
    }

    const client = await this.clientRepository.findById(id);
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
