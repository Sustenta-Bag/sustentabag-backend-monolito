import { jest } from '@jest/globals';
import OrderService from "../../src/application/services/OrderService";
import Order from "../../src/domain/entities/Order";
import OrderItem from "../../src/domain/entities/OrderItem";
import AppError from "../../src/infrastructure/errors/AppError";

// Mock dependencies
const mockOrderRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  findByUserId: jest.fn(),
  findByBusinessId: jest.fn(),
  updateStatus: jest.fn(),
  addItem: jest.fn(),
  removeItem: jest.fn(),
  updateItemQuantity: jest.fn(),
  update: jest.fn(),
};

const mockBagService = {
  getBag: jest.fn(),
};

const mockPaymentServiceClient = {
  createPayment: jest.fn(), // Although we removed this call in createOrder, keep for other potential tests
  getPayment: jest.fn(),
  cancelPayment: jest.fn(),
  refundPayment: jest.fn(),
};

const createOrderService = () => new OrderService(
  mockOrderRepository,
  mockBagService,
  mockPaymentServiceClient
);

describe('OrderService', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create an order successfully when items are valid', async () => {
      const orderData = {
        userId: 1,
        businessId: 1,
        items: [
          { bagId: 1, quantity: 2 },
          { bagId: 2, quantity: 1 },
        ],
      };

      // Mock bagService.getBag to return active bags
      mockBagService.getBag.mockImplementation(async (bagId) => {
        if (bagId === 1) return { id: 1, status: 1, price: 10 };
        if (bagId === 2) return { id: 2, status: 1, price: 20 };
        return null; // Bag not found
      });

      // Mock orderRepository.create to return a created order object
      mockOrderRepository.create.mockResolvedValue({ id: 1, ...orderData, items: orderData.items.map(item => ({...item, price: item.bagId === 1 ? 10 : 20})) });

      const orderService = createOrderService();
      const createdOrder = await orderService.createOrder(orderData);

      expect(mockBagService.getBag).toHaveBeenCalledTimes(orderData.items.length);
      expect(mockBagService.getBag).toHaveBeenCalledWith(1);
      expect(mockBagService.getBag).toHaveBeenCalledWith(2);
      
      // Verify orderRepository.create was called with correct data
      expect(mockOrderRepository.create).toHaveBeenCalledTimes(1);
      expect(mockOrderRepository.create).toHaveBeenCalledWith({
        userId: 1,
        businessId: 1,
        items: [
          { bagId: 1, quantity: 2, price: 10 },
          { bagId: 2, quantity: 1, price: 20 },
        ],
      });

      // Verify paymentServiceClient methods were NOT called
      expect(mockPaymentServiceClient.createPayment).not.toHaveBeenCalled();
      expect(mockPaymentServiceClient.setPaymentInfo).not.toHaveBeenCalled(); // Assuming setPaymentInfo was a method on PaymentServiceClient

      expect(createdOrder).toHaveProperty('id', 1);
      expect(createdOrder.items).toHaveLength(2);
    });

    it('should throw an error if items list is empty', async () => {
      const orderData = {
        userId: 1,
        businessId: 1,
        items: [],
      };

      const orderService = createOrderService();

      await expect(orderService.createOrder(orderData)).rejects.toThrow(
        'Pedido deve conter pelo menos um item'
      );
      expect(mockBagService.getBag).not.toHaveBeenCalled();
      expect(mockOrderRepository.create).not.toHaveBeenCalled();
      expect(mockPaymentServiceClient.createPayment).not.toHaveBeenCalled();
    });

    it('should throw an error if a bag does not exist', async () => {
      const orderData = {
        userId: 1,
        businessId: 1,
        items: [
          { bagId: 99, quantity: 1 }, // Non-existent bag
        ],
      };

      // Mock bagService.getBag to return null for non-existent bag
      mockBagService.getBag.mockResolvedValue(null);

      const orderService = createOrderService();

      await expect(orderService.createOrder(orderData)).rejects.toThrow(
        'Sacola não encontrada com o ID fornecido: 99'
      );
      expect(mockBagService.getBag).toHaveBeenCalledTimes(1);
      expect(mockBagService.getBag).toHaveBeenCalledWith(99);
      expect(mockOrderRepository.create).not.toHaveBeenCalled();
      expect(mockPaymentServiceClient.createPayment).not.toHaveBeenCalled();
    });

    it('should throw an error if a bag is inactive', async () => {
      const orderData = {
        userId: 1,
        businessId: 1,
        items: [
          { bagId: 1, quantity: 1 },
        ],
      };

      // Mock bagService.getBag to return an inactive bag
      mockBagService.getBag.mockResolvedValue({ id: 1, status: 0, price: 10 });

      const orderService = createOrderService();

      await expect(orderService.createOrder(orderData)).rejects.toThrow(
        'Sacola 1 está inativa'
      );
      expect(mockBagService.getBag).toHaveBeenCalledTimes(1);
      expect(mockBagService.getBag).toHaveBeenCalledWith(1);
      expect(mockOrderRepository.create).not.toHaveBeenCalled();
      expect(mockPaymentServiceClient.createPayment).not.toHaveBeenCalled();
    });
  });
}); 