import Favorite from '../../domain/entities/Favorite.js';

class FavoriteService {
    constructor(favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }

    async createFavorite(data) {
        const favorite = new Favorite(undefined, data.idBusiness, data.idClient);
        return await this.favoriteRepository.create(favorite);
    }

    async listFavorites({ page = 1, limit = 10, idClient }) {
        const offset = (page - 1) * limit;
        const options = { offset, limit };

        if (idClient) {
            options.where = { idClient };
        }

        return await this.favoriteRepository.findAll(options);
    }

    async deleteFavorite(id) {
        return await this.favoriteRepository.delete(id);
    }
}

export default FavoriteService;