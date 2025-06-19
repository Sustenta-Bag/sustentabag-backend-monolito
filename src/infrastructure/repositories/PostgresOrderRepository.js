import OrderRepository from './OrderRepository.js';
import Order from '../../domain/entities/Order.js';
import OrderItem from '../../domain/entities/OrderItem.js';
import OrderModel from '../../domain/models/OrderModel.js';
import OrderItemModel from '../../domain/models/OrderItemModel.js';
import ReviewModel from '../../domain/models/ReviewModel.js';
import { Op, or } from 'sequelize';

class PostgresOrderRepository extends OrderRepository {
  constructor(orderModel = OrderModel, orderItemModel = OrderItemModel) {
    super();
    this.OrderModel = orderModel;
    this.OrderItemModel = orderItemModel;
    this.ReviewModel = ReviewModel;
  }

  async create(orderData) {
    const { items, ...orderFields } = orderData;
    
    const orderRecord = await this.OrderModel.create(orderFields);
    const order = this._mapToDomainEntity(orderRecord);
    
    if (items && items.length > 0) {
      const orderItems = items.map(item => ({
        ...item,
        idOrder: order.id
      }));
      
      await this.OrderItemModel.bulkCreate(orderItems);
      const itemsRecords = await this.OrderItemModel.findAll({
        where: { idOrder: order.id }
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

  async findAll(where, limit, offset) {
    const { count, rows } = await this.OrderModel.findAndCountAll({
      where,
      include: [{
        model: this.OrderItemModel,
        as: 'items'
      }],
      offset,
      limit
    });

    const reviews = await this.ReviewModel.findAll({
      where: {
        idOrder: rows.map(record => record.id)
      },
      attributes: ['idOrder']
    });

    const reviewedOrderIds = new Set(reviews.map(r => r.idOrder));

    return {
      count,
      rows: rows.map(record => {
        const order = this._mapToDomainEntity(record);
        order.items = record.items.map(item => {
          const domainItem = this._mapToDomainItem(item);
          return domainItem;
        });
        
        order.calculateTotal();
        order.reviewed = reviewedOrderIds.has(order.id);
        return order;
      })
    };
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

  async findAllBusinessWithOrders() {
    const orderRecords = await this.OrderModel.findAll({
        attributes: [
            [this.OrderModel.sequelize.col('idEmpresa'), 'idBusiness']
        ],
        group: ['idEmpresa'],
        raw: true
    });
    return orderRecords;
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

  async addItem(idOrder, itemData) {
    const itemRecord = await this.OrderItemModel.create({
      ...itemData,
      idOrder
    });
    
    return this._mapToDomainItem(itemRecord);
  }

  async removeItem(idOrder, idItem) {
    const deleted = await this.OrderItemModel.destroy({
      where: {
        id: idItem,
        idOrder
      }
    });
    
    return deleted > 0;
  }

  async updateItemQuantity(idOrder, idItem, quantity) {
    await this.OrderItemModel.update({ quantity }, {
      where: {
        id: idItem,
        idOrder
      }
    });
    
    const itemRecord = await this.OrderItemModel.findOne({
      where: {
        id: idItem,
        idOrder
      }
    });
    
    if (!itemRecord) return null;
    
    return this._mapToDomainItem(itemRecord);
  }

  async getOrderHistory(where, limit = null, offset = 0, orderBy = 'createdAt', orderDirection = 'DESC') {
    const orderRecords = await this.OrderModel.findAndCountAll({
      where,
      include: [{
        model: this.OrderItemModel,
        as: 'items'
      }],
      order: [[orderBy, orderDirection]],
      limit,
      offset
    });

    return {
      orders: orderRecords.rows.map(record => {
        const order = this._mapToDomainEntity(record);
        order.items = record.items.map(item => this._mapToDomainItem(item));
        order.calculateTotal();
        return order;
      }),
      total: orderRecords.count,
      lastPage: (parseInt(offset) + parseInt(limit)) > orderRecords.count
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
    return new Order({
      id: record.id,
      idClient: record.idClient,
      idBusiness: record.idBusiness,
      status: record.status,
      totalAmount: record.totalAmount,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    });
  }

  _mapToDomainItem(record) {
    return new OrderItem({
      id: record.id,
      idOrder: record.idOrder,
      idBag: record.idBag,
      quantity: record.quantity,
      price: record.price,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    });
  }
}

export default PostgresOrderRepository;