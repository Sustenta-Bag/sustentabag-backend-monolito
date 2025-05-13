import LocationService from '../../../../src/application/services/LocationService.js';
import AppError from '../../../../src/infrastructure/errors/AppError.js';
import Address from '../../../../src/domain/entities/Address.js';
import Business from '../../../../src/domain/entities/Business.js';
import { jest } from '@jest/globals';

jest.mock('@mapbox/mapbox-sdk', () => ({
  __esModule: true,
  default: jest.fn(() => ({ 
    token: 'mocked-token'
  }))
}));

jest.mock('@mapbox/mapbox-sdk/services/geocoding.js', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    forwardGeocode: jest.fn().mockReturnValue({
      send: jest.fn().mockResolvedValue({
        body: {
          features: [
            {
              place_name: 'Test Place',
              center: [10.1234, -23.5678]
            }
          ]
        }
      })
    })
  }))
}));

describe('LocationService', () => {
  let mockBusinessRepository;
  let mockAddressRepository;
  let mockMapboxToken;
  let locationService;
  let mockGeocodeService;
  
  beforeEach(() => {
    mockBusinessRepository = {
      findAllWithAddress: jest.fn()
    };
    
    mockAddressRepository = {
      findById: jest.fn(),
      update: jest.fn()
    };
    
    mockMapboxToken = 'mock-mapbox-token';
    
    // Create a proper mock for geocoding
    mockGeocodeService = {
      forwardGeocode: jest.fn().mockReturnValue({
        send: jest.fn().mockResolvedValue({
          body: {
            features: [
              {
                place_name: 'Test Place',
                center: [10.1234, -23.5678]
              }
            ]
          }
        })
      })
    };
      // Create the service
    locationService = new LocationService(
      mockBusinessRepository, 
      mockAddressRepository, 
      mockMapboxToken
    );
    
    // Replace the geocodingClient with our mock
    locationService.geocodingClient = mockGeocodeService;
  });
  
  describe('geocodeAddress', () => {
    test('should successfully geocode an address', async () => {
      const address = {
        street: 'Sample Street',
        number: '123',
        city: 'Sample City',
        state: 'Sample State',
        zipCode: '12345'
      };
      
      const result = await locationService.geocodeAddress(address);
      
      expect(mockGeocodeService.forwardGeocode).toHaveBeenCalledWith({
        query: 'Sample Street, 123, Sample City, Sample State, 12345',
        limit: 1,
        countries: ['br'],
        types: ['address']
      });
      
      expect(result).toEqual({
        latitude: -23.5678,
        longitude: 10.1234
      });
    });
    
    test('should throw an error if address is not provided', async () => {
      await expect(locationService.geocodeAddress()).rejects.toThrow(AppError);
      await expect(locationService.geocodeAddress(null)).rejects.toThrow('Dados de endereço não fornecidos');
    });
    
    test('should throw an error if insufficient address data is provided', async () => {
      const address = {
        street: 'Sample Street'
      };
      
      await expect(locationService.geocodeAddress(address)).rejects.toThrow(AppError);
      await expect(locationService.geocodeAddress(address)).rejects.toThrow('Dados insuficientes para geocodificar endereço');
    });
    
    test('should throw an error when no results are found', async () => {
      mockGeocodeService.forwardGeocode.mockReturnValue({
        send: jest.fn().mockResolvedValue({
          body: {
            features: []
          }
        })
      });
      
      const address = {
        street: 'Nonexistent Street',
        city: 'Nowhere City',
        state: 'Unknown State'
      };
      
      await expect(locationService.geocodeAddress(address)).rejects.toThrow(AppError);
      await expect(locationService.geocodeAddress(address)).rejects.toThrow('Não foi possível geocodificar este endereço');
    });
    
    test('should throw an error when invalid coordinates are returned', async () => {
      mockGeocodeService.forwardGeocode.mockReturnValue({
        send: jest.fn().mockResolvedValue({
          body: {
            features: [
              {
                place_name: 'Bad Place',
                center: [null, undefined]
              }
            ]
          }
        })
      });
      
      const address = {
        street: 'Bad Street',
        city: 'Bad City',
        state: 'Bad State'
      };
      
      await expect(locationService.geocodeAddress(address)).rejects.toThrow(AppError);
      await expect(locationService.geocodeAddress(address)).rejects.toThrow('Coordenadas inválidas retornadas pelo serviço');
    });
  });
  
  describe('processAddress', () => {
    test('should process an address and add coordinates', async () => {
      const addressData = {
        street: 'Sample Street',
        number: '123',
        city: 'Sample City',
        state: 'Sample State'
      };
      
      const result = await locationService.processAddress(addressData);
      
      expect(result).toEqual({
        ...addressData,
        latitude: -23.5678,
        longitude: 10.1234
      });
    });
    
    test('should keep existing coordinates if already present', async () => {
      const addressData = {
        street: 'Sample Street',
        city: 'Sample City',
        state: 'Sample State',
        latitude: 12.3456,
        longitude: 45.6789
      };
      
      const result = await locationService.processAddress(addressData);
      
      expect(mockGeocodeService.forwardGeocode).not.toHaveBeenCalled();
      expect(result).toEqual(addressData);
    });
    
    test('should return original address without coordinates in development environment when geocoding fails', async () => {
      process.env.NODE_ENV = 'development';
      
      mockGeocodeService.forwardGeocode.mockReturnValue({
        send: jest.fn().mockRejectedValue(new Error('Geocoding failed'))
      });
      
      const addressData = {
        street: 'Bad Street',
        city: 'Bad City',
        state: 'Bad State'
      };
      
      const result = await locationService.processAddress(addressData);
      
      expect(result).toEqual(addressData);
      
      delete process.env.NODE_ENV;
    });
  });
  
  describe('findNearbyBusinesses', () => {
    test('should find businesses near a given address', async () => {
      const testAddress = new Address(
        1, '12345', 'Sample State', 'Sample City', 
        'Sample Street', '123', null, -23.5678, 10.1234
      );
      
      const business1 = new Business(
        1, 'Business 1', '12345678901234', 'App Business 1', 
        '1234567890', 'Description 1', null, 'password1', 
        true, 10, 1, true
      );
      business1.address = new Address(
        2, '54321', 'Other State', 'Other City', 
        'Other Street', '456', null, -23.5680, 10.1240
      );
      
      const business2 = new Business(
        2, 'Business 2', '56789012345678', 'App Business 2', 
        '0987654321', 'Description 2', null, 'password2', 
        true, 15, 2, true
      );
      business2.address = new Address(
        3, '98765', 'Far State', 'Far City', 
        'Far Street', '789', null, -25.1234, 12.5678
      );
      
      mockAddressRepository.findById.mockResolvedValue(testAddress);
      mockBusinessRepository.findAllWithAddress.mockResolvedValue([business1, business2]);
      
      jest.spyOn(locationService, 'calculateDistance').mockImplementation((lat1, lon1, lat2, lon2) => {
        if (lat1 === -23.5678 && lon1 === 10.1234) {
          if (lat2 === -23.5680 && lon2 === 10.1240) {
            return 0.5;
          } else if (lat2 === -25.1234 && lon2 === 12.5678) {
            return 200;
          }
        }
        return 999;
      });
      
      const result = await locationService.findNearbyBusinesses(1, { radius: 10 });
      
      expect(mockAddressRepository.findById).toHaveBeenCalledWith(1);
      expect(mockBusinessRepository.findAllWithAddress).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].distance).toBe(0.5);
    });
    
    test('should throw an error if address is not found', async () => {
      mockAddressRepository.findById.mockResolvedValue(null);
      
      await expect(locationService.findNearbyBusinesses(999)).rejects.toThrow(AppError);
      await expect(locationService.findNearbyBusinesses(999)).rejects.toThrow('Endereço não encontrado');
    });
    
    test('should attempt to geocode an address without coordinates', async () => {
      const addressWithoutCoords = new Address(
        1, '12345', 'Sample State', 'Sample City', 
        'Sample Street', '123'
      );
      
      const business1 = new Business(
        1, 'Business 1', '12345678901234', 'App Business 1', 
        '1234567890', 'Description 1', null, 'password1', 
        true, 10, 1, true
      );
      business1.address = new Address(
        2, '54321', 'Other State', 'Other City', 
        'Other Street', '456', null, -23.5680, 10.1240
      );
      
      mockAddressRepository.findById.mockResolvedValue(addressWithoutCoords);
      mockBusinessRepository.findAllWithAddress.mockResolvedValue([business1]);
      mockAddressRepository.update.mockResolvedValue(true);
      
      jest.spyOn(locationService, 'calculateDistance').mockReturnValue(0.5);
      
      const result = await locationService.findNearbyBusinesses(1);
      
      expect(mockAddressRepository.findById).toHaveBeenCalledWith(1);
      expect(mockAddressRepository.update).toHaveBeenCalledWith(1, {
        latitude: -23.5678,
        longitude: 10.1234
      });
    });
    
    test('should return empty array when no businesses are found', async () => {
      const testAddress = new Address(
        1, '12345', 'Sample State', 'Sample City', 
        'Sample Street', '123', null, -23.5678, 10.1234
      );
      
      mockAddressRepository.findById.mockResolvedValue(testAddress);
      mockBusinessRepository.findAllWithAddress.mockResolvedValue([]);
      
      const result = await locationService.findNearbyBusinesses(1);
      
      expect(result).toEqual([]);
    });
  });
  
  describe('calculateDistance', () => {
    test('should correctly calculate distance between two points', () => {
      const lat1 = -23.5678;
      const lon1 = 10.1234;
      const lat2 = -23.5680;
      const lon2 = 10.1240;
      
      const result = locationService.calculateDistance(lat1, lon1, lat2, lon2);
      
      expect(result).toBeCloseTo(0.0717, 2);
    });
    
    test('should throw an error with invalid coordinates', () => {
      expect(() => locationService.calculateDistance(null, 10.1234, -23.5680, 10.1240)).toThrow('Coordenadas inválidas');
      expect(() => locationService.calculateDistance(-23.5678, null, -23.5680, 10.1240)).toThrow('Coordenadas inválidas');
      expect(() => locationService.calculateDistance(-23.5678, 10.1234, null, 10.1240)).toThrow('Coordenadas inválidas');
      expect(() => locationService.calculateDistance(-23.5678, 10.1234, -23.5680, null)).toThrow('Coordenadas inválidas');
    });
    
    test('should return a positive number or zero', () => {
      const result = locationService.calculateDistance(-23.5678, 10.1234, -23.5678, 10.1234);
      expect(result).toBeGreaterThanOrEqual(0);
    });
    
    test('should convert string coordinates to numbers', () => {
      const result = locationService.calculateDistance('-23.5678', '10.1234', '-23.5680', '10.1240');
      expect(result).toBeCloseTo(0.0717, 2);
    });
  });
  
  describe('deg2rad', () => {
    test('should convert degrees to radians', () => {
      const result = locationService.deg2rad(180);
      expect(result).toBeCloseTo(Math.PI, 5);
    });
  });
});
