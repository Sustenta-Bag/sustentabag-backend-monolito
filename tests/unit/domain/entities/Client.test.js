import Client from '../../../../src/domain/entities/Client.js';

describe('Client Entity', () => {
  test('should create a client with correct properties', () => {
    const id = 1;
    const name = 'João Silva';
    const email = 'joao.silva@email.com';
    const cpf = '12345678901';
    const password = 'hashed_password';
    const phone = '11987654321';
    const status = 1;
    const createdAt = new Date('2023-01-01');

    const client = new Client(id, name, email, cpf, password, phone, status, createdAt);

    expect(client.id).toBe(id);
    expect(client.name).toBe(name);
    expect(client.email).toBe(email);
    expect(client.cpf).toBe(cpf);
    expect(client.password).toBe(password);
    expect(client.phone).toBe(phone);
    expect(client.status).toBe(status);
    expect(client.createdAt).toBe(createdAt);
  });

  test('should create a client with default status if not provided', () => {
    const client = new Client(1, 'João Silva', 'joao@email.com', '12345678901', 'password', '11987654321');
    expect(client.status).toBe(1);
  });

  test('should create a client with default createdAt if not provided', () => {
    const now = new Date();
    const client = new Client(1, 'João Silva', 'joao@email.com', '12345678901', 'password', '11987654321');
    
    expect(client.createdAt.getTime()).toBeCloseTo(now.getTime(), -3);
  });

  test('should update status successfully', () => {
    const client = new Client(1, 'João Silva', 'joao@email.com', '12345678901', 'password', '11987654321');
    const updatedClient = client.updateStatus(0);
    
    expect(client.status).toBe(0);
    expect(updatedClient).toBe(client);
  });

  test('should update name successfully', () => {
    const client = new Client(1, 'João Silva', 'joao@email.com', '12345678901', 'password', '11987654321');
    const updatedClient = client.updateName('João Santos');
    
    expect(client.name).toBe('João Santos');
    expect(updatedClient).toBe(client);
  });

  test('should update email successfully', () => {
    const client = new Client(1, 'João Silva', 'joao@email.com', '12345678901', 'password', '11987654321');
    const updatedClient = client.updateEmail('joao.santos@email.com');
    
    expect(client.email).toBe('joao.santos@email.com');
    expect(updatedClient).toBe(client);
  });

  test('should update phone successfully', () => {
    const client = new Client(1, 'João Silva', 'joao@email.com', '12345678901', 'password', '11987654321');
    const updatedClient = client.updatePhone('11999998888');
    
    expect(client.phone).toBe('11999998888');
    expect(updatedClient).toBe(client);
  });

  test('should deactivate client successfully', () => {
    const client = new Client(1, 'João Silva', 'joao@email.com', '12345678901', 'password', '11987654321', 1);
    const updatedClient = client.deactivate();
    
    expect(client.status).toBe(0);
    expect(updatedClient).toBe(client);
  });

  test('should activate client successfully', () => {
    const client = new Client(1, 'João Silva', 'joao@email.com', '12345678901', 'password', '11987654321', 0);
    const updatedClient = client.activate();
    
    expect(client.status).toBe(1);
    expect(updatedClient).toBe(client);
  });
});