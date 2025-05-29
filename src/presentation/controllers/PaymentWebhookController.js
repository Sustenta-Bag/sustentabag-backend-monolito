/**
 * Controller para receber notificações de pagamento do microsserviço payment-service
 * Este é o ponto de integração onde o payment-service informará ao monolito
 * sobre atualizações no status de pagamentos.
 */
class PaymentWebhookController {
  constructor(orderService) {
    this.orderService = orderService;
  }
  async handlePaymentUpdate(req, res, next) {
    try {
      const { orderId, status, paymentId } = req.body;

      if (!orderId || !status) {
        return res.status(400).json({
          message: "Dados incompletos. orderId e status são obrigatórios",
        });
      }

      let orderIdInt;
      try {
        orderIdInt = parseInt(orderId);
        if (isNaN(orderIdInt)) {
          throw new Error("OrderId inválido");
        }
      } catch (error) {
        console.log(
          `❌ OrderId inválido recebido: ${orderId} (tipo: ${typeof orderId})`
        );
        return res.status(400).json({
          message: `OrderId inválido: ${orderId}. Esperado um número inteiro.`,
        });
      }

      console.log(
        `🔄 Convertendo orderId: "${orderId}" (${typeof orderId}) → ${orderIdInt} (${typeof orderIdInt})`
      );
      const order = await this.orderService.getOrder(orderIdInt);
      if (!order) {
        return res.status(404).json({
          message: `Pedido com ID ${orderIdInt} não encontrado`,
        });
      }
      console.log(
        `Webhook do payment-service recebido: Pedido ${orderIdInt}, status ${status}, paymentId: ${paymentId}`
      );

      if (status === "approved" || status === "completed") {
        console.log(`Processando pagamento aprovado para pedido ${orderIdInt}`);

        await this.orderService.updateOrderStatus(orderIdInt, "entregue");

        console.log(
          `✅ Pedido ${orderIdInt} finalizado e sacolas inativadas após pagamento aprovado`
        );
      } else if (status === "failed" || status === "cancelled") {
        console.log(
          `Cancelando pedido ${orderIdInt} devido ao pagamento ${status}`
        );
        await this.orderService.cancelOrder(orderIdInt);
      }

      return res.status(200).json({
        message: "Notificação processada com sucesso",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default PaymentWebhookController;
