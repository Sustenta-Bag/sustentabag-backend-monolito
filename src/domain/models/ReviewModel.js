import { Model, DataTypes } from 'sequelize';

class ReviewModel extends Model {
    static init(sequelizeInstance) {
        if(!sequelizeInstance) {
            throw new Error('É necessário fornecer uma instância do Sequelize para inicializar o modelo ReviewModel');
        }

        super.init({
            idReview: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                field: 'idAvaliacao'
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
            idOrder: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'idPedido',
                references: {
                    model: 'pedidos',
                    key: 'idPedido'
                }
            },
            rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'nota',
                validate: {
                    min: 1,
                    max: 5
                }
            },
            comment: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'comentario'
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
            tableName: 'avaliacoes',
            timestamps: true,
            schema: process.env.DB_SCHEMA || 'public',  
        });

        return this;
    }

    static associate(models) {
        if(models.ClientModel) {
            this.belongsTo(models.ClientModel, {
                foreignKey: 'idCliente',
                as: 'cliente'
            });
        }

        if(models.OrderModel) {
            this.belongsTo(models.OrderModel, {
                foreignKey: 'idPedido',
                as: 'order'
            });
        }
    }
}

export default ReviewModel;