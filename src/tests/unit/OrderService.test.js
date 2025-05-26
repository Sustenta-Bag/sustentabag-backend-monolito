import { jest } from '@jest/globals';
import OrderService from '../../application/services/OrderService.js';
import Order from '../../domain/entities/Order.js';
import OrderItem from '../../domain/entities/OrderItem.js';
import AppError from '../../infrastructure/errors/AppError.js';

describe('OrderService', () => {
  let orderService;
  let mockOrderRepository;
  let mockBagService;

  beforeEach(() => {
    // Mock do repositório
    mockOrderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByUserId: jest.fn(),
      findByBusinessId: jest.fn(),
      updateStatus: jest.fn(),
      update: jest.fn(),
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateItemQuantity: jest.fn()
    };

    // Mock do serviço de sacolas
    mockBagService = {
      getBag: jest.fn(),
      changeBagStatus: jest.fn()
    };

    orderService = new OrderService(mockOrderRepository, mockBagService);
  });

  describe('createOrder', () => {
    const validOrderData = {
      userId: 1,
      businessId: 1,
      items: [
        { bagId: 1, quantity: 2 },
        { bagId: 2, quantity: 1 }
      ]
    };

    const mockBag1 = { id: 1, price: 10.99, status: 1 };
    const mockBag2 = { id: 2, price: 5.99, status: 1 };

    beforeEach(() => {
      mockBagService.getBag.mockImplementation(async (id) => {
        if (id === 1) return mockBag1;
        if (id === 2) return mockBag2;
        return null;
      });      mockOrderRepository.create.mockImplementation(async (data) => ({
        id: 1,
        ...data,
        status: 'pendente',
        createdAt: new Date()
      }));
    });

    it('should create a new order successfully', async () => {
      const result = await orderService.createOrder(validOrderData);

      expect(mockBagService.getBag).toHaveBeenCalledTimes(2);
      expect(mockOrderRepository.create).toHaveBeenCalledWith({
        userId: 1,
        businessId: 1,
        items: [
          { bagId: 1, quantity: 2, price: 10.99 },
          { bagId: 2, quantity: 1, price: 5.99 }
        ]
      });
      expect(result).toHaveProperty('id', 1);
      expect(result.status).toBe('pendente');
    });

    it('should throw error when order has no items', async () => {
      const invalidOrderData = {
        userId: 1,
        businessId: 1,
        items: []
      };

      await expect(orderService.createOrder(invalidOrderData))
        .rejects
        .toThrow(new AppError('Pedido deve conter pelo menos um item', 'INVALID_ORDER'));
    });

    it('should throw error when bag does not exist', async () => {
      mockBagService.getBag.mockResolvedValue(null);

      await expect(orderService.createOrder(validOrderData))
        .rejects
        .toThrow(AppError.notFound('Sacola', 1));
    });

    it('should throw error when bag is inactive', async () => {
      mockBagService.getBag.mockResolvedValue({ id: 1, status: 0 });

      await expect(orderService.createOrder(validOrderData))
        .rejects
        .toThrow(new AppError('Sacola 1 está inativa', 'INACTIVE_BAG'));
    });
  });

  describe('getOrder', () => {
    const mockOrder = new Order(1, 1, 1);

    it('should return order when it exists', async () => {
      mockOrderRepository.findById.mockResolvedValue(mockOrder);

      const result = await orderService.getOrder(1);
      expect(result).toBe(mockOrder);
      expect(mockOrderRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw error when order does not exist', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(orderService.getOrder(999))
        .rejects
        .toThrow(AppError.notFound('Pedido', 999));
    });
  });

  describe('getAllOrders', () => {
    it('should return all orders', async () => {
      const mockOrders = [
        new Order(1, 1, 1),
        new Order(2, 2, 1)
      ];
      mockOrderRepository.findAll.mockResolvedValue(mockOrders);

      const result = await orderService.getAllOrders();
      expect(result).toBe(mockOrders);
      expect(mockOrderRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('getOrdersByUser', () => {
    it('should return orders for specific user', async () => {
      const mockOrders = [
        new Order(1, 1, 1),
        new Order(2, 1, 1)
      ];
      mockOrderRepository.findByUserId.mockResolvedValue(mockOrders);

      const result = await orderService.getOrdersByUser(1);
      expect(result).toBe(mockOrders);
      expect(mockOrderRepository.findByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('getOrdersByBusiness', () => {
    it('should return orders for specific business', async () => {
      const mockOrders = [
        new Order(1, 1, 1),
        new Order(2, 2, 1)
      ];
      mockOrderRepository.findByBusinessId.mockResolvedValue(mockOrders);

      const result = await orderService.getOrdersByBusiness(1);
      expect(result).toBe(mockOrders);
      expect(mockOrderRepository.findByBusinessId).toHaveBeenCalledWith(1);
    });
  });

  describe('updateOrderStatus', () => {
    const mockOrder = new Order(1, 1, 1);

    beforeEach(() => {
      mockOrderRepository.findById.mockResolvedValue(mockOrder);
      mockOrderRepository.updateStatus.mockImplementation(async (id, status) => ({
        ...mockOrder,
        status
      }));
    });    it('should update order status successfully', async () => {
      const result = await orderService.updateOrderStatus(1, 'confirmado');
      
      expect(result.status).toBe('confirmado');
      expect(mockOrderRepository.updateStatus).toHaveBeenCalledWith(1, 'confirmado');
    });

    it('should throw error when order does not exist', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);      await expect(orderService.updateOrderStatus(999, 'confirmado'))
        .rejects
        .toThrow(AppError.notFound('Pedido', 999));
    });

    it('should throw error for invalid status', async () => {
      await expect(orderService.updateOrderStatus(1, 'invalid_status'))
        .rejects
        .toThrow(new AppError('Status inválido', 'INVALID_STATUS'));
    });

    it('should inactivate bags when order is delivered', async () => {
      const orderWithItems = new Order(1, 1, 1);
      orderWithItems.addItem(new OrderItem(1, 1, 1, 2, 10.99));
      mockOrderRepository.findById.mockResolvedValue(orderWithItems);

      await orderService.updateOrderStatus(1, 'entregue');

      expect(mockBagService.changeBagStatus).toHaveBeenCalledWith(1, 0);
    });
  });

  describe('addItemToOrder', () => {
    const mockOrder = new Order(1, 1, 1);
    const mockBag = { id: 1, price: 10.99, status: 1 };
    const itemData = { bagId: 1, quantity: 2 };

    beforeEach(() => {
      mockOrderRepository.findById.mockResolvedValue(mockOrder);
      mockBagService.getBag.mockResolvedValue(mockBag);
      mockOrderRepository.addItem.mockImplementation(async (orderId, data) => ({
        id: 1,
        ...data
      }));
    });

    it('should add item to pending order', async () => {
      const result = await orderService.addItemToOrder(1, itemData);

      expect(result).toHaveProperty('id', 1);
      expect(result.price).toBe(10.99);
      expect(mockOrderRepository.addItem).toHaveBeenCalledWith(1, {
        ...itemData,
        price: 10.99
      });
    });

    it('should throw error when order does not exist', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(orderService.addItemToOrder(999, itemData))
        .rejects
        .toThrow(AppError.notFound('Pedido', 999));
    });    it('should throw error when order is not pending', async () => {
      mockOrder.status = 'confirmado';

      await expect(orderService.addItemToOrder(1, itemData))
        .rejects
        .toThrow(new AppError('Não é possível adicionar itens a um pedido que não está pendente', 'INVALID_ORDER_STATUS'));
    });

    it('should throw error when bag does not exist', async () => {
      mockOrder.status = 'pendente';
      mockBagService.getBag.mockResolvedValue(null);
      await expect(orderService.addItemToOrder(1, itemData))
        .rejects
        .toThrow(new AppError('Sacola não encontrada com o ID: 1', 'NOT_FOUND'));
    });

    it('should throw error when bag is inactive', async () => {
      mockOrder.status = 'pendente';
      mockBagService.getBag.mockResolvedValue({ id: 1, status: 0 });
      await expect(orderService.addItemToOrder(1, itemData))
        .rejects
        .toThrow(new AppError('Sacola 1 está inativa', 'INACTIVE_BAG'));
    });
  });

  describe('removeItemFromOrder', () => {
    const mockOrder = new Order(1, 1, 1);

    beforeEach(() => {
      mockOrderRepository.findById.mockResolvedValue(mockOrder);
      mockOrderRepository.removeItem.mockResolvedValue(true);
    });

    it('should remove item from pending order', async () => {
      const result = await orderService.removeItemFromOrder(1, 1);

      expect(result).toBe(true);
      expect(mockOrderRepository.removeItem).toHaveBeenCalledWith(1, 1);
    });

    it('should throw error when order does not exist', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(orderService.removeItemFromOrder(999, 1))
        .rejects
        .toThrow(AppError.notFound('Pedido', 999));
    });    it('should throw error when order is not pending', async () => {
      mockOrder.status = 'confirmado';

      await expect(orderService.removeItemFromOrder(1, 1))
        .rejects
        .toThrow(new AppError('Não é possível remover itens de um pedido que não está pendente', 'INVALID_ORDER_STATUS'));
    });

    it('should throw error when item does not exist', async () => {
      mockOrder.status = 'pendente';
      mockOrderRepository.removeItem.mockResolvedValue(false);
      await expect(orderService.removeItemFromOrder(1, 999))
        .rejects
        .toThrow(new AppError('Item do pedido não encontrada com o ID: 999', 'NOT_FOUND'));
    });
  });

  describe('updateItemQuantity', () => {
    const mockOrder = new Order(1, 1, 1);

    beforeEach(() => {
      mockOrderRepository.findById.mockResolvedValue(mockOrder);
      mockOrderRepository.updateItemQuantity.mockImplementation(async (orderId, itemId, quantity) => ({
        id: itemId,
        quantity
      }));
    });

    it('should update item quantity in pending order', async () => {
      const result = await orderService.updateItemQuantity(1, 1, 3);

      expect(result.quantity).toBe(3);
      expect(mockOrderRepository.updateItemQuantity).toHaveBeenCalledWith(1, 1, 3);
    });

    it('should throw error when order does not exist', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(orderService.updateItemQuantity(999, 1, 3))
        .rejects
        .toThrow(AppError.notFound('Pedido', 999));
    });

    it('should throw error when order is not pending', async () => {
      mockOrder.status = 'confirmed';

      await expect(orderService.updateItemQuantity(1, 1, 3))
        .rejects
        .toThrow(new AppError('Não é possível atualizar itens de um pedido que não está pendente', 'INVALID_ORDER_STATUS'));
    });

    it('should throw error for invalid quantity', async () => {
      mockOrder.status = 'pendente';
      await expect(orderService.updateItemQuantity(1, 1, 0))
        .rejects
        .toThrow(new AppError('Quantidade deve ser maior que zero', 'INVALID_QUANTITY'));
    });

    it('should throw error when item does not exist', async () => {
      mockOrder.status = 'pendente';
      mockOrderRepository.updateItemQuantity.mockResolvedValue(null);
      await expect(orderService.updateItemQuantity(1, 999, 3))
        .rejects
        .toThrow(new AppError('Item do pedido não encontrada com o ID: 999', 'NOT_FOUND'));
    });
  });

  describe('cancelOrder', () => {
    const mockOrder = new Order(1, 1, 1);

    beforeEach(() => {
      mockOrderRepository.findById.mockResolvedValue(mockOrder);
      mockOrderRepository.updateStatus.mockImplementation(async (id, status) => ({
        ...mockOrder,
        status
      }));
    });

    it('should cancel order successfully', async () => {
      const result = await orderService.cancelOrder(1);
      expect(result.status).toBe('cancelado');
      expect(mockOrderRepository.updateStatus).toHaveBeenCalledWith(1, 'cancelado');
    });

    it('should throw error when order does not exist', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(orderService.cancelOrder(999))
        .rejects
        .toThrow(AppError.notFound('Pedido', 999));
    });

    it('should throw error when order cannot be cancelled', async () => {
      mockOrder.status = 'entregue';
      await expect(orderService.cancelOrder(1))
        .rejects
        .toThrow(new AppError('Não é possível cancelar este pedido', 'INVALID_ORDER_STATUS'));
    });
  });
}); 