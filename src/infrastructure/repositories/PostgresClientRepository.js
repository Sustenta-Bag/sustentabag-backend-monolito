import ClientRepository from "./ClientRepository.js";
import Client from "../../domain/entities/Client.js";
import ClientModel from "../../domain/models/ClientModel.js";

class PostgresClientRepository extends ClientRepository {
  constructor(clientModel = ClientModel) {
    super();
    this.ClientModel = clientModel;
  }

  async create(clientData) {
    const clientRecord = await this.ClientModel.create(clientData);
    return this._mapToDomainEntity(clientRecord);
  }

  async findById(id) {
    const clientRecord = await this.ClientModel.findByPk(id);
    if (!clientRecord) return null;

    return this._mapToDomainEntity(clientRecord);
  }

  async findByCpf(cpf) {
    const clientRecord = await this.ClientModel.findOne({
      where: { cpf },
    });
    if (!clientRecord) return null;

    return this._mapToDomainEntity(clientRecord);
  }

  async findByEmail(email) {
    const clientRecord = await this.ClientModel.findOne({
      where: { email },
    });
    if (!clientRecord) return null;

    return this._mapToDomainEntity(clientRecord);
  }

  async findAll() {
    const clientRecords = await this.ClientModel.findAll();
    return clientRecords.map((record) => this._mapToDomainEntity(record));
  }

  async update(id, clientData) {
    await this.ClientModel.update(clientData, {
      where: { id },
    });

    const clientRecord = await this.ClientModel.findByPk(id);
    if (!clientRecord) return null;

    return this._mapToDomainEntity(clientRecord);
  }

  async delete(id) {
    const deleted = await this.ClientModel.destroy({
      where: { id },
    });
    return deleted > 0;
  }

  async findActiveClients() {
    const clientRecords = await this.ClientModel.findAll({
      where: { status: 1 },
    });

    return clientRecords.map((record) => this._mapToDomainEntity(record));
  }

  _mapToDomainEntity(record) {
    return new Client(
      record.id,
      record.name,
      record.email,
      record.cpf,
      record.password,
      record.phone,
      record.status,
      record.createdAt
    );
  }
}

export default PostgresClientRepository;
