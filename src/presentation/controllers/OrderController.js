class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  async createOrder(req, res, next) {
    /*
    #swagger.tags = ["Order"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: "#/components/schemas/Order" }
    }
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/ForbiddenError" }
    }
    */
    try {
      const idClient = req.user.entityId;
      const data = {
        ...req.body,
        idClient
      }
      if(idClient !== req.user.entityId) {
        return res.forbidden();
      }
      const order = await this.orderService.createOrder(data);
      return res.ok(order);
    } catch (error) {
      next(error);
    }
  }

  async getOrder(req, res, next) {
    /*
    #swagger.tags = ["Order"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[404] = {
      description: "Not Found - Order not found",
      schema: { $ref: "#/components/schemas/NotFoundError" }
    }
    */
    try {
      const order = await this.orderService.getOrder(req.params.id);
      return res.hateoasItem(order);
    } catch (error) {
      next(error);
    }
  }

  async getAllOrders(req, res, next) {
    /*
    #swagger.tags = ["Order"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/ForbiddenError" }
    }
    */
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const filters = {
        idClient: req.query.idClient,
        idBusiness: req.query.idBusiness,
        status: req.query.status,
      }
      const orders = await this.orderService.getAllOrders(page, limit, filters);
      return res.hateoasList(orders.data, orders.pages);
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req, res, next) {
    /*
    #swagger.tags = ["Order"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: "#/components/schemas/OrderStatusUpdate" }
    }
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/ForbiddenError" }
    }
    #swagger.responses[404] = {
      description: "Not Found - Order not found",
      schema: { $ref: "#/components/schemas/NotFoundError" }
    }
    */
    try {
      const order = await this.orderService.updateOrderStatus(
        req.params.id,
        req.body.status
      );
      return res.ok(order);
    } catch (error) {
      next(error);
    }
  }

  async addItemToOrder(req, res, next) {
    /*
    #swagger.tags = ["Order"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: "#/components/schemas/OrderItens" }
    }
    #swagger.responses[201]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/ForbiddenError" }
    }
    #swagger.responses[404] = {
      description: "Not Found - Order not found",
      schema: { $ref: "#/components/schemas/NotFoundError" }
    }
    */
    try {
      const item = await this.orderService.addItemToOrder(
        req.params.idOrder,
        req.body
      );
      return res.ok(item);
    } catch (error) {
      next(error);
    }
  }

  async removeItemFromOrder(req, res, next) {
    /*
    #swagger.tags = ["Order"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[204]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/ForbiddenError" }
    }
    #swagger.responses[404] = {
      description: "Not Found - Order or item not found",
      schema: { $ref: "#/components/schemas/NotFoundError" }
    }
    */
    try {
      await this.orderService.removeItemFromOrder(
        req.params.idOrder,
        req.params.idItem
      );
      return res.no_content();
    } catch (error) {
      next(error);
    }
  }

  async updateItemQuantity(req, res, next) {
    /*
    #swagger.tags = ["Order"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      schema: { $ref: "#/components/schemas/ItemQuantity" }
    }
    #swagger.responses[200]
    #swagger.responses[401] = {
      description: "Unauthorized - Authentication required or invalid token",
      schema: { $ref: "#/components/schemas/UnauthorizedError" }
    }
    #swagger.responses[403] = {
      description: "Forbidden - Insufficient permissions",
      schema: { $ref: "#/components/schemas/ForbiddenError" }
    }
    #swagger.responses[404] = {
      description: "Not Found - Order or item not found",
      schema: { $ref: "#/components/schemas/NotFoundError" }
    }
    */
    try {
      const item = await this.orderService.updateItemQuantity(
        req.params.idOrder,
        req.params.idItem,
        req.body.quantity
      );
      return res.ok(item);
    } catch (error) {
      next(error);
    }
  }

  async getOrderHistory(req, res, next) {
    /*
    #swagger.tags = ["Order History"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    */
    try {
      const entityId = req.user.entityId;
      const entityType = req.user.role;
      const { status, startDate, endDate, limit, page, orderBy, orderDirection } = req.query;
      let where = {};
      const offset = (page - 1) * limit || 0;

      if (status) {
        where.status = status;
      }
      if (startDate && endDate) {
        where.createdAt = {
          [this.orderService.Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      if (entityType === 'business') {
        where.idBusiness = entityId;
      } else if (entityType === 'client') {
        where.idClient = entityId;
      }

      const history = await this.orderService.getOrderHistory(where, limit, offset, orderBy, orderDirection);
      return res.ok(history);
    } catch (error) {
      next(error);
    }
  }

  async getOrderStats(req, res, next) {
    /*
    #swagger.tags = ["Order Statistics"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    */
    try {
      const entityId = req.user.entityId;
      const entityType = req.user.role;
      const stats = await this.orderService.getOrderStats(entityId, entityType);
      return res.ok(stats);
    } catch (error) {
      next(error);
    }
  }

  async getOrdersByDateRange(req, res, next) {
    /*
    #swagger.tags = ["Order"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    */
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
      return res.ok(orders);
    } catch (error) {
      next(error);
    }
  }

  async cancelOrder(req, res, next) {
    /*
    #swagger.tags = ["Order"]
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[204]
    */
    try {
      const idClient = req.user.entityId;
      await this.orderService.cancelOrder(req.params.idOrder, idClient);
      return res.no_content();
    } catch(error) {
      next(error);
    }
  }
}

export default OrderController;