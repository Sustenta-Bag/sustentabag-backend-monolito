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
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            idBusiness: { type: "integer", example: 1 }
                        },
                        required: ["idBusiness"]
                    }
                }
            }
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
};