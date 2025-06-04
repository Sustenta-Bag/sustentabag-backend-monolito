class reviewController {
  constructor(reviewService) {
    this.reviewService = reviewService;
  }

  async createReview(req, res, next) {
    try {
      const review = await this.reviewService.createReview(req.body);
      return res.status(201).json(review);
    } catch(error) {
      next(error);
    }
  }

  async listReviews(req, res, next) {
    try {
      const { page, limit, idClient, idBusiness } = req.query;
      const reviews = await this.reviewService.listReviews({
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
        idClient: idClient ? parseInt(idClient) : null,
        idBusiness: idBusiness ? parseInt(idBusiness) : null
      });
      return res.json(reviews);
    } catch(error) {
      next(error);
    } 
  }

  async deleteReview(req, res, next) {
    try {
      await this.reviewService.deleteReview(req.params.id);
      return res.status(204).send();
    } catch (error) {
      next(error) 
    }
  }
}

export default reviewController;