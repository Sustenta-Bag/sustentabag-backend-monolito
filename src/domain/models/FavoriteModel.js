import { Model } from 'sequelize';

class FavoriteModel extends Model {
    static init(sequelizeInstance) {
        if (!sequelizeInstance) {
            throw new Error('É necessário fornecer uma instância do Sequelize para inicializar o modelo FavoriteModel');
        }

        super.init({
            idFavorite: {
                type: sequelizeInstance.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                field: 'idFavorito'
            },
            idClient: {
                type: sequelizeInstance.Sequelize.INTEGER,
                allowNull: false,
                field: 'idCliente'
            },
            idBusiness: {
                type: sequelizeInstance.Sequelize.INTEGER,
                allowNull: false,
                field: 'idEmpresa'
            }
        }, {
            sequelize: sequelizeInstance,
            tableName: 'favoritos',
            timestamps: false
        });

        return this;
    }

    static associations(models) {
        if(models.BusinessModel) {
            this.belongsTo(models.BusinessModel, {
                foreignKey: 'idBusiness',
                as: 'business',
                onDelete: 'CASCADE'
            });
        }

        if(models.ClientModel) {
            this.belongsTo(models.ClientModel, {
                foreignKey: 'idClient',
                as: 'client',
                onDelete: 'CASCADE'
            });
        }
    }
}

export default FavoriteModel;