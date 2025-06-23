class reviewController {
  constructor(reviewService) {
    this.reviewService = reviewService;
  }

  async createReview(req, res, next) {
    /*
    #swagger.tags = ["Reviews"]
    #swagger.consumes = ['application/json']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        schema: { $ref: '#/components/schemas/Review' },
    }
    #swagger.responses[201]
    */
    try {
      const data = {
        ...req.body,
        idClient: req.user.entityId
      }
      await this.reviewService.createReview(data);
      return res.created();
    } catch(error) {
      next(error);
    }
  }

  async listReviews(req, res, next) {
    /*
    #swagger.tags = ["Reviews"]
    #swagger.consumes = ['application/json']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200]
    */
    try {
      const { page, limit, idClient, idBusiness, rating } = req.query;
      const reviews = await this.reviewService.listReviews({
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
        idClient: idClient ? parseInt(idClient) : null,
        idBusiness: idBusiness ? parseInt(idBusiness) : null,
        rating: rating ? parseInt(rating) : null
      });
      return res.ok(reviews);
    } catch(error) {
      next(error);
    } 
  }

  async deleteReview(req, res, next) {
    /*
    #swagger.tags = ["Reviews"]
    #swagger.consumes = ['application/json']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[204]
    */
    try {
      await this.reviewService.deleteReview(req.params.id);
      return res.no_content();
    } catch (error) {
      next(error) 
    }
  }
}

export default reviewController;