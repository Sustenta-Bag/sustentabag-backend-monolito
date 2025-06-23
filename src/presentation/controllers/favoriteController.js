class FavoriteController {
    constructor(favoriteService) {
        this.favoriteService = favoriteService;
    }

    async createFavorite(req, res, next) {
        /*
        #swagger.tags = ["Favorites"]
        #swagger.consumes = ['application/json']
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.requestBody = {
            required: true,
            schema: { $ref: '#/components/schemas/Favorite' },
        }
        #swagger.responses[201]
        */
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
        /*
        #swagger.tags = ["Favorites"]
        #swagger.consumes = ['application/json']
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.responses[201]
        */
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
        /*
        #swagger.tags = ["Favorites"]
        #swagger.consumes = ['application/json']
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.responses[204]
        */
        try {
            await this.favoriteService.deleteFavorite(req.params.id);
            return res.no_content();
        } catch (error) {
            next(error);
        }
    }

    async deleteFavoriteByBusiness(req, res, next) {
        /*
        #swagger.tags = ["Favorites"]
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.responses[204]
        */
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