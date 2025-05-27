class Favorite {
    constructor(id, idBusiness, idClient) {
        this.id = id;
        this.idBusiness = idBusiness;
        this.idClient = idClient;
    }

    delete() {
        this.id = null;
        this.idBusiness = null;
        this.idClient = null;
        return this;
    }
}

export default Favorite;