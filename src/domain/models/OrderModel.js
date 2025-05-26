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
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'idUsuario',
        references: {
          model: 'usuarios',
          key: 'idUsuario'
        }
      },
      businessId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'idEmpresa',
        references: {
          model: 'empresas',
          key: 'idEmpresa'
        }
      },      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pendente',
        field: 'status',
        validate: {
          isIn: [['pendente', 'confirmado', 'preparando', 'pronto', 'entregue', 'cancelado']]
        }
      },totalAmount: {
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
    if (models.UserModel) {
      this.belongsTo(models.UserModel, { 
        foreignKey: 'userId',
        as: 'user'
      });
    }
    
    if (models.BusinessModel) {
      this.belongsTo(models.BusinessModel, { 
        foreignKey: 'businessId',
        as: 'business'
      });
    }
    
    if (models.OrderItemModel) {
      this.hasMany(models.OrderItemModel, {
        foreignKey: 'orderId',
        as: 'items'
      });
    }
  }
}

export default OrderModel; 