import { 
  validateRegisterInput, 
  validateLoginInput, 
  validateFirebaseLoginInput,
  validateChangePasswordInput 
} from '../middleware/authValidation.js';
import { authenticate } from '../middleware/authMiddleware.js';

export default (authController) => (router) => {
  // Public routes
  router.post(
    '/register', 
    validateRegisterInput,
    authController.registerUser.bind(authController)
  );
  
  router.post(
    '/login', 
    validateLoginInput,
    authController.login.bind(authController)
  );
  
  router.post(
    '/login/firebase', 
    validateFirebaseLoginInput,
    authController.loginWithFirebase.bind(authController)
  );
  
  // Protected routes
  router.post(
    '/change-password', 
    authenticate,
    validateChangePasswordInput,
    authController.changePassword.bind(authController)
  );
  
  return router;
};