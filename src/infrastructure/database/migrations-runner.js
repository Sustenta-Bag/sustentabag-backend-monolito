import { sequelize } from './connection.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigrations() {
  try {
    console.log('Starting database migrations...');
    
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.js'))
      .sort();

    let completedMigrations = [];
    try {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS migrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      const [results] = await sequelize.query('SELECT name FROM migrations');
      completedMigrations = results.map(row => row.name);
    } catch (error) {
      console.error('Error checking migrations table:', error);
    }    for (const file of migrationFiles) {
      if (!completedMigrations.includes(file)) {
        console.log(`Running migration: ${file}`);
        
        try {
          const migrationPath = path.join(migrationsDir, file);
          // Converter o caminho para formato de URL para ESM
          const fileUrl = `file://${migrationPath.replace(/\\/g, '/')}`;
          const migration = await import(fileUrl);
          await migration.up(sequelize);
          
          await sequelize.query('INSERT INTO migrations (name) VALUES ($1)', {
            bind: [file]
          });
          
          console.log(`Completed migration: ${file}`);
        } catch (err) {
          console.error(`Migration error: ${err}`);
          throw err;
        }
      } else {
        console.log(`Skipping already executed migration: ${file}`);
      }
    }
    
    console.log('Database migrations completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}

export { runMigrations };
