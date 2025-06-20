class Bag {
  constructor(id, type, price, description, idBusiness, status = 1, tags = [], createdAt = new Date(), updatedAt = new Date()) {
    this.id = id;
    this.type = type;
    this.price = price; 
    this.description = description;
    this.idBusiness = idBusiness; 
    this.status = status;
    this.tags = tags;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
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

export default Bag;