import { Model, DataTypes } from 'sequelize';

class OrderModel extends Model {
  static init(sequelizeInstance) {
    if (!sequelizeInstance) {
      throw new Error('É necessário fornecer uma instância do Sequelize para inicializar o modelo OrderModel');
    }
    
    super.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'idPedido'
      },
      idClient: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'idCliente',
        references: {
          model: 'clientes',
          key: 'idCliente'
        }
      },
      idBusiness: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'idEmpresa',
        references: {
          model: 'empresas',
          key: 'idEmpresa'
        }
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pendente',
        field: 'status',
        validate: {
          isIn: [['pendente', 'confirmado', 'preparando', 'pronto', 'entregue', 'cancelado']]
        }
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'valorTotal'
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
      tableName: 'pedidos',
      timestamps: true,
      schema: process.env.DB_SCHEMA || 'public'
    });
    
    return this;
  }
  
  static associate(models) {
    if (models.ClientModel) {
      this.belongsTo(models.ClientModel, { 
        foreignKey: 'idClient',
        as: 'client'
      });
    }
    
    if (models.BusinessModel) {
      this.belongsTo(models.BusinessModel, { 
        foreignKey: 'idBusiness',
        as: 'business'
      });
    }
    
    if (models.OrderItemModel) {
      this.hasMany(models.OrderItemModel, {
        foreignKey: 'idOrder',
        as: 'items'
      });
    }
  }
}

export default OrderModel; 