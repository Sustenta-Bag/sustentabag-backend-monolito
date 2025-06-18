/**
 * Este arquivo configura as associações entre os modelos do Sequelize
 */

const setupAssociations = (models) => {
  console.log('Configurando associações entre modelos...');
  
  if (models.BusinessModel && models.AddressModel) {
    console.log('Configurando associação entre Business e Address');
    
    models.BusinessModel.belongsTo(models.AddressModel, {
      foreignKey: 'idAddress',
      targetKey: 'id',
      as: 'address'
    });
    
    models.AddressModel.hasMany(models.BusinessModel, {
      foreignKey: 'idAddress',
      sourceKey: 'id',
      as: 'businesses'
    });
  } else {
    console.warn('Não foi possível configurar associação entre Business e Address. Modelos não disponíveis.');
  }
  
  if (models.ClientModel && models.AddressModel) {
    console.log('Configurando associação entre Client e Address');
    
    models.ClientModel.belongsTo(models.AddressModel, {
      foreignKey: 'idAddress',
      targetKey: 'id',
      as: 'address'
    });
    
    models.AddressModel.hasMany(models.ClientModel, {
      foreignKey: 'idAddress',
      sourceKey: 'id',
      as: 'clients'
    });
  } else {
    console.warn('Não foi possível configurar associação entre Client e Address. Modelos não disponíveis.');
  }

  if (models.OrderModel && models.OrderItemModel) {
    console.log('Configurando associação entre Order e OrderItem');
    
    models.OrderModel.hasMany(models.OrderItemModel, {
      foreignKey: 'idOrder',
      as: 'items'
    });
    
    models.OrderItemModel.belongsTo(models.OrderModel, {
      foreignKey: 'idOrder',
      as: 'order'
    });
  } else {
    console.warn('Não foi possível configurar associação entre Order e OrderItem. Modelos não disponíveis.');
  }

  if (models.OrderModel && models.UserModel) {
    console.log('Configurando associação entre Order e Client');
    
    models.OrderModel.belongsTo(models.UserModel, {
      foreignKey: 'idClient',
      as: 'client'
    });
    
    models.UserModel.hasMany(models.OrderModel, {
      foreignKey: 'idClient',
      as: 'orders'
    });
  } else {
    console.warn('Não foi possível configurar associação entre Order e Client. Modelos não disponíveis.');
  }

  if (models.OrderModel && models.BusinessModel) {
    console.log('Configurando associação entre Order e Business');
    
    models.OrderModel.belongsTo(models.BusinessModel, {
      foreignKey: 'idBusiness',
      as: 'business'
    });
    
    models.BusinessModel.hasMany(models.OrderModel, {
      foreignKey: 'idBusiness',
      as: 'orders'
    });
  } else {
    console.warn('Não foi possível configurar associação entre Order e Business. Modelos não disponíveis.');
  }

  if (models.OrderItemModel && models.BagModel) {
    console.log('Configurando associação entre OrderItem e Bag');
    
    models.OrderItemModel.belongsTo(models.BagModel, {
      foreignKey: 'idBag',
      as: 'bag'
    });
    
    models.BagModel.hasMany(models.OrderItemModel, {
      foreignKey: 'idBag',
      as: 'orderItems'
    });
  } else {
    console.warn('Não foi possível configurar associação entre OrderItem e Bag. Modelos não disponíveis.');
  }

  if (models.BagModel && models.BusinessModel) {
    console.log('Configurando associação entre Bag e Business');
    
    models.BagModel.belongsTo(models.BusinessModel, {
      foreignKey: 'idBusiness',
      as: 'business'
    });
    
    models.BusinessModel.hasMany(models.BagModel, {
      foreignKey: 'idBusiness',
      as: 'bags'
    });
  } else {
    console.warn('Não foi possível configurar associação entre Bag e Business. Modelos não disponíveis.');
  }

  if (models.FavoriteModel && models.BusinessModel) {
    console.log('Configurando associação entre Favorite e Business');
    
    models.FavoriteModel.belongsTo(models.BusinessModel, {
      foreignKey: 'idBusiness',
      as: 'business'
    });
    
    models.BusinessModel.hasMany(models.FavoriteModel, {
      foreignKey: 'idBusiness',
      as: 'favorites'
    });
  } else {
    console.warn('Não foi possível configurar associação entre Favorite e Business. Modelos não disponíveis.');
  }

  if (models.FavoriteModel && models.ClientModel) {
    console.log('Configurando associação entre Favorite e Client');
    
    models.FavoriteModel.belongsTo(models.ClientModel, {
      foreignKey: 'idClient',
      as: 'client'
    });
    
    models.ClientModel.hasMany(models.FavoriteModel, {
      foreignKey: 'idClient',
      as: 'favorites'
    });
  } else {
    console.warn('Não foi possível configurar associação entre Favorite e Client. Modelos não disponíveis.');
  }

  if (models.ReviewModel && models.OrderModel) {
    console.log('Configurando associação entre Review e Order');
    
    models.ReviewModel.belongsTo(models.OrderModel, {
      foreignKey: 'idOrder',
      as: 'order'
    });
    
    models.OrderModel.hasOne(models.ReviewModel, {
      foreignKey: 'idOrder',
      as: 'review'
    });
  } else {
    console.warn('Não foi possível configurar associação entre Review e Business. Modelos não disponíveis.');
  }

  if (models.ReviewModel && models.ClientModel) {
    console.log('Configurando associação entre Review e Client');
    
    models.ReviewModel.belongsTo(models.ClientModel, {
      foreignKey: 'idClient',
      as: 'client'
    });
    
    models.ClientModel.hasMany(models.ReviewModel, {
      foreignKey: 'idClient',
      as: 'reviews'
    });
  } else {
    console.warn('Não foi possível configurar associação entre Review e Client. Modelos não disponíveis.');
  }
};

export default setupAssociations;
