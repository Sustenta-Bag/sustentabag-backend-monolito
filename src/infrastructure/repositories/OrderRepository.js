class OrderRepository {
  async create(order) {
    throw new Error('Método não implementado');
  }

  async findById(id) {
    throw new Error('Método não implementado');
  }

  async findAll() {
    throw new Error('Método não implementado');
  }

  async update(id, order) {
    throw new Error('Método não implementado');
  }

  async delete(id) {
    throw new Error('Método não implementado');
  }

  async findAllBusinessWithOrders() {
    throw new Error('Método não implementado');
  }

  async updateStatus(id, status) {
    throw new Error('Método não implementado');
  }

  async addItem(orderId, item) {
    throw new Error('Método não implementado');
  }

  async removeItem(orderId, itemId) {
    throw new Error('Método não implementado');
  }

  async updateItemQuantity(orderId, itemId, quantity) {
    throw new Error('Método não implementado');
  }

  async getOrderHistoryByUser(userId, options = {}) {
    throw new Error('Método não implementado');
  }

  async getOrderHistoryByBusiness(businessId, options = {}) {
    throw new Error('Método não implementado');
  }

  async getOrdersByDateRange(startDate, endDate, options = {}) {
    throw new Error('Método não implementado');
  }
}

export default OrderRepository;