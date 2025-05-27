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
      updateItemQuantity: jest.fn()
    };

    mockBagService = {
      getBag: jest.fn()
    };

    orderService = new OrderService(mockOrderRepository, mockBagService);
  });

  describe('createOrder', () => {
    const orderData = {
      userId: 1,
      businessId: 2,
      items: [
        { bagId: 1, quantity: 2 },
        { bagId: 2, quantity: 1 }
      ]
    };

    const mockBags = [
      { id: 1, price: 10.99, status: 1 },
      { id: 2, price: 15.99, status: 1 }
    ];

    beforeEach(() => {
      mockBagService.getBag
        .mockResolvedValueOnce(mockBags[0])
        .mockResolvedValueOnce(mockBags[1]);
    });

    test('should create order successfully', async () => {
      const mockOrder = {
        id: 1,
        userId: orderData.userId,
        businessId: orderData.businessId,
        status: 'pendente',
        totalAmount: 37.97, // (2 * 10.99) + (1 * 15.99)
        items: [
          { bagId: 1, quantity: 2, price: 10.99 },
          { bagId: 2, quantity: 1, price: 15.99 }
        ]
      };

      mockOrderRepository.create.mockResolvedValue(mockOrder);

      const result = await orderService.createOrder(orderData);

      expect(mockBagService.getBag).toHaveBeenCalledTimes(2);
      expect(mockBagService.getBag).toHaveBeenCalledWith(1);
      expect(mockBagService.getBag).toHaveBeenCalledWith(2);
      expect(mockOrderRepository.create).toHaveBeenCalledWith({
        userId: orderData.userId,
        businessId: orderData.businessId,
        items: [
          { bagId: 1, quantity: 2, price: 10.99 },
          { bagId: 2, quantity: 1, price: 15.99 }
        ]
      });
      expect(result).toEqual(mockOrder);
    });
  });

  describe('addItemToOrder', () => {
    const orderId = 1;
    const itemData = { bagId: 1, quantity: 2 };
    const mockOrder = {
      id: orderId,
      status: 'pendente',
      items: []
    };
    const mockBag = { id: 1, price: 10.99, status: 1 };
    const mockItem = { id: 1, orderId, bagId: 1, quantity: 2, price: 10.99 };

    beforeEach(() => {
      mockOrderRepository.findById.mockResolvedValue(mockOrder);
      mockBagService.getBag.mockResolvedValue(mockBag);
      mockOrderRepository.addItem.mockResolvedValue(mockItem);
    });

    test('should add item to order successfully', async () => {
      const result = await orderService.addItemToOrder(orderId, itemData);

      expect(mockOrderRepository.findById).toHaveBeenCalledWith(orderId);
      expect(mockBagService.getBag).toHaveBeenCalledWith(itemData.bagId);
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
}); 