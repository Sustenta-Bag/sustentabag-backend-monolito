class Client {
  constructor(
    id,
    name,
    email,
    cpf,
    phone,
    idAddress = null,
    status = 1,
    createdAt = new Date(),
    updatedAt = new Date(),
  ) {
    this.id = id;
    this.name = name; 
    this.email = email; 
    this.cpf = cpf; 
    this.phone = phone;
    this.idAddress = idAddress;
    this.status = status; 
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  updateStatus(newStatus) {
    this.status = newStatus;
    return this;
  }

  updateName(newName) {
    this.name = newName;
    return this;
  }

  updateEmail(newEmail) {
    this.email = newEmail;
    return this;
  }

  updatePhone(newPhone) {
    this.phone = newPhone;
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

export default Client;