import BagService from '../../../../src/application/services/BagService.js';
import Bag from '../../../../src/domain/entities/Bag.js';
import AppError from '../../../../src/infrastructure/errors/AppError.js';
import { jest } from '@jest/globals';

describe('BagService', () => {
  let mockBagRepository;
  let mockFavoriteRepository;
  let mockAuthRepository;
  let bagService;
  
  beforeEach(() => {
    mockBagRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByBusinessId: jest.fn(),
      findActiveByBusinessId: jest.fn()
    };
    
    mockFavoriteRepository = {
      addFavorite: jest.fn(),
      removeFavorite: jest.fn(),
      isFavorite: jest.fn(),
      findByBusinessId: jest.fn()
    };
    
    mockAuthRepository = {
      validateBusinessAccess: jest.fn(),
      findByCliendIds: jest.fn()
    };
    
    bagService = new BagService(mockBagRepository, mockFavoriteRepository, mockAuthRepository);
  });
  
  describe('createBag', () => {
    test('should call repository create method with the correct data', async () => {
      const bagData = {
        type: 'Mista',
        price: 15.99,
        description: 'Mixed bag',
        idBusiness: 5
      };
      
      const createdBag = new Bag(1, 'Mista', 15.99, 'Mixed bag', 5);
      mockBagRepository.create.mockResolvedValue(createdBag);
      
      const result = await bagService.createBag(bagData);
      
      expect(mockBagRepository.create).toHaveBeenCalledWith(bagData);
      expect(result).toBe(createdBag);
    });

    test('should handle repository errors during creation', async () => {
      const bagData = {
        type: 'Mista',
        price: 15.99,
        description: 'Mixed bag',
        idBusiness: 5
      };
      
      const error = new Error('Database error');
      mockBagRepository.create.mockRejectedValue(error);
      
      await expect(bagService.createBag(bagData)).rejects.toThrow(error);
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

      await expect(bagService.getBag(999))
        .rejects
        .toThrow(AppError);
      await expect(bagService.getBag(999))
        .rejects
        .toThrow('Sacola não encontrada com o ID: 999');
      expect(mockBagRepository.findById).toHaveBeenCalledWith(999);
    });

    test('should handle repository errors during get', async () => {
      const error = new Error('Database error');
      mockBagRepository.findById.mockRejectedValue(error);
      
      await expect(bagService.getBag(1)).rejects.toThrow(error);
    });
  });

  describe('getAllBags', () => {
    test('should return all bags', async () => {
      const bags = [
        new Bag(1, 'Mista', 15.99, 'Mixed bag', 5),
        new Bag(2, 'Vegetariana', 12.99, 'Vegetarian bag', 5)
      ];
      mockBagRepository.findAll.mockResolvedValue(bags);
      
      const result = await bagService.getAllBags();
      
      expect(mockBagRepository.findAll).toHaveBeenCalled();
      expect(result).toBe(bags);
    });

    test('should handle repository errors during getAll', async () => {
      const error = new Error('Database error');
      mockBagRepository.findAll.mockRejectedValue(error);
      
      await expect(bagService.getAllBags()).rejects.toThrow(error);
    });
  });

  describe('updateBag', () => {
    test('should update bag when found', async () => {
      const bagData = {
        type: 'Mista',
        price: 20.99,
        description: 'Updated mixed bag'
      };
      
      const updatedBag = new Bag(1, 'Mista', 20.99, 'Updated mixed bag', 5);
      mockBagRepository.update.mockResolvedValue(updatedBag);
      
      const result = await bagService.updateBag(1, bagData);
      
      expect(mockBagRepository.update).toHaveBeenCalledWith(1, bagData);
      expect(result).toBe(updatedBag);
    });
    
    test('should throw error when bag not found', async () => {
      const bagData = { price: 20.99 };
      mockBagRepository.update.mockResolvedValue(null);

      await expect(bagService.updateBag(999, bagData))
        .rejects
        .toThrow(AppError);
      await expect(bagService.updateBag(999, bagData))
        .rejects
        .toThrow('Sacola não encontrada com o ID: 999');
    });

    test('should handle repository errors during update', async () => {
      const bagData = { price: 20.99 };
      const error = new Error('Database error');
      mockBagRepository.update.mockRejectedValue(error);
      
      await expect(bagService.updateBag(1, bagData)).rejects.toThrow(error);
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

      await expect(bagService.deleteBag(999))
        .rejects
        .toThrow(AppError);
      await expect(bagService.deleteBag(999))
        .rejects
        .toThrow('Sacola não encontrada com o ID: 999');
    });

    test('should handle repository errors during delete', async () => {
      const error = new Error('Database error');
      mockBagRepository.delete.mockRejectedValue(error);
      
      await expect(bagService.deleteBag(1)).rejects.toThrow(error);
    });
  });

  describe('getBagsByBusinessId', () => {
    test('should return bags for a business', async () => {
      const businessId = 1;
      const bags = [
        new Bag(1, 'Mista', 15.99, 'Mixed bag', businessId),
        new Bag(2, 'Vegetariana', 12.99, 'Vegetarian bag', businessId)
      ];
      mockBagRepository.findByBusinessId.mockResolvedValue(bags);
      
      const result = await bagService.getBagsByBusinessId(businessId);
      
      expect(mockBagRepository.findByBusinessId).toHaveBeenCalledWith(businessId);
      expect(result).toBe(bags);
    });

    test('should handle repository errors during getBagsByBusinessId', async () => {
      const error = new Error('Database error');
      mockBagRepository.findByBusinessId.mockRejectedValue(error);
      
      await expect(bagService.getBagsByBusinessId(1)).rejects.toThrow(error);
    });
  });

  describe('getUsersFavoritesByBusinessId', () => {
    const businessId = 1;
    const mockFavorites = [
      { idClient: 1 },
      { idClient: 2 }
    ];
    const mockUsers = [
      { id: 1, fcmToken: 'token1' },
      { id: 2, fcmToken: 'token2' }
    ];

    beforeEach(() => {
      mockFavoriteRepository.findByBusinessId = jest.fn();
      mockAuthRepository.findByCliendIds = jest.fn();
    });

    test('should return users with fcm tokens for a business', async () => {
      mockFavoriteRepository.findByBusinessId.mockResolvedValue(mockFavorites);
      mockAuthRepository.findByCliendIds.mockResolvedValue(mockUsers);
      
      const result = await bagService.getUsersFavoritesByBusinessId(businessId);
      
      expect(mockFavoriteRepository.findByBusinessId).toHaveBeenCalledWith(businessId);
      expect(mockAuthRepository.findByCliendIds).toHaveBeenCalledWith([1, 2]);
      expect(result).toEqual([
        { fcmToken: 'token1' },
        { fcmToken: 'token2' }
      ]);
    });

    test('should throw error when no favorites found', async () => {
      mockFavoriteRepository.findByBusinessId.mockResolvedValue([]);
      
      await expect(bagService.getUsersFavoritesByBusinessId(businessId))
        .rejects
        .toThrow(AppError);
      await expect(bagService.getUsersFavoritesByBusinessId(businessId))
        .rejects
        .toThrow('Favoritos não encontrada com o ID: para o negócio 1');
    });

    test('should throw error when no users found', async () => {
      mockFavoriteRepository.findByBusinessId.mockResolvedValue(mockFavorites);
      mockAuthRepository.findByCliendIds.mockResolvedValue([]);
      
      await expect(bagService.getUsersFavoritesByBusinessId(businessId))
        .rejects
        .toThrow(AppError);
      await expect(bagService.getUsersFavoritesByBusinessId(businessId))
        .rejects
        .toThrow('Usuários não encontrada com o ID: favoritados para o negócio 1');
    });

    test('should handle repository errors during getUsersFavoritesByBusinessId', async () => {
      const error = new Error('Database error');
      mockFavoriteRepository.findByBusinessId.mockRejectedValue(error);
      
      await expect(bagService.getUsersFavoritesByBusinessId(businessId))
        .rejects
        .toThrow(error);
    });
  });

  describe('getActiveBagsByBusinessId', () => {
    test('should return active bags for a business', async () => {
      const businessId = 1;
      const bags = [
        new Bag(1, 'Mista', 15.99, 'Mixed bag', businessId, 1),
        new Bag(2, 'Vegetariana', 12.99, 'Vegetarian bag', businessId, 1)
      ];
      mockBagRepository.findActiveByBusinessId.mockResolvedValue(bags);
      
      const result = await bagService.getActiveBagsByBusinessId(businessId);
      
      expect(mockBagRepository.findActiveByBusinessId).toHaveBeenCalledWith(businessId);
      expect(result).toBe(bags);
    });

    test('should handle repository errors during getActiveBagsByBusinessId', async () => {
      const error = new Error('Database error');
      mockBagRepository.findActiveByBusinessId.mockRejectedValue(error);
      
      await expect(bagService.getActiveBagsByBusinessId(1)).rejects.toThrow(error);
    });
  });

  describe('changeBagStatus', () => {
    test('should change bag status to active (1)', async () => {
      const bagId = 1;
      const bag = new Bag(bagId, 'Mista', 15.99, 'Mixed bag', 1, 0);
      const updatedBag = new Bag(bagId, 'Mista', 15.99, 'Mixed bag', 1, 1);
      
      mockBagRepository.findById.mockResolvedValue(bag);
      mockBagRepository.update.mockResolvedValue(updatedBag);
      
      const result = await bagService.changeBagStatus(bagId, true);
      
      expect(mockBagRepository.findById).toHaveBeenCalledWith(bagId);
      expect(mockBagRepository.update).toHaveBeenCalledWith(bagId, { status: 1 });
      expect(result).toBe(updatedBag);
    });

    test('should change bag status to inactive (0)', async () => {
      const bagId = 1;
      const bag = new Bag(bagId, 'Mista', 15.99, 'Mixed bag', 1, 1);
      const updatedBag = new Bag(bagId, 'Mista', 15.99, 'Mixed bag', 1, 0);
      
      mockBagRepository.findById.mockResolvedValue(bag);
      mockBagRepository.update.mockResolvedValue(updatedBag);
      
      const result = await bagService.changeBagStatus(bagId, false);
      
      expect(mockBagRepository.findById).toHaveBeenCalledWith(bagId);
      expect(mockBagRepository.update).toHaveBeenCalledWith(bagId, { status: 0 });
      expect(result).toBe(updatedBag);
    });

    test('should accept numeric status values', async () => {
      const bagId = 1;
      const bag = new Bag(bagId, 'Mista', 15.99, 'Mixed bag', 1, 1);
      const updatedBag = new Bag(bagId, 'Mista', 15.99, 'Mixed bag', 1, 0);
      
      mockBagRepository.findById.mockResolvedValue(bag);
      mockBagRepository.update.mockResolvedValue(updatedBag);
      
      const result = await bagService.changeBagStatus(bagId, 0);
      
      expect(mockBagRepository.findById).toHaveBeenCalledWith(bagId);
      expect(mockBagRepository.update).toHaveBeenCalledWith(bagId, { status: 0 });
      expect(result).toBe(updatedBag);
    });

    test('should throw error for invalid status value', async () => {
      await expect(bagService.changeBagStatus(1, 2))
        .rejects
        .toThrow(AppError);
      await expect(bagService.changeBagStatus(1, 2))
        .rejects
        .toThrow('Status inválido. Deve ser 0 (inativo) ou 1 (ativo)');
    });

    test('should throw error when bag not found', async () => {
      mockBagRepository.findById.mockResolvedValue(null);
      
      await expect(bagService.changeBagStatus(999, true))
        .rejects
        .toThrow(AppError);
      await expect(bagService.changeBagStatus(999, true))
        .rejects
        .toThrow(/Sacola não encontrada com o ID: 999/);
    });

    test('should handle repository errors during changeBagStatus', async () => {
      const error = new Error('Database error');
      mockBagRepository.findById.mockRejectedValue(error);
      
      await expect(bagService.changeBagStatus(1, true)).rejects.toThrow(error);
    });
  });
});