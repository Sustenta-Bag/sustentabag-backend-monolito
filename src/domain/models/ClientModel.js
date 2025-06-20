import { DataTypes, Model } from 'sequelize';

class ClientModel extends Model {
  static init(sequelize) {
    if (!sequelize) {
      throw new Error('É necessário fornecer uma instância do Sequelize para inicializar o modelo ClientModel');
    }

    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          field: 'idCliente'
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          field: 'nome'
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        cpf: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'telefone'
        },
        idAddress: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'idEndereco',
          references: {
            model: 'Endereco',
            key: 'idEndereco'
          }
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        createdAt: {
          type: DataTypes.DATE,
          field: 'dataCriacao'
        },
        updatedAt: {
          type: DataTypes.DATE,
          field: 'dataAtualizacao'
        }
      },      {
        sequelize,
        modelName: 'ClientModel',
        tableName: 'clientes',
        timestamps: true,
        createdAt: 'dataCriacao',
        updatedAt: 'dataAtualizacao',
        underscored: false // Garantir que não vai tentar usar snake_case
      }
    );
  }

  static associate(models) {
    if (models.AddressModel) {
      this.belongsTo(models.AddressModel, {
        foreignKey: 'idAddress',
        as: 'address'
      });
    }
  }
}

export default ClientModel;