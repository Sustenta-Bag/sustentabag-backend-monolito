import BagRepository from './BagRepository.js';
import Bag from '../../domain/entities/Bag.js';
import BagModel from '../../domain/models/BagModel.js';

class PostgresBagRepository extends BagRepository {
  constructor(bagModel = BagModel) {
    super();
    this.BagModel = bagModel;
  }

  async create(bagData) {
    const bagRecord = await this.BagModel.create(bagData);
    return this._mapToDomainEntity(bagRecord);
  }

  async findById(id) {
    const bagRecord = await this.BagModel.findByPk(id);
    if (!bagRecord) return null;
    
    return this._mapToDomainEntity(bagRecord);
  }

  async findAll(where, limit = 10, offset = 0) {
    const { count, rows } = await this.BagModel.findAndCountAll({ where, offset, limit });
    return {
      count,
      rows: rows.map(r => this._mapToDomainEntity(r))
    }
  };

  async update(id, bagData) {
    await this.BagModel.update(bagData, {
      where: { id }
    });
    
    const bagRecord = await this.BagModel.findByPk(id);
    if (!bagRecord) return null;

    return this._mapToDomainEntity(bagRecord);
  }

  async delete(id) {
    const deleted = await this.BagModel.destroy({
      where: { id }
    });
    return deleted > 0;
  }
  
  _mapToDomainEntity(record) {
    return new Bag(
      record.id,
      record.type,
      record.price,
      record.description,
      record.idBusiness,
      record.status,
      record.tags,
      record.createdAt,
      record.updatedAt
    );
  }
}

export default PostgresBagRepository;