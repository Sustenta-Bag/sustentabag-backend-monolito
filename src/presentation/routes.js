import { Router } from 'express';
import AddressRoutes from '../presentation/routes/addressRoutes.js';
import BagRoutes from '../presentation/routes/bagRoutes.js';
import authRoutes from './routes/authRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const routes = Router();

routes.use(`/api/auth`, authRoutes());
routes.use(`/api/addresses`, AddressRoutes());
routes.use(`/api/businesses`, businessRoutes());
routes.use(`/api/clients`, clientRoutes());
routes.use(`/api/locations`, locationRoutes());
routes.use(`/api/bags`, BagRoutes());
routes.use(`/api/orders`, orderRoutes());
routes.use(`/api/reviews`, reviewRoutes());
routes.use(`/api/favorites`, favoriteRoutes());
routes.use(`/api/payments`, paymentRoutes);
routes.use(`/api/health`, healthRoutes());

export default routes;