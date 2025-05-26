import Order from '../../domain/entities/Order.js';
import OrderItem from '../../domain/entities/OrderItem.js';

describe('Order Entity', () => {
  let order;
  const mockDate = new Date('2024-01-01');
  beforeEach(() => {
    order = new Order(1, 1, 1, 'pendente', 0, mockDate);
  });

  describe('Constructor', () => {
    it('should create an order with default values', () => {
      const defaultOrder = new Order(1, 1, 1);
      expect(defaultOrder.id).toBe(1);
      expect(defaultOrder.userId).toBe(1);
      expect(defaultOrder.businessId).toBe(1);
      expect(defaultOrder.status).toBe('pendente');
      expect(defaultOrder.totalAmount).toBe(0);
      expect(defaultOrder.items).toEqual([]);
      expect(defaultOrder.createdAt).toBeInstanceOf(Date);
    });

    it('should create an order with custom values', () => {
      expect(order.id).toBe(1);
      expect(order.userId).toBe(1);
      expect(order.businessId).toBe(1);
      expect(order.status).toBe('pendente');
      expect(order.totalAmount).toBe(0);
      expect(order.createdAt).toBe(mockDate);
      expect(order.items).toEqual([]);
    });
  });

  describe('addItem', () => {
    it('should add an item and update total amount', () => {
      const item = new OrderItem(1, 1, 1, 2, 10.99);
      order.addItem(item);
      
      expect(order.items).toHaveLength(1);
      expect(order.items[0]).toBe(item);
      expect(order.totalAmount).toBe(21.98); // 10.99 * 2
    });

    it('should handle multiple items correctly', () => {
      const item1 = new OrderItem(1, 1, 1, 2, 10.99);
      const item2 = new OrderItem(2, 1, 2, 1, 5.99);
      
      order.addItem(item1);
      order.addItem(item2);
      
      expect(order.items).toHaveLength(2);
      expect(order.totalAmount).toBe(27.97); // (10.99 * 2) + (5.99 * 1)
    });
  });

  describe('removeItem', () => {
    it('should remove an item and update total amount', () => {
      const item1 = new OrderItem(1, 1, 1, 2, 10.99);
      const item2 = new OrderItem(2, 1, 2, 1, 5.99);
      
      order.addItem(item1);
      order.addItem(item2);
      order.removeItem(1);
      
      expect(order.items).toHaveLength(1);
      expect(order.items[0].id).toBe(2);
      expect(order.totalAmount).toBe(5.99);
    });

    it('should do nothing when removing non-existent item', () => {
      const item = new OrderItem(1, 1, 1, 2, 10.99);
      order.addItem(item);
      order.removeItem(999);
      
      expect(order.items).toHaveLength(1);
      expect(order.totalAmount).toBe(21.98);
    });
  });

  describe('Status Management', () => {    it('should update status to valid values', () => {
      const validStatuses = ['confirmado', 'preparando', 'pronto', 'entregue', 'cancelado'];
      
      validStatuses.forEach(status => {
        order.updateStatus(status);
        expect(order.status).toBe(status);
      });
    });

    it('should throw error for invalid status', () => {
      expect(() => order.updateStatus('invalid_status')).toThrow('Status inválido');
    });    it('should confirm order when in pending status', () => {
      order.confirm();
      expect(order.status).toBe('confirmado');
    });

    it('should prepare order when confirmed', () => {
      order.confirm();
      order.prepare();
      expect(order.status).toBe('preparando');
    });

    it('should mark order as ready when preparing', () => {
      order.confirm();
      order.prepare();
      order.markAsReady();
      expect(order.status).toBe('pronto');
    });

    it('should deliver order when ready', () => {
      order.confirm();
      order.prepare();
      order.markAsReady();
      order.deliver();
      expect(order.status).toBe('entregue');
    });

    it('should cancel order when not delivered', () => {
      order.cancel();
      expect(order.status).toBe('cancelado');
    });
  });

  describe('Status Validation', () => {
    it('should allow confirmation only when pending', () => {
      expect(order.canBeConfirmed()).toBe(true);
      
      order.confirm();
      expect(order.canBeConfirmed()).toBe(false);
    });

    it('should allow cancellation when not delivered', () => {
      expect(order.canBeCancelled()).toBe(true);
      
      order.confirm();
      expect(order.canBeCancelled()).toBe(true);
      
      order.prepare();
      expect(order.canBeCancelled()).toBe(true);
      
      order.markAsReady();
      expect(order.canBeCancelled()).toBe(true);
      
      order.deliver();
      expect(order.canBeCancelled()).toBe(false);
    });
  });
}); 