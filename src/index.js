import { start } from './app.js';

// Set a different port to avoid conflicts
process.env.PORT = 4041;

// Start the application with database initialization
start(); 