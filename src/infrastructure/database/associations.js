/**
 * Este arquivo configura as associações entre os modelos do Sequelize
 */

const setupAssociations = (models) => {
  console.log('Configurando associações entre modelos...');
  
  // Verifica se os modelos necessários existem
  if (models.BusinessModel && models.AddressModel) {
    console.log('Configurando associação entre Business e Address');
    
    // Define a associação de Business para Address (um negócio pertence a um endereço)
    models.BusinessModel.belongsTo(models.AddressModel, {
      foreignKey: 'idAddress',
      targetKey: 'id',
      as: 'address'
    });
    
    // Define a associação de Address para Business (um endereço pode ter muitos negócios)
    models.AddressModel.hasMany(models.BusinessModel, {
      foreignKey: 'idAddress',
      sourceKey: 'id',
      as: 'businesses'
    });
  } else {
    console.warn('Não foi possível configurar associação entre Business e Address. Modelos não disponíveis.');
  }
  
  // Pode adicionar outras associações aqui conforme necessário
};

export default setupAssociations;
