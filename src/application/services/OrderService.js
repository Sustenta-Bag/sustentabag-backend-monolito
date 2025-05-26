import Order from '../../domain/entities/Order.js';
import OrderItem from '../../domain/entities/OrderItem.js';
import AppError from '../../infrastructure/errors/AppError.js';

class OrderService {
  constructor(orderRepository, bagService) {
    this.orderRepository = orderRepository;
    this.bagService = bagService;
  }
  async createOrder(orderData) {
    const { items, ...orderFields } = orderData;
    
    if (!items || items.length === 0) {
      throw new AppError('Pedido deve conter pelo menos um item', 'INVALID_ORDER');
    }
    
    // Validate all bags exist and are active
    for (const item of items) {
      const bag = await this.bagService.getBag(item.bagId);
      if (!bag) {
        throw AppError.notFound('Sacola', item.bagId);
      }
      if (bag.status !== 1) {
        throw new AppError(`Sacola ${bag.id} está inativa`, 'INACTIVE_BAG');
      }
      // Use the current bag price
      item.price = bag.price;
    }
    
    const order = new Order(
      null,
      orderFields.userId,
      orderFields.businessId
    );
    
    items.forEach(item => {
      order.addItem(new OrderItem(
        null,
        null,
        item.bagId,
        item.quantity,
        item.price
      ));
    });

    return await this.orderRepository.create({
      ...orderFields,
      items: order.items.map(item => ({
        bagId: item.bagId,
        quantity: item.quantity,
        price: item.price
      }))
    });
  }
  async getOrder(id) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw AppError.notFound('Pedido', id);
    }
    
    // Removida a lógica de busca de informações de pagamento
    // Isso será tratado pelo payment-service

    return order;
  }

  async getAllOrders() {
    return await this.orderRepository.findAll();
  }

  async getOrdersByUser(userId) {
    return await this.orderRepository.findByUserId(userId);
  }

  async getOrdersByBusiness(businessId) {
    return await this.orderRepository.findByBusinessId(businessId);
  }  async updateOrderStatus(id, status) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw AppError.notFound('Pedido', id);
    }
    
    const validStatuses = ['pendente', 'confirmado', 'preparando', 'pronto', 'entregue', 'cancelado'];
    if (!validStatuses.includes(status)) {
      throw new AppError('Status inválido', 'INVALID_STATUS');
    }

    // Atualizar o status do pedido
    const updatedOrder = await this.orderRepository.updateStatus(id, status);

    // Se o pedido foi finalizado (entregue), inativar as sacolas
    if (status === 'entregue') {
      await this.inactivateBagsFromOrder(order);
    }

    return updatedOrder;
  }

  async addItemToOrder(orderId, itemData) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw AppError.notFound('Pedido', orderId);
    }
      if (order.status !== 'pendente') {
      throw new AppError('Não é possível adicionar itens a um pedido que não está pendente', 'INVALID_ORDER_STATUS');
    }
    
    const bag = await this.bagService.getBag(itemData.bagId);
    if (!bag) {
      throw AppError.notFound('Sacola', itemData.bagId);
    }
    if (bag.status !== 1) {
      throw new AppError(`Sacola ${bag.id} está inativa`, 'INACTIVE_BAG');
    }
    
    const item = await this.orderRepository.addItem(orderId, {
      ...itemData,
      price: bag.price
    });
    
    // Update order total
    await this.orderRepository.update(orderId, {
      totalAmount: order.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    });
    
    return item;
  }

  async removeItemFromOrder(orderId, itemId) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw AppError.notFound('Pedido', orderId);
    }
      if (order.status !== 'pendente') {
      throw new AppError('Não é possível remover itens de um pedido que não está pendente', 'INVALID_ORDER_STATUS');
    }
    
    const removed = await this.orderRepository.removeItem(orderId, itemId);
    if (!removed) {
      throw AppError.notFound('Item do pedido', itemId);
    }
    
    // Update order total
    await this.orderRepository.update(orderId, {
      totalAmount: order.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    });
    
    return true;
  }

  async updateItemQuantity(orderId, itemId, quantity) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw AppError.notFound('Pedido', orderId);
    }
      if (order.status !== 'pendente') {
      throw new AppError('Não é possível atualizar itens de um pedido que não está pendente', 'INVALID_ORDER_STATUS');
    }
    
    if (quantity < 1) {
      throw new AppError('Quantidade deve ser maior que zero', 'INVALID_QUANTITY');
    }
    
    const item = await this.orderRepository.updateItemQuantity(orderId, itemId, quantity);
    if (!item) {
      throw AppError.notFound('Item do pedido', itemId);
    }
    
    // Update order total
    await this.orderRepository.update(orderId, {
      totalAmount: order.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    });
    
    return item;
  }
  async cancelOrder(id) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw AppError.notFound('Pedido', id);
    }
    
    if (!order.canBeCancelled()) {
      throw new AppError('Não é possível cancelar este pedido', 'INVALID_ORDER_STATUS');
    }    // Removida a lógica de cancelamento/reembolso de pagamento
    // O payment-service deve ser informado sobre o cancelamento do pedido
    // através de um mecanismo de comunicação assíncrona (eventos, webhooks, etc.)
      return await this.orderRepository.updateStatus(id, 'cancelado');
  }

  /**
   * Inativa as sacolas de um pedido quando ele é finalizado (entregue)
   * Isso previne que as mesmas unidades sejam comercializadas novamente
   */
  async inactivateBagsFromOrder(order) {
    try {
      console.log(`Inativando sacolas do pedido ${order.id} - Status: entregue`);
      
      for (const item of order.items) {
        try {
          await this.bagService.changeBagStatus(item.bagId, 0); // 0 = inativo
          console.log(`✅ Sacola ${item.bagId} inativada com sucesso (quantidade: ${item.quantity})`);
        } catch (error) {
          console.error(`❌ Erro ao inativar sacola ${item.bagId}:`, error.message);
          // Continua o processo mesmo se uma sacola falhar
          // para não bloquear a finalização do pedido
        }
      }
      
      console.log(`Processo de inativação concluído para o pedido ${order.id}`);
    } catch (error) {
      console.error(`Erro geral ao inativar sacolas do pedido ${order.id}:`, error);
      // Log do erro mas não propaga para não bloquear a atualização do status do pedido
    }
  }
}

export default OrderService; 