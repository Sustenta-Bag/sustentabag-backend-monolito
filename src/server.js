import http from "node:http";
import app from "./app.js";
import { runMigrations } from './infrastructure/database/migrations-runner.js';

const error = (err) => {
  console.error(`An error has occurred on start server\n ${err.message}`);
  throw err;
};

const listening = () => {
  console.log(`Server running on port ${process.env.PORT || 4040}`);
};

const PORT = process.env.PORT || 4040;

async function startServer() {
  try {
    await runMigrations();
    
    const server = http.createServer(app);
    server.listen(PORT);
    server.on("error", error);
    server.on("listening", listening);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
console.log(`Documentação Swagger disponível em http://localhost:${PORT}/swagger`);
console.log(`Servidor rodando na porta ${PORT}`);