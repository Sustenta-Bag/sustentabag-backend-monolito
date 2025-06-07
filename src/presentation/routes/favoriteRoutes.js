import FavoriteController from "../controllers/favoriteController.js";
import FavoriteService from "../../application/services/FavoriteService.js";
import PostgresFavoriteRepository from "../../infrastructure/repositories/PostgresFavoriteRepository.js";
import {
    authenticate,
    requireClientRole
} from "../middleware/authMiddleware.js";

export const setupFavoriteRoutes = (router, options = {}) => {
    const favoriteRepository = options.favoriteRepository || new PostgresFavoriteRepository();
    const favoriteService = new FavoriteService(favoriteRepository);
    const favoriteController = new FavoriteController(favoriteService);

    router.get(
        /*
        #swagger.path = '/api/favorites'
        #swagger.tags = ["Favorites"]
        #swagger.consumes = ['application/json']
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['idClient'] = {
            in: 'query',
            description: 'ID of the client to filter favorites',
            required: false,
            type: 'integer'
        }
        #swagger.responses[201]
        */
        "/",
        authenticate,
        requireClientRole,
        favoriteController.listFavorites.bind(favoriteController)
    );

    router.post(
        /*
        #swagger.path = '/api/favorites'
        #swagger.tags = ["Favorites"]
        #swagger.consumes = ['application/json']
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.requestBody = {
            required: true,
            schema: { $ref: '#/components/schemas/Favorite' },
        }
        #swagger.responses[201]
        */
        "/",
        authenticate,
        requireClientRole,
        favoriteController.createFavorite.bind(favoriteController)
    );

    router.delete(
        /*
        #swagger.path = '/api/favorites/{id}'
        #swagger.tags = ["Favorites"]
        #swagger.consumes = ['application/json']
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID of the favorite to delete',
            required: true,
            type: 'integer'
        }
        #swagger.responses[204]
        */
        "/:id",
        authenticate,
        requireClientRole,
        favoriteController.deleteFavorite.bind(favoriteController)
    );

    router.delete(
        /*
        #swagger.path = '/api/favorites/business/{idBusiness}'
        #swagger.tags = ["Favorites"]
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['idBusiness'] = {
            in: 'path',
            description: 'ID of the business to delete',
            required: true,
            type: 'integer'
        }
        #swagger.responses[204]
        */
        "/business/:idBusiness",
        authenticate,
        requireClientRole,
        favoriteController.deleteFavoriteByBusiness.bind(favoriteController)
    )
};