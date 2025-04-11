class Bag {
  constructor(id, type, price, description, companyId, status = 1, createdAt = new Date()) {
    this.id = id;
    this.type = type; // ENUM: 'Doce', 'Salgada', 'Mista'
    this.price = price; // Float
    this.description = description;
    this.companyId = companyId; // ID da empresa (vem de outro microserviço)
    this.status = status; // 0 = inativo, 1 = ativo
    this.createdAt = createdAt;
  }

  updateStatus(newStatus) {
    this.status = newStatus;
    return this;
  }

  updatePrice(newPrice) {
    this.price = newPrice;
    return this;
  }

  updateDescription(newDescription) {
    this.description = newDescription;
    return this;
  }

  deactivate() {
    this.status = 0;
    return this;
  }

  activate() {
    this.status = 1;
    return this;
  }
}

module.exports = Bag;