class OrderItem {
  constructor({ id = null, idOrder = null, idBag, quantity, price, createdAt = new Date(), updatedAt = new Date() }) {
    this.id = id;
    this.idOrder = idOrder;
    this.idBag = idBag;
    this.quantity = quantity;
    this.price = price;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
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