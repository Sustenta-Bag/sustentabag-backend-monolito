import { Router } from 'express';
import PaymentWebhookController from '../controllers/PaymentWebhookController.js';
import OrderService from '../../application/services/OrderService.js';
import BagService from '../../application/services/BagService.js';
import { getOrderRepository } from '../../application/modules/orderModule.js';
import { getBagRepository } from '../../application/modules/bagModule.js';
import { sequelize } from '../../infrastructure/database/connection.js';

const router = Router();

const orderRepository = getOrderRepository(sequelize);
const orderService = new OrderService(orderRepository);
const bagRepository = getBagRepository(sequelize);
const bagService = new BagService(bagRepository);
const paymentWebhookController = new PaymentWebhookController(orderService, bagService);

router.post('/webhook', paymentWebhookController.handlePaymentUpdate.bind(paymentWebhookController));

export default router;