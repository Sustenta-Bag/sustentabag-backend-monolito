const { Sequelize } = require('sequelize');
const BagModel = require('./models/BagModel');

const sequelize = new Sequelize(
  process.env.POSTGRES_DB || 'sacola_service',
  process.env.POSTGRES_USER || 'postgres',
  process.env.POSTGRES_PASSWORD || 'postgres',
  {
    host: process.env.POSTGRES_HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.POSTGRES_PORT || 5432,
    logging: process.env.NODE_ENV !== 'production',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Inicialização dos modelos
const initModels = () => {
  BagModel.init(sequelize);
  // Aqui você pode inicializar outros modelos, se existirem
};

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado ao PostgreSQL com sucesso');
    
    // Inicializa os modelos após a autenticação
    initModels();
    
  } catch (error) {
    console.error('Erro na conexão com PostgreSQL:', error);
    process.exit(1);
  }
};

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Banco de dados sincronizado com sucesso');
  } catch (error) {
    console.error('Erro na sincronização do banco de dados:', error);
    process.exit(1);
  }
};

module.exports = { 
  sequelize, 
  connectDatabase,
  syncDatabase,
  initModels
};