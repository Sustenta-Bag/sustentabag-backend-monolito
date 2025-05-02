import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
    // Validate if email already exists in User repository
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError("Email já cadastrado", "EMAIL_ALREADY_EXISTS");
    }
    
    // Check for existing client with same CPF
    const existingClientByCpf = await this.clientRepository.findByCpf(clientData.cpf);
    if (existingClientByCpf) {
      throw new AppError("CPF já cadastrado", "CPF_ALREADY_EXISTS");
    }

    // First create the client in local database
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Try to create Firebase user
    let firebaseUser = null;
    try {
      firebaseUser = await this.firebaseService.createUser({
        email: userData.email,
        password: userData.password,
        name: clientData.name,
        cpf: clientData.cpf,
        phone: clientData.phone,
        status: clientData.status || 1
      });
      console.log("Firebase user created with ID:", firebaseUser.uid);
    } catch (firebaseError) {
      console.error("Error creating Firebase user:", firebaseError);
      // Continue with local user creation even if Firebase fails
    }

    // Add Firebase ID to client data if available
    const clientToCreate = {
      ...clientData,
      email: userData.email,  // Add this line to include email
      password: hashedPassword,
      firebaseId: firebaseUser?.uid || null
    };
    
    // Create client record
    const newClient = await this.clientRepository.create(clientToCreate);

    // Then create the associated user account
    const userToCreate = {
      email: userData.email,
      password: hashedPassword,
      role: "client",
      entityId: newClient.id,
      active: true,
      firebaseId: firebaseUser?.uid || null
    };

    const user = await this.userRepository.create(userToCreate);

    // Update Firebase record with local ID if available
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
    const existingBusinessByCnpj = await this.businessRepository.findByCnpj(businessData.cnpj);
    if (existingBusinessByCnpj) {
      throw new AppError("CNPJ já cadastrado", "CNPJ_ALREADY_EXISTS");
    }

    // Hash the password
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
        status: businessData.status || 1
      });
      console.log("Firebase business user created with ID:", firebaseUser.uid);
    } catch (firebaseError) {
      console.error("Error creating Firebase business user:", firebaseError);
      // Continue with local user creation even if Firebase fails
    }

    // Add Firebase ID to business data if available
    const businessToCreate = {
      ...businessData,
      password: hashedPassword,
      firebaseId: firebaseUser?.uid || null
    };
    
    // Create business record
    const newBusiness = await this.businessRepository.create(businessToCreate);

    // Create the associated user account
    const user = await this.userRepository.create({
      email: userData.email,
      password: hashedPassword,
      role: "business",
      entityId: newBusiness.idBusiness,
      active: true,
      firebaseId: firebaseUser?.uid || null
    });

    // Update Firebase record with local ID if available
    if (firebaseUser?.uid) {
      await this.firebaseService.updateLocalIdInFirestore(
        firebaseUser.uid,
        newBusiness.idBusiness
      );
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
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

    // Verify password
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
      },
      process.env.JWT_SECRET || "sustentabag_secret_key",
      { expiresIn: process.env.JWT_EXPIRATION || "24h" }
    );

    return { user, entity, token };
  }

  async loginWithFirebase(firebaseToken) {
    try {
      // Verify Firebase token
      const decodedToken = await this.firebaseService.verifyIdToken(firebaseToken);
      const firebaseUid = decodedToken.uid;
      
      // Try to find the user with this Firebase ID
      const user = await this.userRepository.findByFirebaseId(firebaseUid);
      
      if (!user) {
        throw new AppError("Usuário não encontrado", "USER_NOT_FOUND", 404);
      }
      
      if (!user.active) {
        throw new AppError("Conta inativa", "ACCOUNT_INACTIVE", 401);
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
          firebaseId: user.firebaseId
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
      throw AppError.notFound("Usuário", userId);
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      throw new AppError("Senha atual incorreta", "INVALID_PASSWORD", 401);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userRepository.update(userId, { password: hashedPassword });
    
    if (user.firebaseId) {
      try {
        await this.firebaseService.updateUserPassword(user.firebaseId, newPassword);
      } catch (firebaseError) {
        console.error("Error updating Firebase password:", firebaseError);
      }
    }

    return true;
  }
}

export default AuthService;