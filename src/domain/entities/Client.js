class Client {
  constructor(
    id,
    name,
    email,
    cpf,
    password,
    phone,
    status = 1,
    createdAt = new Date(),
    firebaseId = null
  ) {
    this.id = id;
    this.name = name; // Nome do cliente
    this.email = email; // Email do cliente
    this.cpf = cpf; // CPF do cliente
    this.password = password; // Senha do cliente (já deve estar em hash)
    this.phone = phone; // Telefone do cliente
    this.status = status; // 0 = inativo, 1 = ativo
    this.createdAt = createdAt; // Data de criação do cliente
    this.firebaseId = firebaseId;
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
