import OrderRepository from './OrderRepository.js';
import Order from '../../domain/entities/Order.js';
import OrderItem from '../../domain/entities/OrderItem.js';
import OrderModel from '../../domain/models/OrderModel.js';
import OrderItemModel from '../../domain/models/OrderItemModel.js';
import { Op, or } from 'sequelize';

class PostgresOrderRepository extends OrderRepository {
  constructor(orderModel = OrderModel, orderItemModel = OrderItemModel) {
    super();
    this.OrderModel = orderModel;
    this.OrderItemModel = orderItemModel;
  }

  async create(orderData) {
    const { items, ...orderFields } = orderData;
    
    const orderRecord = await this.OrderModel.create(orderFields);
    const order = this._mapToDomainEntity(orderRecord);
    
    if (items && items.length > 0) {
      const orderItems = items.map(item => ({
        ...item,
        orderId: order.id
      }));
      
      await this.OrderItemModel.bulkCreate(orderItems);
      const itemsRecords = await this.OrderItemModel.findAll({
        where: { orderId: order.id }
      });
      
      order.items = itemsRecords.map(item => this._mapToDomainItem(item));
    }
    order.calculateTotal();
    
    return order;
  }
  async findById(id) {
    const orderRecord = await this.OrderModel.findByPk(id, {
      include: [{
        model: this.OrderItemModel,
        as: 'items'
      }]
    });
    
    if (!orderRecord) return null;
    
    const order = this._mapToDomainEntity(orderRecord);
    order.items = orderRecord.items.map(item => this._mapToDomainItem(item));
    order.calculateTotal();
    
    return order;
  }
  async findAll() {
    const orderRecords = await this.OrderModel.findAll({
      include: [{
        model: this.OrderItemModel,
        as: 'items'
      }]
    });
    
    return orderRecords.map(record => {
      const order = this._mapToDomainEntity(record);
      order.items = record.items.map(item => this._mapToDomainItem(item));
      order.calculateTotal();
      return order;
    });
  }
  async update(id, orderData) {
    const { items, ...orderFields } = orderData;
    
    await this.OrderModel.update(orderFields, {
      where: { id }
    });
    
    const orderRecord = await this.OrderModel.findByPk(id, {
      include: [{
        model: this.OrderItemModel,
        as: 'items'
      }]
    });
    
    if (!orderRecord) return null;
    
    const order = this._mapToDomainEntity(orderRecord);
    order.items = orderRecord.items.map(item => this._mapToDomainItem(item));
    order.calculateTotal();
    
    return order;
  }

  async delete(id) {
    const deleted = await this.OrderModel.destroy({
      where: { id }
    });
    return deleted > 0;
  }
  async findByUserId(userId) {
    const orderRecords = await this.OrderModel.findAll({
      where: { userId },
      include: [{
        model: this.OrderItemModel,
        as: 'items'
      }]
    });
    
    return orderRecords.map(record => {
      const order = this._mapToDomainEntity(record);
      order.items = record.items.map(item => this._mapToDomainItem(item));
      order.calculateTotal();
      return order;
    });
  }
  async findByBusinessId(businessId) {
    const orderRecords = await this.OrderModel.findAll({
      where: { businessId },
      include: [{
        model: this.OrderItemModel,
        as: 'items'
      }]
    });
    
    return orderRecords.map(record => {
      const order = this._mapToDomainEntity(record);
      order.items = record.items.map(item => this._mapToDomainItem(item));
      order.calculateTotal();
      return order;
    });
  }
  async updateStatus(id, status) {
    await this.OrderModel.update({ status }, {
      where: { id }
    });
    
    const orderRecord = await this.OrderModel.findByPk(id, {
      include: [{
        model: this.OrderItemModel,
        as: 'items'
      }]
    });
    
    if (!orderRecord) return null;
    
    const order = this._mapToDomainEntity(orderRecord);
    order.items = orderRecord.items.map(item => this._mapToDomainItem(item));
    order.calculateTotal();
    
    return order;
  }

  async addItem(orderId, itemData) {
    const itemRecord = await this.OrderItemModel.create({
      ...itemData,
      orderId
    });
    
    return this._mapToDomainItem(itemRecord);
  }

  async removeItem(orderId, itemId) {
    const deleted = await this.OrderItemModel.destroy({
      where: {
        id: itemId,
        orderId
      }
    });
    
    return deleted > 0;
  }

