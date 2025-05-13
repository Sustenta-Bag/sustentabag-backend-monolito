FROM node:18-alpine AS build

# Diretório de trabalho
WORKDIR /app

# Copiar apenas arquivos de dependências para aproveitar o cache do Docker
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Estágio de produção
FROM node:18-alpine

# Definir variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=4041

# Diretório de trabalho
WORKDIR /app

# Copiar apenas as dependências do estágio de build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

# Copiar código-fonte
COPY src/ ./src/
COPY .env ./.env

# Verificar e copiar outros arquivos necessários
RUN mkdir -p ./uploads

# Criar script de inicialização
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "Verificando variáveis de ambiente do Firebase:"' >> /app/start.sh && \
    echo 'echo "FIREBASE_API_KEY presente: "' >> /app/start.sh && \
    echo 'echo "FIREBASE_AUTH_DOMAIN: "' >> /app/start.sh && \
    echo 'echo "FIREBASE_PROJECT_ID: "' >> /app/start.sh && \
    echo 'echo "FIREBASE_APP_ID presente: "' >> /app/start.sh && \
    echo 'echo "FIREBASE_CLIENT_EMAIL: "' >> /app/start.sh && \
    echo 'echo "FIREBASE_PRIVATE_KEY presente: "' >> /app/start.sh && \
    echo 'echo "Iniciando aplicação..."' >> /app/start.sh && \
    echo 'exec node src/server.js' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expor a porta da aplicação
EXPOSE 4041

# Executar o script de inicialização
CMD ["sh", "/app/start.sh"]
