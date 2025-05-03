import { Model, DataTypes } from 'sequelize';

class UserModel extends Model {
  static init(sequelizeInstance) {
    if (!sequelizeInstance) {
      throw new Error('É necessário fornecer uma instância do Sequelize para inicializar o modelo UserModel');
    }

    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'idUsuario'
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        field: 'email'
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'senha'
      },
      role: {
        type: DataTypes.ENUM('client', 'business', 'admin'),
        allowNull: false,
        field: 'tipo'
      },
      entityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'idEntidade'
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'ativo'
      },
      firebaseId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'firebaseId'
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
      tableName: 'usuarios', // Alterado para minúsculas
      timestamps: true,
      modelName: 'User' // Nome explícito do modelo
    });

    return this;
  }

  static associate(models) {
    // No direct associations as we're using a generic entityId with role distinction
  }
}

export default UserModel;