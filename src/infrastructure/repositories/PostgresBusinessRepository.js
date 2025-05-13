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
  }  async findByIdWithAddress(id) {
    try {
      // Verificando se a associação está configurada
      if (!this.BusinessModel.associations || !this.BusinessModel.associations.address) {
        console.warn('Associação entre Business e Address não encontrada. Tentando configurar manualmente...');
        
        // Tenta configurar a associação manualmente, caso não esteja configurada
        this.BusinessModel.belongsTo(this.AddressModel, {
          foreignKey: 'idAddress',
          targetKey: 'id',
          as: 'address'
        });
      }
      
      const record = await this.BusinessModel.findByPk(id, {
        include: [{ 
          model: this.AddressModel, 
          as: 'address',
          required: false // Torna o join LEFT JOIN em vez de INNER JOIN
        }]
      });
      
      if (!record) return null;

      const business = this._mapToDomainEntity(record);

      if (record.address) {
        const addr = record.address;
        console.log(`Empresa ${business.id} tem endereço: ID=${addr.id}`);
        business.address = new Address(
          addr.id,
          addr.zipCode,
          addr.state,
          addr.city,
          addr.street,
          addr.number,
          addr.complement,
          addr.latitude,
          addr.longitude,
          addr.status,
          addr.createdAt
        );
      } else {
        console.log(`Empresa ${business.id} não tem endereço associado`);
      }

      return business;
    } catch (error) {
      console.error(`Erro ao buscar empresa ID=${id} com endereço:`, error);
      throw error;
    }
  }
  async findAllWithAddress() {
    try {
      // Verificando se a associação está configurada
      if (!this.BusinessModel.associations || !this.BusinessModel.associations.address) {
        console.warn('Associação entre Business e Address não encontrada. Tentando configurar manualmente...');
        
        // Tenta configurar a associação manualmente, caso não esteja configurada
        this.BusinessModel.belongsTo(this.AddressModel, {
          foreignKey: 'idAddress',
          targetKey: 'id',
          as: 'address'
        });
      }      const records = await this.BusinessModel.findAll({
        include: [{ 
          model: this.AddressModel, 
          as: 'address',
          required: false // Torna o join LEFT JOIN em vez de INNER JOIN
        }],
        where: { status: true } // Corrigido para boolean true
      });

      console.log(`Encontrados ${records.length} registros de empresas`);

      return records.map(record => {
        const business = this._mapToDomainEntity(record);
        
        if (record.address) {
          const addr = record.address;
          console.log(`Empresa ${business.id} tem endereço: ID=${addr.id}`);
          business.address = new Address(
            addr.id,
            addr.zipCode,
            addr.state,
            addr.city,
            addr.street,
            addr.number,
            addr.complement,
            addr.latitude,
            addr.longitude,
            addr.status,
            addr.createdAt
          );
        } else {
          console.log(`Empresa ${business.id} não tem endereço associado`);
        }
        
        return business;
      });
    } catch (error) {
      console.error('Erro ao buscar empresas com endereços:', error);
      throw error;
    }
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
      where: { status: true } // Corrigido para boolean true
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