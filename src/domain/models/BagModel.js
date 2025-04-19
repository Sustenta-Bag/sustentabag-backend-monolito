import { Model, DataTypes } from 'sequelize';

class BagModel extends Model {
  static init(sequelizeInstance) {
    if (!sequelizeInstance) {
      throw new Error('É necessário fornecer uma instância do Sequelize para inicializar o modelo BagModel');
    }
    
    super.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'idSacola'
      },
      type: {
        type: DataTypes.STRING, 
        allowNull: false,
        field: 'tipo',
        validate: {
          isIn: [['Doce', 'Salgada', 'Mista']]
        }
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'preco'
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'descricao'
      },
      // companyId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   field: 'idEmpresa',
      //   references: {
      //     model: 'empresas',
      //     key: 'id'
      //   }
      // },
      companyId: {
        type: DataTypes.INTEGER,
        field: 'idEmpresa',
        allowNull: false, // Mude para true se for opcional
        // Remova ou modifique a referência abaixo se a tabela empresas não existir ainda
        // references: {
        //   model: 'empresas',
        //   key: 'id'
        // }
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
      tableName: 'sacolas',
      timestamps: true,
      schema: process.env.DB_SCHEMA || 'public' 
    });
    
    return this;
  }
  
  static associate(models) {
    if (models.CompanyModel) {
      this.belongsTo(models.CompanyModel, { 
        foreignKey: 'companyId',
        as: 'company'
      });
    }
  }
}

export default BagModel;