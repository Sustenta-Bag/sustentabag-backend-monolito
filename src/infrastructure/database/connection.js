import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.DB_NAME || 'sacola_service';
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

export const syncDatabase = async (force = false) => {
  try {
    console.log("Iniciando sincronização dos modelos com o banco de dados...");
    console.log("Modelos disponíveis:", Object.keys(sequelize.models));
    
    // Desativar restrições de chave estrangeira temporariamente
    await sequelize.query('SET CONSTRAINTS ALL DEFERRED');
    
    // Criar tabelas SEM dependências primeiro
    if (sequelize.models.User) {
      console.log("Sincronizando modelo de Usuários...");
      await sequelize.models.User.sync({ force });
    }
    
    if (sequelize.models.AddressModel) {
      console.log("Sincronizando modelo de Endereços...");
      await sequelize.models.AddressModel.sync({ force });
    }
    
    // Depois criar tabelas que têm dependências (mas não são dependidas por outras)
    if (sequelize.models.BusinessModel) {
      console.log("Sincronizando modelo de Empresas...");
      await sequelize.models.BusinessModel.sync({ force });
    }
    
    if (sequelize.models.ClientModel) {
      console.log("Sincronizando modelo de Clientes...");
      await sequelize.models.ClientModel.sync({ force });
    }
    
    // Por último, criar tabelas que dependem de outras
    if (sequelize.models.BagModel) {
      console.log("Sincronizando modelo de Sacolas...");
      await sequelize.models.BagModel.sync({ force });
    }
    
    // Reativar as restrições
    await sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
    
    console.log('Modelos sincronizados com o banco de dados com sucesso.');
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