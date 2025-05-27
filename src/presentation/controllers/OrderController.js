class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  async createOrder(req, res, next) {
    try {
      const order = await this.orderService.createOrder(req.body);
      return res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }

  async getOrder(req, res, next) {
    try {
      const order = await this.orderService.getOrder(req.params.id);
      return res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async getAllOrders(req, res, next) {
    try {
      const orders = await this.orderService.getAllOrders();
      return res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  async getOrdersByUser(req, res, next) {
    try {
      const orders = await this.orderService.getOrdersByUser(req.params.userId);
      return res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  async getOrdersByBusiness(req, res, next) {
    try {
      const orders = await this.orderService.getOrdersByBusiness(req.params.businessId);
      return res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req, res, next) {
    try {
      const order = await this.orderService.updateOrderStatus(
        req.params.id,
        req.body.status
      );
      return res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async addItemToOrder(req, res, next) {
    try {
      const item = await this.orderService.addItemToOrder(
        req.params.orderId,
        req.body
      );
      return res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  }

  async removeItemFromOrder(req, res, next) {
    try {
      await this.orderService.removeItemFromOrder(
        req.params.orderId,
        req.params.itemId
      );
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async updateItemQuantity(req, res, next) {
    try {
      const item = await this.orderService.updateItemQuantity(
        req.params.orderId,
        req.params.itemId,
        req.body.quantity
      );
      return res.json(item);
    } catch (error) {
      next(error);
    }
  }

  async cancelOrder(req, res, next) {
    try {
      const order = await this.orderService.cancelOrder(req.params.id);
      return res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async getOrderHistoryByUser(req, res, next) {
    try {
      const { userId } = req.params;
      const { status, startDate, endDate, limit, offset, orderBy, orderDirection } = req.query;
      
      const options = {
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        limit: limit || 10,
        offset: offset || 0,
        orderBy: orderBy || 'createdAt',
        orderDirection: orderDirection || 'DESC'
      };

      const history = await this.orderService.getOrderHistoryByUser(userId, options);
      return res.json(history);
    } catch (error) {
      next(error);
    }
  }

  async getOrderHistoryByBusiness(req, res, next) {
    try {
      const { businessId } = req.params;
      const { status, startDate, endDate, limit, offset, orderBy, orderDirection } = req.query;
      
      const options = {
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        limit: limit || 10,
        offset: offset || 0,
        orderBy: orderBy || 'createdAt',
        orderDirection: orderDirection || 'DESC'
      };

      const history = await this.orderService.getOrderHistoryByBusiness(businessId, options);
      return res.json(history);
    } catch (error) {
      next(error);
    }
  }

  async getOrderStatsForUser(req, res, next) {
    try {
      const stats = await this.orderService.getOrderStatsForUser(req.params.userId);
      return res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  async getOrderStatsForBusiness(req, res, next) {
    try {
      const stats = await this.orderService.getOrderStatsForBusiness(req.params.businessId);
      return res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  async getOrdersByStatus(req, res, next) {
    try {
      const { status } = req.params;
      const { limit, offset, orderBy, orderDirection } = req.query;
      
      const options = {
        limit: limit || 10,
        offset: offset || 0,
        orderBy: orderBy || 'createdAt',
        orderDirection: orderDirection || 'DESC'
      };

      const orders = await this.orderService.getOrdersByStatus(status, options);
      return res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  async getOrdersByDateRange(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const { limit, offset, orderBy, orderDirection } = req.query;
      
      const options = {
        limit: limit || 10,
        offset: offset || 0,
        orderBy: orderBy || 'createdAt',
        orderDirection: orderDirection || 'DESC'
      };

      const orders = await this.orderService.getOrdersByDateRange(
        startDate ? new Date(startDate) : null,
        endDate ? new Date(endDate) : null,
        options
      );
      return res.json(orders);
    } catch (error) {
      next(error);
    }
  }
}

export default OrderController;