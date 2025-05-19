import AppError from "../../infrastructure/errors/AppError.js";

class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  async registerUser(req, res, next) {
    try {
      const { entityType, userData, entityData } = req.body;

      if (!entityType || !["client", "business"].includes(entityType)) {
        throw new AppError(
          'Tipo de entidade inválido. Deve ser "client" ou "business"',
          "INVALID_ENTITY_TYPE",
          400
        );
      }

      if (!userData || !entityData) {
        throw new AppError(
          "Dados de usuário e entidade são obrigatórios",
          "MISSING_DATA",
          400
        );
      }

      let result;

      if (entityType === "client") {
        result = await this.authService.registerClient({...entityData, idAddress: entityData.idAddress }, userData);
      } else {
        result = await this.authService.registerBusiness(entityData, userData);
      }

      if (result.user && result.user.password) {
        delete result.user.password;
      }

      if (result.client && result.client.password) {
        delete result.client.password;
      }

      if (result.business && result.business.password) {
        delete result.business.password;
      }

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError(
          "Email e senha são obrigatórios",
          "MISSING_CREDENTIALS",
          400
        );
      }

      const result = await this.authService.login(email, password);

      const { password: _, ...userData } = result.user;

      return res.json({
        user: userData,
        entity: result.entity,
        token: result.token,
      });
    } catch (error) {
      next(error);
    }
  }

  async loginWithFirebase(req, res, next) {
    try {
      const { firebaseToken } = req.body;

      if (!firebaseToken) {
        throw new AppError(
          "Token do Firebase é obrigatório",
          "MISSING_FIREBASE_TOKEN",
          400
        );
      }

      const result = await this.authService.loginWithFirebase(firebaseToken);

      const { password: _, ...userData } = result.user;

      return res.json({
        user: userData,
        entity: result.entity,
        token: result.token,
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.userId;

      if (!currentPassword || !newPassword) {
        throw new AppError(
          "Senha atual e nova senha são obrigatórias",
          "MISSING_PASSWORD",
          400
        );
      }

      await this.authService.changePassword(
        userId,
        currentPassword,
        newPassword
      );

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async updateDeviceToken(req, res, next) {
    try {
      const { deviceToken } = req.body;
      const userId = req.user.userId;

      if (!deviceToken) {
        throw new AppError(
          "Token do dispositivo é obrigatório",
          "MISSING_DEVICE_TOKEN",
          400
        );
      }

      await this.authService.updateDeviceToken(userId, deviceToken);

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
