class FavoriteController {
    constructor(favoriteService) {
        this.favoriteService = favoriteService;
    }

    async createFavorite(req, res, next) {
        try {
            const favorite = await this.favoriteService.createFavorite(req.body);
            return res.status(201).json(favorite);
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
            return res.json(favorites);
        } catch(error) {
            next(error);
        }
    }

    async deleteFavorite(req, res, next) {
        try {
            await this.favoriteService.deleteFavorite(req.params.id);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default FavoriteController;