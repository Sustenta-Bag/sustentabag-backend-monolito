const Bag = require('../../../src/domain/entities/Bag');

describe('Bag Entity', () => {
  const mockDate = new Date('2025-04-10T10:00:00Z');
  
  beforeAll(() => {
    global.Date = jest.fn(() => mockDate);
    global.Date.now = jest.fn(() => mockDate.getTime());
  });

  afterAll(() => {
    global.Date = Date;
  });

  test('deve criar uma instância de Bag com valores corretos', () => {
    const bag = new Bag(1, 'Doce', 10.99, 'Descrição da sacola', 2, 1);
    
    expect(bag.id).toBe(1);
    expect(bag.type).toBe('Doce');
    expect(bag.price).toBe(10.99);
    expect(bag.description).toBe('Descrição da sacola');
    expect(bag.companyId).toBe(2);
    expect(bag.status).toBe(1);
  });

  test('deve criar uma instância de Bag com status padrão 1 quando não informado', () => {
    const bag = new Bag(1, 'Salgada', 15.99, 'Descrição da sacola', 2);
    
    expect(bag.status).toBe(1);
  });

  test('deve atualizar o status da sacola corretamente', () => {
    const bag = new Bag(1, 'Mista', 20.50, 'Descrição da sacola', 2, 1);
    const updatedBag = bag.updateStatus(0);
    
    expect(updatedBag.status).toBe(0);
    expect(updatedBag).toBe(bag); 
  });

  test('deve atualizar o preço da sacola corretamente', () => {
    const bag = new Bag(1, 'Doce', 10.99, 'Descrição da sacola', 2, 1);
    const updatedBag = bag.updatePrice(12.99);
    
    expect(updatedBag.price).toBe(12.99);
    expect(updatedBag).toBe(bag);
  });

  test('deve atualizar a descrição da sacola corretamente', () => {
    const bag = new Bag(1, 'Doce', 10.99, 'Descrição da sacola', 2, 1);
    const updatedBag = bag.updateDescription('Nova descrição');
    
    expect(updatedBag.description).toBe('Nova descrição');
    expect(updatedBag).toBe(bag);
  });

  test('deve desativar a sacola corretamente', () => {
    const bag = new Bag(1, 'Doce', 10.99, 'Descrição da sacola', 2, 1);
    const updatedBag = bag.deactivate();
    
    expect(updatedBag.status).toBe(0);
    expect(updatedBag).toBe(bag);
  });

  test('deve ativar a sacola corretamente', () => {
    const bag = new Bag(1, 'Doce', 10.99, 'Descrição da sacola', 2, 0);
    const updatedBag = bag.activate();
    
    expect(updatedBag.status).toBe(1);
    expect(updatedBag).toBe(bag);
  });
});