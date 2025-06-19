import { Router } from "express";

import AuthController from "../controllers/authController.js";
import AuthService from "../../application/services/AuthService.js";
import UserRepository from "../../infrastructure/repositories/UserRepository.js";
import PostgresClientRepository from "../../infrastructure/repositories/PostgresClientRepository.js";
import PostgresBusinessRepository from "../../infrastructure/repositories/PostgresBusinessRepository.js";
import PostgresAddressRepository from "../../infrastructure/repositories/PostgresAddressRepository.js";
import LocationService from "../../application/services/LocationService.js";
import {
  validateRegisterInput,
  validateLoginInput,
  validateChangePasswordInput,
  validateDeviceTokenInput,
} from "../middleware/authValidation.js";
import { authenticate } from "../middleware/authMiddleware.js";

export default (options = {}) => {
  const userRepository = options.userRepository || new UserRepository();
  const clientRepository = options.clientRepository || new PostgresClientRepository();
  const businessRepository = options.businessRepository || new PostgresBusinessRepository();
  const addressRepository = options.addressRepository || new PostgresAddressRepository();
  const locationService = options.locationService || new LocationService(
    businessRepository,
    addressRepository,
    clientRepository,
    process.env.MAPBOX_ACCESS_TOKEN
  );

  const authService = new AuthService(
    userRepository,
    clientRepository,
    businessRepository,
    addressRepository,
    locationService
  );
  const authController = new AuthController(authService);

  const router = Router();

  router.post("/register", validateRegisterInput, authController.registerUser.bind(authController));
  router.post("/login", validateLoginInput, authController.login.bind(authController));
  router.post("/change-password", authenticate, validateChangePasswordInput, authController.changePassword.bind(authController));
  router.post("/device-token", authenticate, validateDeviceTokenInput, authController.updateDeviceToken.bind(authController));
  router.get("/user/:userId/fcm-token", authController.getUserFcmToken.bind(authController));

  return router;
};
