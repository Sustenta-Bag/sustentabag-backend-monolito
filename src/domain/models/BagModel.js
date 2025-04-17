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
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'idEmpresa'
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
  
  /**
   * Define associações com outros modelos no monolito
   * @param {Object} models - Objeto contendo todos os modelos do monolito
   */
  static associate(models) {
  }
}

export default BagModel;