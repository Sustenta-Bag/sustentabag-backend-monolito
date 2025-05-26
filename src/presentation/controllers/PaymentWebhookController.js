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
          message: 'Dados incompletos. orderId e status são obrigatórios'
        });
      }

      // Buscar o pedido e verificar se ele existe
      const order = await this.orderService.getOrder(orderId);
      if (!order) {
        return res.status(404).json({
          message: `Pedido com ID ${orderId} não encontrado`
        });
      }

      // Log da notificação recebida
      console.log(`Webhook do payment-service recebido: Pedido ${orderId}, status ${status}`);      // Atualizar o status do pedido com base na notificação
      if (status === 'completed') {
        // Se o pagamento foi concluído, confirmar o pedido
        await this.orderService.updateOrderStatus(orderId, 'confirmado');
      } else if (status === 'failed' || status === 'cancelled') {
        // Se o pagamento falhou ou foi cancelado, cancelar o pedido
        await this.orderService.cancelOrder(orderId);
      }
      // Outros status podem ser tratados conforme necessário

      // Responder com sucesso
      return res.status(200).json({
        message: 'Notificação processada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default PaymentWebhookController;