  async updateItemQuantity(orderId, itemId, quantity) {
    await this.OrderItemModel.update({ quantity }, {
      where: {
        id: itemId,
        orderId
      }
    });
    
    const itemRecord = await this.OrderItemModel.findOne({
      where: {
        id: itemId,
        orderId
      }
    });
    
    if (!itemRecord) return null;
    
    return this._mapToDomainItem(itemRecord);
  }
  async getOrderHistoryByUser(userId, options = {}) {
    const { status, startDate, endDate, limit = 10, offset = 0, orderBy = 'createdAt', orderDirection = 'DESC' } = options;

    const whereClause = { userId };
    
    if (status) {
      whereClause.status = status;
    }
    
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [startDate, endDate]
      };
    } else if (startDate) {
      whereClause.createdAt = {
        [Op.gte]: startDate
      };
    } else if (endDate) {
      whereClause.createdAt = {
        [Op.lte]: endDate
      };
    }

    const orderRecords = await this.OrderModel.findAndCountAll({
      where: whereClause,
      include: [{
        model: this.OrderItemModel,
        as: 'items'
      }],
      order: [[orderBy, orderDirection]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return {
      orders: orderRecords.rows.map(record => {
        const order = this._mapToDomainEntity(record);
        order.items = record.items.map(item => this._mapToDomainItem(item));
        order.calculateTotal();
        return order;
      }),
      total: orderRecords.count,
      hasMore: (parseInt(offset) + parseInt(limit)) < orderRecords.count
    };
  }
  async getOrderHistoryByBusiness(businessId, options = {}) {
    const { status, startDate, endDate, limit = 10, offset = 0, orderBy = 'createdAt', orderDirection = 'DESC' } = options;

    const whereClause = { businessId };
    
    if (status) {
      whereClause.status = status;
    }
    
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [startDate, endDate]
      };
    } else if (startDate) {
      whereClause.createdAt = {
        [Op.gte]: startDate
      };
    } else if (endDate) {
      whereClause.createdAt = {
        [Op.lte]: endDate
      };
    }

    const orderRecords = await this.OrderModel.findAndCountAll({
      where: whereClause,
      include: [{
        model: this.OrderItemModel,
        as: 'items'
      }],
      order: [[orderBy, orderDirection]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return {
      orders: orderRecords.rows.map(record => {
        const order = this._mapToDomainEntity(record);
        order.items = record.items.map(item => this._mapToDomainItem(item));
        order.calculateTotal();
        return order;
      }),
      total: orderRecords.count,
      hasMore: (parseInt(offset) + parseInt(limit)) < orderRecords.count
    };
  }
  async getOrdersByStatus(status, options = {}) {
    const { limit = 10, offset = 0, orderBy = 'createdAt', orderDirection = 'DESC' } = options;

    const orderRecords = await this.OrderModel.findAndCountAll({
      where: { status },
      include: [{
        model: this.OrderItemModel,
        as: 'items'
      }],
      order: [[orderBy, orderDirection]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return {
      orders: orderRecords.rows.map(record => {
        const order = this._mapToDomainEntity(record);
        order.items = record.items.map(item => this._mapToDomainItem(item));
        order.calculateTotal();
        return order;
      }),
      total: orderRecords.count,
      hasMore: (parseInt(offset) + parseInt(limit)) < orderRecords.count
    };
  }
  async getOrdersByDateRange(startDate, endDate, options = {}) {
    const { limit = 10, offset = 0, orderBy = 'createdAt', orderDirection = 'DESC' } = options;

    const whereClause = {};
    
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [startDate, endDate]
      };
    } else if (startDate) {
      whereClause.createdAt = {
        [Op.gte]: startDate
      };
    } else if (endDate) {
      whereClause.createdAt = {
        [Op.lte]: endDate
      };
    }

    const orderRecords = await this.OrderModel.findAndCountAll({
      where: whereClause,
      include: [{
        model: this.OrderItemModel,
        as: 'items'
      }],
      order: [[orderBy, orderDirection]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return {
      orders: orderRecords.rows.map(record => {
        const order = this._mapToDomainEntity(record);
        order.items = record.items.map(item => this._mapToDomainItem(item));
        order.calculateTotal();
        return order;
      }),
      total: orderRecords.count,
      hasMore: (parseInt(offset) + parseInt(limit)) < orderRecords.count
    };
  }

  _mapToDomainEntity(record) {
    return new Order(
      record.id,
      record.userId,
      record.businessId,
      record.status,
      record.totalAmount,
      record.createdAt
    );
  }

  _mapToDomainItem(record) {
    return new OrderItem(
      record.id,
      record.orderId,
      record.bagId,
      record.quantity,
      record.price,
      record.createdAt
    );
  }
}

export default PostgresOrderRepository;