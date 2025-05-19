import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import AppError from "../../infrastructure/errors/AppError.js";
import FirebaseService from "./FirebaseService.js";

class AuthService {
  constructor(userRepository, clientRepository, businessRepository) {
    this.userRepository = userRepository;
    this.clientRepository = clientRepository;
    this.businessRepository = businessRepository;
    this.firebaseService = new FirebaseService();
  }

  async registerClient(clientData, userData) {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError("Email já cadastrado", "EMAIL_ALREADY_EXISTS");
    }

    const existingClientByCpf = await this.clientRepository.findByCpf(
      clientData.cpf
    );
    if (existingClientByCpf) {
      throw new AppError("CPF já cadastrado", "CPF_ALREADY_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    let firebaseUser = null;
    try {
      firebaseUser = await this.firebaseService.createUser({
        email: userData.email,
        password: userData.password,
        name: clientData.name,
        cpf: clientData.cpf,
        phone: clientData.phone,
        status: clientData.status || 1,
      });
      console.log("Firebase user created with ID:", firebaseUser.uid);
    } catch (firebaseError) {
      console.error("Error creating Firebase user:", firebaseError);
    }

    const clientToCreate = {
      ...clientData,
      email: userData.email,
    };

    const newClient = await this.clientRepository.create(clientToCreate);

    const userToCreate = {
      email: userData.email,
      password: hashedPassword,
      role: "client",
      entityId: newClient.id,
      active: true,
      firebaseId: firebaseUser?.uid || null,
    };

    const user = await this.userRepository.create(userToCreate);

    if (firebaseUser?.uid) {
      await this.firebaseService.updateLocalIdInFirestore(
        firebaseUser.uid,
        newClient.id
      );
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firebaseId: user.firebaseId,
      },
      client: newClient,
    };
  }

  async registerBusiness(businessData, userData) {
    // Validate if email already exists in User repository
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError("Email já cadastrado", "EMAIL_ALREADY_EXISTS");
    }

    // Check for existing business with same CNPJ
    const existingBusinessByCnpj = await this.businessRepository.findByCnpj(
      businessData.cnpj
    );
    if (existingBusinessByCnpj) {
      throw new AppError("CNPJ já cadastrado", "CNPJ_ALREADY_EXISTS");
    }

    // Hash the password for user creation
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Try to create Firebase user
    let firebaseUser = null;
    try {
      firebaseUser = await this.firebaseService.createUser({
        email: userData.email,
        password: userData.password,
        name: businessData.legalName,
        cnpj: businessData.cnpj,
        appName: businessData.appName,
        cellphone: businessData.cellphone,
        status: businessData.status || 1,
      });
      console.log("Firebase business user created with ID:", firebaseUser.uid);
    } catch (firebaseError) {
      console.error("Error creating Firebase business user:", firebaseError);
    }
    const businessToCreate = {
      legalName: businessData.legalName,
      cnpj: businessData.cnpj,
      appName: businessData.appName,
      cellphone: businessData.cellphone,
      description: businessData.description,
      logo: businessData.logo || null,
      delivery: businessData.delivery,
      deliveryTax: businessData.deliveryTax,
      idAddress: businessData.idAddress,
      status: businessData.status || 1,
    };

    const newBusiness = await this.businessRepository.create(businessToCreate);

    // Create the associated user account with password and firebaseId
    const user = await this.userRepository.create({
      email: userData.email,
      password: hashedPassword,
      role: "business",
      entityId: newBusiness.id,
      active: true,
      firebaseId: firebaseUser?.uid || null,
    });

    // Update Firebase record with local ID if available
    if (firebaseUser?.uid) {
      await this.firebaseService.updateLocalIdInFirestore(
        firebaseUser.uid,
        newBusiness.id
      );
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firebaseId: user.firebaseId,
      },
      business: newBusiness,
    };
  }

  async login(email, password) {
    // Try to find the user in our local database
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Credenciais inválidas", "INVALID_CREDENTIALS", 401);
    }

    if (!user.active) {
      throw new AppError("Conta inativa", "ACCOUNT_INACTIVE", 401);
    }

    // Verify password from the user model (not from entity)
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Credenciais inválidas", "INVALID_CREDENTIALS", 401);
    }

    // Get the associated entity based on role
    let entity = null;
    if (user.role === "client") {
      entity = await this.clientRepository.findById(user.entityId);
    } else if (user.role === "business") {
      entity = await this.businessRepository.findById(user.entityId);
    }

    if (!entity) {
      throw new AppError(
        "Entidade associada não encontrada",
        "ENTITY_NOT_FOUND",
        404
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        entityId: user.entityId,
        firebaseId: user.firebaseId,
      },
      process.env.JWT_SECRET || "sustentabag_secret_key",
      { expiresIn: process.env.JWT_EXPIRATION || "24h" }
    );

    return { user, entity, token };
  }

  async loginWithFirebase(firebaseToken) {
    try {
      const decodedToken = await this.firebaseService.verifyIdToken(
        firebaseToken
      );
      const firebaseUid = decodedToken.uid;

      const user = await this.userRepository.findByFirebaseId(firebaseUid);

      if (!user) {
        throw new AppError("Usuário não encontrado", "USER_NOT_FOUND", 404);
      }

      if (!user.active) {
        throw new AppError("Conta inativa", "ACCOUNT_INACTIVE", 401);
      }

      let entity = null;
      if (user.role === "client") {
        entity = await this.clientRepository.findById(user.entityId);
      } else if (user.role === "business") {
        entity = await this.businessRepository.findById(user.entityId);
      }

      if (!entity) {
        throw new AppError(
          "Entidade associada não encontrada",
          "ENTITY_NOT_FOUND",
          404
        );
      }

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
          entityId: user.entityId,
          firebaseId: user.firebaseId,
          fcmToken: user.fcmToken,
        },
        process.env.JWT_SECRET || "sustentabag_secret_key",
        { expiresIn: process.env.JWT_EXPIRATION || "24h" }
      );

      return { user, entity, token };
    } catch (error) {
      console.error("Firebase login error:", error);
      throw new AppError(
        "Falha na autenticação com Firebase",
        "FIREBASE_AUTH_ERROR",
        401
      );
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("Usuário não encontrado", "USER_NOT_FOUND", 404);
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      throw new AppError(
        "Senha atual incorreta",
        "INVALID_CURRENT_PASSWORD",
        400
      );
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await this.userRepository.update(userId, { password: hashedNewPassword });

    return true;
  }

  async updateDeviceToken(userId, deviceToken) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("Usuário não encontrado", "USER_NOT_FOUND", 404);
    }

    await this.userRepository.update(userId, { fcmToken: deviceToken });

    if (user.firebaseId) {
      try {
        await this.firebaseService.updateUserFcmToken(
          user.firebaseId,
          deviceToken
        );
      } catch (error) {
        console.error("Erro ao atualizar token FCM no Firestore:", error);
      }
    }
    return true;
  }

  async getDeviceToken(userId) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("Usuário não encontrado", "USER_NOT_FOUND", 404);
    }

    return user.fcmToken || null;
  }
}

export default AuthService;
