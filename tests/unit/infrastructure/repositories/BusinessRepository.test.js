import BusinessRepository from '../../../../src/infrastructure/repositories/BusinessRepository.js';

class TestBusinessRepository extends BusinessRepository {
  async findActiveBusiness() {
    throw new Error('Método não implementado');
  }
}

describe('BusinessRepository Unit Tests', () => {
  let businessRepository;

  beforeEach(() => {
    businessRepository = new TestBusinessRepository();
  });

  test('create method should throw "Método não implementado"', async () => {
    const business = { 
      id: 1, 
      name: 'Empresa Teste', 
      cnpj: '12345678901234',
      email: 'empresa@teste.com'
    };
    
    await expect(businessRepository.create(business)).rejects.toThrow('Método não implementado');
  });

  test('findById method should throw "Método não implementado"', async () => {
    await expect(businessRepository.findById(1)).rejects.toThrow('Método não implementado');
  });

  test('findByIdWithAddress method should throw "Método não implementado"', async () => {
    await expect(businessRepository.findByIdWithAddress(1)).rejects.toThrow('Método não implementado');
  });

  test('findAll method should throw "Método não implementado"', async () => {
    const options = { status: 1 };
    await expect(businessRepository.findAll(options)).rejects.toThrow('Método não implementado');
  });

  test('findByCnpj method should throw "Método não implementado"', async () => {
    await expect(businessRepository.findByCnpj('12345678901234')).rejects.toThrow('Método não implementado');
  });

  test('findActiveBusiness method should throw "Método não implementado"', async () => {
    await expect(businessRepository.findActiveBusiness()).rejects.toThrow('Método não implementado');
  });

  test('update method should throw "Método não implementado"', async () => {
    const business = { 
      id: 1, 
      name: 'Empresa Teste Atualizada', 
      cnpj: '12345678901234',
      email: 'empresa@teste.com'
    };
    
    await expect(businessRepository.update(1, business)).rejects.toThrow('Método não implementado');
  });

  test('delete method should throw "Método não implementado"', async () => {
    await expect(businessRepository.delete(1)).rejects.toThrow('Método não implementado');
  });
});
