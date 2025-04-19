import { jest } from "@jest/globals";

// Em vez de mockar todo o módulo, vamos criar os mocks manualmente e depois atribuí-los ao módulo
const mockHash = jest.fn().mockResolvedValue("hashed_password");
const mockCompare = jest.fn().mockResolvedValue(true);

// Mockamos o módulo bcrypt
jest.mock("bcrypt", () => ({
  hash: mockHash,
  compare: mockCompare
}));

// Depois importamos os outros módulos
import ClientService from "../../../../src/application/services/ClientService.js";
import Client from "../../../../src/domain/entities/Client.js";
import AppError from "../../../../src/infrastructure/errors/AppError.js";
import bcrypt from "bcrypt";

describe("ClientService", () => {
  let mockClientRepository;
  let clientService;

  beforeEach(() => {
    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();

    mockClientRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCpf: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findActiveClients: jest.fn(),
    };

    clientService = new ClientService(mockClientRepository);
  });

  describe("createClient", () => {
    // test("should call repository create method with the correct data", async () => {
    //   const clientData = {
    //     name: "João Silva",
    //     email: "joao.silva@email.com",
    //     cpf: "12345678901",
    //     password: "senha123",
    //     phone: "11987654321",
    //   };

    //   const createdClient = new Client(
    //     1,
    //     "João Silva",
    //     "joao.silva@email.com",
    //     "12345678901",
    //     "hashed_password",
    //     "11987654321",
    //     1,
    //     new Date()
    //   );

    //   mockClientRepository.findByCpf.mockResolvedValue(null);
    //   mockClientRepository.findByEmail.mockResolvedValue(null);
    //   mockClientRepository.create.mockResolvedValue(createdClient);
    //   // Reset the mock before this test
    //   mockHash.mockClear();
    //   mockHash.mockResolvedValue("hashed_password");

    //   const result = await clientService.createClient(clientData);

    //   expect(mockClientRepository.findByCpf).toHaveBeenCalledWith("12345678901");
    //   expect(mockClientRepository.findByEmail).toHaveBeenCalledWith("joao.silva@email.com");

    //   // Verificando que hash foi chamado com a senha correta
    //   expect(mockHash).toHaveBeenCalledWith("senha123", 10);


    //   // Verificando que create foi chamado com os dados corretos incluindo a senha hasheada
    //   expect(mockClientRepository.create).toHaveBeenCalledWith(
    //     expect.objectContaining({
    //       name: "João Silva",
    //       email: "joao.silva@email.com",
    //       cpf: "12345678901",
    //       phone: "11987654321",
    //       password: "hashed_password",
    //     })
    //   );

    //   expect(result).toBe(createdClient);
    // });

    test("should throw error when CPF already exists", async () => {
      const clientData = {
        name: "João Silva",
        email: "joao.silva@email.com",
        cpf: "12345678901",
        password: "senha123",
        phone: "11987654321",
      };

      const existingClient = new Client(
        2,
        "José Santos",
        "jose@email.com",
        "12345678901",
        "hashed_password",
        "11999998888",
        1,
        new Date()
      );

      mockClientRepository.findByCpf.mockResolvedValue(existingClient);

      await expect(clientService.createClient(clientData)).rejects.toThrow(AppError);
      expect(mockClientRepository.findByCpf).toHaveBeenCalledWith("12345678901");
      expect(mockClientRepository.create).not.toHaveBeenCalled();
    });

    test("should throw error when email already exists", async () => {
      const clientData = {
        name: "João Silva",
        email: "joao.silva@email.com",
        cpf: "12345678901",
        password: "senha123",
        phone: "11987654321",
      };

      const existingClient = new Client(
        2,
        "José Santos",
        "joao.silva@email.com",
        "98765432101",
        "hashed_password",
        "11999998888",
        1,
        new Date()
      );

      mockClientRepository.findByCpf.mockResolvedValue(null);
      mockClientRepository.findByEmail.mockResolvedValue(existingClient);

      await expect(clientService.createClient(clientData)).rejects.toThrow(AppError);
      expect(mockClientRepository.findByCpf).toHaveBeenCalledWith("12345678901");
      expect(mockClientRepository.findByEmail).toHaveBeenCalledWith("joao.silva@email.com");
      expect(mockClientRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("getClient", () => {
    test("should return client when found", async () => {
      const client = new Client(
        1,
        "João Silva",
        "joao.silva@email.com",
        "12345678901",
        "hashed_password",
        "11987654321",
        1,
        new Date()
      );

      mockClientRepository.findById.mockResolvedValue(client);

      const result = await clientService.getClient(1);

      expect(mockClientRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toBe(client);
    });

    test("should throw error when client not found", async () => {
      mockClientRepository.findById.mockResolvedValue(null);

      await expect(clientService.getClient(999)).rejects.toThrow(AppError);
      expect(mockClientRepository.findById).toHaveBeenCalledWith(999);
    });
  });

  describe("getAllClients", () => {
    test("should return all clients", async () => {
      const clients = [
        new Client(
          1,
          "João Silva",
          "joao@email.com",
          "12345678901",
          "hash1",
          "11987654321"
        ),
        new Client(
          2,
          "Maria Santos",
          "maria@email.com",
          "98765432101",
          "hash2",
          "11999998888"
        ),
      ];

      mockClientRepository.findAll.mockResolvedValue(clients);

      const result = await clientService.getAllClients();

      expect(mockClientRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(clients);
    });
  });

  describe("updateClient", () => {
    test("should update client when found", async () => {
      const existingClient = new Client(
        1,
        "João Silva",
        "joao@email.com",
        "12345678901",
        "hashed_password",
        "11987654321"
      );

      const clientData = {
        name: "João Santos Silva",
        email: "joao.santos@email.com",
        phone: "11999998888",
      };

      const updatedClient = new Client(
        1,
        "João Santos Silva",
        "joao.santos@email.com",
        "12345678901",
        "hashed_password",
        "11999998888"
      );

      mockClientRepository.findById.mockResolvedValue(existingClient);
      mockClientRepository.findByEmail.mockResolvedValue(null);
      mockClientRepository.update.mockResolvedValue(updatedClient);

      const result = await clientService.updateClient(1, clientData);

      expect(mockClientRepository.findById).toHaveBeenCalledWith(1);
      expect(mockClientRepository.findByEmail).toHaveBeenCalledWith("joao.santos@email.com");
      expect(mockClientRepository.update).toHaveBeenCalledWith(1, clientData);
      expect(result).toBe(updatedClient);
    });

    // test("should hash password if it is being updated", async () => {
    //   const existingClient = new Client(
    //     1,
    //     "João Silva",
    //     "joao@email.com",
    //     "12345678901",
    //     "old_hash",
    //     "11987654321"
    //   );

    //   const clientData = {
    //     password: "nova_senha123",
    //   };

    //   const updatedClient = new Client(
    //     1,
    //     "João Silva",
    //     "joao@email.com",
    //     "12345678901",
    //     "hashed_password",
    //     "11987654321"
    //   );

    //   mockClientRepository.findById.mockResolvedValue(existingClient);
    //   mockClientRepository.update.mockResolvedValue(updatedClient);
    //   // Reset the mock before this test
    //   mockHash.mockClear();
    //   mockHash.mockResolvedValue("hashed_password");

    //   const result = await clientService.updateClient(1, clientData);

    //   expect(mockClientRepository.findById).toHaveBeenCalledWith(1);
    //   expect(mockHash).toHaveBeenCalledWith("nova_senha123", 10);
    //   expect(mockClientRepository.update).toHaveBeenCalledWith(1, {
    //     password: "hashed_password",
    //   });
    //   expect(result).toBe(updatedClient);
    // });

    test("should throw error when client not found", async () => {
      mockClientRepository.findById.mockResolvedValue(null);

      await expect(
        clientService.updateClient(999, { name: "Novo Nome" })
      ).rejects.toThrow(AppError);
      expect(mockClientRepository.findById).toHaveBeenCalledWith(999);
      expect(mockClientRepository.update).not.toHaveBeenCalled();
    });

    test("should throw error when updating email to one that already exists", async () => {
      const existingClient = new Client(
        1,
        "João Silva",
        "joao@email.com",
        "12345678901",
        "hashed_password",
        "11987654321"
      );

      const otherClient = new Client(
        2,
        "Maria Santos",
        "maria@email.com",
        "98765432101",
        "hash2",
        "11999998888"
      );

      mockClientRepository.findById.mockResolvedValue(existingClient);
      mockClientRepository.findByEmail.mockResolvedValue(otherClient);

      await expect(
        clientService.updateClient(1, { email: "maria@email.com" })
      ).rejects.toThrow(AppError);
      expect(mockClientRepository.findById).toHaveBeenCalledWith(1);
      expect(mockClientRepository.findByEmail).toHaveBeenCalledWith("maria@email.com");
      expect(mockClientRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("deleteClient", () => {
    test("should delete client when found", async () => {
      mockClientRepository.delete.mockResolvedValue(true);

      const result = await clientService.deleteClient(1);

      expect(mockClientRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    test("should throw error when client not found", async () => {
      mockClientRepository.delete.mockResolvedValue(false);

      await expect(clientService.deleteClient(999)).rejects.toThrow(AppError);
      expect(mockClientRepository.delete).toHaveBeenCalledWith(999);
    });
  });

  describe("getActiveClients", () => {
    test("should return active clients", async () => {
      const activeClients = [
        new Client(
          1,
          "João Silva",
          "joao@email.com",
          "12345678901",
          "hash1",
          "11987654321",
          1
        ),
        new Client(
          2,
          "Maria Santos",
          "maria@email.com",
          "98765432101",
          "hash2",
          "11999998888",
          1
        ),
      ];

      mockClientRepository.findActiveClients.mockResolvedValue(activeClients);

      const result = await clientService.getActiveClients();

      expect(mockClientRepository.findActiveClients).toHaveBeenCalled();
      expect(result).toEqual(activeClients);
    });
  });

  describe("changeClientStatus", () => {
    test("should change client status to active when found", async () => {
      const client = new Client(
        1,
        "João Silva",
        "joao@email.com",
        "12345678901",
        "hash1",
        "11987654321",
        0
      );
      
      const updatedClient = new Client(
        1,
        "João Silva",
        "joao@email.com",
        "12345678901",
        "hash1",
        "11987654321",
        1
      );

      mockClientRepository.findById.mockResolvedValue(client);
      mockClientRepository.update.mockResolvedValue(updatedClient);

      const result = await clientService.changeClientStatus(1, 1);

      expect(mockClientRepository.findById).toHaveBeenCalledWith(1);
      expect(mockClientRepository.update).toHaveBeenCalledWith(1, { status: 1 });
      expect(result).toBe(updatedClient);
    });

    test("should change client status to inactive when found", async () => {
      const client = new Client(
        1,
        "João Silva",
        "joao@email.com",
        "12345678901",
        "hash1",
        "11987654321",
        1
      );
      
      const updatedClient = new Client(
        1,
        "João Silva",
        "joao@email.com",
        "12345678901",
        "hash1",
        "11987654321",
        0
      );

      mockClientRepository.findById.mockResolvedValue(client);
      mockClientRepository.update.mockResolvedValue(updatedClient);

      const result = await clientService.changeClientStatus(1, 0);

      expect(mockClientRepository.findById).toHaveBeenCalledWith(1);
      expect(mockClientRepository.update).toHaveBeenCalledWith(1, { status: 0 });
      expect(result).toBe(updatedClient);
    });

    test("should change client status when boolean is provided", async () => {
      const client = new Client(
        1,
        "João Silva",
        "joao@email.com",
        "12345678901",
        "hash1",
        "11987654321",
        1
      );
      
      const updatedClient = new Client(
        1,
        "João Silva",
        "joao@email.com",
        "12345678901",
        "hash1",
        "11987654321",
        0
      );

      mockClientRepository.findById.mockResolvedValue(client);
      mockClientRepository.update.mockResolvedValue(updatedClient);

      const result = await clientService.changeClientStatus(1, false);

      expect(mockClientRepository.findById).toHaveBeenCalledWith(1);
      expect(mockClientRepository.update).toHaveBeenCalledWith(1, { status: 0 });
      expect(result).toBe(updatedClient);
    });

    test("should throw error when invalid status is provided", async () => {
      await expect(clientService.changeClientStatus(1, 2)).rejects.toThrow(AppError);
    });

    test("should throw error when client not found", async () => {
      mockClientRepository.findById.mockResolvedValue(null);

      await expect(clientService.changeClientStatus(999, 1)).rejects.toThrow(AppError);
      expect(mockClientRepository.findById).toHaveBeenCalledWith(999);
    });
  });

  describe("authenticateClient", () => {
    // test("should authenticate client with valid credentials", async () => {
    //   const client = new Client(
    //     1,
    //     "João Silva",
    //     "joao@email.com",
    //     "12345678901",
    //     "hashed_password",
    //     "11987654321",
    //     1
    //   );

    //   mockClientRepository.findByCpf.mockResolvedValue(client);
    //   // Properly reset and set up the mock to return true for this test
    //   mockCompare.mockClear();
    //   mockCompare.mockResolvedValue(true);

    //   console.log("Client data:", client);

    //   const result = await clientService.authenticateClient(
    //     "12345678901",
    //     "hashed_password"
    //   );

    //   expect(mockClientRepository.findByCpf).toHaveBeenCalledWith("12345678901");
    //   expect(mockCompare).toHaveBeenCalledWith("senha123", "hashed_password");
    //   expect(result).toBe(client);
    // });

    test("should throw error when client not found", async () => {
      mockClientRepository.findByCpf.mockResolvedValue(null);

      await expect(
        clientService.authenticateClient("99988877766", "senha123")
      ).rejects.toThrow(AppError);
      
      expect(mockClientRepository.findByCpf).toHaveBeenCalledWith("99988877766");
      expect(mockCompare).not.toHaveBeenCalled();
    });

    test("should throw error when client is inactive", async () => {
      const client = new Client(
        1,
        "João Silva",
        "joao@email.com",
        "12345678901",
        "hashed_password",
        "11987654321",
        0
      );

      mockClientRepository.findByCpf.mockResolvedValue(client);

      await expect(
        clientService.authenticateClient("12345678901", "senha123")
      ).rejects.toThrow(AppError);
      
      expect(mockClientRepository.findByCpf).toHaveBeenCalledWith("12345678901");
      expect(mockCompare).not.toHaveBeenCalled();
    });

    // test("should throw error when password is invalid", async () => {
    //   const client = new Client(
    //     1,
    //     "João Silva",
    //     "joao@email.com",
    //     "12345678901",
    //     "hashed_password",
    //     "11987654321",
    //     1
    //   );
    
    //   mockClientRepository.findByCpf.mockResolvedValue(client);
    //   mockCompare.mockResolvedValueOnce(false);
    
    //   await expect(
    //     clientService.authenticateClient("12345678901", "senha_errada")
    //   ).rejects.toThrow(AppError);
      
    //   expect(mockClientRepository.findByCpf).toHaveBeenCalledWith("12345678901");
    //   mockCompare.mockResolvedValueOnce(false);
    //   expect(mockCompare).toHaveBeenCalledWith("senha_errada", "hashed_password");
    // });
  });
});