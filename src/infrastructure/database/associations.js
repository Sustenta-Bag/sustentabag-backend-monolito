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
  
};

export default setupAssociations;
