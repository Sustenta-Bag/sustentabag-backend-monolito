import PostgresBagRepository from '../../../../src/infrastructure/repositories/PostgresBagRepository.js';
import Bag from '../../../../src/domain/entities/Bag.js';
import { jest } from '@jest/globals';

describe('PostgresBagRepository', () => {
  let mockBagModel;
  let repository;

  const bagData = {
    id: 1,
    type: 'Mista',
    price: 15.99,
    description: 'Mixed bag with various items',
    idBusiness: 5,
    status: 1,
    createdAt: new Date('2023-01-01')
  };

  beforeEach(() => {
    mockBagModel = {
      create: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn()
    };
    
    repository = new PostgresBagRepository(mockBagModel);
  });

  describe('create', () => {
    test('should create a bag and return domain entity', async () => {
      const mockBagRecord = {
        ...bagData,
        toJSON: () => bagData
      };
      
      mockBagModel.create.mockResolvedValue(mockBagRecord);
      
      const result = await repository.create(bagData);
      
      expect(mockBagModel.create).toHaveBeenCalledWith(bagData);
      expect(result).toBeInstanceOf(Bag);
      expect(result.id).toBe(bagData.id);
      expect(result.type).toBe(bagData.type);
      expect(result.price).toBe(bagData.price);
      expect(result.description).toBe(bagData.description);
      expect(result.idBusiness).toBe(bagData.idBusiness);
      expect(result.status).toBe(bagData.status);
      expect(result.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('findById', () => {
    test('should find a bag by id and return domain entity', async () => {
      const mockBagRecord = {
        ...bagData,
        toJSON: () => bagData
      };
      
      mockBagModel.findByPk.mockResolvedValue(mockBagRecord);
      
      const result = await repository.findById(1);
      
      expect(mockBagModel.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBeInstanceOf(Bag);
      expect(result.id).toBe(bagData.id);
    });
    
    test('should return null when bag not found', async () => {
      mockBagModel.findByPk.mockResolvedValue(null);
      
      const result = await repository.findById(999);
      
      expect(mockBagModel.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    test('should return all bags as domain entities', async () => {
      const mockBagRecords = [
        {
          ...bagData,
          id: 1,
          toJSON: () => ({ ...bagData, id: 1 })
        },
        {
          ...bagData,
          id: 2,
          toJSON: () => ({ ...bagData, id: 2 })
        }
      ];
      
      mockBagModel.findAndCountAll.mockResolvedValue({
        count: 2,
        rows: mockBagRecords
      });
      
      const results = await repository.findAll();
      
      expect(mockBagModel.findAndCountAll).toHaveBeenCalledWith({ where: undefined, offset: undefined, limit: undefined });
      expect(results.count).toBe(2);
      expect(results.rows).toHaveLength(2);
      expect(results.rows[0]).toBeInstanceOf(Bag);
      expect(results.rows[1]).toBeInstanceOf(Bag);
      expect(results.rows[0].id).toBe(1);
      expect(results.rows[1].id).toBe(2);
    });
    
    test('should return empty array when no bags found', async () => {
      mockBagModel.findAndCountAll.mockResolvedValue({
        count: 0,
        rows: []
      });
      
      const results = await repository.findAll();
      
      expect(mockBagModel.findAndCountAll).toHaveBeenCalledWith({ where: undefined, offset: undefined, limit: undefined });
      expect(results.count).toBe(0);
      expect(results.rows).toEqual([]);
    });
  });

  describe('update', () => {
    test('should update a bag and return domain entity', async () => {
      const updateData = { price: 20.0, description: 'Updated description' };
      const updatedBagData = { ...bagData, ...updateData };
      const mockBagRecord = {
        ...updatedBagData,
        toJSON: () => updatedBagData
      };
      
      mockBagModel.update.mockResolvedValue([1]);
      mockBagModel.findByPk.mockResolvedValue(mockBagRecord);
      
      const result = await repository.update(1, updateData);
      
      expect(mockBagModel.update).toHaveBeenCalledWith(updateData, { where: { id: 1 } });
      expect(mockBagModel.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBeInstanceOf(Bag);
      expect(result.price).toBe(updateData.price);
      expect(result.description).toBe(updateData.description);
    });
    
    test('should return null when bag not found after update', async () => {
      mockBagModel.update.mockResolvedValue([1]);
      mockBagModel.findByPk.mockResolvedValue(null);
      
      const result = await repository.update(999, { price: 20.0 });
      
      expect(mockBagModel.update).toHaveBeenCalledWith({ price: 20.0 }, { where: { id: 999 } });
      expect(mockBagModel.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    test('should return true when bag successfully deleted', async () => {
      mockBagModel.destroy.mockResolvedValue(1);
      
      const result = await repository.delete(1);
      
      expect(mockBagModel.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(true);
    });
    
    test('should return false when bag not found for deletion', async () => {
      mockBagModel.destroy.mockResolvedValue(0);
      
      const result = await repository.delete(999);
      
      expect(mockBagModel.destroy).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(result).toBe(false);
    });
  });
});