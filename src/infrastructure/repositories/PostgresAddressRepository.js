import AddressRepository from './AddressRepository.js';
import Address from '../../domain/entities/Address.js';
import AdressModel from '../../domain/models/AddressModel.js';

class PostgresAddressRepository extends AddressRepository {
  constructor(addressModel = AdressModel) {
    super();
    this.AddressModel = addressModel;
  }

  async create(addressData) {
    const record = await this.AddressModel.create(addressData);
    return this._mapToDomainEntity(record);
  }

  async findById(id) {
    const record = await this.AddressModel.findByPk(id);
    if (!record) return null;
    return this._mapToDomainEntity(record);
  }

  async findAll(options = {}) {
    const records = await this.AddressModel.findAll(options);
    return records.map(r => this._mapToDomainEntity(r));
  }

  async findAndCountAll({ where = {}, offset = 0, limit = 10 } = {}) {
    const { count, rows } = await this.AddressModel.findAndCountAll({ where, offset, limit });
    return {
      count,
      rows: rows.map(r => this._mapToDomainEntity(r))
    };
  }

  async findByUnique({ ZipCode, City, Street, Number }) {
    const record = await this.AddressModel.findOne({
      where: { ZipCode, City, Street, Number }
    });
    if (!record) return null;
    return this._mapToDomainEntity(record);
  }

  async update(id, addressData) {
    await this.AddressModel.update(addressData, {
      where: { id: id }
    });
    const record = await this.AddressModel.findByPk(id);
    if (!record) return null;
    return this._mapToDomainEntity(record);
  }

  async delete(id) {
    const rows = await this.AddressModel.destroy({
      where: { id: id }
    });
    return rows > 0;
  }
  _mapToDomainEntity(record) {
    return new Address(
      record.id,
      record.zipCode,
      record.state,
      record.city,
      record.street,
      record.number,
      record.complement,
      record.latitude,
      record.longitude,
      record.status,
      record.createdAt
    );
  }
}

export default PostgresAddressRepository;