class OrderItem {
  constructor(id, orderId, bagId, quantity, price, createdAt = new Date()) {
    this.id = id;
    this.orderId = orderId;
    this.bagId = bagId;
    this.quantity = quantity;
    this.price = price;
    this.createdAt = createdAt;
  }

  updateQuantity(newQuantity) {
    if (newQuantity < 1) {
      throw new Error('Quantidade deve ser maior que zero');
    }
    this.quantity = newQuantity;
    return this;
  }

  updatePrice(newPrice) {
    if (newPrice < 0) {
      throw new Error('Preço não pode ser negativo');
    }
    this.price = newPrice;
    return this;
  }

  getSubtotal() {
    return this.price * this.quantity;
  }
}

export default OrderItem; 