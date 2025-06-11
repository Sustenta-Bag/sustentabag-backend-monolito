import AppError from '../../infrastructure/errors/AppError.js';
import { Op } from 'sequelize';

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

  async getAllBags(page, limit, filters) {
    if(!page || page < 1) page = 1;
    if(!limit) limit = 10;
    const offset = (page - 1) * limit;
    const business = filters?.idBusiness || null;
    const type = filters?.type || null;
    const where = {};
    if(business) {
      where.idBusiness = business;
    }
    if(type) {
      where.type = { [Op.iLike]: `%${type}%` };
    }
    const result = await this.bagRepository.findAll(offset, limit, where);
    return {
      total: result.count,
      pages: Math.ceil(result.count / limit),
      data: result.rows
    }
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