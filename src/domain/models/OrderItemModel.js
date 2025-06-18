import { Model, DataTypes } from 'sequelize';

class OrderItemModel extends Model {
  static init(sequelizeInstance) {
    if (!sequelizeInstance) {
      throw new Error('É necessário fornecer uma instância do Sequelize para inicializar o modelo OrderItemModel');
    }
    
    super.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'idItemPedido'
      },
      idOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'idPedido',
        references: {
          model: 'pedidos',
          key: 'idPedido'
        }
      },
      idBag: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'idSacola',
        references: {
          model: 'sacolas',
          key: 'idSacola'
        }
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: 'quantidade',
        validate: {
          min: 1
        }
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'preco',
        validate: {
          min: 0
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
      tableName: 'itens_pedido',
      timestamps: true,
      schema: process.env.DB_SCHEMA || 'public'
    });
    
    return this;
  }
  
  static associate(models) {
    if (models.OrderModel) {
      this.belongsTo(models.OrderModel, { 
        foreignKey: 'idOrder',
        as: 'order'
      });
    }
    
    if (models.BagModel) {
      this.belongsTo(models.BagModel, { 
        foreignKey: 'idBag',
        as: 'bag'
      });
    }
  }
}

export default OrderItemModel; 