const { Model, DataTypes } = require('sequelize');

class BagModel extends Model {
  static init(sequelizeInstance) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'idSacola'
      },
      type: {
        type: DataTypes.STRING, // Usando STRING em vez de ENUM para compatibilidade com SQLite
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
        type: DataTypes.INTEGER, // Usando INTEGER em vez de SMALLINT para compatibilidade com SQLite
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
      timestamps: true
    });
    
    return this;
  }
}

// Exportar a classe ao invés da instância do modelo
module.exports = BagModel;