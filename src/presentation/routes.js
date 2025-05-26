import express from 'express';
import { setupModuleRouters } from '../application/bootstrap.js';
import { sequelize } from '../infrastructure/database/connection.js';
import PaymentWebhookController from './controllers/PaymentWebhookController.js';
import OrderService from '../application/services/OrderService.js';
import OrderRepository from '../infrastructure/repositories/OrderRepository.js';
import BagService from '../application/services/BagService.js';
import BagRepository from '../infrastructure/repositories/BagRepository.js';

const router = express.Router();

const { 
    bagRouter, 
    clientRouter, 
    addresRouter, 
    businessRouter,
    authRouter,
    locationRouter,
    orderRouter
} = setupModuleRouters({
    sequelizeInstance: sequelize
});

router.use('/api/addresses', addresRouter);
router.use('/api/clients', clientRouter);
router.use('/api/businesses', businessRouter);
router.use('/api/bags', bagRouter);
router.use('/api/auth', authRouter);
router.use('/api/locations', locationRouter);
router.use('/api/orders', orderRouter);

// Configurar webhook para receber notificações do payment-service
const bagRepository = new BagRepository(sequelize);
const bagService = new BagService(bagRepository);
const orderRepository = new OrderRepository(sequelize);
const orderService = new OrderService(orderRepository, bagService);
const paymentWebhookController = new PaymentWebhookController(orderService);

// Rota para receber callbacks do payment-service
router.post('/api/payments/webhook', (req, res, next) => 
  paymentWebhookController.handlePaymentUpdate(req, res, next)
);

export default router;