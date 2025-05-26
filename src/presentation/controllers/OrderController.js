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
}

export default OrderController; 