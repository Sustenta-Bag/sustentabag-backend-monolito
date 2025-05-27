import favoriteRepository from './FavoriteRepository.js';
import Favorite from '../../domain/entities/Favorite.js';
import FavoriteModel from '../../domain/models/FavoriteModel.js';

class PostgresFavoriteRepository extends favoriteRepository {
    constructor(favoriteModel = FavoriteModel) {
        super();
        this.FavoriteModel = favoriteModel;
    }

    async create(favoriteData) {
        console.log(favoriteData)
        const favoriteRecord = await this.FavoriteModel.create(favoriteData);
        return this._mapToDomainEntity(favoriteRecord);
    }

    async delete(id) {
        const rows = await this.FavoriteModel.destroy({
            where: { idFavorite: id }
        });
        return rows > 0;
    }

    async findAll(options = {}) {
        const records = await this.FavoriteModel.findAll(options);
        return records.map(r => this._mapToDomainEntity(r));
    }

    _mapToDomainEntity(record) {
        return new Favorite(
            record.id,
            record.idBusiness,
            record.idUser
        );
    }
}

export default PostgresFavoriteRepository;