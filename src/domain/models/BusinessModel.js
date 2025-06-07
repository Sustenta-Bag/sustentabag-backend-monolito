import { Model, DataTypes } from 'sequelize';

class BusinessModel extends Model {
  static init(sequelizeInstance) {
    if (!sequelizeInstance) {
      throw new Error('É necessário fornecer uma instância do Sequelize para inicializar o modelo BusinessModel');
    }

    super.init({
      idBusiness: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'idEmpresa'
      },
      legalName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'razaoSocial'
      },
      cnpj: {
        type: DataTypes.STRING(14),
        allowNull: false,
        unique: true,
        field: 'cnpj',
        validate: {
          is: /^\d{14}$/ 
        }
      },
      appName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'nomeApp'
      },
      cellphone: {
        type: DataTypes.STRING(11),
        allowNull: false,
        field: 'celular',
        validate: {
          is: /^\d{11}$/ 
        }
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'descricao'
      },
      logo: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'logo'
      },
      delivery: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'entrega'
      },
      deliveryTax: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: 'taxaEntrega'
      },
      deliveryTime: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'tempoEntrega'
      },
      openingHours: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'horarioFuncionamento'
      },
      idAddress: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'idEndereco',
        references: {
          model: 'Endereco',
          key: 'idEndereco'
        }
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'status'
      },
      firebaseId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'firebase_id'
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
      tableName: 'empresas',
      timestamps: false,
    });

    return this;
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

export default BusinessModel;
