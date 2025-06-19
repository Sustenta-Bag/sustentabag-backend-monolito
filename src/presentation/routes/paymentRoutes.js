import { Router } from 'express';
import PaymentWebhookController from '../controllers/PaymentWebhookController.js';
import OrderService from '../../application/services/OrderService.js';
import { getOrderRepository } from '../../application/modules/orderModule.js';
import { getBagService } from '../../application/modules/bagModule.js';
import { sequelize } from '../../infrastructure/database/connection.js';

const router = Router();

const bagService = getBagService(sequelize);
const orderRepository = getOrderRepository(sequelize);
const orderService = new OrderService(orderRepository, bagService);
const paymentWebhookController = new PaymentWebhookController(orderService);

router.post('/webhook', paymentWebhookController.handlePaymentUpdate.bind(paymentWebhookController));

export default router;