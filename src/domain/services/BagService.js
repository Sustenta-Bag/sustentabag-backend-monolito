async createBag(bagData, entityId) {
  try {
    const { error, value } = BagDTO.validate(bagData);
    if (error) throw new Error(error.details[0].message);

    const bag = await BagModel.create({
      type: value.type,
      price: value.price,
      description: value.description,
      idBusiness: entityId,
      status: value.status,
      tags: value.tags,
      createdAt: value.createdAt,
      updatedAt: value.updatedAt
    });

    return bag;
  } catch (error) {
    throw new Error(`Erro ao criar sacola: ${error.message}`);
  }
}

async updateBag(id, bagData, entityId) {
  try {
    const { error, value } = BagDTO.validate(bagData, { abortEarly: false });
    if (error) throw new Error(error.details[0].message);

    const bag = await BagModel.findOne({
      where: { 
        id,
        idBusiness: entityId 
      }
    });
    
    if (!bag) throw new Error('Sacola não encontrada');

    await bag.update({
      type: value.type,
      price: value.price,
      description: value.description,
      status: value.status,
      tags: value.tags,
      updatedAt: value.updatedAt
    });

    return bag;
  } catch (error) {
    throw new Error(`Erro ao atualizar sacola: ${error.message}`);
  }
} 