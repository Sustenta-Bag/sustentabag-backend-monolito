class FavoriteRepository {
    async create(favorite) {
        throw new Error('Método não implementado');
    }

    async findAll(options, idClient) {
        throw new Error('Método não implementado');
    }

    async findAndCountAll() {
        throw new Error('Método não implementado');
    }

    async findByBusinessId(idBusiness) {
        throw new Error('Método não implementado');
    }

    async delete(id) {
        throw new Error('Método não implementado');
    }
}

export default FavoriteRepository;