import BagService from '../../../../src/application/services/BagService.js';
import Bag from '../../../../src/domain/entities/Bag.js';
import AppError from '../../../../src/infrastructure/errors/AppError.js';
import { jest } from '@jest/globals';

describe('BagService', () => {
  let mockBagRepository;
  let bagService;
  
  beforeEach(() => {
    mockBagRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCompanyId: jest.fn(),
      findActiveByCompanyId: jest.fn()
    };
    
    bagService = new BagService(mockBagRepository);
  });
  
  describe('createBag', () => {
    test('should call repository create method with the correct data', async () => {
      const bagData = {
        type: 'Mista',
        price: 15.99,
        description: 'Mixed bag',
        companyId: 5
      };
      
      const createdBag = new Bag(1, 'Mista', 15.99, 'Mixed bag', 5);
      mockBagRepository.create.mockResolvedValue(createdBag);
      
      const result = await bagService.createBag(bagData);
      
      expect(mockBagRepository.create).toHaveBeenCalledWith(bagData);
      expect(result).toBe(createdBag);
    });
  });
  
  describe('getBag', () => {
    test('should return bag when found', async () => {
      const bag = new Bag(1, 'Mista', 15.99, 'Mixed bag', 5);
      mockBagRepository.findById.mockResolvedValue(bag);
      
      const result = await bagService.getBag(1);
      
      expect(mockBagRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toBe(bag);
    });
    
    test('should throw error when bag not found', async () => {
      mockBagRepository.findById.mockResolvedValue(null);
      
      await expect(bagService.getBag(999)).rejects.toThrow();
      expect(mockBagRepository.findById).toHaveBeenCalledWith(999);
    });
  });
  
  describe('getAllBags', () => {
    test('should return all bags', async () => {
      const bags = [
        new Bag(1, 'Doce', 10.0, 'Sweet bag', 5),
        new Bag(2, 'Salgada', 12.0, 'Salty bag', 5)
      ];
      
      mockBagRepository.findAll.mockResolvedValue(bags);
      
      const result = await bagService.getAllBags();
      
      expect(mockBagRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(bags);
    });
  });
  
  describe('updateBag', () => {
    test('should update bag when found', async () => {
      const bagData = { price: 20.0, description: 'Updated description' };
      const updatedBag = new Bag(1, 'Mista', 20.0, 'Updated description', 5);
      
      mockBagRepository.update.mockResolvedValue(updatedBag);
      
      const result = await bagService.updateBag(1, bagData);
      
      expect(mockBagRepository.update).toHaveBeenCalledWith(1, bagData);
      expect(result).toBe(updatedBag);
    });
    
    test('should throw error when bag not found', async () => {
      mockBagRepository.update.mockResolvedValue(null);
      
      await expect(bagService.updateBag(999, { price: 20.0 })).rejects.toThrow();
      expect(mockBagRepository.update).toHaveBeenCalledWith(999, { price: 20.0 });
    });
  });
  
  describe('deleteBag', () => {
    test('should delete bag when found', async () => {
      mockBagRepository.delete.mockResolvedValue(true);
      
      const result = await bagService.deleteBag(1);
      
      expect(mockBagRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });
    
    test('should throw error when bag not found', async () => {
      mockBagRepository.delete.mockResolvedValue(false);
      
      await expect(bagService.deleteBag(999)).rejects.toThrow();
      expect(mockBagRepository.delete).toHaveBeenCalledWith(999);
    });
  });
  
  describe('getBagsByCompanyId', () => {
    test('should return bags for a company', async () => {
      const bags = [
        new Bag(1, 'Doce', 10.0, 'Sweet bag', 5),
        new Bag(2, 'Salgada', 12.0, 'Salty bag', 5)
      ];
      
      mockBagRepository.findByCompanyId.mockResolvedValue(bags);
      
      const result = await bagService.getBagsByCompanyId(5);
      
      expect(mockBagRepository.findByCompanyId).toHaveBeenCalledWith(5);
      expect(result).toEqual(bags);
    });
  });
  
  describe('getActiveBagsByCompanyId', () => {
    test('should return active bags for a company', async () => {
      const activeBags = [
        new Bag(1, 'Doce', 10.0, 'Sweet bag', 5, 1),
        new Bag(2, 'Salgada', 12.0, 'Salty bag', 5, 1)
      ];
      
      mockBagRepository.findActiveByCompanyId.mockResolvedValue(activeBags);
      
      const result = await bagService.getActiveBagsByCompanyId(5);
      
      expect(mockBagRepository.findActiveByCompanyId).toHaveBeenCalledWith(5);
      expect(result).toEqual(activeBags);
    });
  });
  
  describe('changeBagStatus', () => {
    test('should change bag status to active when found', async () => {
      const bag = new Bag(1, 'Doce', 10.0, 'Sweet bag', 5, 0);
      const updatedBag = new Bag(1, 'Doce', 10.0, 'Sweet bag', 5, 1);
      
      mockBagRepository.findById.mockResolvedValue(bag);
      mockBagRepository.update.mockResolvedValue(updatedBag);
      
      const result = await bagService.changeBagStatus(1, 1);
      
      expect(mockBagRepository.findById).toHaveBeenCalledWith(1);
      expect(mockBagRepository.update).toHaveBeenCalledWith(1, { status: 1 });
      expect(result).toBe(updatedBag);
    });
    
    test('should change bag status when boolean is provided', async () => {
      const bag = new Bag(1, 'Doce', 10.0, 'Sweet bag', 5, 1);
      const updatedBag = new Bag(1, 'Doce', 10.0, 'Sweet bag', 5, 0);
      
      mockBagRepository.findById.mockResolvedValue(bag);
      mockBagRepository.update.mockResolvedValue(updatedBag);
      
      const result = await bagService.changeBagStatus(1, false);
      
      expect(mockBagRepository.findById).toHaveBeenCalledWith(1);
      expect(mockBagRepository.update).toHaveBeenCalledWith(1, { status: 0 });
      expect(result).toBe(updatedBag);
    });
    
    test('should throw error when invalid status is provided', async () => {
      await expect(bagService.changeBagStatus(1, 2)).rejects.toThrow();
    });
    
    test('should throw error when bag not found', async () => {
      mockBagRepository.findById.mockResolvedValue(null);
      
      await expect(bagService.changeBagStatus(999, 1)).rejects.toThrow();
      expect(mockBagRepository.findById).toHaveBeenCalledWith(999);
    });
  });
}); 