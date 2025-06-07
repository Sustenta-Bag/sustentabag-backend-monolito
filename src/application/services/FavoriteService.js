import Favorite from '../../domain/entities/Favorite.js';

class FavoriteService {
    constructor(favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }

    async createFavorite(data) {
        const existing = await this.favoriteRepository.findAll({
            where: {
                idClient: data.idClient,
                idBusiness: data.idBusiness
            }
        });
        if(existing && existing.length > 0) {
            throw new Error('Favorite already exists for this client and business');
        }
        const favorite = new Favorite(data.idClient, data.idBusiness);
        return await this.favoriteRepository.create(favorite);
    }

    async listFavorites({ page = 1, limit = 10, idClient}) {
        const offset = (page - 1) * limit;
        const options = { offset, limit };

        return await this.favoriteRepository.findAll(options, idClient);
    }

    async deleteFavorite(id) {
        return await this.favoriteRepository.delete(id);
    }

    async deleteFavoriteByBusiness(idBusiness, idClient) {
        const favorites = await this.favoriteRepository.findAll({
            where: {
                idBusiness: idBusiness,
                idClient: idClient
            }
        });
        
        if (!favorites || favorites.length === 0) {
            throw new Error('No favorite found for the given business and client');
        }

        const favorite = favorites[0]
        return await this.favoriteRepository.delete(favorite.idFavorite);
    }
}

export default FavoriteService;