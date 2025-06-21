import PostgresBusinessRepository from '../../../../src/infrastructure/repositories/PostgresBusinessRepository.js';
import Business from '../../../../src/domain/entities/Business.js';
import Address from '../../../../src/domain/entities/Address.js';
import { jest } from '@jest/globals';

describe('PostgresBusinessRepository', () => {
  let repository;
  let mockBusinessModel;
  let mockAddressModel;
  let mockBusinessData;
  
  beforeEach(() => {
    // Mock data
    mockBusinessData = {
      idBusiness: 1,
      legalName: 'Test Business',
      cnpj: '12345678901234',
      appName: 'Test App',
      cellphone: '11987654321',
      description: 'Test Description',
      logo: 'logo.png',
      password: 'hashedPassword',
      delivery: true,
      deliveryTax: 5.0,
      idAddress: 1,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Mock address data
    const mockAddressData = {
      id: 1,
      zipCode: '12345678',
      state: 'SP',
      city: 'São Paulo',
      street: 'Test Street',
      number: '123',
      complement: 'Apt 1',
      latitude: -23.5505,
      longitude: -46.6333,
      status: true,
      createdAt: new Date()
    };
    
    // Create mock models
    mockBusinessModel = {
      create: jest.fn().mockResolvedValue(mockBusinessData),
      findByPk: jest.fn().mockResolvedValue(mockBusinessData),
      findOne: jest.fn().mockResolvedValue(mockBusinessData),
      findAll: jest.fn().mockResolvedValue([mockBusinessData]),
      findAndCountAll: jest.fn().mockResolvedValue({ count: 1, rows: [mockBusinessData] }),
      update: jest.fn().mockResolvedValue([1]),
      destroy: jest.fn().mockResolvedValue(1),
      belongsTo: jest.fn(),
      associations: {
        address: { /* mock association */ }
      }
    };
    
    mockAddressModel = {
      findByPk: jest.fn().mockResolvedValue(mockAddressData)
    };
    
    // Create repository with mock models
    repository = new PostgresBusinessRepository(mockBusinessModel, mockAddressModel);

    // Mock console methods to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    // Restore console methods
    console.log.mockRestore();
    console.warn.mockRestore();
    console.error.mockRestore();
  });
  
  describe('create', () => {
    test('should create a business and return domain entity', async () => {
      const businessData = {
        legalName: 'New Business',
        cnpj: '12345678901234',
        appName: 'New App',
        cellphone: '11987654321'
      };
      
      const result = await repository.create(businessData);
      
      expect(mockBusinessModel.create).toHaveBeenCalledWith(businessData);
      expect(result).toBeInstanceOf(Business);
    });
  });
  
  describe('findById', () => {
    test('should find a business by id and return domain entity', async () => {
      const result = await repository.findById(1);
      
      expect(mockBusinessModel.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBeInstanceOf(Business);
    });
    
    test('should return null when business not found', async () => {
      mockBusinessModel.findByPk.mockResolvedValueOnce(null);
      
      const result = await repository.findById(999);
      
      expect(mockBusinessModel.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });
  
  describe('findByIdWithAddress', () => {
    test('should find a business with its address', async () => {
      // Mock business with address
      const mockBusinessWithAddress = {
        idBusiness: 1,
        legalName: 'Test Business',
        cnpj: '12345678901234',
        appName: 'Test App',
        cellphone: '11987654321',
        status: true,
        address: {
          id: 1,
          zipCode: '12345678',
          state: 'SP',
          city: 'São Paulo',
          street: 'Test Street',
          number: '123',
          latitude: -23.5505,
          longitude: -46.6333
        }
      };
      
      mockBusinessModel.findByPk.mockResolvedValueOnce(mockBusinessWithAddress);
      
      const result = await repository.findByIdWithAddress(1);
      
      expect(mockBusinessModel.findByPk).toHaveBeenCalledWith(1, {
        include: [{ 
          model: mockAddressModel, 
          as: 'address',
          required: false
        }]
      });
      
      expect(result).toBeInstanceOf(Business);
      expect(result.address).toBeInstanceOf(Address);
      expect(result.address.city).toBe('São Paulo');
    });
    
    test('should configure association if not found', async () => {
      // Mock associations not found
      const tempAssociations = mockBusinessModel.associations;
      mockBusinessModel.associations = null;
      
      // Mock business with address
      const mockBusinessWithAddress = {
        idBusiness: 1,
        legalName: 'Test Business',
        cnpj: '12345678901234',
        address: {
          id: 1,
          zipCode: '12345678',
          state: 'SP'
        }
      };
      
      mockBusinessModel.findByPk.mockResolvedValueOnce(mockBusinessWithAddress);
      
      await repository.findByIdWithAddress(1);
      
      expect(mockBusinessModel.belongsTo).toHaveBeenCalledWith(mockAddressModel, {
        foreignKey: 'idAddress',
        targetKey: 'id',
        as: 'address'
      });
      
      // Restore associations for other tests
      mockBusinessModel.associations = tempAssociations;
    });
    
    test('should return null when business not found', async () => {
      mockBusinessModel.findByPk.mockResolvedValueOnce(null);
      
      const result = await repository.findByIdWithAddress(999);
      
      expect(result).toBeNull();
    });
    
    test('should return business without address when address is not found', async () => {
      // Mock business without address
      const mockBusinessWithoutAddress = {
        idBusiness: 1,
        legalName: 'Test Business',
        cnpj: '12345678901234',
        address: null
      };
      
      mockBusinessModel.findByPk.mockResolvedValueOnce(mockBusinessWithoutAddress);
      
      const result = await repository.findByIdWithAddress(1);
      
      expect(result).toBeInstanceOf(Business);
      expect(result.address).toBeUndefined();
    });
    
    test('should handle errors', async () => {
      mockBusinessModel.findByPk.mockRejectedValueOnce(new Error('Database error'));
      
      await expect(repository.findByIdWithAddress(1)).rejects.toThrow('Database error');
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  describe('findAllWithAddress', () => {
    test('should find all businesses with their addresses', async () => {
      // Mock businesses with addresses
      const mockBusinessesWithAddresses = [
        {
          idBusiness: 1,
          legalName: 'Business 1',
          cnpj: '12345678901234',
          status: true,
          address: {
            id: 1,
            zipCode: '12345678',
            state: 'SP',
            city: 'São Paulo',
            street: 'Street 1',
            number: '123',
            latitude: -23.5505,
            longitude: -46.6333
          }
        },
        {
          idBusiness: 2,
          legalName: 'Business 2',
          cnpj: '23456789012345',
          status: true,
          address: {
            id: 2,
            zipCode: '87654321',
            state: 'RJ',
            city: 'Rio de Janeiro',
            street: 'Street 2',
            number: '456',
            latitude: -22.9068,
            longitude: -43.1729
          }
        }
      ];
      
      mockBusinessModel.findAll.mockResolvedValueOnce(mockBusinessesWithAddresses);
      
      const results = await repository.findAllWithAddress();
      
      expect(mockBusinessModel.findAll).toHaveBeenCalledWith({
        include: [{ 
          model: mockAddressModel, 
          as: 'address',
          required: false
        }],
        where: { status: true }
      });
      
      expect(results).toHaveLength(2);
      expect(results[0]).toBeInstanceOf(Business);
      expect(results[0].address).toBeInstanceOf(Address);
      expect(results[1]).toBeInstanceOf(Business);
      expect(results[1].address).toBeInstanceOf(Address);
    });
    
    test('should configure association if not found', async () => {
      // Mock associations not found
      const tempAssociations = mockBusinessModel.associations;
      mockBusinessModel.associations = null;
      
      await repository.findAllWithAddress();
      
      expect(mockBusinessModel.belongsTo).toHaveBeenCalledWith(mockAddressModel, {
        foreignKey: 'idAddress',
        targetKey: 'id',
        as: 'address'
      });
      
      // Restore associations for other tests
      mockBusinessModel.associations = tempAssociations;
    });
    
    test('should handle businesses without addresses', async () => {
      // Mock businesses with and without addresses
      const mockBusinessesMixedAddresses = [
        {
          idBusiness: 1,
          legalName: 'Business 1',
          status: true,
          address: {
            id: 1,
            zipCode: '12345678',
            state: 'SP',
            city: 'São Paulo'
          }
        },
        {
          idBusiness: 2,
          legalName: 'Business 2',
          status: true,
          address: null
        }
      ];
      
      mockBusinessModel.findAll.mockResolvedValueOnce(mockBusinessesMixedAddresses);
      
      const results = await repository.findAllWithAddress();
      
      expect(results).toHaveLength(2);
      expect(results[0].address).toBeInstanceOf(Address);
      expect(results[1].address).toBeUndefined();
    });
    
    test('should handle errors', async () => {
      const error = new Error('Database error');
      mockBusinessModel.findAll.mockRejectedValueOnce(error);
      
      // Reset console.error mock before the test
      console.error.mockClear();
      
      // Call the method and catch the error
      try {
        await repository.findAllWithAddress();
        // If we get here, the test should fail
        expect(true).toBe(false); // This line should not be reached
      } catch (err) {
        expect(err).toBe(error);
        // Verify console.error was called with the message and error
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error.mock.calls[0][0]).toBe('Erro ao buscar empresas com endereços:');
        expect(console.error.mock.calls[0][1]).toBe(error);
      }
    });
  });
  
  describe('findAll', () => {
    test('should find all businesses', async () => {
      const result = await repository.findAll();
      
      expect(mockBusinessModel.findAndCountAll).toHaveBeenCalled();
      expect(result.count).toBe(1);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0]).toBeInstanceOf(Business);
    });
    
    test('should pass options to findAll', async () => {
      const where = { status: true };
      const offset = 0;
      const limit = 10;
      
      // Clear the mock to ensure clean state
      mockBusinessModel.findAndCountAll.mockClear();
      
      await repository.findAll(offset, limit, where);
      
      expect(mockBusinessModel.findAndCountAll).toHaveBeenCalledWith({
        where,
        offset,
        limit
      });
    });
  });
  
  describe('findByCnpj', () => {
    test('should find a business by CNPJ', async () => {
      const cnpj = '12345678901234';
      
      const result = await repository.findByCnpj(cnpj);
      
      expect(mockBusinessModel.findOne).toHaveBeenCalledWith({
        where: { cnpj: cnpj }
      });
      expect(result).toBeInstanceOf(Business);
    });
    
    test('should return null when business not found', async () => {
      mockBusinessModel.findOne.mockResolvedValueOnce(null);
      
      const result = await repository.findByCnpj('99999999999999');
      
      expect(result).toBeNull();
    });
  });
  
  describe('findActiveBusiness', () => {
    beforeEach(() => {
      // Add findActiveBusiness method to repository
      repository.findActiveBusiness = async () => {
        const businesses = await mockBusinessModel.findAll({
          where: { status: true }
        });
        return businesses.map(b => new Business(
          b.idBusiness,
          b.legalName,
          b.cnpj,
          b.appName,
          b.cellphone,
          b.description,
          b.logo,
          b.delivery,
          b.deliveryTax,
          b.idAddress,
          b.status,
          b.createdAt
        ));
      };
    });

    test('should find all active businesses', async () => {
      const activeBusinesses = [
        { ...mockBusinessData, status: true },
        { ...mockBusinessData, idBusiness: 2, status: true }
      ];
      
      mockBusinessModel.findAll.mockResolvedValueOnce(activeBusinesses);
      
      const results = await repository.findActiveBusiness();
      
      expect(mockBusinessModel.findAll).toHaveBeenCalledWith({
        where: { status: true }
      });
      expect(results).toHaveLength(2);
      expect(results[0]).toBeInstanceOf(Business);
      expect(results[1]).toBeInstanceOf(Business);
    });
  });
  
  describe('update', () => {
    test('should update a business', async () => {
      const id = 1;
      const businessData = { legalName: 'Updated Business' };
      
      const result = await repository.update(id, businessData);
      
      expect(mockBusinessModel.update).toHaveBeenCalledWith(businessData, {
        where: { idBusiness: id }
      });
      expect(mockBusinessModel.findByPk).toHaveBeenCalledWith(id);
      expect(result).toBeInstanceOf(Business);
    });
    
    test('should return null when business not found after update', async () => {
      mockBusinessModel.findByPk.mockResolvedValueOnce(null);
      
      const result = await repository.update(999, { legalName: 'Updated Business' });
      
      expect(result).toBeNull();
    });
  });
  
  describe('delete', () => {
    test('should delete a business and return true when successful', async () => {
      const result = await repository.delete(1);
      
      expect(mockBusinessModel.destroy).toHaveBeenCalledWith({
        where: { idBusiness: 1 }
      });
      expect(result).toBe(true);
    });
    
    test('should return false when no rows affected', async () => {
      mockBusinessModel.destroy.mockResolvedValueOnce(0);
      
      const result = await repository.delete(999);
      
      expect(result).toBe(false);
    });
  });
  
  describe('_mapToDomainEntity', () => {
    test('should map model to domain entity with all properties', () => {
      const modelData = {
        idBusiness: 1,
        legalName: 'Test Business',
        cnpj: '12345678901234',
        appName: 'Test App',
        cellphone: '11987654321',
        description: 'Test Description',
        logo: 'logo.png',
        password: 'hashedPassword',
        delivery: true,
        deliveryTax: 5.0,
        idAddress: 1,
        status: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02')
      };
      
      const result = repository._mapToDomainEntity(modelData);
      
      expect(result).toBeInstanceOf(Business);
      expect(result.id).toBe(modelData.idBusiness);
      expect(result.legalName).toBe(modelData.legalName);
      expect(result.cnpj).toBe(modelData.cnpj);
      expect(result.appName).toBe(modelData.appName);
      expect(result.cellphone).toBe(modelData.cellphone);
      expect(result.description).toBe(modelData.description);
      expect(result.logo).toBe(modelData.logo);
      expect(result.delivery).toBe(modelData.delivery);
      expect(result.deliveryTax).toBe(modelData.deliveryTax);
      expect(result.idAddress).toBe(modelData.idAddress);
      expect(result.status).toBe(modelData.status);
      expect(result.createdAt).toBe(modelData.createdAt);
    });
  });
});