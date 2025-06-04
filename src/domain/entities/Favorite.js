class Favorite {
    constructor(idBusiness, idClient) {
        this.idBusiness = idBusiness;
        this.idClient = idClient;
    }

    delete() {
        this.idBusiness = null;
        this.idClient = null;
        return this;
    }
}

export default Favorite;