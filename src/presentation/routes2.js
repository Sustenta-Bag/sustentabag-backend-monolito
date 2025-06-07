import { Router } from 'express';
import AddressRoutes from '../presentation/routes/addressRoutes2.js';
import { authenticate, requireAnyRole, requireBusinessRole, requireClientRole } from '../presentation/middleware/authMiddleware.js';

const routes = Router();

routes.use('/api/addresses', AddressRoutes());

export default routes;