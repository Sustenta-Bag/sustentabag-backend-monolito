class Favorite {
    constructor(idClient, idBusiness, idFavorite = null) {
        this.idFavorite = idFavorite;
        this.idClient = idClient;
        this.idBusiness = idBusiness;
    }

    delete() {
        this.idFavorite = null;
        this.idBusiness = null;
        this.idClient = null;
        return this;
    }
}

export default Favorite;