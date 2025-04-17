import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.DB_NAME || 'sustentabag';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'postgres';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 5432;
const dbSchema = process.env.DB_SCHEMA || 'public';

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  schema: dbSchema,
  logging: process.env.NODE_ENV !== 'production',
  define: {
    timestamps: true,
    underscored: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

/**
 * Estabelece conexão com o banco de dados
 * @returns {Promise<boolean>} true se a conexão foi estabelecida com sucesso
 */
export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o PostgreSQL estabelecida com sucesso.');
    return true;
  } catch (error) {
    console.error('Não foi possível conectar ao PostgreSQL:', error);
    throw error;
  }
};

/**
 * Sincroniza os modelos com o banco de dados
 * @param {boolean} force Se true, recria todas as tabelas
 * @returns {Promise<boolean>} true se os modelos foram sincronizados com sucesso
 */
export const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('Modelos sincronizados com o banco de dados.');
    return true;
  } catch (error) {
    console.error('Erro ao sincronizar modelos:', error);
    throw error;
  }
};

export default {
  sequelize,
  connectDatabase,
  syncDatabase
}; 