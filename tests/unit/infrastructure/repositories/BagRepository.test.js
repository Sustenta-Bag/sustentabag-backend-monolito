// filepath: d:\Faculdade\Integrador\sustentabag-backend-monolito\tests\unit\infrastructure\repositories\BagRepository.test.js
import BagRepository from '../../../../src/infrastructure/repositories/BagRepository.js';

describe('BagRepository Unit Tests', () => {
  let bagRepository;

  beforeEach(() => {
    bagRepository = new BagRepository();
  });

  test('create method should throw "Método não implementado"', async () => {
    await expect(bagRepository.create({})).rejects.toThrow('Método não implementado');
  });

  test('findById method should throw "Método não implementado"', async () => {
    await expect(bagRepository.findById(1)).rejects.toThrow('Método não implementado');
  });

  test('findAll method should throw "Método não implementado"', async () => {
    await expect(bagRepository.findAll()).rejects.toThrow('Método não implementado');
  });

  test('update method should throw "Método não implementado"', async () => {
    await expect(bagRepository.update(1, {})).rejects.toThrow('Método não implementado');
  });

  test('delete method should throw "Método não implementado"', async () => {
    await expect(bagRepository.delete(1)).rejects.toThrow('Método não implementado');
  });
});