import express from "express";
import { setupModuleRouters } from "../application/bootstrap.js";
import { sequelize } from "../infrastructure/database/connection.js";
import PaymentWebhookController from "./controllers/PaymentWebhookController.js";
import OrderService from "../application/services/OrderService.js";
import { getOrderRepository } from "../application/modules/orderModule.js";
import { getBagService } from "../application/modules/bagModule.js";

const router = express.Router();

const {
  bagRouter,
  clientRouter,
  addresRouter,
  businessRouter,
  authRouter,
  locationRouter,
  orderRouter,
  favoriteRouter,
} = setupModuleRouters({
  sequelizeInstance: sequelize,
});

router.use("/api/addresses", addresRouter);
router.use("/api/clients", clientRouter);
router.use("/api/businesses", businessRouter);
router.use("/api/bags", bagRouter);
router.use("/api/auth", authRouter);
router.use("/api/locations", locationRouter);
router.use("/api/orders", orderRouter);
router.use("/api/favorites", favoriteRouter);

// Configurar webhook para receber notificações do payment-service
const bagService = getBagService(sequelize);
const orderRepository = getOrderRepository(sequelize);
const orderService = new OrderService(orderRepository, bagService);
const paymentWebhookController = new PaymentWebhookController(orderService);

// Rota para receber callbacks do payment-service
router.post("/api/payments/webhook", (req, res, next) =>
  paymentWebhookController.handlePaymentUpdate(req, res, next)
);

export default router;
