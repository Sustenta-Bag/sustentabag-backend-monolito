import ClientRepository from '../../../../src/infrastructure/repositories/ClientRepository.js';

describe('ClientRepository Unit Tests', () => {
  let clientRepository;

  beforeEach(() => {
    clientRepository = new ClientRepository();
  });

  test('create method should throw "Método não implementado"', async () => {
    await expect(clientRepository.create({})).rejects.toThrow('Método não implementado');
  });

  test('findAll method should throw "Método não implementado"', async () => {
    await expect(clientRepository.findAll()).rejects.toThrow('Método não implementado');
  });

  test('update method should throw "Método não implementado"', async () => {
    await expect(clientRepository.update(1, {})).rejects.toThrow('Método não implementado');
  });

  test('delete method should throw "Método não implementado"', async () => {
    await expect(clientRepository.delete(1)).rejects.toThrow('Método não implementado');
  });
});
