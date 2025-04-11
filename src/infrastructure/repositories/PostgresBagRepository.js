const BagRepository = require('../../domain/repositories/BagRepository');
const Bag = require('../../domain/entities/Bag');
const BagModel = require('../database/models/BagModel');

class PostgresBagRepository extends BagRepository {
  async create(bagData) {
    const bagRecord = await BagModel.create(bagData);
    return new Bag(
      bagRecord.id,
      bagRecord.type,
      bagRecord.price,
      bagRecord.description,
      bagRecord.companyId,
      bagRecord.status,
      bagRecord.createdAt
    );
  }

  async findById(id) {
    const bagRecord = await BagModel.findByPk(id);
    if (!bagRecord) return null;
    
    return new Bag(
      bagRecord.id,
      bagRecord.type,
      bagRecord.price,
      bagRecord.description,
      bagRecord.companyId,
      bagRecord.status,
      bagRecord.createdAt
    );
  }

  async findAll() {
    const bagRecords = await BagModel.findAll();
    return bagRecords.map(record => new Bag(
      record.id,
      record.type,
      record.price,
      record.description,
      record.companyId,
      record.status,
      record.createdAt
    ));
  }

  async update(id, bagData) {
    // Primeiro atualiza o registro
    await BagModel.update(bagData, {
      where: { id }
    });
    
    // Depois recupera o registro atualizado
    const bagRecord = await BagModel.findByPk(id);
    if (!bagRecord) return null;

    return new Bag(
      bagRecord.id,
      bagRecord.type,
      bagRecord.price,
      bagRecord.description,
      bagRecord.companyId,
      bagRecord.status,
      bagRecord.createdAt
    );
  }

  async delete(id) {
    const deleted = await BagModel.destroy({
      where: { id }
    });
    return deleted > 0;
  }

  async findByCompanyId(companyId) {
    const bagRecords = await BagModel.findAll({
      where: { companyId }
    });
    
    return bagRecords.map(record => new Bag(
      record.id,
      record.type,
      record.price,
      record.description,
      record.companyId,
      record.status,
      record.createdAt
    ));
  }

  async findActiveByCompanyId(companyId) {
    const bagRecords = await BagModel.findAll({
      where: { 
        companyId,
        status: 1
      }
    });
    
    return bagRecords.map(record => new Bag(
      record.id,
      record.type,
      record.price,
      record.description,
      record.companyId,
      record.status,
      record.createdAt
    ));
  }
}

module.exports = PostgresBagRepository;