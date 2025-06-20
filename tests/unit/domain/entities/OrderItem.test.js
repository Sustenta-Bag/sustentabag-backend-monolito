import OrderItem from '../../../../src/domain/entities/OrderItem.js';
import { jest } from '@jest/globals';

describe('OrderItem Entity', () => {
  describe('Constructor', () => {
    test('should create an order item with all properties', () => {
      const orderItem = new OrderItem({ id: 1, idOrder: 2, idBag: 3, quantity: 4, price: 10.99 });
      
      expect(orderItem.id).toBe(1);
      expect(orderItem.idOrder).toBe(2);
      expect(orderItem.idBag).toBe(3);
      expect(orderItem.quantity).toBe(4);
      expect(orderItem.price).toBe(10.99);
      expect(orderItem.createdAt).toBeInstanceOf(Date);
    });

    test('should create an order item with default createdAt', () => {
      const mockDate = new Date('2024-01-01');
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const orderItem = new OrderItem({ id: 1, idOrder: 2, idBag: 3, quantity: 4, price: 10.99 });
      
      expect(orderItem.createdAt).toEqual(mockDate);
      
      jest.useRealTimers();
    });

    test('should create an order item with custom createdAt', () => {
      const customDate = new Date('2023-12-31');
      const orderItem = new OrderItem({ id: 1, idOrder: 2, idBag: 3, quantity: 4, price: 10.99, createdAt: customDate });
      
      expect(orderItem.createdAt).toBe(customDate);
    });
  });

  describe('updateQuantity', () => {
    test('should update quantity successfully', () => {
      const orderItem = new OrderItem({ id: 1, idOrder: 2, idBag: 3, quantity: 4, price: 10.99 });
      const result = orderItem.updateQuantity(5);
      
      expect(orderItem.quantity).toBe(5);
      expect(result).toBe(orderItem); // Test method chaining
    });

    test('should throw error when quantity is less than 1', () => {
      const orderItem = new OrderItem({ id: 1, idOrder: 2, idBag: 3, quantity: 4, price: 10.99 });
      
      expect(() => orderItem.updateQuantity(0)).toThrow('Quantidade deve ser maior que zero');
      expect(() => orderItem.updateQuantity(-1)).toThrow('Quantidade deve ser maior que zero');
    });
  });

  describe('updatePrice', () => {
    test('should update price successfully', () => {
      const orderItem = new OrderItem({ id: 1, idOrder: 2, idBag: 3, quantity: 4, price: 10.99 });
      const result = orderItem.updatePrice(15.99);
      
      expect(orderItem.price).toBe(15.99);
      expect(result).toBe(orderItem); // Test method chaining
    });

    test('should throw error when price is negative', () => {
      const orderItem = new OrderItem({ id: 1, idOrder: 2, idBag: 3, quantity: 4, price: 10.99 });
      
      expect(() => orderItem.updatePrice(-1)).toThrow('Preço não pode ser negativo');
    });

    test('should allow zero price', () => {
      const orderItem = new OrderItem({ id: 1, idOrder: 2, idBag: 3, quantity: 4, price: 10.99 });
      const result = orderItem.updatePrice(0);
      
      expect(orderItem.price).toBe(0);
      expect(result).toBe(orderItem);
    });
  });

  describe('getSubtotal', () => {
    test('should calculate subtotal correctly', () => {
      const orderItem = new OrderItem({ id: 1, idOrder: 2, idBag: 3, quantity: 4, price: 10.99 });
      
      expect(orderItem.getSubtotal()).toBe(43.96); // 4 * 10.99
    });

    test('should calculate subtotal with zero price', () => {
      const orderItem = new OrderItem({ id: 1, idOrder: 2, idBag: 3, quantity: 4, price: 0 });
      
      expect(orderItem.getSubtotal()).toBe(0);
    });

    test('should calculate subtotal with quantity of 1', () => {
      const orderItem = new OrderItem({ id: 1, idOrder: 2, idBag: 3, quantity: 1, price: 10.99 });
      
      expect(orderItem.getSubtotal()).toBe(10.99);
    });

    test('should calculate subtotal with decimal price', () => {
      const orderItem = new OrderItem({ id: 1, idOrder: 2, idBag: 3, quantity: 2, price: 10.50 });
      
      expect(orderItem.getSubtotal()).toBe(21.00);
    });
  });
}); 