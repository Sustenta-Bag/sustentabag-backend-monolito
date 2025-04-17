const PostgresBagRepository = require('../../../src/infrastructure/repositories/PostgresBagRepository');
const BagModel = require('../../../src/infrastructure/database/models/BagModel');
const Bag = require('../../../src/domain/entities/Bag');

jest.mock('../../../src/infrastructure/database/models/BagModel');

describe('PostgresBagRepository', () => {
  let postgresBagRepository;
  
  const mockBagData = {
    id: 1,
    type: 'Doce',
    price: 10.99,
    description: 'Descrição da sacola',
    companyId: 2,
    status: 1,
    createdAt: new Date('2025-04-10T10:00:00Z')
  };
  
  const mockBagRecord = {
    id: mockBagData.id,
    type: mockBagData.type,
    price: mockBagData.price,
    description: mockBagData.description,
    companyId: mockBagData.companyId,
    status: mockBagData.status,
    createdAt: mockBagData.createdAt
  };

  beforeEach(() => {
    jest.clearAllMocks();
    postgresBagRepository = new PostgresBagRepository();
  });

  describe('create', () => {
    test('deve criar uma nova sacola no banco e retornar a entidade de domínio', async () => {
      BagModel.create.mockResolvedValue(mockBagRecord);

      const result = await postgresBagRepository.create(mockBagData);

      expect(BagModel.create).toHaveBeenCalledWith(mockBagData);
      expect(result).toBeInstanceOf(Bag);
      expect(result.id).toBe(mockBagData.id);
      expect(result.type).toBe(mockBagData.type);
      expect(result.price).toBe(mockBagData.price);
      expect(result.description).toBe(mockBagData.description);
      expect(result.companyId).toBe(mockBagData.companyId);
      expect(result.status).toBe(mockBagData.status);
    });
  });

  describe('findById', () => {
    test('deve encontrar uma sacola pelo ID', async () => {
      BagModel.findByPk.mockResolvedValue(mockBagRecord);

      const result = await postgresBagRepository.findById(1);

      expect(BagModel.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBeInstanceOf(Bag);
      expect(result.id).toBe(mockBagData.id);
    });

    test('deve retornar null quando a sacola não for encontrada', async () => {
      BagModel.findByPk.mockResolvedValue(null);

      const result = await postgresBagRepository.findById(999);

      expect(BagModel.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    test('deve retornar todas as sacolas', async () => {
      const mockRecords = [mockBagRecord, { ...mockBagRecord, id: 2 }];
      BagModel.findAll.mockResolvedValue(mockRecords);

      const result = await postgresBagRepository.findAll();

      expect(BagModel.findAll).toHaveBeenCalled();
      expect(result.length).toBe(2);
      expect(result[0]).toBeInstanceOf(Bag);
      expect(result[0].id).toBe(mockBagData.id);
      expect(result[1].id).toBe(2);
    });
  });

  describe('update', () => {
    test('deve atualizar uma sacola existente', async () => {
      const updateData = { price: 15.99 };
      const updatedRecord = { ...mockBagRecord, price: 15.99 };
      
      BagModel.update.mockResolvedValue([1]);
      BagModel.findByPk.mockResolvedValue(updatedRecord)

      const result = await postgresBagRepository.update(1, updateData);

      expect(BagModel.update).toHaveBeenCalledWith(updateData, { where: { id: 1 } });
      expect(BagModel.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBeInstanceOf(Bag);
      expect(result.price).toBe(15.99);
    });

    test('deve retornar null quando a sacola não existir', async () => {
      const updateData = { price: 15.99 };
      
      BagModel.update.mockResolvedValue([1]); 
      BagModel.findByPk.mockResolvedValue(null);

      const result = await postgresBagRepository.update(999, updateData);

      expect(BagModel.update).toHaveBeenCalledWith(updateData, { where: { id: 999 } });
      expect(BagModel.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    test('deve excluir uma sacola existente', async () => {
      BagModel.destroy.mockResolvedValue(1);

      const result = await postgresBagRepository.delete(1);

      expect(BagModel.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(true);
    });

    test('deve retornar false quando a sacola não existir', async () => {
      BagModel.destroy.mockResolvedValue(0);

      const result = await postgresBagRepository.delete(999);

      expect(BagModel.destroy).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(result).toBe(false);
    });
  });

  describe('findByCompanyId', () => {
    test('deve encontrar sacolas por ID da empresa', async () => {
      const mockRecords = [mockBagRecord, { ...mockBagRecord, id: 2 }];
      BagModel.findAll.mockResolvedValue(mockRecords);

      const result = await postgresBagRepository.findByCompanyId(2);

      expect(BagModel.findAll).toHaveBeenCalledWith({ where: { companyId: 2 } });
      expect(result.length).toBe(2);
      expect(result[0]).toBeInstanceOf(Bag);
      expect(result[0].companyId).toBe(2);
    });
  });

  describe('findActiveByCompanyId', () => {
    test('deve encontrar sacolas ativas por ID da empresa', async () => {
      const mockRecords = [mockBagRecord]; 
      BagModel.findAll.mockResolvedValue(mockRecords);

      const result = await postgresBagRepository.findActiveByCompanyId(2);

      expect(BagModel.findAll).toHaveBeenCalledWith({ 
        where: { companyId: 2, status: 1 } 
      });
      expect(result.length).toBe(1);
      expect(result[0]).toBeInstanceOf(Bag);
      expect(result[0].companyId).toBe(2);
      expect(result[0].status).toBe(1);
    });
  });
});