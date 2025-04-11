const BagService = require('../../../src/application/services/BagService');
const Bag = require('../../../src/domain/entities/Bag');

// Mock do repositório
const mockBagRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findByCompanyId: jest.fn(),
  findActiveByCompanyId: jest.fn()
};

const mockBag = new Bag(1, 'Doce', 10.99, 'Descrição da sacola', 2, 1);

describe('BagService', () => {
  let bagService;

  beforeEach(() => {
    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();
    
    // Inicializar o serviço com o repositório mockado
    bagService = new BagService(mockBagRepository);
  });

  describe('createBag', () => {
    test('deve chamar o método create do repositório com os dados corretos', async () => {
      const bagData = { 
        type: 'Doce', 
        price: 10.99, 
        description: 'Descrição da sacola', 
        companyId: 2 
      };
      mockBagRepository.create.mockResolvedValue(mockBag);

      const result = await bagService.createBag(bagData);

      expect(mockBagRepository.create).toHaveBeenCalledWith(bagData);
      expect(result).toBe(mockBag);
    });
  });

  describe('getBag', () => {
    test('deve retornar uma sacola quando ela existe', async () => {
      mockBagRepository.findById.mockResolvedValue(mockBag);

      const result = await bagService.getBag(1);

      expect(mockBagRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toBe(mockBag);
    });

    test('deve lançar erro quando a sacola não existe', async () => {
      mockBagRepository.findById.mockResolvedValue(null);

      await expect(bagService.getBag(999)).rejects.toThrow('Sacola não encontrada');
      expect(mockBagRepository.findById).toHaveBeenCalledWith(999);
    });
  });

  describe('getAllBags', () => {
    test('deve retornar todas as sacolas', async () => {
      const mockBags = [mockBag, { ...mockBag, id: 2 }];
      mockBagRepository.findAll.mockResolvedValue(mockBags);

      const result = await bagService.getAllBags();

      expect(mockBagRepository.findAll).toHaveBeenCalled();
      expect(result).toBe(mockBags);
    });
  });

  describe('updateBag', () => {
    test('deve atualizar uma sacola quando ela existe', async () => {
      const bagData = { price: 15.99 };
      const updatedBag = { ...mockBag, price: 15.99 };
      mockBagRepository.update.mockResolvedValue(updatedBag);

      const result = await bagService.updateBag(1, bagData);

      expect(mockBagRepository.update).toHaveBeenCalledWith(1, bagData);
      expect(result).toBe(updatedBag);
    });

    test('deve lançar erro quando a sacola não existe', async () => {
      mockBagRepository.update.mockResolvedValue(null);

      await expect(bagService.updateBag(999, { price: 15.99 }))
        .rejects.toThrow('Sacola não encontrada');
      expect(mockBagRepository.update).toHaveBeenCalledWith(999, { price: 15.99 });
    });
  });

  describe('deleteBag', () => {
    test('deve excluir uma sacola quando ela existe', async () => {
      mockBagRepository.delete.mockResolvedValue(true);

      const result = await bagService.deleteBag(1);

      expect(mockBagRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    test('deve lançar erro quando a sacola não existe', async () => {
      mockBagRepository.delete.mockResolvedValue(false);

      await expect(bagService.deleteBag(999)).rejects.toThrow('Sacola não encontrada');
      expect(mockBagRepository.delete).toHaveBeenCalledWith(999);
    });
  });

  describe('getBagsByCompanyId', () => {
    test('deve retornar sacolas de uma empresa específica', async () => {
      const mockBags = [mockBag, { ...mockBag, id: 2 }];
      mockBagRepository.findByCompanyId.mockResolvedValue(mockBags);

      const result = await bagService.getBagsByCompanyId(2);

      expect(mockBagRepository.findByCompanyId).toHaveBeenCalledWith(2);
      expect(result).toBe(mockBags);
    });
  });

  describe('getActiveBagsByCompanyId', () => {
    test('deve retornar sacolas ativas de uma empresa específica', async () => {
      const mockBags = [mockBag];
      mockBagRepository.findActiveByCompanyId.mockResolvedValue(mockBags);

      const result = await bagService.getActiveBagsByCompanyId(2);

      expect(mockBagRepository.findActiveByCompanyId).toHaveBeenCalledWith(2);
      expect(result).toBe(mockBags);
    });
  });

  describe('changeBagStatus', () => {
    test('deve alterar o status de uma sacola quando ela existe', async () => {
      mockBagRepository.findById.mockResolvedValue(mockBag);
      const updatedBag = { ...mockBag, status: 0 };
      mockBagRepository.update.mockResolvedValue(updatedBag);

      const result = await bagService.changeBagStatus(1, 0);

      expect(mockBagRepository.findById).toHaveBeenCalledWith(1);
      expect(mockBagRepository.update).toHaveBeenCalled();
      expect(result).toBe(updatedBag);
    });

    test('deve converter valor booleano true para 1', async () => {
      mockBagRepository.findById.mockResolvedValue(mockBag);
      const updatedBag = { ...mockBag, status: 1 };
      mockBagRepository.update.mockResolvedValue(updatedBag);

      await bagService.changeBagStatus(1, true);

      expect(mockBagRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({ status: 1 }));
    });

    test('deve converter valor booleano false para 0', async () => {
      mockBagRepository.findById.mockResolvedValue(mockBag);
      const updatedBag = { ...mockBag, status: 0 };
      mockBagRepository.update.mockResolvedValue(updatedBag);

      await bagService.changeBagStatus(1, false);

      expect(mockBagRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({ status: 0 }));
    });

    test('deve lançar erro quando a sacola não existe', async () => {
      mockBagRepository.findById.mockResolvedValue(null);

      await expect(bagService.changeBagStatus(999, 1)).rejects.toThrow('Sacola não encontrada');
    });
  });
});