class User {
  constructor(
    id,
    email,
    password,
    role,
    entityId,
    active = true,
    firebaseId = null,
    fcmToken = null,
    createdAt = new Date(),
    updatedAt = new Date()
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.role = role;
    this.entityId = entityId;
    this.active = active;
    this.firebaseId = firebaseId;
    this.fcmToken = fcmToken;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export default User;