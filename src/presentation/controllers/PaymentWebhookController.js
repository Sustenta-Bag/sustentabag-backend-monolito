/**
 * Controller para receber notificações de pagamento do microsserviço payment-service
 * Este é o ponto de integração onde o payment-service informará ao monolito
 * sobre atualizações no status de pagamentos.
 */
class PaymentWebhookController {
  constructor(orderService, bagService) {
    this.orderService = orderService;
    this.bagService = bagService;
  }
  async handlePaymentUpdate(req, res, next) {
    /*
    
    */
    try {
      const { orderId, status, paymentId } = req.body;

      if (!orderId || !status) {
        return res.payment_required({
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
        console.error(
          `❌ OrderId inválido recebido: ${orderId} (tipo: ${typeof orderId})`
        );
        return res.payment_required({
          message: `OrderId inválido: ${orderId}. Esperado um número inteiro.`,
        });
      }

      console.log(
        `🔄 Convertendo orderId: "${orderId}" (${typeof orderId}) → ${orderIdInt} (${typeof orderIdInt})`
      );
      const order = await this.orderService.getOrder(orderIdInt);
      if (!order) {
        return res.not_found();
      }
      console.log(
        `Webhook do payment-service recebido: Pedido ${orderIdInt}, status ${status}, paymentId: ${paymentId}`
      );

      if (status === "approved" || status === "completed") {
        console.log(`Processando pagamento aprovado para pedido ${orderIdInt}`);

        await this.orderService.updateOrderStatus(orderIdInt, "pago");
        
        for (const item of order.items) {
            await this.bagService.changeBagStatus(item.idBag, 0);
        }

        setTimeout(async () => {
          await this.orderService.updateOrderStatus(orderIdInt, "pronto");
          setTimeout(async () => {
            await this.orderService.updateOrderStatus(orderIdInt, "entregue");
          }, 20000);
        }, 20000);


        console.log(
          `✅ Pedido ${orderIdInt} finalizado e sacolas inativadas após pagamento aprovado`
        );
      } else if (status === "failed" || status === "cancelled" || status === "rejected") {
        console.log(
          `Cancelando pedido ${orderIdInt} devido ao pagamento ${status}`
        );
        await this.orderService.updateOrderStatus(orderIdInt, "cancelado");
      } else {
        console.log(
          `Status de pagamento desconhecido: ${status} para pedido ${orderIdInt}`
        );
        return res.payment_required({
          message: `Status de pagamento desconhecido: ${status}`,
        });
      }

      return res.ok({
        message: "Notificação processada com sucesso",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default PaymentWebhookController;
