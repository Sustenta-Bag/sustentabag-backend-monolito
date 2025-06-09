class BusinessRepository {
    async create(business) {
      throw new Error('Método não implementado');
    }
  
    async findById(id) {
      throw new Error('Método não implementado');
    }
  
    async findByIdWithAddress(id) {
        throw new Error('Método não implementado');
    }

    async findAll(options) {
      throw new Error('Método não implementado');
    }

    async findByCnpj(cnpj) {
        throw new Error('Método não implementado');
    }
 
    async update(id, business) {
      throw new Error('Método não implementado');
    }
  
    async delete(id) {
      throw new Error('Método não implementado');
    }
  }
  
  export default BusinessRepository;