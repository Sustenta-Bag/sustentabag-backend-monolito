import ClientRepository from "./ClientRepository.js";
import Client from "../../domain/entities/Client.js";
import Address from "../../domain/entities/Address.js";
import ClientModel from "../../domain/models/ClientModel.js";
import AddressModel from "../../domain/models/AddressModel.js";

class PostgresClientRepository extends ClientRepository {
  constructor(clientModel = ClientModel, addressModel = AddressModel) {
    super();
    this.ClientModel = clientModel;
    this.AddressModel = addressModel;
  }

  async create(clientData) {
    const clientRecord = await this.ClientModel.create(clientData);
    return this._mapToDomainEntity(clientRecord);
  }

  async getClient(where) {
    const clientRecord = await this.ClientModel.findOne({ where });
    if (!clientRecord) return null;

    return this._mapToDomainEntity(clientRecord);
  }

  async findByIdWithAddress(id) {
    try {
      if (!this.ClientModel.associations || !this.ClientModel.associations.address) {
        console.warn('Associação entre Client e Address não encontrada. Tentando configurar manualmente...');
        
        this.ClientModel.belongsTo(this.AddressModel, {
          foreignKey: 'idAddress',
          targetKey: 'id',
          as: 'address'
        });
      }
      
      const record = await this.ClientModel.findByPk(id, {
        include: [{ 
          model: this.AddressModel, 
          as: 'address',
          required: false
        }]
      });
      
      if (!record) return null;

      const client = this._mapToDomainEntity(record);

      if (record.address) {
        const addr = record.address;
        console.log(`Cliente ${client.id} tem endereço: ID=${addr.id}`);
        client.address = new Address(
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
        console.log(`Cliente ${client.id} não tem endereço associado`);
      }

      return client;
    } catch (error) {
      console.error(`Erro ao buscar cliente ID=${id} com endereço:`, error);
      throw error;
    }
  }

  async findAll(offset, limit, where = {}) {
    const { count, rows } = await this.ClientModel.findAndCountAll({
      where,
      offset,
      limit,
    });
    return {
      count,
      rows: rows.map(record => this._mapToDomainEntity(record))
    }
  }

  async findAllWithAddress() {
    try {
      if (!this.ClientModel.associations || !this.ClientModel.associations.address) {
        console.warn('Associação entre Client e Address não encontrada. Tentando configurar manualmente...');
        
        this.ClientModel.belongsTo(this.AddressModel, {
          foreignKey: 'idAddress',
          targetKey: 'id',
          as: 'address'
        });
      }
      
      const records = await this.ClientModel.findAll({
        include: [{ 
          model: this.AddressModel, 
          as: 'address',
          required: false
        }]
      });

      console.log(`Encontrados ${records.length} registros de clientes`);

      return records.map(record => {
        const client = this._mapToDomainEntity(record);
        
        if (record.address) {
          const addr = record.address;
          console.log(`Cliente ${client.id} tem endereço: ID=${addr.id}`);
          client.address = new Address(
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
          console.log(`Cliente ${client.id} não tem endereço associado`);
        }
        
        return client;
      });
    } catch (error) {
      console.error('Erro ao buscar clientes com endereços:', error);
      throw error;
    }
  }

  async findAllWithAddressAndCount(offset = 0, limit = 10, where = {}) {
    try {
      if (!this.ClientModel.associations || !this.ClientModel.associations.address) {
        console.warn('Associação entre Client e Address não encontrada. Tentando configurar manualmente...');
        
        this.ClientModel.belongsTo(this.AddressModel, {
          foreignKey: 'idAddress',
          targetKey: 'id',
          as: 'address'
        });
      }
      
      const { count, rows } = await this.ClientModel.findAndCountAll({
        where,
        offset,
        limit,
        include: [{ 
          model: this.AddressModel, 
          as: 'address',
          required: false
        }]
      });

      return {
        count,
        rows: rows.map(record => {
          const client = this._mapToDomainEntity(record);
          
          if (record.address) {
            const addr = record.address;
            console.log(`Cliente ${client.id} tem endereço: ID=${addr.id}`);
            client.address = new Address(
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
            console.log(`Cliente ${client.id} não tem endereço associado`);
          }
          
          return client;
        })
      }
    } catch (error) {
      console.error('Erro ao buscar clientes com endereços:', error);
      throw error;
    }
  }

  async update(id, clientData, options = {}) {
    await this.ClientModel.update(clientData, {
      where: { id },
    });

    if (options && options.includeAddress) {
      return this.findByIdWithAddress(id);
    } else {
      const clientRecord = await this.ClientModel.findByPk(id);
      if (!clientRecord) return null;
      
      return this._mapToDomainEntity(clientRecord);
    }
  }

  async delete(id) {
    return await this.ClientModel.destroy({
      where: { id },
    });
  }

  _mapToDomainEntity(record) {
    return new Client(
      record.id,
      record.name,
      record.email,
      record.cpf,
      record.phone,
      record.idAddress,
      record.status,
      record.createdAt,
      record.updatedAt,
    );
  }
}

export default PostgresClientRepository;
