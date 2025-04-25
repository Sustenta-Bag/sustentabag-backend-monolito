import Bag from '../../../../src/domain/entities/Bag.js';

describe('Bag Entity', () => {
  test('should create a bag with correct properties', () => {
    const id = 1;
    const type = 'Mista';
    const price = 15.99;
    const description = 'Mixed bag with various items';
    const idBusiness = 5;
    const status = 1;
    const createdAt = new Date('2023-01-01');

    const bag = new Bag(id, type, price, description, idBusiness, status, createdAt);

    expect(bag.id).toBe(id);
    expect(bag.type).toBe(type);
    expect(bag.price).toBe(price);
    expect(bag.description).toBe(description);
    expect(bag.idBusiness).toBe(idBusiness);
    expect(bag.status).toBe(status);
    expect(bag.createdAt).toBe(createdAt);
  });

  test('should create a bag with default status if not provided', () => {
    const bag = new Bag(1, 'Doce', 10.0, 'Sweet bag', 5);
    expect(bag.status).toBe(1);
  });

  test('should create a bag with default createdAt if not provided', () => {
    const now = new Date();
    const bag = new Bag(1, 'Salgada', 12.0, 'Salty bag', 5);
    
    expect(bag.createdAt.getTime()).toBeCloseTo(now.getTime(), -3);
  });

  test('should update status successfully', () => {
    const bag = new Bag(1, 'Doce', 10.0, 'Sweet bag', 5);
    const updatedBag = bag.updateStatus(0);
    
    expect(bag.status).toBe(0);
    expect(updatedBag).toBe(bag);
  });

  test('should update price successfully', () => {
    const bag = new Bag(1, 'Doce', 10.0, 'Sweet bag', 5);
    const updatedBag = bag.updatePrice(15.0);
    
    expect(bag.price).toBe(15.0);
    expect(updatedBag).toBe(bag);
  });

  test('should update description successfully', () => {
    const bag = new Bag(1, 'Doce', 10.0, 'Sweet bag', 5);
    const updatedBag = bag.updateDescription('Updated sweet bag');
    
    expect(bag.description).toBe('Updated sweet bag');
    expect(updatedBag).toBe(bag); 
  });

  test('should deactivate bag successfully', () => {
    const bag = new Bag(1, 'Doce', 10.0, 'Sweet bag', 5, 1);
    const updatedBag = bag.deactivate();
    
    expect(bag.status).toBe(0);
    expect(updatedBag).toBe(bag); 
  });

  test('should activate bag successfully', () => {
    const bag = new Bag(1, 'Doce', 10.0, 'Sweet bag', 5, 0);
    const updatedBag = bag.activate();
    
    expect(bag.status).toBe(1);
    expect(updatedBag).toBe(bag);
  });
});