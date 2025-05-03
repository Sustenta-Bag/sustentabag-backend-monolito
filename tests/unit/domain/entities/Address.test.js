import Address from '../../../../src/domain/entities/Address.js';

describe('Address Entity Unit Tests', () => {
  // Dados de teste para reuso
  const addressData = {
    id: 1,
    zipCode: '12345678',
    state: 'SP',
    city: 'São Paulo',
    street: 'Avenida Paulista',
    number: '1578',
    complement: 'Sala 304',
    status: 1,
    createdAt: new Date('2023-01-01')
  };

  describe('Constructor', () => {
    test('should initialize with all properties correctly', () => {
      const address = new Address(
        addressData.id,
        addressData.zipCode,
        addressData.state,
        addressData.city,
        addressData.street,
        addressData.number,
        addressData.complement,
        addressData.status,
        addressData.createdAt
      );

      expect(address.id).toBe(addressData.id);
      expect(address.zipCode).toBe(addressData.zipCode);
      expect(address.state).toBe(addressData.state);
      expect(address.city).toBe(addressData.city);
      expect(address.street).toBe(addressData.street);
      expect(address.number).toBe(addressData.number);
      expect(address.complement).toBe(addressData.complement);
      expect(address.status).toBe(addressData.status);
      expect(address.createdAt).toEqual(addressData.createdAt);
    });

    test('should initialize with default status when not provided', () => {
      const address = new Address(
        addressData.id,
        addressData.zipCode,
        addressData.state,
        addressData.city,
        addressData.street,
        addressData.number,
        addressData.complement
      );

      expect(address.status).toBe(1);
    });

    // test('should initialize with null complement when not provided', () => {
    //   const address = new Address(
    //     addressData.id,
    //     addressData.zipCode,
    //     addressData.state,
    //     addressData.city,
    //     addressData.street,
    //     addressData.number
    //   );

    //   expect(address.complement).toBeNull();
    // });
  });

  describe('Methods', () => {
    test('updateZipCode should change zipCode and return this', () => {
      const address = new Address(
        addressData.id,
        addressData.zipCode,
        addressData.state,
        addressData.city,
        addressData.street,
        addressData.number
      );
      
      const newZipCode = '87654321';
      const returnValue = address.updateZipCode(newZipCode);
      
      expect(address.zipCode).toBe(newZipCode);
      expect(returnValue).toBe(address);
    });

    test('updateState should change state and return this', () => {
      const address = new Address(
        addressData.id,
        addressData.zipCode,
        addressData.state,
        addressData.city,
        addressData.street,
        addressData.number
      );
      
      const newState = 'RJ';
      const returnValue = address.updateState(newState);
      
      expect(address.state).toBe(newState);
      expect(returnValue).toBe(address);
    });

    test('updateCity should change city and return this', () => {
      const address = new Address(
        addressData.id,
        addressData.zipCode,
        addressData.state,
        addressData.city,
        addressData.street,
        addressData.number
      );
      
      const newCity = 'Rio de Janeiro';
      const returnValue = address.updateCity(newCity);
      
      expect(address.city).toBe(newCity);
      expect(returnValue).toBe(address);
    });

    test('methods should support chaining', () => {
      const address = new Address(
        addressData.id,
        addressData.zipCode,
        addressData.state,
        addressData.city,
        addressData.street,
        addressData.number,
        addressData.complement,
        1
      );
      
      address
        .updateZipCode('87654321')
        .updateState('RJ')
        .updateCity('Rio de Janeiro')
        .updateStreet('Av. Atlântica')
        .updateNumber('2000')
        .updateComplement('Apto 501');
      
      expect(address.zipCode).toBe('87654321');
      expect(address.state).toBe('RJ');
      expect(address.city).toBe('Rio de Janeiro');
      expect(address.street).toBe('Av. Atlântica');
      expect(address.number).toBe('2000');
      expect(address.complement).toBe('Apto 501');
    });
  });
});