import Bag from '../../domain/entities/Bag.js';
import AppError from '../../infrastructure/errors/AppError.js';

class BagService {
  constructor(bagRepository) {
    this.bagRepository = bagRepository;
  }

  async createBag(bagData) {
    return await this.bagRepository.create(bagData);
  }

  async getBag(id) {
    const bag = await this.bagRepository.findById(id);
    if (!bag) {
      throw AppError.notFound('Sacola', id);
    }
    return bag;
  }

  async getAllBags() {
    return await this.bagRepository.findAll();
  }

  async updateBag(id, bagData) {
    const bag = await this.bagRepository.update(id, bagData);
    if (!bag) {
      throw AppError.notFound('Sacola', id);
    }
    return bag;
  }

  async deleteBag(id) {
    const result = await this.bagRepository.delete(id);
    if (!result) {
      throw AppError.notFound('Sacola', id);
    }
    return result;
  }

  async getBagsByCompanyId(companyId) {
    return await this.bagRepository.findByCompanyId(companyId);
  }

  async getActiveBagsByCompanyId(companyId) {
    return await this.bagRepository.findActiveByCompanyId(companyId);
  }

  async changeBagStatus(id, status) {
    if (typeof status === 'boolean') {
      status = status ? 1 : 0;
    }
    
    if (status !== 0 && status !== 1) {
      throw new AppError(
        'Status inválido. Deve ser 0 (inativo) ou 1 (ativo)', 
        'INVALID_STATUS'
      );
    }
    
    const bag = await this.bagRepository.findById(id);
    if (!bag) {
      throw AppError.notFound('Sacola', id);
    }
    
    return await this.bagRepository.update(id, { status });
  }
}

export default BagService;