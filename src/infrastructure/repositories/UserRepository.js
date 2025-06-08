import User from '../../domain/entities/User.js';

class UserRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async create(userData) {
    const user = await this.userModel.create(userData);
    return this._mapToEntity(user);
  }

  async findById(id) {
    const user = await this.userModel.findByPk(id);
    if (!user) return null;
    return this._mapToEntity(user);
  }

  async findByEmail(email) {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) return null;
    return this._mapToEntity(user);
  }

  async findByEntityId(entityId, role) {
    const user = await this.userModel.findOne({ 
      where: { 
        entityId,
        role
      } 
    });
    if (!user) return null;
    return this._mapToEntity(user);
  }

  async update(id, userData) {
    await this.userModel.update(userData, { where: { id } });
    const updated = await this.userModel.findByPk(id);
    if (!updated) return null;
    return this._mapToEntity(updated);
  }

  async findByCliendIds(clientIds) {
    if (!clientIds || clientIds.length === 0) {
      return [];
    }
    
    const users = await this.userModel.findAll({
      where: {
        entityId: clientIds
      }
    });
    
    return users.map(user => this._mapToEntity(user));
  }

  async findByFirebaseId(firebaseId) {
    const user = await this.userModel.findOne({ where: { firebaseId } });
    if (!user) return null;
    return this._mapToEntity(user);
  }

  _mapToEntity(model) {
    return new User(
      model.id,
      model.email,
      model.password,
      model.role,
      model.entityId,
      model.active,
      model.firebaseId,
      model.fcmToken,
      model.createdAt,
      model.updatedAt
    );
  }
}

export default UserRepository;