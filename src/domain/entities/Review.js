class Review {
    constructor(idOrder, idClient, rating, comment = '', createdAt = new Date(), updatedAt = new Date(), idReview) {
        this.idReview = idReview;
        this.idClient = idClient;
        this.idOrder = idOrder;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    delete() {
        this.idClient = null;
        this.idOrder = null;
        this.rating = null;
        this.comment = '';
        this.createdAt = null;
        this.updatedAt = null;
        return this;
    }
}

export default Review;