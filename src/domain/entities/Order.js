class Order {
  constructor(id, userId, businessId, status = 'pending', totalAmount = 0, createdAt = new Date()) {
    this.id = id;
    this.userId = userId;
    this.businessId = businessId;
    this.status = status;
    this.totalAmount = totalAmount;
    this.createdAt = createdAt;
    this.items = [];
  }

  addItem(item) {
    this.items.push(item);
    this.calculateTotal();
    return this;
  }

  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.calculateTotal();
    return this;
  }

  calculateTotal() {
    this.totalAmount = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    return this;
  }

  updateStatus(newStatus) {
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error('Status inválido');
    }
    this.status = newStatus;
    return this;
  }

  confirm() {
    return this.updateStatus('confirmed');
  }

  prepare() {
    return this.updateStatus('preparing');
  }

  markAsReady() {
    return this.updateStatus('ready');
  }

  deliver() {
    return this.updateStatus('delivered');
  }

  cancel() {
    return this.updateStatus('cancelled');
  }
  canBeConfirmed() {
    // O microsserviço de pagamento será responsável por confirmar se o pagamento foi realizado
    // Esta lógica deve ser removida do monolito e delegada ao payment-service
    return this.status === 'pending';
  }

  canBeCancelled() {
    // Removida a dependência do status de pagamento
    // O payment-service será responsável pelo gerenciamento do status de pagamentos
    return this.status !== 'delivered';
  }
}

export default Order; 