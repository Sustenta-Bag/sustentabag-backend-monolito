import { Model, DataTypes } from 'sequelize';

class AddressModel extends Model {
  static init(sequelizeInstance) {
    if (!sequelizeInstance) {
      throw new Error('É necessário fornecer uma instância do Sequelize para inicializar o modelo AddressModel');
    }

    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'idEndereco'
      },
      zipCode: {
        type: DataTypes.STRING(8),
        allowNull: false,
        field: 'CEP',
        validate: {
          is: /^\d{5}-?\d{3}$/ 
        }
      },
      state: {
        type: DataTypes.STRING(2),
        allowNull: false,
        field: 'Estado',
        validate: {
          is: /^[A-Z]{2}$/ 
        }
      },
      city: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'Cidade'
      },
      street: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'Rua'
      },
      number: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: 'Numero',
        validate: {
          is: /^\d+$/ 
        }
      },      complement: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'Complemento'
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: 'Latitude'
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: 'Longitude'
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
        field: 'status',
        validate: {
          isIn: [[0, 1]]
        }
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'dataCriacao'
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'dataAtualizacao'
      }
    }, {
      sequelize: sequelizeInstance,
      tableName: 'Endereco',
      timestamps: false,
      schema: process.env.DB_SCHEMA || 'public'
    });

    return this;
  }

}

export default AddressModel;