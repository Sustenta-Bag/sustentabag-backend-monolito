import { Model, DataTypes } from 'sequelize';

class ClientModel extends Model {
  static init(sequelizeInstance) {
    if (!sequelizeInstance) {
      throw new Error('É necessário fornecer uma instância do Sequelize para inicializar o modelo ClientModel');
    }
    
    super.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
        unique: true,
        field: 'email',
        validate: {
          isEmail: true
        }
      },
      cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'cpf',
        validate: {
          is: /^\d{11}$/
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'senha'
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'telefone'
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
      },
      firebaseId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'firebase_id'
      },
    }, {
      sequelize: sequelizeInstance,
      tableName: 'clientes',
      timestamps: true,
      schema: process.env.DB_SCHEMA || 'public'
    });
    
    return this;
  }
}

export default ClientModel;