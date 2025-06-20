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
      findAll: jest.fn((where = {}, limit = 10, offset = 0) => Promise.resolve({ count: 0, rows: [] })),
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
      mockBagRepository.findAll.mockResolvedValue({
        count: 2,
        rows: bags
      });
      
      const result = await bagService.getAllBags(1, 10);
      
      expect(mockBagRepository.findAll).toHaveBeenCalledWith({}, 10, 0);
      expect(result).toEqual({
        total: 2,
        pages: 1,
        data: bags
      });
    });

    test('should handle repository errors during getAll', async () => {
      const error = new Error('Database error');
      mockBagRepository.findAll.mockRejectedValue(error);
      
      await expect(bagService.getAllBags(1, 10)).rejects.toThrow(error);
    });

    it('should get all bags with default pagination when page is less than 1', async () => {
      const mockResult = {
        count: 20,
        rows: [{ id: 1, name: 'Bag 1' }, { id: 2, name: 'Bag 2' }]
      };
      mockBagRepository.findAll.mockResolvedValue(mockResult);

      const result = await bagService.getAllBags(0, 10, {});

      expect(mockBagRepository.findAll).toHaveBeenCalledWith({}, 10, 0);
      expect(result).toEqual({
        total: 20,
        pages: 2,
        data: mockResult.rows
      });
    });

    it('should get all bags with default limit when limit is undefined', async () => {
      const mockResult = {
        count: 20,
        rows: [{ id: 1, name: 'Bag 1' }, { id: 2, name: 'Bag 2' }]
      };
      mockBagRepository.findAll.mockResolvedValue(mockResult);

      const result = await bagService.getAllBags(1, undefined, {});

      expect(mockBagRepository.findAll).toHaveBeenCalledWith({}, 10, 0);
      expect(result).toEqual({
        total: 20,
        pages: 2,
        data: mockResult.rows
      });
    });

    it('should get all bags with default pagination when page is undefined', async () => {
      const mockResult = {
        count: 20,
        rows: [{ id: 1, name: 'Bag 1' }, { id: 2, name: 'Bag 2' }]
      };
      mockBagRepository.findAll.mockResolvedValue(mockResult);

      const result = await bagService.getAllBags(undefined, undefined, {});

      expect(mockBagRepository.findAll).toHaveBeenCalledWith({}, 10, 0);
      expect(result).toEqual({
        total: 20,
        pages: 2,
        data: mockResult.rows
      });
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

  describe('changeBagStatus', () => {
    test('should change bag status when bag exists', async () => {
      const bag = new Bag(1, 'Mista', 15.99, 'Mixed bag', 5, 1);
      mockBagRepository.findById.mockResolvedValue(bag);
      mockBagRepository.update.mockResolvedValue(bag);
      
      const result = await bagService.changeBagStatus(1, 0);
      
      expect(mockBagRepository.findById).toHaveBeenCalledWith(1);
      expect(mockBagRepository.update).toHaveBeenCalledWith(1, { status: 0 });
      expect(result).toBe(bag);
    });

    test('should throw error when bag not found', async () => {
      mockBagRepository.findById.mockResolvedValue(null);
      
      await expect(bagService.changeBagStatus(999, 1))
        .rejects
        .toThrow(AppError);
      await expect(bagService.changeBagStatus(999, 1))
        .rejects
        .toThrow('Sacola não encontrada com o ID: 999');
    });

    test('should throw error when status is invalid', async () => {
      await expect(bagService.changeBagStatus(1, 2))
        .rejects
        .toThrow(AppError);
      await expect(bagService.changeBagStatus(1, 2))
        .rejects
        .toThrow('Status inválido. Deve ser 0 (inativo) ou 1 (ativo)');
    });

    test('should convert boolean to number', async () => {
      const bag = new Bag(1, 'Mista', 15.99, 'Mixed bag', 5, 1);
      mockBagRepository.findById.mockResolvedValue(bag);
      mockBagRepository.update.mockResolvedValue(bag);
      
      const result = await bagService.changeBagStatus(1, true);
      
      expect(mockBagRepository.update).toHaveBeenCalledWith(1, { status: 1 });
      expect(result).toBe(bag);
    });
  });
});