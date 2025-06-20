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
      idClient: 1,
      idBusiness: 1,
      items: [
        { idBag: 1, quantity: 2 },
        { idBag: 2, quantity: 1 }
      ]
    };

    const mockBag1 = { id: 1, price: 10.99, status: 1 };
    const mockBag2 = { id: 2, price: 5.99, status: 1 };

    beforeEach(() => {
      mockBagService.getBag.mockImplementation(async (idBag) => {
        if (idBag === 1) return mockBag1;
        if (idBag === 2) return mockBag2;
        return null;
      });
      mockOrderRepository.create.mockImplementation(async (data) => ({
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
        idClient: 1,
        idBusiness: 1,
        items: [
          { idBag: 1, quantity: 2, price: 10.99 },
          { idBag: 2, quantity: 1, price: 5.99 }
        ]
      });
      expect(result).toHaveProperty('id', 1);
      expect(result.status).toBe('pendente');
    });

    it('should throw error when order has no items', async () => {
      const invalidOrderData = {
        idClient: 1,
        idBusiness: 1,
        items: []
      };

      await expect(orderService.createOrder(invalidOrderData))
        .rejects
        .toThrow(new AppError('Pedido deve conter pelo menos um item', 'INVALID_ORDER'));
    });

    it('should throw error when bag does not exist', async () => {
      mockBagService.getBag.mockImplementation(async (idBag) => idBag === 1 ? null : mockBag2);
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
      mockOrderRepository.findAll.mockResolvedValue({ count: 2, rows: mockOrders });

      const result = await orderService.getAllOrders();
      expect(result).toEqual({ total: 2, pages: 1, data: mockOrders });
      expect(mockOrderRepository.findAll).toHaveBeenCalled();
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
    });

    it('should update order status successfully', async () => {
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
      orderWithItems.addItem(new OrderItem({ id: 1, idOrder: 1, idBag: 1, quantity: 2, price: 10.99 }));
      mockOrderRepository.findById.mockResolvedValue(orderWithItems);
      mockOrderRepository.updateStatus.mockImplementation(async (id, status) => ({
        ...orderWithItems,
        status
      }));
      mockBagService.changeBagStatus.mockClear();
      await orderService.updateOrderStatus(1, 'entregue');
      expect(mockBagService.changeBagStatus).toHaveBeenCalledWith(1, 0);
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
    });

    it('should throw error when order is not pending', async () => {
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
}); 