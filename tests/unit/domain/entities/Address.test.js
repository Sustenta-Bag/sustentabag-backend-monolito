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
      // Criar um mock para a data atual para que o teste seja estável
      const mockDate = new Date('2023-01-01');
      const originalDate = global.Date;
      global.Date = class extends Date {
        constructor() {
          return mockDate;
        }
      };

      const address = new Address(
        addressData.id,
        addressData.zipCode,
        addressData.state,
        addressData.city,
        addressData.street,
        addressData.number,
        addressData.complement,
        null,
        null,
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
      
      // Restaurar Date original
      global.Date = originalDate;
    });    test('should initialize with default status when not provided', () => {
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

    test('should initialize with default createdAt when not provided', () => {
      const mockDate = new Date('2023-01-01');
      const originalDate = global.Date;
      global.Date = class extends Date {
        constructor() {
          return mockDate;
        }
      };

      const address = new Address(
        addressData.id,
        addressData.zipCode,
        addressData.state,
        addressData.city,
        addressData.street,
        addressData.number,
        addressData.complement
      );

      expect(address.createdAt).toEqual(mockDate);

      global.Date = originalDate;
    });

    test('should initialize with null latitude and longitude when not provided', () => {
      const address = new Address(
        addressData.id,
        addressData.zipCode,
        addressData.state,
        addressData.city,
        addressData.street,
        addressData.number,
        addressData.complement
      );

      expect(address.latitude).toBeNull();
      expect(address.longitude).toBeNull();
    });

    test('should initialize with provided latitude and longitude', () => {
      const latitude = 40.7128;
      const longitude = -74.0060;
      const address = new Address(
        addressData.id,
        addressData.zipCode,
        addressData.state,
        addressData.city,
        addressData.street,
        addressData.number,
        addressData.complement,
        latitude,
        longitude
      );

      expect(address.latitude).toBe(latitude);
      expect(address.longitude).toBe(longitude);
    });
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
    
    test('updateStreet should change street and return this', () => {
      const address = new Address(
        addressData.id,
        addressData.zipCode,
        addressData.state,
        addressData.city,
        addressData.street,
        addressData.number
      );
      
      const newStreet = 'Rua das Flores';
      const returnValue = address.updateStreet(newStreet);
      
      expect(address.street).toBe(newStreet);
      expect(returnValue).toBe(address);
    });

    test('updateNumber should change number and return this', () => {
      const address = new Address(
        addressData.id,
        addressData.zipCode,
        addressData.state,
        addressData.city,
        addressData.street,
        addressData.number
      );
      
      const newNumber = '2000';
      const returnValue = address.updateNumber(newNumber);
      
      expect(address.number).toBe(newNumber);
      expect(returnValue).toBe(address);
    });

    test('updateComplement should change complement and return this', () => {
      const address = new Address(
        addressData.id,
        addressData.zipCode,
        addressData.state,
        addressData.city,
        addressData.street,
        addressData.number,
        addressData.complement
      );
      
      const newComplement = 'Apto 501';
      const returnValue = address.updateComplement(newComplement);
      
      expect(address.complement).toBe(newComplement);
      expect(returnValue).toBe(address);
    });

    test('updateCoordinates should change latitude and longitude and return this', () => {
      const address = new Address(
        addressData.id,
        addressData.zipCode,
        addressData.state,
        addressData.city,
        addressData.street,
        addressData.number
      );
      
      const newLatitude = 40.7128;
      const newLongitude = -74.0060;
      const returnValue = address.updateCoordinates(newLatitude, newLongitude);
      
      expect(address.latitude).toBe(newLatitude);
      expect(address.longitude).toBe(newLongitude);
      expect(returnValue).toBe(address);
    });

    test('updateStatus should change status and return this', () => {
      const address = new Address(
        addressData.id,
        addressData.zipCode,
        addressData.state,
        addressData.city,
        addressData.street,
        addressData.number
      );
      
      const newStatus = 0;
      const returnValue = address.updateStatus(newStatus);
      
      expect(address.status).toBe(newStatus);
      expect(returnValue).toBe(address);
    });

    test('deactivate should set status to 0 and return this', () => {
      const address = new Address(
        addressData.id,
        addressData.zipCode,
        addressData.state,
        addressData.city,
        addressData.street,
        addressData.number
      );
      
      const returnValue = address.deactivate();
      
      expect(address.status).toBe(0);
      expect(returnValue).toBe(address);
    });

    test('activate should set status to 1 and return this', () => {
      const address = new Address(
        addressData.id,
        addressData.zipCode,
        addressData.state,
        addressData.city,
        addressData.street,
        addressData.number,
        addressData.complement,
        null,
        null,
        0
      );
      
      const returnValue = address.activate();
      
      expect(address.status).toBe(1);
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
        null,
        null,
        1
      );
      
      address
        .updateZipCode('87654321')
        .updateState('RJ')
        .updateCity('Rio de Janeiro')
        .updateStreet('Av. Atlântica')
        .updateNumber('2000')
        .updateComplement('Apto 501')
        .updateCoordinates(40.7128, -74.0060)
        .updateStatus(0)
        .activate();
      
      expect(address.zipCode).toBe('87654321');
      expect(address.state).toBe('RJ');
      expect(address.city).toBe('Rio de Janeiro');
      expect(address.street).toBe('Av. Atlântica');
      expect(address.number).toBe('2000');
      expect(address.complement).toBe('Apto 501');
      expect(address.latitude).toBe(40.7128);
      expect(address.longitude).toBe(-74.0060);
      expect(address.status).toBe(1);
    });
  });
});