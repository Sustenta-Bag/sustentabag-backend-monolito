class FavoriteController {
    constructor(favoriteService) {
        this.favoriteService = favoriteService;
    }

    async createFavorite(req, res, next) {
        try {
            const data = {
                ...req.body,
                idClient: req.user.entityId
            }
            await this.favoriteService.createFavorite(data);
            return res.created();
        } catch (error) {
            next(error);
        }
    }

    async listFavorites(req, res, next) {
        try {
            const { page, limit, idClient } = req.query;
            const favorites = await this.favoriteService.listFavorites({
                page: page ? parseInt(page) : 1,
                limit: limit ? parseInt(limit) : 10,
                idClient: idClient ? parseInt(idClient) : null
            });
            return res.ok(favorites);
        } catch(error) {
            next(error);
        }
    }

    async deleteFavorite(req, res, next) {
        try {
            await this.favoriteService.deleteFavorite(req.params.id);
            return res.no_content();
        } catch (error) {
            next(error);
        }
    }

    async deleteFavoriteByBusiness(req, res, next) {
        try {
            const idBusiness = parseInt(req.params.idBusiness, 10);
            const idClient = req.user.entityId;
            await this.favoriteService.deleteFavoriteByBusiness(idBusiness, idClient);
            return res.no_content();
        } catch (error) {
            next(error);
        }
    }
}

export default FavoriteController;