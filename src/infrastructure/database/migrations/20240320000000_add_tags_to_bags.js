export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('sacolas', 'tags', {
    type: Sequelize.JSONB,
    allowNull: true,
    comment: 'Array de tags de alérgenos possíveis na sacola'
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn('sacolas', 'tags');
}; 