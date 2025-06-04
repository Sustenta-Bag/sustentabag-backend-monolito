class Favorite {
    async create(review) {
        throw new Error('Método não implementado');
    }

    async findAll(options, idClient, idBusiness) {
        throw new Error('Método não implementado');
    }

    async findAndCountAll() {
        throw new Error('Método não implementado');
    }

    async delete(id) {
        throw new Error('Método não implementado');
    }
}

export default Favorite;