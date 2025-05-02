import BusinessRepository from './BusinessRepository.js';
import Business from '../../domain/entities/Business.js';
import Address from '../../domain/entities/Address.js';
import BusinessModel from '../../domain/models/BusinessModel.js';
import AddressModel from '../../domain/models/AddressModel.js';

class PostgresBusinessRepository extends BusinessRepository {
  constructor(businessModel = BusinessModel, addressModel = AddressModel) {
    super();
    this.BusinessModel = businessModel;
    this.AddressModel = addressModel;
  }

  async create(businessData) {
    const record = await this.BusinessModel.create(businessData);
    return this._mapToDomainEntity(record);
  }

  async findById(id) {
    const record = await this.BusinessModel.findByPk(id);
    if (!record) return null;
    return this._mapToDomainEntity(record);
  }

  async findByIdWithAddress(id) {
    const record = await this.BusinessModel.findByPk(id, {
      include: [{ model: this.AddressModel, as: 'address' }]
    });
    if (!record) return null;

    console.log(record);

    const business = this._mapToDomainEntity(record);

    if (record.address) {
      const addr = record.address;
      business.idAddress = new Address(
        addr.idAddress,
        addr.zipCode,
        addr.state,
        addr.city,
        addr.street,
        addr.number,
        addr.complement
      );
    }

    return business;
  }

  async findAll(options = {}) {
    const records = await this.BusinessModel.findAll(options);
    return records.map(r => this._mapToDomainEntity(r));
  }

  async findByCnpj(cnpj) {
    const record = await this.BusinessModel.findOne({
      where: { cnpj: cnpj }
    });
    if (!record) return null;
    return this._mapToDomainEntity(record);
  }

  async findActiveBusiness() {
    const records = await this.BusinessModel.findAll({
      where: { status: 1 }
    });
    return records.map(r => this._mapToDomainEntity(r));
  }

  async update(id, businessData) {
    await this.BusinessModel.update(businessData, {
      where: { idBusiness: id }
    });
    const record = await this.BusinessModel.findByPk(id);
    if (!record) return null;
    return this._mapToDomainEntity(record);
  }

  async delete(id) {
    const rows = await this.BusinessModel.destroy({
      where: { idBusiness: id }
    });
    return rows > 0;
  }

  _mapToDomainEntity(record) {
    return new Business(
      record.idBusiness,
      record.legalName,
      record.cnpj,
      record.appName,
      record.cellphone,
      record.description,
      record.logo,
      record.password,
      record.delivery,
      record.deliveryTax,
      record.idAddress,
      record.status,
      record.createdAt,
      record.updatedAt
    );
  }
}

export default PostgresBusinessRepository;