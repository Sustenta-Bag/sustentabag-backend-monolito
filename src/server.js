import http from "node:http";
import { app } from "./app.js";

/**
 * Trata erros no servidor
 */
const error = (err) => {
  console.error(`An error has occurred on start server\n ${err.message}`);
  throw err;
};

/**
 * Trata evento de inicialização do servidor
 */
const listening = () => {
  console.log(`Server running on port ${process.env.PORT || 4040}`);
};

/**
 * Inicia o servidor HTTP
 */
const startServer = () => {
  const server = http.createServer(app);
  server.listen(process.env.PORT || 4040);
  server.on("error", error);
  server.on("listening", listening);
  
  return server;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}

export default startServer;
