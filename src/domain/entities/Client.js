class Client {
  constructor(
    id,
    name,
    email,
    cpf,
    phone,
    status = 1,
    createdAt = new Date()
  ) {
    this.id = id;
    this.name = name; 
    this.email = email; 
    this.cpf = cpf; 
    this.phone = phone; 
    this.status = status; 
    this.createdAt = createdAt; 
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