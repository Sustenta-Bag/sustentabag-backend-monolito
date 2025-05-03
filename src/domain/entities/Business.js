class Business {
  constructor(id, legalName, cnpj, appName, cellphone, description, logo, delivery, deliveryTax, idAddress, status = 1, createdAt = new Date()) {
    this.id = id;
    this.legalName = legalName;
    this.cnpj = cnpj; 
    this.description = description;
    this.appName = appName;
    this.cellphone = cellphone;
    this.logo = logo;
    this.delivery = delivery;
    this.deliveryTax = deliveryTax;
    this.idAddress = idAddress;
    this.status = status;
    this.createdAt = createdAt;
  }

  updateStatus(newStatus) {
    this.status = newStatus;
    return this;
  }

  updateDescription(newDescription) {
    this.description = newDescription;
    return this;
  }

  updateDelivery(newDelivery) {
    this.delivery = newDelivery;
    return this;
  }

  updateDeliveryTax(newDeliveryTax) {
    this.deliveryTax = newDeliveryTax;
    return this;
  }

  updateLogo(newLogo) {
    this.logo = newLogo;
    return this;
  }

  updateCellphone(newCellphone) {
    this.cellphone = newCellphone;
    return this;
  }

  updateLegalName(newLegalName) {
    this.legalName = newLegalName;
    return this;
  }

  updateCnpj(newCnpj) {
    this.cnpj = newCnpj;
    return this;
  }

  updateAppName(newAppName) {
    this.appName = newAppName;
    return this;
  }

  updateIdAddress(newIdAddress) {
    this.idAddress = newIdAddress;
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

export default Business;