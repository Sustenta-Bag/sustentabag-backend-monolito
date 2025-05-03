import PostgresBusinessRepository from '../../../../src/infrastructure/repositories/PostgresBusinessRepository.js';
import Business from '../../../../src/domain/entities/Business.js';
import { jest } from '@jest/globals';

describe('PostgresBusinessRepository', () => {
  let mockBusinessModel;
  let repository;

  const businessData = {
    id: 1,
    legalName: 'Sustenta Bag LTDA',
    cnpj: '12345678000199',
    appName: 'Sustenta Bag App',
    cellphone: '11987654321',
    description: 'Empresa especializada em sacolas sustentáveis',
    logo: 'logo.png',
    delivery: true,
    deliveryTax: 5.99,
    idAddress: 5,
    status: 1,
    createdAt: new Date('2023-01-01')
  };

  beforeEach(() => {
    mockBusinessModel = {
      create: jest.fn(),
      findByPk: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn()
    };
    
    repository = new PostgresBusinessRepository(mockBusinessModel);
  });

  // describe('create', () => {
  //   test('should create a business and return domain entity', async () => {
  //     const mockBusinessRecord = {
  //       ...businessData,
  //       toJSON: () => businessData
  //     };
      
  //     mockBusinessModel.create.mockResolvedValue(mockBusinessRecord);
      
  //     const result = await repository.create(businessData);
      
  //     expect(mockBusinessModel.create).toHaveBeenCalledWith(businessData);
  //     expect(result).toBeInstanceOf(Business);
  //     expect(result.id).toBe(businessData.id);
  //     expect(result.legalName).toBe(businessData.legalName);
  //     expect(result.cnpj).toBe(businessData.cnpj);
  //   });
  // });

  describe('findById', () => {
    // test('should find a business by id and return domain entity', async () => {
    //   const mockBusinessRecord = {
    //     ...businessData,
    //     toJSON: () => businessData
    //   };
      
    //   mockBusinessModel.findByPk.mockResolvedValue(mockBusinessRecord);
      
    //   const result = await repository.findById(1);
      
    //   expect(mockBusinessModel.findByPk).toHaveBeenCalledWith(1);
    //   expect(result).toBeInstanceOf(Business);
    //   expect(result.id).toBe(businessData.id);
    // });
    
    test('should return null when business not found', async () => {
      mockBusinessModel.findByPk.mockResolvedValue(null);
      
      const result = await repository.findById(999);
      
      expect(mockBusinessModel.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('findByCnpj', () => {
    test('should find a business by CNPJ and return domain entity', async () => {
      const mockBusinessRecord = {
        ...businessData,
        toJSON: () => businessData
      };
      
      mockBusinessModel.findOne.mockResolvedValue(mockBusinessRecord);
      
      const result = await repository.findByCnpj('12345678000199');
      
      expect(mockBusinessModel.findOne).toHaveBeenCalledWith({
        where: { cnpj: '12345678000199' }
      });
      expect(result).toBeInstanceOf(Business);
      expect(result.cnpj).toBe('12345678000199');
    });
    
    test('should return null when business not found by CNPJ', async () => {
      mockBusinessModel.findOne.mockResolvedValue(null);
      
      const result = await repository.findByCnpj('99999999000199');
      
      expect(mockBusinessModel.findOne).toHaveBeenCalledWith({
        where: { cnpj: '99999999000199' }
      });
      expect(result).toBeNull();
    });
  });

  // describe('findAll', () => {
  //   test('should return all businesses as domain entities', async () => {
  //     const mockBusinessRecords = [
  //       {
  //         ...businessData,
  //         id: 1,
  //         toJSON: () => ({ ...businessData, id: 1 })
  //       },
  //       {
  //         ...businessData,
  //         id: 2,
  //         cnpj: '98765432000199',
  //         appName: 'Outro App',
  //         toJSON: () => ({ ...businessData, id: 2, cnpj: '98765432000199', appName: 'Outro App' })
  //       }
  //     ];
      
  //     mockBusinessModel.findAll.mockResolvedValue(mockBusinessRecords);
      
  //     const results = await repository.findAll();
      
  //     expect(mockBusinessModel.findAll).toHaveBeenCalled();
  //     expect(results).toHaveLength(2);
  //     expect(results[0]).toBeInstanceOf(Business);
  //     expect(results[1]).toBeInstanceOf(Business);
  //     expect(results[0].id).toBe(1);
  //     expect(results[1].id).toBe(2);
  //     expect(results[1].cnpj).toBe('98765432000199');
  //   });
  // });

  // describe('findActiveBusinesses', () => {
  //   test('should find active businesses and return domain entities', async () => {
  //     const mockBusinessRecords = [
  //       {
  //         ...businessData,
  //         id: 1,
  //         status: 1,
  //         toJSON: () => ({ ...businessData, id: 1, status: 1 })
  //       },
  //       {
  //         ...businessData,
  //         id: 2,
  //         cnpj: '98765432000199',
  //         status: 1,
  //         toJSON: () => ({ ...businessData, id: 2, cnpj: '98765432000199', status: 1 })
  //       }
  //     ];
      
  //     mockBusinessModel.findAll.mockResolvedValue(mockBusinessRecords);
      
  //     const results = await repository.findActiveBusinesses();
      
  //     expect(mockBusinessModel.findAll).toHaveBeenCalledWith({
  //       where: { status: 1 }
  //     });
  //     expect(results).toHaveLength(2);
  //     expect(results[0]).toBeInstanceOf(Business);
  //     expect(results[1]).toBeInstanceOf(Business);
  //     expect(results[0].status).toBe(1);
  //     expect(results[1].status).toBe(1);
  //   });
  // });

  // describe('update', () => {
  //   test('should update a business and return domain entity', async () => {
  //     const updateData = { 
  //       legalName: 'Nova Empresa LTDA', 
  //       delivery: false 
  //     };
  //     const updatedBusinessData = { ...businessData, ...updateData };
  //     const mockBusinessRecord = {
  //       ...updatedBusinessData,
  //       toJSON: () => updatedBusinessData
  //     };
      
  //     mockBusinessModel.update.mockResolvedValue([1]);
  //     mockBusinessModel.findByPk.mockResolvedValue(mockBusinessRecord);
      
  //     const result = await repository.update(1, updateData);
      
  //     expect(mockBusinessModel.update).toHaveBeenCalledWith(updateData, { where: { id: 1 } });
  //     expect(mockBusinessModel.findByPk).toHaveBeenCalledWith(1);
  //     expect(result).toBeInstanceOf(Business);
  //     expect(result.legalName).toBe(updateData.legalName);
  //     expect(result.delivery).toBe(updateData.delivery);
  //   });
  // });

  // describe('delete', () => {
  //   test('should return true when business successfully deleted', async () => {
  //     mockBusinessModel.destroy.mockResolvedValue(1);
      
  //     const result = await repository.delete(1);
      
  //     expect(mockBusinessModel.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
  //     expect(result).toBe(true);
  //   });
    
  //   test('should return false when business not found for deletion', async () => {
  //     mockBusinessModel.destroy.mockResolvedValue(0);
      
  //     const result = await repository.delete(999);
      
  //     expect(mockBusinessModel.destroy).toHaveBeenCalledWith({ where: { id: 999 } });
  //     expect(result).toBe(false);
  //   });
  // });
});