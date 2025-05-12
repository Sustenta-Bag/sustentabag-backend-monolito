import { Sequelize } from 'sequelize';

async function up(sequelize) {
  await sequelize.query(`
    ALTER TABLE "Endereco"
    ADD COLUMN IF NOT EXISTS "Latitude" FLOAT,
    ADD COLUMN IF NOT EXISTS "Longitude" FLOAT;
  `);
}

async function down(sequelize) {
  await sequelize.query(`
    ALTER TABLE "Endereco"
    DROP COLUMN IF EXISTS "Latitude",
    DROP COLUMN IF EXISTS "Longitude";
  `);
}

export { up, down };
