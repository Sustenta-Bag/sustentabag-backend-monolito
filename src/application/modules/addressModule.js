import AddressModel from '../../domain/models/AddressModel.js';
import PostgresAddressRepository from '../../infrastructure/repositories/PostgresAddressRepository.js';

export const getAddressRepository = (sequelizeInstance) => {
    AddressModel.init(sequelizeInstance);
    return new PostgresAddressRepository(AddressModel);
};

export const initializeModels = (sequelizeInstance) => {
    if(!sequelizeInstance) {
        throw new Error('É necessário fornecer uma instância do Sequelize para inicializar os modelos');
    }
    AddressModel.init(sequelizeInstance);
    return {
        AddressModel
    };
}