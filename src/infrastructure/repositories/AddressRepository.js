class AddressRepository {
  async create(address) {
    throw new Error('Método não implementado');
  }

  async findById(id) {
    throw new Error('Método não implementado');
  }

  async findAll(options) {
    throw new Error('Método não implementado');
  }

  async findAndCountAll(options) {
    throw new Error('Método não implementado');
  }

  async findByUnique({ zipCode, city, street, number }) {
    throw new Error('Método não implementado');
  }

  async update(id, address) {
    throw new Error('Método não implementado');
  }

  async delete(id) {
    throw new Error('Método não implementado');
  }
}

export default AddressRepository;