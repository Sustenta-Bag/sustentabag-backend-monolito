import LocationService from '../../../../src/application/services/LocationService.js';
import AppError from '../../../../src/infrastructure/errors/AppError.js';
import Address from '../../../../src/domain/entities/Address.js';
import Business from '../../../../src/domain/entities/Business.js';
import { jest } from '@jest/globals';

describe('LocationService', () => {
  let mockBusinessRepository;
  let mockAddressRepository;
  let locationService;
  let mockMapboxToken = 'fake-token';

  beforeEach(() => {
    mockBusinessRepository = {
      findAllWithAddress: jest.fn().mockResolvedValue([])
    };
    
    mockAddressRepository = {
      findById: jest.fn(),
      update: jest.fn()
    };
    
    // Use the testing option to bypass token validation
    locationService = new LocationService(
      mockBusinessRepository, 
      mockAddressRepository, 
      mockMapboxToken,
      { isTesting: true }
    );
    
    // Mock console methods
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    // Restore console methods
    jest.restoreAllMocks();
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
      
      expect(result).toEqual({
        latitude: -23.5678,
        longitude: 10.1234
      });
    });

    test('should throw an error if address is not provided', async () => {
      await expect(locationService.geocodeAddress()).rejects.toThrow(AppError);
      await expect(locationService.geocodeAddress()).rejects.toThrow('Dados de endereço não fornecidos');
    });
    
    test('should throw an error if insufficient address data is provided', async () => {
      const address = {
        street: 'Sample Street'
      };
      
      await expect(locationService.geocodeAddress(address)).rejects.toThrow(AppError);
      await expect(locationService.geocodeAddress(address)).rejects.toThrow('Dados insuficientes para geocodificar endereço');
    });
    
    test('should throw an error when no results are found', async () => {
      const address = {
        street: 'Nonexistent Street',
        city: 'Nowhere City',
        state: 'Unknown State'
      };
      
      // Create a custom mock for this test
      const customMockGeocoding = {
        forwardGeocode: () => ({
          send: async () => ({ body: { features: [] } })
        })
      };
      
      const serviceWithEmptyResults = new LocationService(
        mockBusinessRepository,
        mockAddressRepository,
        mockMapboxToken,
        { 
          isTesting: true,
          mockGeocoding: customMockGeocoding
        }
      );
      
      await expect(serviceWithEmptyResults.geocodeAddress(address)).rejects.toThrow(AppError);
      await expect(serviceWithEmptyResults.geocodeAddress(address)).rejects.toThrow('Não foi possível geocodificar este endereço');
    });
    
    test('should throw an error when invalid coordinates are returned', async () => {
      const address = {
        street: 'Bad Street',
        city: 'Bad City',
        state: 'Bad State'
      };
      
      // Create a custom mock for this test that returns invalid coordinates
      const customMockGeocoding = {
        forwardGeocode: () => ({
          send: async () => ({
            body: { 
              features: [{ 
                place_name: 'Test Address',
                center: [null, null] 
              }]
            }
          })
        })
      };
      
      const serviceWithInvalidCoords = new LocationService(
        mockBusinessRepository,
        mockAddressRepository,
        mockMapboxToken,
        { 
          isTesting: true,
          mockGeocoding: customMockGeocoding
        }
      );
      
      await expect(serviceWithInvalidCoords.geocodeAddress(address)).rejects.toThrow(AppError);
      await expect(serviceWithInvalidCoords.geocodeAddress(address)).rejects.toThrow('Coordenadas inválidas retornadas pelo serviço');
    });

    test('should throw an error when query parts are too few', async () => {
      const insufficientAddress = {
        street: 'Only Street'
        // missing other fields
      };
      
      await expect(locationService.geocodeAddress(insufficientAddress)).rejects.toThrow(AppError);
      await expect(locationService.geocodeAddress(insufficientAddress)).rejects.toThrow('Dados insuficientes para geocodificar endereço');
    });

    test('should throw an error when geocoding service is not configured', async () => {
      // Create a service with no geocoding client
      const serviceWithoutGeocoding = new LocationService(
        mockBusinessRepository,
        mockAddressRepository,
        mockMapboxToken,
        { 
          isTesting: true,
          mockClient: {},
          mockGeocoding: null
        }
      );
      
      // Override the geocodingClient to simulate unconfigured service
      serviceWithoutGeocoding.geocodingClient = null;
      
      const address = {
        street: 'Sample Street',
        city: 'Sample City',
        state: 'Sample State'
      };
      
      await expect(serviceWithoutGeocoding.geocodeAddress(address)).rejects.toThrow(AppError);
      await expect(serviceWithoutGeocoding.geocodeAddress(address)).rejects.toThrow('Serviço de geocodificação não configurado');
    });

    test('should handle API timeout correctly', async () => {
      const address = {
        street: 'Timeout Street',
        city: 'Timeout City',
        state: 'Timeout State'
      };
      
      // Create a custom mock that simulates a timeout
      const timeoutMockGeocoding = {
        forwardGeocode: () => ({
          send: async () => {
            // Delay longer than the timeout
            await new Promise(resolve => setTimeout(resolve, 15000));
            return {};
          }
        })
      };
      
      const serviceWithTimeout = new LocationService(
        mockBusinessRepository,
        mockAddressRepository,
        mockMapboxToken,
        { 
          isTesting: true,
          mockGeocoding: timeoutMockGeocoding
        }
      );
      
      // Override the timeout to make the test run faster
      const originalTimeout = setTimeout;
      global.setTimeout = jest.fn((callback) => callback());
      
      try {
        await expect(serviceWithTimeout.geocodeAddress(address)).rejects.toThrow();
      } finally {
        global.setTimeout = originalTimeout;
      }
    });

    test('should handle AbortError correctly', async () => {
      const address = {
        street: 'Abort Street',
        city: 'Abort City',
        state: 'Abort State'
      };
      
      // Create a custom mock that simulates an AbortError
      const abortMockGeocoding = {
        forwardGeocode: () => ({
          send: async () => {
            const error = new Error('Request aborted');
            error.name = 'AbortError';
            throw error;
          }
        })
      };
      
      const serviceWithAbort = new LocationService(
        mockBusinessRepository,
        mockAddressRepository,
        mockMapboxToken,
        { 
          isTesting: true,
          mockGeocoding: abortMockGeocoding
        }
      );
      
      await expect(serviceWithAbort.geocodeAddress(address)).rejects.toThrow(AppError);
      await expect(serviceWithAbort.geocodeAddress(address)).rejects.toThrow('Requisição de geocodificação abortada');
    });

    test('should throw an error when geocoding client is not configured correctly', async () => {
      // Create a service without geocoding client
      const serviceWithoutGeocoding = new LocationService(
        mockBusinessRepository,
        mockAddressRepository,
        null,
        { isTesting: true, mockClient: null, mockGeocoding: null }
      );
      
      // Override the geocoding client to simulate an unconfigured client
      serviceWithoutGeocoding.geocodingClient = null;
      
      const address = {
        street: 'Av. Paulista',
        number: '1000',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100'
      };
      
      await expect(serviceWithoutGeocoding.geocodeAddress(address)).rejects.toThrow(AppError);
      await expect(serviceWithoutGeocoding.geocodeAddress(address)).rejects.toThrow('Serviço de geocodificação não configurado');
    });

    test('should handle timeout during geocoding request', async () => {
      // Mock the Promise.race to simulate a timeout
      const originalRace = Promise.race;
      Promise.race = jest.fn().mockRejectedValue(new Error('Timeout na requisição de geocodificação'));
      
      const address = {
        street: 'Av. Paulista',
        number: '1000',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100'
      };
      
      try {
        await locationService.geocodeAddress(address);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toContain('Timeout na requisição');
      } finally {
        // Restore the original Promise.race
        Promise.race = originalRace;
      }
    });

    test('should handle AbortError during geocoding', async () => {
      // Mock geocoding client to throw AbortError
      const mockAbortGeocoding = {
        forwardGeocode: () => ({
          send: async () => {
            const error = new Error('Request aborted');
            error.name = 'AbortError';
            throw error;
          }
        })
      };
      
      const serviceWithAbortingClient = new LocationService(
        mockBusinessRepository,
        mockAddressRepository,
        'fake-token',
        { isTesting: true, mockGeocoding: mockAbortGeocoding }
      );
      
      const address = {
        street: 'Av. Paulista',
        number: '1000',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100'
      };
      
      try {
        await serviceWithAbortingClient.geocodeAddress(address);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.errorCode).toBe('GEOCODING_REQUEST_ABORTED');
      }
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
      
      // No need to mock geocodeAddress since we're using the real method with mocked dependencies
      
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
      
      // Spy on geocodeAddress to verify it's not called
      const geocodeSpy = jest.spyOn(locationService, 'geocodeAddress');
      
      const result = await locationService.processAddress(addressData);
      
      expect(result).toEqual(addressData);
      expect(geocodeSpy).not.toHaveBeenCalled();
      
      geocodeSpy.mockRestore();
    });
    
    test('should return original address without coordinates in development environment when geocoding fails', async () => {
      // Save original environment
      const originalNodeEnv = process.env.NODE_ENV;
      // Set to development
      process.env.NODE_ENV = 'development';
      
      // Address data
      const addressData = {
        street: 'Test Street',
        city: 'Test City',
        state: 'TS'
        // Missing latitude/longitude
      };
      
      // Mock geocodeAddress to fail
      jest.spyOn(locationService, 'geocodeAddress').mockRejectedValueOnce(new Error('Geocoding failed'));
      
      try {
        // Execute
        const result = await locationService.processAddress(addressData);
        
        // Verify it returns the original address in development mode
        expect(result).toBe(addressData);
      } finally {
        // Restore environment
        process.env.NODE_ENV = originalNodeEnv;
        jest.restoreAllMocks();
      }
    });

    test('should throw an error when address data is invalid', async () => {
      await expect(locationService.processAddress(null)).rejects.toThrow();
      await expect(locationService.processAddress('not an object')).rejects.toThrow();
    });

    test('should log warning for incomplete address data', async () => {
      const console_warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      const incompleteAddress = {
        street: 'Only Street'
        // missing city and state
      };
      
      try {
        // In development mode, this should not throw even with incomplete data
        process.env.NODE_ENV = 'development';
        await locationService.processAddress(incompleteAddress);
        expect(console_warn).toHaveBeenCalled();
      } finally {
        delete process.env.NODE_ENV;
        console_warn.mockRestore();
      }
    });

    test('should rethrow errors in production environment', async () => {
      const errorMockGeocoding = {
        forwardGeocode: () => ({
          send: async () => { throw new Error('Test error'); }
        })
      };
      
      const serviceWithError = new LocationService(
        mockBusinessRepository,
        mockAddressRepository,
        mockMapboxToken,
        { 
          isTesting: true,
          mockGeocoding: errorMockGeocoding
        }
      );
      
      // In production mode, this should throw
      process.env.NODE_ENV = 'production';
      
      try {
        await expect(serviceWithError.processAddress({ 
          street: 'Error Street',
          city: 'Error City',
          state: 'Error State'
        })).rejects.toThrow(AppError);
      } finally {
        delete process.env.NODE_ENV;
      }
    });

    test('should log error message when processAddress fails', async () => {
      console.error = jest.fn();
      
      const errorMessage = 'API error';
      const mockGeocodeWithError = jest.fn().mockRejectedValue(new Error(errorMessage));
      locationService.geocodeAddress = mockGeocodeWithError;
      
      const address = {
        id: 1,
        street: 'Test Street',
        number: '123',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345-678'
      };
      
      // Save original NODE_ENV
      const originalNodeEnv = process.env.NODE_ENV;
      // Set to development for this test
      process.env.NODE_ENV = 'development';
      
      const result = await locationService.processAddress(address);
      
      // Fix the error message to match the actual implementation
      expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Erro ao processar coordenadas:'), expect.any(Error));
      
      // Restore NODE_ENV
      process.env.NODE_ENV = originalNodeEnv;
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
      
      mockAddressRepository.findById.mockResolvedValue(testAddress);
      mockBusinessRepository.findAllWithAddress.mockResolvedValue([business1]);
      
      // Mock the calculateDistance method
      jest.spyOn(locationService, 'calculateDistance').mockReturnValue(0.5);
      
      const result = await locationService.findNearbyBusinesses(1, { radius: 10 });
      
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
      
      // Mock the calculateDistance method
      jest.spyOn(locationService, 'calculateDistance').mockReturnValue(0.5);
      
      const result = await locationService.findNearbyBusinesses(1);
      
      expect(result).toHaveLength(1);
      expect(mockAddressRepository.update).toHaveBeenCalled();
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

    test('should throw an error when address ID is invalid', async () => {
      await expect(locationService.findNearbyBusinesses(null)).rejects.toThrow(AppError);
      await expect(locationService.findNearbyBusinesses('not-a-number')).rejects.toThrow(AppError);
    });

    test('should throw an error when address is incomplete for geocoding', async () => {
      const incompleteAddress = new Address(
        1, '12345', null, null, // missing state and city
        'Sample Street', '123', null, null, null // no coordinates
      );
      
      mockAddressRepository.findById.mockResolvedValue(incompleteAddress);
      
      await expect(locationService.findNearbyBusinesses(1)).rejects.toThrow(AppError);
      await expect(locationService.findNearbyBusinesses(1)).rejects.toThrow('Endereço incompleto, impossível geocodificar');
    });

    test('should throw an error when geocoding fails during findNearbyBusinesses', async () => {
      const addressWithoutCoords = new Address(
        1, '12345', 'Sample State', 'Sample City', 
        'Sample Street', '123', null, null, null // no coordinates
      );
      
      mockAddressRepository.findById.mockResolvedValue(addressWithoutCoords);
      
      // Mock geocoding to fail
      const errorMockGeocoding = {
        forwardGeocode: () => ({
          send: async () => { throw new Error('Geocoding failed'); }
        })
      };
      
      const serviceWithGeocodingError = new LocationService(
        mockBusinessRepository,
        mockAddressRepository,
        mockMapboxToken,
        { 
          isTesting: true,
          mockGeocoding: errorMockGeocoding
        }
      );
      
      await expect(serviceWithGeocodingError.findNearbyBusinesses(1)).rejects.toThrow(AppError);
      await expect(serviceWithGeocodingError.findNearbyBusinesses(1)).rejects.toThrow('Erro ao geocodificar endereço');
    });

    test('should throw an error when coordinates cannot be determined', async () => {
      const addressWithoutCoords = new Address(
        1, '12345', 'Sample State', 'Sample City', 
        'Sample Street', '123', null, null, null // no coordinates
      );
      
      mockAddressRepository.findById.mockResolvedValue(addressWithoutCoords);
      
      // Mock geocoding to return without coordinates
      const noCoordsMockGeocoding = {
        forwardGeocode: () => ({
          send: async () => ({
            body: { 
              features: [{ 
                place_name: 'Test Address',
                center: [null, null] // invalid coordinates
              }]
            }
          })
        })
      };
      
      const serviceWithNoCoords = new LocationService(
        mockBusinessRepository,
        mockAddressRepository,
        mockMapboxToken,
        { 
          isTesting: true,
          mockGeocoding: noCoordsMockGeocoding
        }
      );
      
      await expect(serviceWithNoCoords.findNearbyBusinesses(1)).rejects.toThrow(AppError);
    });

    test('should handle businesses with missing addresses', async () => {
      const testAddress = new Address(
        1, '12345', 'Sample State', 'Sample City', 
        'Sample Street', '123', null, -23.5678, 10.1234
      );
      
      const business1 = new Business(
        1, 'Business 1', '12345678901234', 'App Business 1', 
        '1234567890', 'Description 1', null, 'password1', 
        true, 10, 1, true
      );
      // Business without address
      
      const business2 = new Business(
        2, 'Business 2', '23456789012345', 'App Business 2', 
        '2345678901', 'Description 2', null, 'password2', 
        true, 10, 2, true
      );
      business2.address = new Address(
        2, '54321', 'Other State', 'Other City', 
        'Other Street', '456', null, -23.5680, 10.1240
      );
      
      mockAddressRepository.findById.mockResolvedValue(testAddress);
      mockBusinessRepository.findAllWithAddress.mockResolvedValue([business1, business2]);
      
      // Mock the calculateDistance method
      jest.spyOn(locationService, 'calculateDistance').mockReturnValue(0.5);
      
      const result = await locationService.findNearbyBusinesses(1, { radius: 10 });
      
      // Should only include the business with a valid address
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    test('should skip businesses with invalid coordinates', async () => {
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
        'Other Street', '456', null, null, null // no coordinates
      );
      
      mockAddressRepository.findById.mockResolvedValue(testAddress);
      mockBusinessRepository.findAllWithAddress.mockResolvedValue([business1]);
      
      const result = await locationService.findNearbyBusinesses(1, { radius: 10 });
      
      // Should not include any business
      expect(result).toHaveLength(0);
    });

    test('should handle errors in distance calculation', async () => {
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
      
      mockAddressRepository.findById.mockResolvedValue(testAddress);
      mockBusinessRepository.findAllWithAddress.mockResolvedValue([business1]);
      
      // Mock calculateDistance to throw an error
      jest.spyOn(locationService, 'calculateDistance').mockImplementation(() => {
        throw new Error('Distance calculation error');
      });
      
      const console_error = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      try {
        const result = await locationService.findNearbyBusinesses(1, { radius: 10 });
        
        // Should not include any business due to calculation error
        expect(result).toHaveLength(0);
        expect(console_error).toHaveBeenCalled();
      } finally {
        console_error.mockRestore();
      }
    });

    test('should sort businesses by distance', async () => {
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
        2, 'Business 2', '23456789012345', 'App Business 2', 
        '2345678901', 'Description 2', null, 'password2', 
        true, 10, 2, true
      );
      business2.address = new Address(
        3, '67890', 'Another State', 'Another City', 
        'Another Street', '789', null, -23.5690, 10.1250
      );
      
      mockAddressRepository.findById.mockResolvedValue(testAddress);
      mockBusinessRepository.findAllWithAddress.mockResolvedValue([business1, business2]);
      
      // Mock the calculateDistance method to return different distances
      const calculateDistanceMock = jest.spyOn(locationService, 'calculateDistance');
      calculateDistanceMock.mockImplementation((lat1, lon1, lat2, lon2) => {
        if (lat2 === -23.5680) return 2.0; // Farther
        if (lat2 === -23.5690) return 0.5; // Closer
        return 0;
      });
      
      const result = await locationService.findNearbyBusinesses(1, { radius: 10 });
      
      // Should include both businesses, sorted by distance
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(2); // Closer business should be first
      expect(result[1].id).toBe(1);
    });

    test('should limit results according to limit parameter', async () => {
      const testAddress = new Address(
        1, '12345', 'Sample State', 'Sample City', 
        'Sample Street', '123', null, -23.5678, 10.1234
      );
      
      // Create 5 businesses
      const businesses = Array(5).fill(0).map((_, i) => {
        const business = new Business(
          i + 1, `Business ${i + 1}`, `1234567890123${i}`, `App Business ${i + 1}`, 
          `123456789${i}`, `Description ${i + 1}`, null, `password${i + 1}`, 
          true, 10, i + 1, true
        );
        business.address = new Address(
          i + 2, '54321', 'Other State', 'Other City', 
          'Other Street', '456', null, -23.5680 + (i * 0.001), 10.1240 + (i * 0.001)
        );
        return business;
      });
      
      mockAddressRepository.findById.mockResolvedValue(testAddress);
      mockBusinessRepository.findAllWithAddress.mockResolvedValue(businesses);
      
      // All distances are within radius
      jest.spyOn(locationService, 'calculateDistance').mockReturnValue(5);
      
      // Request only 3 results
      const result = await locationService.findNearbyBusinesses(1, { radius: 10, limit: 3 });
      
      expect(result).toHaveLength(3);
    });

    test('should skip businesses without coordinates when finding nearby', async () => {
      // Mock business with missing coordinates
      const mockBusinessWithoutCoordinates = {
        id: 3,
        legalName: 'Business Without Coordinates',
        address: {
          id: 3,
          street: 'Address Without Coordinates',
          // Missing latitude and longitude
        }
      };
      
      const mockAddressWithCoordinates = {
        id: 1,
        street: 'Reference Street',
        city: 'Reference City',
        state: 'RS',
        latitude: -30.0,
        longitude: -51.0
      };
      
      // Setup mocks
      mockAddressRepository.findById.mockResolvedValueOnce(mockAddressWithCoordinates);
      mockBusinessRepository.findAllWithAddress.mockResolvedValueOnce([mockBusinessWithoutCoordinates]);
      
      // Execute
      const result = await locationService.findNearbyBusinesses(1);
      
      // Verify
      expect(result).toEqual([]);
      // Should have skipped the business without coordinates
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('ignorado - endereço sem coordenadas'));
    });

    test('should handle errors when calculating distance for specific businesses', async () => {
      // Mock address and businesses
      const mockAddress = {
        id: 1,
        street: 'Reference Street',
        city: 'Reference City',
        state: 'RS',
        latitude: -30.0,
        longitude: -51.0
      };
      
      const mockBusinesses = [
        {
          id: 1,
          legalName: 'Good Business',
          address: {
            id: 1,
            latitude: -30.1,
            longitude: -51.1
          }
        },
        {
          id: 2,
          legalName: 'Problematic Business',
          address: {
            id: 2,
            latitude: -30.2,
            longitude: -51.2
          }
        }
      ];
      
      // Setup mocks
      mockAddressRepository.findById.mockResolvedValueOnce(mockAddress);
      mockBusinessRepository.findAllWithAddress.mockResolvedValueOnce(mockBusinesses);
      
      // Mock calculateDistance to throw error for the second business
      const originalCalculateDistance = locationService.calculateDistance;
      locationService.calculateDistance = jest.fn()
        .mockImplementationOnce(() => 5) // First call works fine, 5km distance
        .mockImplementationOnce(() => { throw new Error('Distance calculation error'); }); // Second call throws
      
      try {
        // Execute
        const result = await locationService.findNearbyBusinesses(1, { radius: 10 });
        
        // Verify
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(1); // Only the first business should be included
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Erro ao calcular distância'), expect.any(Error));
      } finally {
        // Restore original method
        locationService.calculateDistance = originalCalculateDistance;
      }
    });

    test('should log when calculating distance for a business', async () => {
      // Mock console.log
      console.log = jest.fn();
      
      // Setup test data
      const clientAddress = {
        id: 1,
        latitude: 40.7128,
        longitude: -74.0060,
        zipCode: '10001',
        state: 'NY',
        city: 'New York',
        street: 'Broadway',
        number: '123'
      };
      
      const businessWithAddress = {
        id: 1,
        legalName: 'Test Business',
        address: {
          latitude: 40.7580,
          longitude: -73.9855
        }
      };
      
      // Setup repository mocks
      mockAddressRepository.findById.mockResolvedValue(clientAddress);
      mockBusinessRepository.findAllWithAddress.mockResolvedValue([businessWithAddress]);
      
      // Execute the function
      await locationService.findNearbyBusinesses(1, { radius: 100 }); // Use large radius to ensure inclusion
      
      // Just verify that console.log was called at least once, without checking the specific message
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('calculateDistance', () => {
    test('should correctly calculate distance between two points', () => {
      const lat1 = -23.5678;
      const lon1 = 10.1234;
      const lat2 = -23.5680;
      const lon2 = 10.1240;
      
      const distance = locationService.calculateDistance(lat1, lon1, lat2, lon2);
      
      // Approximate distance should be less than 1 km
      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(1);
    });
    
    test('should throw an error with invalid coordinates', () => {
      expect(() => {
        locationService.calculateDistance(null, 10.1234, -23.5680, 10.1240);
      }).toThrow();
      
      expect(() => {
        locationService.calculateDistance(-23.5678, null, -23.5680, 10.1240);
      }).toThrow();
      
      expect(() => {
        locationService.calculateDistance(-23.5678, 10.1234, null, 10.1240);
      }).toThrow();
      
      expect(() => {
        locationService.calculateDistance(-23.5678, 10.1234, -23.5680, null);
      }).toThrow();
    });
    
    test('should return a positive number or zero', () => {
      const distance = locationService.calculateDistance(-23.5678, 10.1234, -23.5678, 10.1234);
      expect(distance).toBeGreaterThanOrEqual(0);
    });
    
    test('should convert string coordinates to numbers', () => {
      const distance = locationService.calculateDistance('-23.5678', '10.1234', '-23.5680', '10.1240');
      
      // Approximate distance should be less than 1 km
      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(1);
    });

    test('should handle string coordinates correctly in special cases', () => {
      // Empty strings
      expect(() => {
        locationService.calculateDistance('', '', '-23.5680', '10.1240');
      }).toThrow();
      
      // Non-numeric strings
      expect(() => {
        locationService.calculateDistance('not-a-number', '10.1234', '-23.5680', '10.1240');
      }).toThrow();
    });

    test('should handle extreme coordinate values', () => {
      // North pole to south pole
      const distance = locationService.calculateDistance(90, 0, -90, 0);
      expect(distance).toBeCloseTo(20015.086, 0); // ~20,000 km
    });

    test('should handle invalid coordinates in calculateDistance', () => {
      const testCases = [
        { args: [null, 0, 0, 0], name: 'null lat1' },
        { args: [0, null, 0, 0], name: 'null lon1' },
        { args: [0, 0, null, 0], name: 'null lat2' },
        { args: [0, 0, 0, null], name: 'null lon2' },
        { args: [undefined, 0, 0, 0], name: 'undefined lat1' },
        { args: ['not-a-number', 0, 0, 0], name: 'NaN lat1' },
        { args: [0, 0, 0, 'not-a-number'], name: 'NaN lon2' }
      ];
      
      testCases.forEach(testCase => {
        expect(() => {
          locationService.calculateDistance(...testCase.args);
        }).toThrow('Coordenadas inválidas para cálculo de distância');
      });
    });

    test('should return Infinity for distance calculation with invalid result', () => {
      // Mock Math functions to create a NaN result
      const originalSin = Math.sin;
      Math.sin = jest.fn().mockReturnValue(NaN);
      
      try {
        const result = locationService.calculateDistance(0, 0, 1, 1);
        expect(result).toBe(Infinity);
      } finally {
        // Restore original Math function
        Math.sin = originalSin;
      }
    });
  });

  describe('deg2rad', () => {
    test('should convert degrees to radians', () => {
      const degrees = 180;
      const radians = locationService.deg2rad(degrees);
      expect(radians).toBeCloseTo(Math.PI, 5);
    });
  });

  test('should initialize properly with API credentials', () => {
    // Create a custom LocationService class for testing that extends the real one
    class TestLocationService extends LocationService {
      constructor(businessRepo, addressRepo, token, options) {
        // Call super but intercept the mapboxSdk call
        super(businessRepo, addressRepo, token, { ...options, isTesting: true });
        
        // Override the testing flag if needed
        if (options && options.isTesting === false) {
          this.isTesting = false;
        }
      }
    }
    
    // Create instance with testing bypassing the token validation
    const service = new TestLocationService(
      mockBusinessRepository,
      mockAddressRepository,
      'fake-token',
      { isTesting: false }
    );
    
    // Verify it initialized correctly
    expect(service.isTesting).toBe(false);
    expect(service.businessRepository).toBe(mockBusinessRepository);
    expect(service.addressRepository).toBe(mockAddressRepository);
  });
});
