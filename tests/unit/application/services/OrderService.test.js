import OrderService from '../../../../src/application/services/OrderService.js';
import AppError from '../../../../src/infrastructure/errors/AppError.js';
import { jest } from '@jest/globals';

describe('OrderService', () => {
  let orderService;
  let mockOrderRepository;
  let mockBagService;

  beforeEach(() => {
    mockOrderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateItemQuantity: jest.fn(),
      updateStatus: jest.fn(),
      findByUserId: jest.fn(),
      findByBusinessId: jest.fn(),
      getOrderHistoryByUser: jest.fn(),
      getOrderHistoryByBusiness: jest.fn(),
      getOrdersByStatus: jest.fn(),
      getOrdersByDateRange: jest.fn()
    };

    mockBagService = {
      getBag: jest.fn(),
      changeBagStatus: jest.fn()
    };

    orderService = new OrderService(mockOrderRepository, mockBagService);
  });

  describe('createOrder', () => {
    const orderData = {
      idClient: 1,
      idBusiness: 2,
      items: [
        { idBag: 1, quantity: 2 },
        { idBag: 2, quantity: 1 }
      ]
    };

    const mockBags = [
      { id: 1, price: 10.99, status: 1 },
      { id: 2, price: 15.99, status: 1 }
    ];

    beforeEach(() => {
      mockBagService.getBag
        .mockImplementation((idBag) => {
          if (idBag === 1) return Promise.resolve(mockBags[0]);
          if (idBag === 2) return Promise.resolve(mockBags[1]);
          return Promise.resolve(null);
        });
    });

    test('should create order successfully', async () => {
      const mockOrder = {
        id: 1,
        idClient: orderData.idClient,
        idBusiness: orderData.idBusiness,
        status: 'pendente',
        totalAmount: 37.97, // (2 * 10.99) + (1 * 15.99)
        items: [
          { idBag: 1, quantity: 2, price: 10.99 },
          { idBag: 2, quantity: 1, price: 15.99 }
        ]
      };

      mockOrderRepository.create.mockResolvedValue(mockOrder);

      const result = await orderService.createOrder(orderData);

      expect(mockBagService.getBag).toHaveBeenCalledTimes(2);
      expect(mockBagService.getBag).toHaveBeenCalledWith(1);
      expect(mockBagService.getBag).toHaveBeenCalledWith(2);
      expect(mockOrderRepository.create).toHaveBeenCalledWith({
        idClient: orderData.idClient,
        idBusiness: orderData.idBusiness,
        items: [
          { idBag: 1, quantity: 2, price: 10.99 },
          { idBag: 2, quantity: 1, price: 15.99 }
        ]
      });
      expect(result).toEqual(mockOrder);
    });
  });

  describe('addItemToOrder', () => {
    const orderId = 1;
    const itemData = { idBag: 1, quantity: 2 };
    const mockOrder = {
      id: orderId,
      status: 'pendente',
      items: []
    };
    const mockBag = { id: 1, price: 10.99, status: 1 };
    const mockItem = { id: 1, orderId, idBag: 1, quantity: 2, price: 10.99 };

    beforeEach(() => {
      mockOrderRepository.findById.mockResolvedValue(mockOrder);
      mockBagService.getBag.mockResolvedValue(mockBag);
      mockOrderRepository.addItem.mockResolvedValue(mockItem);
    });

    test('should add item to order successfully', async () => {
      const result = await orderService.addItemToOrder(orderId, itemData);

      expect(mockOrderRepository.findById).toHaveBeenCalledWith(orderId);
      expect(mockBagService.getBag).toHaveBeenCalledWith(itemData.idBag);
      expect(mockOrderRepository.addItem).toHaveBeenCalledWith(orderId, {
        ...itemData,
        price: mockBag.price
      });
      expect(result).toEqual(mockItem);
    });

    test('should throw error when order is not found', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(orderService.addItemToOrder(orderId, itemData))
        .rejects
        .toThrow(AppError);
    });

    test('should throw error when order is not pending', async () => {
      mockOrderRepository.findById.mockResolvedValue({ ...mockOrder, status: 'confirmado' });

      await expect(orderService.addItemToOrder(orderId, itemData))
        .rejects
        .toThrow('Não é possível adicionar itens a um pedido que não está pendente');
    });

    test('should throw error when bag is not found', async () => {
      mockBagService.getBag.mockResolvedValue(null);

      await expect(orderService.addItemToOrder(orderId, itemData))
        .rejects
        .toThrow(AppError);
    });

    test('should throw error when bag is inactive', async () => {
      mockBagService.getBag.mockResolvedValue({ ...mockBag, status: 0 });

      await expect(orderService.addItemToOrder(orderId, itemData))
        .rejects
        .toThrow('Sacola 1 está inativa');
    });
  });

  describe('removeItemFromOrder', () => {
    const orderId = 1;
    const itemId = 1;
    const mockOrder = {
      id: orderId,
      status: 'pendente',
      items: [
        { id: 1, price: 10.99, quantity: 2 },
        { id: 2, price: 15.99, quantity: 1 }
      ]
    };

    beforeEach(() => {
      mockOrderRepository.findById.mockResolvedValue(mockOrder);
      mockOrderRepository.removeItem.mockResolvedValue(true);
    });

    test('should remove item from order successfully', async () => {
      const result = await orderService.removeItemFromOrder(orderId, itemId);

      expect(mockOrderRepository.findById).toHaveBeenCalledWith(orderId);
      expect(mockOrderRepository.removeItem).toHaveBeenCalledWith(orderId, itemId);
      expect(mockOrderRepository.update).toHaveBeenCalledWith(orderId, {
        totalAmount: 37.97 // Original total since items array is not updated
      });
      expect(result).toBe(true);
    });

    test('should throw error when order is not found', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(orderService.removeItemFromOrder(orderId, itemId))
        .rejects
        .toThrow(AppError);
    });

    test('should throw error when order is not pending', async () => {
      mockOrderRepository.findById.mockResolvedValue({ ...mockOrder, status: 'confirmado' });

      await expect(orderService.removeItemFromOrder(orderId, itemId))
        .rejects
        .toThrow('Não é possível remover itens de um pedido que não está pendente');
    });

    test('should throw error when item is not found', async () => {
      mockOrderRepository.removeItem.mockResolvedValue(false);

      await expect(orderService.removeItemFromOrder(orderId, itemId))
        .rejects
        .toThrow(AppError);
    });
  });

  describe('updateItemQuantity', () => {
    const orderId = 1;
    const itemId = 1;
    const quantity = 3;
    const mockOrder = {
      id: orderId,
      status: 'pendente',
      items: [
        { id: 1, price: 10.99, quantity: 2 },
        { id: 2, price: 15.99, quantity: 1 }
      ]
    };
    const mockUpdatedItem = { id: 1, orderId, bagId: 1, quantity: 3, price: 10.99 };

    beforeEach(() => {
      mockOrderRepository.findById.mockResolvedValue(mockOrder);
      mockOrderRepository.updateItemQuantity.mockResolvedValue(mockUpdatedItem);
    });

    test('should update item quantity successfully', async () => {
      const result = await orderService.updateItemQuantity(orderId, itemId, quantity);

      expect(mockOrderRepository.findById).toHaveBeenCalledWith(orderId);
      expect(mockOrderRepository.updateItemQuantity).toHaveBeenCalledWith(orderId, itemId, quantity);
      expect(mockOrderRepository.update).toHaveBeenCalledWith(orderId, {
        totalAmount: 37.97 // Original total since items array is not updated
      });
      expect(result).toEqual(mockUpdatedItem);
    });

    test('should throw error when order is not found', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(orderService.updateItemQuantity(orderId, itemId, quantity))
        .rejects
        .toThrow(AppError);
    });

    test('should throw error when order is not pending', async () => {
      mockOrderRepository.findById.mockResolvedValue({ ...mockOrder, status: 'confirmado' });

      await expect(orderService.updateItemQuantity(orderId, itemId, quantity))
        .rejects
        .toThrow('Não é possível atualizar itens de um pedido que não está pendente');
    });

    test('should throw error when quantity is less than 1', async () => {
      await expect(orderService.updateItemQuantity(orderId, itemId, 0))
        .rejects
        .toThrow('Quantidade deve ser maior que zero');
    });

    test('should throw error when item is not found', async () => {
      mockOrderRepository.updateItemQuantity.mockResolvedValue(null);

      await expect(orderService.updateItemQuantity(orderId, itemId, quantity))
        .rejects
        .toThrow(AppError);
    });
  });

  describe('getOrder', () => {
    const orderId = 1;
    const mockOrder = {
      id: orderId,
      userId: 1,
      businessId: 2,
      status: 'pendente',
      items: []
    };

    test('should return order when found', async () => {
      mockOrderRepository.findById.mockResolvedValue(mockOrder);

      const result = await orderService.getOrder(orderId);

      expect(mockOrderRepository.findById).toHaveBeenCalledWith(orderId);
      expect(result).toEqual(mockOrder);
    });

    test('should throw error when order is not found', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(orderService.getOrder(999))
        .rejects
        .toThrow(AppError);
      await expect(orderService.getOrder(999))
        .rejects
        .toThrow(/Pedido não encontrada com o ID: 999/);
    });
  });

  describe('getAllOrders', () => {
    const mockOrders = [
      { id: 1, status: 'pendente' },
      { id: 2, status: 'confirmado' }
    ];

    test('should return all orders', async () => {
      mockOrderRepository.findAll.mockResolvedValue({ count: 2, rows: mockOrders });

      const result = await orderService.getAllOrders();

      expect(mockOrderRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual({ total: 2, pages: 1, data: mockOrders });
    });

    test('should handle repository errors', async () => {
      const error = new Error('Database error');
      mockOrderRepository.findAll.mockRejectedValue(error);

      await expect(orderService.getAllOrders())
        .rejects
        .toThrow(error);
    });
  });

  describe('updateOrderStatus', () => {
    const orderId = 1;
    const mockOrder = {
      id: orderId,
      status: 'pendente',
      items: [
        { idBag: 1, quantity: 2 },
        { idBag: 2, quantity: 1 }
      ]
    };

    beforeEach(() => {
      mockOrderRepository.findById.mockResolvedValue(mockOrder);
      mockOrderRepository.updateStatus.mockImplementation((id, status) => ({
        ...mockOrder,
        status
      }));
    });

    test('should update status successfully', async () => {
      const newStatus = 'confirmado';
      const result = await orderService.updateOrderStatus(orderId, newStatus);

      expect(mockOrderRepository.findById).toHaveBeenCalledWith(orderId);
      expect(mockOrderRepository.updateStatus).toHaveBeenCalledWith(orderId, newStatus);
      expect(result.status).toBe(newStatus);
    });

    test('should throw error when order is not found', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(orderService.updateOrderStatus(orderId, 'confirmado'))
        .rejects
        .toThrow(AppError);
    });

    test('should throw error when status is invalid', async () => {
      await expect(orderService.updateOrderStatus(orderId, 'invalid_status'))
        .rejects
        .toThrow('Status inválido');
    });

    test('should inactivate bags when order is delivered', async () => {
      const newStatus = 'entregue';
      mockBagService.changeBagStatus.mockResolvedValue(true);

      const result = await orderService.updateOrderStatus(orderId, newStatus);

      expect(mockOrderRepository.updateStatus).toHaveBeenCalledWith(orderId, newStatus);
      expect(mockBagService.changeBagStatus).toHaveBeenCalledTimes(2);
      expect(mockBagService.changeBagStatus).toHaveBeenCalledWith(1, 0);
      expect(mockBagService.changeBagStatus).toHaveBeenCalledWith(2, 0);
      expect(result.status).toBe(newStatus);
    });

    test('should handle bag inactivation errors gracefully', async () => {
      const newStatus = 'entregue';
      mockBagService.changeBagStatus
        .mockResolvedValueOnce(true)
        .mockRejectedValueOnce(new Error('Bag inactivation failed'));

      const result = await orderService.updateOrderStatus(orderId, newStatus);

      expect(mockOrderRepository.updateStatus).toHaveBeenCalledWith(orderId, newStatus);
      expect(mockBagService.changeBagStatus).toHaveBeenCalledTimes(2);
      expect(result.status).toBe(newStatus);
    });
  });

  describe('getOrdersByDateRange', () => {
    const startDate = '2024-01-01';
    const endDate = '2024-01-31';
    const options = { limit: 10, offset: 0 };
    const mockOrders = [
      { id: 1, createdAt: '2024-01-15' },
      { id: 2, createdAt: '2024-01-20' }
    ];

    test('should return orders within date range', async () => {
      mockOrderRepository.getOrdersByDateRange.mockResolvedValue(mockOrders);

      const result = await orderService.getOrdersByDateRange(startDate, endDate, options);

      expect(mockOrderRepository.getOrdersByDateRange).toHaveBeenCalledWith(startDate, endDate, options);
      expect(result).toEqual(mockOrders);
    });

    test('should throw error when date range is invalid', async () => {
      await expect(orderService.getOrdersByDateRange('2024-02-01', '2024-01-01', options))
        .rejects
        .toThrow('Data inicial não pode ser maior que a data final');
    });

    test('should handle repository errors', async () => {
      const error = new Error('Database error');
      mockOrderRepository.getOrdersByDateRange.mockRejectedValue(error);

      await expect(orderService.getOrdersByDateRange(startDate, endDate, options))
        .rejects
        .toThrow(error);
    });
  });
}); 