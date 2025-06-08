import Bag from '../../domain/entities/Bag.js';
import AppError from '../../infrastructure/errors/AppError.js';

class BagService {
  constructor(bagRepository, favoriteRepository, authRepository) {
    this.bagRepository = bagRepository;
    this.favoriteRepository = favoriteRepository;
    this.authRepository = authRepository;
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

  async getBagsByBusinessId(idBusiness) {
    return await this.bagRepository.findByBusinessId(idBusiness);
  }

  async getUsersFavoritesByBusinessId(idBusiness) {
    const favorites = await this.favoriteRepository.findByBusinessId(idBusiness);
    if (!favorites || favorites.length === 0) {
      throw AppError.notFound('Favoritos', `para o negócio ${idBusiness}`);
    }
    const clientIds = favorites.map(fav => fav.idClient);
    const users = await this.authRepository.findByCliendIds(clientIds);
    if (!users || users.length === 0) {
      throw AppError.notFound('Usuários', `favoritados para o negócio ${idBusiness}`);
    }
    return users.map(user => ({
      fcmToken: user.fcmToken
    }));
  }

  async getActiveBagsByBusinessId(idBusiness) {
    return await this.bagRepository.findActiveByBusinessId(idBusiness);
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