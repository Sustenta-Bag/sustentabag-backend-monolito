# SustentaBag Backend Monolito

[![CI](https://github.com/Sustenta-Bag/sustentabag-backend-monolito/actions/workflows/ci.yml/badge.svg)](https://github.com/Sustenta-Bag/sustentabag-backend-monolito/actions/workflows/ci.yml)
[![Análise de Segurança](https://github.com/Sustenta-Bag/sustentabag-backend-monolito/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/Sustenta-Bag/sustentabag-backend-monolito/actions/workflows/codeql-analysis.yml)
[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue.svg)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-20.10+-blue.svg)](https://www.docker.com)
[![Licença](https://img.shields.io/badge/Licença-ISC-blue.svg)](LICENSE)

📊 **Estatísticas do Projeto:**
- 🧪 **Testes**: 100+ casos de teste unitários
- 📦 **Entidades**: 9 modelos de domínio  
- 🔥 **Endpoints**: APIs REST documentadas
- 🐳 **Containerizado**: Docker Compose

## 📋 Índice

- [⚡ Quick Start](#-quick-start)
- [🌟 Descrição](#-descrição)
- [🏗 Arquitetura](#-arquitetura)
- [🛠 Tecnologias](#-tecnologias)
- [📋 Pré-requisitos](#-pré-requisitos)
- [🚀 Instalação](#-instalação)
- [⚙️ Configuração](#-configuração)
- [💻 Uso](#-uso)
- [🔧 Solução de Problemas](#-solução-de-problemas)
- [👨‍💻 Desenvolvimento](#-desenvolvimento)
- [🧪 Testes](#-testes)
- [📚 Documentação](#-documentação)
- [🤝 Contribuição](#-contribuição)
- [💬 Suporte](#-suporte)
- [📄 Licença](#-licença)

## ⚡ Quick Start

Quer testar rapidamente? Execute estes comandos:

```bash
# Clone e configure
git clone https://github.com/Sustenta-Bag/sustentabag-backend-monolito.git
cd sustentabag-backend-monolito
cp .env.example .env

# Inicie com Docker (todos os serviços)
docker-compose up -d

# Aguarde ~30s e acesse:
# 📖 Documentação: http://localhost:4041/api-docs
# 🔍 Health Check: http://localhost:4041/health
# 🗄️ PgAdmin: http://localhost:5050
```

**Primeira vez?** Vá para [Instalação Completa](#-instalação) para configuração detalhada.

---

## 🌟 Descrição

O SustentaBag é um sistema inovador para gerenciamento de sacolas ecológicas, desenvolvido com foco em sustentabilidade e eficiência. O backend monolítico implementa uma arquitetura baseada em DDD (Domain-Driven Design) e integra-se com diversos serviços para fornecer uma solução completa de gestão.

### 🎯 Objetivos

- 🌱 Facilitar o gerenciamento de sacolas ecológicas
- ♻️ Promover práticas sustentáveis
- 🚀 Fornecer uma API robusta e escalável
- 💳 Integrar serviços de pagamento e notificação
- 🔒 Garantir rastreabilidade e segurança

### ✨ Funcionalidades Principais

#### Core Business
- 📦 Cadastro e gerenciamento de sacolas
- 👥 Gestão de usuários e autenticação
- 📊 Controle de estoque e pedidos
- 🚚 Rastreamento de entregas
- 📈 Relatórios e analytics

#### Serviços Integrados
- 🔔 Sistema de notificações em tempo real
- 💳 Processamento de pagamentos
- 📱 Autenticação via Firebase
- 📍 Geolocalização de entregas
- 📊 Monitoramento e métricas

## 🏗 Arquitetura

### Visão Geral do Sistema
```
┌─────────────────┐     ┌─────────────────┐
│   API Principal │     │  Frontend Web   │
│   (Monolito)    │◄───►│    (React)      │
└─────────────────┘     └─────────────────┘
        ▲                        ▲
        │                        │
        ▼                        ▼
┌─────────────────┐     ┌─────────────────┐
│   PostgreSQL    │     │    Firebase     │
└─────────────────┘     └─────────────────┘
```

### Componentes do Sistema

#### 1. 🎯 API Principal (Monolito)
- **Porta**: 4041
- **Responsabilidades**:
  - Implementa DDD para gerenciamento do core business
  - Gerencia sacolas, usuários e pedidos
  - Fornece endpoints REST documentados
  - Integra com Firebase para autenticação
  - Utiliza Mapbox para geolocalização
  - Autenticação via Firebase
  - Dashboard administrativo
  - Gestão de usuários

### Fluxo de Dados

1. **Autenticação e Autorização**
   ```
   Cliente → Frontend → Firebase Auth → API Principal
   ```

2. **Processamento de Pedidos**
   ```
   Cliente → API Principal → PostgreSQL
   ```

3. **Geolocalização**
   ```
   Cliente → API Principal → Mapbox API → Resposta com Coordenadas
   ```

### Persistência de Dados

- **PostgreSQL**: Dados principais e relacionamentos
- **Firebase**: Autenticação

## 🛠 Tecnologias

### Backend Principal
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| Node.js | v14+ | Runtime JavaScript |
| Express | ^5.1.0 | Framework Web |
| Sequelize | ^6.37.7 | ORM para PostgreSQL |
| Jest | ^29.7.0 | Framework de Testes |
| Swagger | ^5.0.1 | Documentação da API |
| JWT | ^9.0.2 | Autenticação |
| Express-validator | ^7.2.1 | Validação de Requisições |

### Serviços e Integrações
| Serviço | Versão | Descrição |
|---------|--------|-----------|
| PostgreSQL | 14 | Banco de Dados Principal |
| Firebase | ^11.6.0 | Autenticação |
| Mapbox | ^1.0.0 | Geolocalização |

### Ferramentas de Desenvolvimento
| Ferramenta | Versão | Descrição |
|------------|--------|-----------|
| Docker | 20.10+ | Containerização |
| Docker Compose | 2.0+ | Orquestração |
| PgAdmin | Latest | Admin PostgreSQL |

### Dependências de Desenvolvimento
| Pacote | Versão | Descrição |
|--------|--------|-----------|
| Nodemon | ^3.1.9 | Hot Reload |
| Supertest | ^7.1.0 | Testes de API |
| Sinon | ^20.0.0 | Mocks e Stubs |
| SQLite3 | ^5.1.7 | Banco de Testes |
| Swagger-autogen | 2.23.7 | Geração de Docs |

### Segurança
- Helmet (^8.1.0) para headers HTTP
- CORS (^2.8.5) para controle de acesso
- Validação de entrada com Express-validator
- Autenticação JWT
- Firebase Auth para autenticação

## 📋 Pré-requisitos

### Desenvolvimento Local
- Node.js v14 ou superior
- PostgreSQL 14
- Docker e Docker Compose
- Git

### Contas e Serviços
- Conta Firebase (para autenticação)
- Conta Mapbox (para geolocalização)

## 🚀 Instalação

### 1. Clone o Repositório
```bash
# Clone o repositório
git clone https://github.com/Sustenta-Bag/sustentabag-backend-monolito.git

# Entre no diretório
cd sustentabag-backend-monolito
```

### 2. Instale as Dependências
```bash
# Instale as dependências
npm install

# Verifique se há vulnerabilidades
npm audit
```

### 3. Configure as Variáveis de Ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações
# Use seu editor preferido, por exemplo:
code .env
```

### 4. Inicie os Serviços com Docker
```bash
# Inicie todos os serviços
docker-compose up -d

# Verifique se os serviços estão rodando
docker-compose ps

# Verifique os logs
docker-compose logs -f
```

### 5. Verifique as Conexões
```bash
# Verifique a documentação da API
# Acesse: http://localhost:4041/api-docs
```

## ⚙️ Configuração

### Variáveis de Ambiente
```env
# Servidor
PORT=4041
NODE_ENV=development

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sustentabag
DB_USER=postgres
DB_PASSWORD=postgres
DB_SCHEMA=public

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=24h

# Logs
LOG_LEVEL=debug

# Firebase
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key

# Mapbox
MAPBOX_ACCESS_TOKEN=your_mapbox_token
```

### Portas dos Serviços
| Serviço | Porta | Descrição | Acesso |
|---------|-------|-----------|---------|
| API Principal | 4041 | API REST principal | http://localhost:4041 |
| Swagger | 4041/api-docs | Documentação da API | http://localhost:4041/api-docs |
| PgAdmin | 5050 | Admin do PostgreSQL | http://localhost:5050 |

### Credenciais Padrão
| Serviço | Usuário | Senha |
|---------|---------|-------|
| PostgreSQL | postgres | postgres |
| PgAdmin | admin@sustentabag.com | admin |

### Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative Authentication
3. Gere uma chave privada para o serviço
4. Configure as variáveis de ambiente no `.env`

### Configuração do Mapbox

1. Crie uma conta no [Mapbox](https://www.mapbox.com)
2. Gere um token de acesso
3. Adicione o token no arquivo `.env`

### 🌍 Configuração por Ambiente

#### Desenvolvimento Local
```bash
# .env.development
NODE_ENV=development
PORT=4041
LOG_LEVEL=debug
DB_HOST=localhost
```

#### Homologação/Staging
```bash
# .env.staging
NODE_ENV=staging
PORT=4041
LOG_LEVEL=info
DB_HOST=staging-db.sustentabag.com
CORS_ORIGIN=https://staging.sustentabag.com
```

#### Produção
```bash
# .env.production
NODE_ENV=production
PORT=4041
LOG_LEVEL=error
DB_HOST=prod-db.sustentabag.com
CORS_ORIGIN=https://app.sustentabag.com
JWT_EXPIRATION=1h  # Menor tempo em produção
```

### 🔒 Segurança por Ambiente

| Configuração | Desenvolvimento | Produção |
|--------------|----------------|----------|
| **JWT Expiration** | 24h | 1h |
| **CORS Origin** | * | Domínio específico |
| **Logs** | Debug | Error apenas |

### Verificação da Instalação

```bash
# Inicie o servidor em modo desenvolvimento
npm run dev

# Em outro terminal, execute os testes
npm test

# Verifique a documentação da API
# Acesse: http://localhost:4041/api-docs
```

### Solução de Problemas Comuns

1. **Erro de Conexão com o Banco**
   ```bash
   # Verifique se o PostgreSQL está rodando
   docker-compose ps db
   
   # Verifique os logs
   docker-compose logs db
   ```

2. **Erro de Porta em Uso**
   ```bash
   # Liste processos usando as portas
   netstat -ano | findstr "4041"
   
   # Encerre o processo se necessário
   taskkill /PID <PID> /F
   ```

3. **Erro de Variáveis de Ambiente**
   ```bash
   # Verifique se o arquivo .env existe
   ls -la .env
   
   # Verifique se as variáveis estão definidas
   cat .env
   ```

4. **Erro no Docker**
   ```bash
   # Limpe containers parados
   docker-compose down

   # Remova volumes não utilizados
   docker volume prune

   # Reconstrua as imagens
   docker-compose build --no-cache
   ```

5. **Erro nos Testes**
   ```bash
   # Limpe o cache do Jest
   npm run test -- --clearCache

   # Execute testes específicos
   npm test -- -t "nome do teste"

   # Verifique a cobertura
   npm run test:coverage
   ```

## 🔧 Solução de Problemas

### Problemas Comuns

#### 1. Erro de Conexão com o Banco
```bash
# Verifique se o PostgreSQL está rodando
docker-compose ps db

# Verifique os logs
docker-compose logs db

# Tente reconectar
docker-compose restart db
```

#### 2. Erro de Porta em Uso
```bash
# Liste processos usando as portas
netstat -ano | findstr "4041"

# Encerre o processo se necessário
taskkill /PID <PID> /F

# Ou altere a porta no .env
PORT=4042
```

#### 3. Erro de Variáveis de Ambiente
```bash
# Verifique se o arquivo .env existe
ls -la .env

# Verifique se as variáveis estão definidas
cat .env

# Copie o arquivo de exemplo novamente
cp .env.example .env
```

#### 4. Erro no Docker
```bash
# Limpe containers parados
docker-compose down

# Remova volumes não utilizados
docker volume prune

# Reconstrua as imagens
docker-compose build --no-cache
```

#### 5. Erro nos Testes
```bash
# Limpe o cache do Jest
npm run test -- --clearCache

# Execute testes específicos
npm test -- -t "nome do teste"

# Verifique a cobertura
npm run test:coverage
```

### Logs e Monitoramento

#### Visualização de Logs
```bash
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker-compose logs -f api

# Últimas 100 linhas
docker-compose logs --tail=100 -f api

# Filtrar por nível
docker-compose logs -f api | grep "ERROR"
```

#### Métricas e Saúde
- **Health Check**: http://localhost:4041/health

### Recuperação de Dados

#### Backup do Banco
```bash
# Backup do PostgreSQL
docker-compose exec db pg_dump -U postgres sustentabag > backup.sql

# Restaurar backup
cat backup.sql | docker-compose exec -T db psql -U postgres sustentabag
```

#### Logs de Erro
```bash
# Exportar logs
docker-compose logs api > api-logs.txt

# Limpar logs antigos
docker-compose exec api sh -c "echo '' > /var/log/api.log"
```

### Contato e Suporte

- **Issues**: [GitHub Issues](https://github.com/Sustenta-Bag/sustentabag-backend-monolito/issues)
- **Email**: suporte@sustentabag.com
- **Slack**: [Canal de Suporte](https://sustentabag.slack.com)

## 💻 Uso

### Comandos Disponíveis

#### Desenvolvimento
```bash
# Iniciar em diferentes modos
npm start            # Modo produção
npm run dev          # Modo desenvolvimento com hot-reload
npm run start:watch  # Modo watch nativo
```

#### Documentação
```bash
# Gerar documentação
npm run swagger      # Gera documentação Swagger
```

#### Testes
```bash
# Executar testes
npm test            # Testes unitários
npm run test:integration  # Testes de integração
npm run test:all    # Todos os testes
npm run test:watch  # Testes em modo watch

# Cobertura de testes
npm run test:coverage     # Cobertura básica
npm run test:coverage:html # Relatório HTML
npm run test:coverage:unit:html # Relatório unitário
npm run coverage:open     # Abre relatório no navegador
```

#### Docker
```bash
# Gerenciamento de containers
docker-compose up -d     # Inicia serviços
docker-compose down      # Para serviços
docker-compose restart   # Reinicia serviços
docker-compose logs -f   # Monitora logs

# Manutenção
docker-compose ps        # Lista containers
docker-compose build    # Reconstrói imagens
docker system prune     # Limpa recursos não utilizados
```

### Acessando os Serviços

#### API e Documentação
- **API Principal**: http://localhost:4041
- **Swagger UI**: http://localhost:4041/api-docs
- **Health Check**: http://localhost:4041/health
- **Métricas**: http://localhost:4041/metrics

#### Ferramentas de Administração
- **PgAdmin**: http://localhost:5050
  - Email: admin@sustentabag.com
  - Senha: admin
- **RabbitMQ**: http://localhost:15672
  - Usuário: admin
  - Senha: admin
- **MongoDB Compass**: mongodb://localhost:27017

#### Frontend e Microserviços
- **Web App**: http://localhost:4079
- **Serviço de Pagamentos**: http://localhost:3001
- **Serviço de Notificações**: http://localhost:4409

## 👨‍💻 Desenvolvimento

### Estrutura do Projeto
```
src/
  ├── app.js                # Configuração da aplicação
  ├── index.js              # Ponto de entrada
  ├── server.js             # Servidor HTTP
  ├── application/          # Casos de uso e serviços
  │   ├── bootstrap.js      # Inicialização
  │   ├── dtos/            # Objetos de transferência
  │   ├── modules/         # Módulos da aplicação
  │   └── services/        # Serviços da aplicação
  ├── domain/              # Regras de negócio
  │   ├── entities/        # Entidades do domínio
  │   ├── models/          # Modelos de dados
  │   └── value/           # Objetos de valor
  ├── infrastructure/      # Implementações técnicas
  │   ├── config/          # Configurações
  │   ├── database/        # Banco de dados
  │   ├── errors/          # Tratamento de erros
  │   └── repositories/    # Repositórios
  └── presentation/        # Interfaces
      ├── controllers/     # Controladores
      ├── http/           # Configurações HTTP
      ├── middleware/     # Middlewares
      └── routes/         # Rotas da API
```

### Convenções de Código

#### Nomenclatura
- **Variáveis/Funções**: camelCase
- **Classes**: PascalCase
- **Arquivos**: kebab-case
- **Constantes**: UPPER_SNAKE_CASE
- **Interfaces**: IPascalCase
- **Tipos**: TPascalCase

#### Organização de Imports
```typescript
// Core
import path from 'path';
import fs from 'fs';

// Externos
import express from 'express';
import { Sequelize } from 'sequelize';

// Internos
import { User } from '../domain/entities';
import { UserService } from '../application/services';
```

#### Documentação
```typescript
/**
 * Cria um novo usuário no sistema
 * @param {CreateUserDTO} userData - Dados do usuário
 * @returns {Promise<User>} Usuário criado
 * @throws {ValidationError} Se os dados forem inválidos
 */
async function createUser(userData: CreateUserDTO): Promise<User>
```

#### Testes
```typescript
describe('UserService', () => {
  it('deve criar um usuário com dados válidos', async () => {
    // Arrange
    const userData = { /* ... */ };

    // Act
    const user = await userService.create(userData);

    // Assert
    expect(user).toBeDefined();
    expect(user.email).toBe(userData.email);
  });
});
```

### Workflow de Desenvolvimento

1. **Preparação**
   ```bash
   # Atualize a branch develop
   git checkout develop
   git pull origin develop

   # Crie uma nova branch
   git checkout -b feature/nome-da-feature
   ```

2. **Desenvolvimento**
   ```bash
   # Inicie o servidor em modo desenvolvimento
   npm run dev

   # Em outro terminal, execute os testes
   npm run test:watch
   ```

3. **Commit**
   ```bash
   # Verifique as alterações
   git status
   git diff

   # Adicione as alterações
   git add .

   # Faça o commit
   git commit -m "feat: adiciona nova funcionalidade

   - Implementa criação de usuário
   - Adiciona validação de email
   - Atualiza documentação"
   ```

4. **Push e Pull Request**
   ```bash
   # Envie para o repositório
   git push origin feature/nome-da-feature

   # Crie um Pull Request no GitHub
   # Use o template fornecido
   ```

### Boas Práticas

1. **Commits**
   - Use o padrão Conventional Commits
   - Escreva mensagens claras e descritivas
   - Referencie issues quando aplicável

2. **Código**
   - Siga os princípios SOLID
   - Mantenha a cobertura de testes alta
   - Documente APIs e funções complexas
   - Use tipos e interfaces do TypeScript

3. **Segurança**
   - Nunca comite credenciais
   - Valide todas as entradas
   - Use prepared statements
   - Implemente rate limiting

4. **Performance**
   - Use índices apropriadamente
   - Implemente cache quando necessário
   - Monitore uso de recursos
   - Otimize queries

### Debugging

1. **Logs**
   ```bash
   # Visualize logs em tempo real
   docker-compose logs -f api

   # Filtre logs por nível
   docker-compose logs -f api | grep "ERROR"
   ```

2. **Inspeção**
   ```bash
   # Entre no container
   docker-compose exec api sh

   # Verifique processos
   ps aux

   # Monitore recursos
   top
   ```

3. **Testes**
   ```bash
   # Execute um teste específico
   npm test -- -t "nome do teste"

   # Debug testes
   npm run test:debug
   ```

## 🧪 Testes

### Tipos de Testes

- **Unitários**: Testam componentes isolados
- **Integração**: Testam interação entre componentes
- **E2E**: Testam fluxos completos (em desenvolvimento)

### Executando Testes

```bash
# Todos os testes
npm test

# Testes específicos
npm test -- -t "nome do teste"

# Cobertura
npm run test:coverage

# Watch mode
npm run test:watch
```

### Relatórios de Cobertura

- HTML: `npm run test:coverage:html`
- Terminal: `npm run test:coverage`
- Abrir relatório: `npm run coverage:open`

## 🚀 Deploy

### Ambiente de Produção

1. **Preparação**
   ```bash
   # Build da imagem
   docker build -t sustentabag-backend .

   # Verificar configuração
   docker-compose config
   ```

2. **Deploy**
   ```bash
   # Iniciar serviços
   docker-compose up -d

   # Verificar logs
   docker-compose logs -f
   ```

### Monitoramento

- **Logs**: Docker logs

## 📚 Documentação

### Documentação da API

- Swagger UI: http://localhost:4041/api-docs

## 🗺️ Roadmap

### 🎯 Versão Atual (v1.0.0)
- ✅ API REST completa com DDD
## 🗺️ Roadmap

### 🎯 Versão Atual (v1.0.0)
- ✅ API REST completa com DDD
- ✅ Autenticação Firebase + JWT
- ✅ Documentação Swagger
- ✅ Testes unitários

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: add some amazing feature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Commit

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Tarefas gerais

## 💬 Suporte

- **Issues**: [GitHub Issues](https://github.com/Sustenta-Bag/sustentabag-backend-monolito/issues)
- **Email**: suporte@sustentabag.com
- **Slack**: [Canal de Suporte](https://sustentabag.slack.com)

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/Sustenta-Bag">SustentaBag Team</a></sub>
</div>

## ❓ FAQ (Perguntas Frequentes)

### 🔐 **Autenticação e Segurança**

**P: Como funciona a autenticação?**  
R: O sistema usa JWT + Firebase Auth. O Firebase autentica o usuário e o backend gera um JWT para autorização nas APIs.

**P: O token JWT expira?**  
R: Sim, em 24h por padrão. Configure no `.env` com `JWT_EXPIRATION`.

**P: Posso usar a API sem Firebase?**  
R: Não atualmente. O Firebase é essencial para autenticação e notificações push.

### 🏗️ **Arquitetura e Deploy**

**P: Por que um monolito + microserviços?**  
R: O core business está no monolito (DDD) para consistência, enquanto serviços especializados (pagamento, notificação) são separados para escalabilidade.

**P: Posso rodar apenas o monolito?**  
R: Sim, o projeto funciona como monolito standalone.

**P: Como fazer deploy em produção?**  
R: Use `docker-compose up -d` com as variáveis de ambiente adequadas.

### 🐛 **Problemas Comuns**

**P: Erro "Port 4041 already in use"**  
R: Mude a porta no `.env`: `PORT=4042` ou pare o processo que está usando a porta.

**P: Firebase não conecta**  
R: Verifique se todas as variáveis `FIREBASE_*` estão no `.env` e se a chave privada está formatada corretamente.

**P: Mapbox retorna erro 401**  
R: Gere um novo token em [Mapbox](https://account.mapbox.com/access-tokens/) e atualize `MAPBOX_ACCESS_TOKEN`.

**P: Banco não sincroniza**  
R: Execute `docker-compose down -v && docker-compose up -d` para recriar volumes.

### 📈 **Desenvolvimento**

**P: Como adicionar novos endpoints?**  
R: 1) Crie entidade em `/domain`, 2) Implemente repository em `/infrastructure`, 3) Crie service em `/application`, 4) Adicione routes em `/presentation`.

**P: Como executar apenas testes unitários?**  
R: `npm test` para todos os testes unitários ou `npm run test:coverage` para relatório.

**P: O Swagger não atualiza?**  
R: Execute `npm run swagger` para regenerar a documentação.

### 💡 **Dicas de Uso**

**P: Posso usar outros bancos além do PostgreSQL?**  
R: Tecnicamente sim (Sequelize), mas PostgreSQL é recomendado e testado.

**P: Como contribuir com o projeto?**  
R: Faça fork, crie branch (`feature/nome`), commit com padrão Conventional, abra PR. Veja [Contribuição](#-contribuição).

---

💬 **Não encontrou sua pergunta?** Abra uma [issue](https://github.com/Sustenta-Bag/sustentabag-backend-monolito/issues) ou entre em contato conosco!