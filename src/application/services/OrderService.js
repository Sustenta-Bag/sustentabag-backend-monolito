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
      const bag = await this.bagService.getBag(item.idBag);
      if (!bag) {
        throw AppError.notFound('Sacola', item.idBag);
      }
      if (bag.status !== 1) {
        throw new AppError(`Sacola ${bag.id} está inativa`, 'INACTIVE_BAG');
      }
      // Use the current bag price
      item.price = bag.price;
    }

    const order = new Order({
      idClient: orderFields.idClient,
      idBusiness: orderFields.idBusiness
    });
    
    items.forEach(item => {
      order.addItem(new OrderItem({
        idBag: item.idBag,
        quantity: item.quantity,
        price: item.price
      }));
    });

    return await this.orderRepository.create({
      ...orderFields,
      items: order.items.map(item => ({
        idBag: item.idBag,
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

  async getAllOrders(page, limit, filters = {}) {
    if (!page || page < 1) page = 1;
    if (!limit) limit = 10;
    const offset = (page - 1) * limit;
    const where = {};
    if (filters.idClient) {
      where.idClient = filters.idClient;
    }
    if (filters.idBusiness) {
      where.idBusiness = filters.idBusiness;
    }
    if (filters.status) {
      where.status = filters.status;
    }
    const result = await this.orderRepository.findAll(where, limit, offset);
    return {
      total: result.count,
      pages: Math.ceil(result.count / limit),
      data: result.rows
    }
  }

  async updateOrderStatus(id, status) {
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

  async addItemToOrder(idOrder, itemData) {
    const order = await this.orderRepository.findById(idOrder);
    if (!order) {
      throw AppError.notFound('Pedido', idOrder);
    }
      if (order.status !== 'pendente') {
      throw new AppError('Não é possível adicionar itens a um pedido que não está pendente', 'INVALID_ORDER_STATUS');
    }
    
    const bag = await this.bagService.getBag(itemData.idBag);
    if (!bag) {
      throw AppError.notFound('Sacola', itemData.idBag);
    }
    if (bag.status !== 1) {
      throw new AppError(`Sacola ${bag.id} está inativa`, 'INACTIVE_BAG');
    }
    
    const item = await this.orderRepository.addItem(idOrder, {
      ...itemData,
      price: bag.price
    });
    
    // Update order total
    await this.orderRepository.update(idOrder, {
      totalAmount: order.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    });
    
    return item;
  }

  async removeItemFromOrder(idOrder, idItem) {
    const order = await this.orderRepository.findById(idOrder);
    if (!order) {
      throw AppError.notFound('Pedido', idOrder);
    }
      if (order.status !== 'pendente') {
      throw new AppError('Não é possível remover itens de um pedido que não está pendente', 'INVALID_ORDER_STATUS');
    }
    
    const removed = await this.orderRepository.removeItem(idOrder, idItem);
    if (!removed) {
      throw AppError.notFound('Item do pedido', idItem);
    }
    
    // Update order total
    await this.orderRepository.update(idOrder, {
      totalAmount: order.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    });
    
    return true;
  }

  async updateItemQuantity(idOrder, idItem, quantity) {
    const order = await this.orderRepository.findById(idOrder);
    if (!order) {
      throw AppError.notFound('Pedido', idOrder);
    }
      if (order.status !== 'pendente') {
      throw new AppError('Não é possível atualizar itens de um pedido que não está pendente', 'INVALID_ORDER_STATUS');
    }
    
    if (quantity < 1) {
      throw new AppError('Quantidade deve ser maior que zero', 'INVALID_QUANTITY');
    }
    
    const item = await this.orderRepository.updateItemQuantity(idOrder, idItem, quantity);
    if (!item) {
      throw AppError.notFound('Item do pedido', idItem);
    }
    
    // Update order total
    await this.orderRepository.update(idOrder, {
      totalAmount: order.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    });
    
    return item;
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
          await this.bagService.changeBagStatus(item.idBag, 0); // 0 = inativo
          console.log(`✅ Sacola ${item.idBag} inativada com sucesso (quantidade: ${item.quantity})`);
        } catch (error) {
          console.error(`❌ Erro ao inativar sacola ${item.idBag}:`, error.message);
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

  async getOrderHistory(where, limit, offset, orderBy, orderDirection) {
    return await this.orderRepository.getOrderHistory(where, limit, offset, orderBy, orderDirection);
  }

  async getOrdersByDateRange(startDate, endDate, options = {}) {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      throw new AppError('Data inicial não pode ser maior que a data final', 'INVALID_DATE_RANGE');
    }
    return await this.orderRepository.getOrdersByDateRange(startDate, endDate, options);
  }

  async getOrderStats(entityId, entityType) {
    entityId = entityType === 'business' ? { idBusiness: entityId } : { idClient: entityId };
    const allOrders = await this.orderRepository.findAll(entityId, null, null);

    const stats = {
      total: allOrders.count,
      byStatus: {
        pendente: 0,
        confirmado: 0,
        preparando: 0,
        pronto: 0,
        entregue: 0,
        cancelado: 0
      },
      totalAmount: 0,
      lastOrderDate: null
    };

    allOrders.rows.forEach(order => {
      stats.byStatus[order.status]++;
      stats.totalAmount += parseFloat(order.totalAmount || 0);

      if (!stats.lastOrderDate || order.createdAt > stats.lastOrderDate) {
        stats.lastOrderDate = order.createdAt;
      }
    });

    stats.totalAmount = stats.totalAmount.toFixed(2);

    return stats;
  }
}

export default OrderService;