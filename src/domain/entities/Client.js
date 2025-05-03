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
    this.name = name; // Nome do cliente
    this.email = email; // Email do cliente
    this.cpf = cpf; // CPF do cliente
    this.phone = phone; // Telefone do cliente
    this.status = status; // 0 = inativo, 1 = ativo
    this.createdAt = createdAt; // Data de criação do cliente
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