# 🌱 SustentaBag - Backend Monolítico

> **Sistema de gerenciamento de sacolas ecológicas para redução do desperdício alimentar**

Um backend robusto desenvolvido em Node.js que conecta estabelecimentos comerciais a consumidores conscientes, promovendo a sustentabilidade através da venda de sacolas com produtos próximos ao vencimento por preços acessíveis.

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#️-configuração)
- [Uso](#-uso)
- [API Documentation](#-api-documentation)
- [Testes](#-testes)
- [Deploy](#-deploy)
- [Contribuição](#-contribuição)
- [FAQ](#-faq)
- [Licença](#-licença)

## 🎯 Sobre o Projeto

O SustentaBag é uma plataforma inovadora que combate o desperdício alimentar conectando:

- **🏪 Estabelecimentos**: Cadastram sacolas com produtos próximos ao vencimento
- **👥 Consumidores**: Adquirem produtos de qualidade por preços reduzidos
- **🌍 Sustentabilidade**: Reduz o desperdício e promove consumo consciente

### Funcionalidades Principais

- ✅ **Gestão de Estabelecimentos**: Cadastro, autenticação e gerenciamento de negócios
- ✅ **Sistema de Sacolas**: Criação e gestão de sacolas ecológicas (Doce, Salgada, Mista)
- ✅ **Geolocalização**: Busca de estabelecimentos próximos usando Mapbox
- ✅ **Sistema de Pedidos**: Fluxo completo de compra e entrega
- ✅ **Autenticação**: Integração com Firebase Authentication
- ✅ **Favoritos**: Sistema de estabelecimentos favoritos
- ✅ **Notificações**: Notificações push para novos produtos
- ✅ **API RESTful**: Documentação completa com Swagger

## 🛠 Tecnologias

### Backend Principal
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Node.js** | 18+ | Runtime JavaScript |
| **Express** | ^5.1.0 | Framework Web |
| **Sequelize** | ^6.37.7 | ORM para PostgreSQL |
| **PostgreSQL** | 14 | Banco de Dados Principal |
| **Jest** | ^29.7.0 | Framework de Testes |

### Serviços e Integrações
| Serviço | Versão | Descrição |
|---------|--------|-----------|
| **Firebase** | ^11.6.0 | Autenticação e Notificações |
| **Mapbox** | ^1.0.0 | Geolocalização e Mapas |
| **Swagger** | ^5.0.1 | Documentação da API |
| **JWT** | ^9.0.2 | Tokens de Autenticação |
| **Docker** | - | Containerização |

### Segurança e Middleware
- **Helmet**: Proteção de headers HTTP
- **CORS**: Controle de origem cruzada
- **bcrypt**: Hash de senhas
- **Express Validator**: Validação de dados

## 🏗 Arquitetura

O projeto segue os princípios da **Clean Architecture** com separação clara de responsabilidades:

```
src/
├── 📁 application/          # Casos de uso e serviços
│   ├── services/           # Lógica de negócio
│   ├── modules/            # Módulos da aplicação
│   └── bootstrap.js        # Inicialização dos módulos
├── 📁 domain/              # Entidades e regras de negócio
│   ├── entities/           # Entidades do domínio
│   ├── models/             # Modelos do Sequelize
│   └── services/           # Serviços de domínio
├── 📁 infrastructure/      # Camada de infraestrutura
│   ├── database/           # Configuração do banco
│   ├── repositories/       # Implementação dos repositórios
│   ├── services/           # Serviços externos
│   └── errors/             # Tratamento de erros
└── 📁 presentation/        # Camada de apresentação
    ├── controllers/        # Controladores HTTP
    ├── routes/             # Definição das rotas
    ├── middleware/         # Middlewares personalizados
    └── docs/               # Documentação da API
```

### Principais Entidades

- **👤 Client**: Clientes do sistema
- **🏪 Business**: Estabelecimentos comerciais  
- **🛍 Bag**: Sacolas ecológicas (Doce, Salgada, Mista)
- **📦 Order**: Pedidos e compras
- **📍 Address**: Endereços e localização
- **⭐ Favorite**: Sistema de favoritos

## 📋 Pré-requisitos

### Desenvolvimento Local
- **Node.js** v18 ou superior
- **PostgreSQL** 14+
- **Docker** e **Docker Compose**
- **Git**

### Contas e Serviços Externos
- **Firebase Console**: Para autenticação e notificações
- **Mapbox Account**: Para serviços de geolocalização

## 🚀 Instalação

### 1. Clone o Repositório
```bash
git clone https://github.com/Sustenta-Bag/sustentabag-backend-monolito.git
cd sustentabag-backend-monolito
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configure o Ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite as variáveis de ambiente
nano .env
```

### 4. Inicie com Docker (Recomendado)
```bash
# Suba todos os serviços
docker-compose up -d

# Verifique os logs
docker-compose logs -f api
```

### 5. Ou Execute Localmente
```bash
# Inicie o PostgreSQL localmente
# Configure as variáveis no .env

# Execute as migrações
npm run migrate

# Inicie em modo desenvolvimento
npm run dev
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# 🔧 Servidor
PORT=4041
NODE_ENV=development

# 🗄️ PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sustentabag
DB_USER=postgres
DB_PASSWORD=postgres
DB_SCHEMA=public

# 🔐 JWT
JWT_SECRET=seu_jwt_secret_super_seguro
JWT_EXPIRATION=24h

# 📱 Firebase - Autenticação
FIREBASE_API_KEY=sua_api_key
FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
FIREBASE_PROJECT_ID=seu_projeto_id
FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef

# 🔑 Firebase - Admin SDK
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@seu-projeto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_PRIVADA\n-----END PRIVATE KEY-----\n"

# 🗺️ Mapbox
MAPBOX_ACCESS_TOKEN= SEU_TOKEN

# 📊 Logs
LOG_LEVEL=debug
```

### Configuração do Firebase

1. **Crie um projeto** no [Firebase Console](https://console.firebase.google.com)
2. **Ative o Authentication** com providers desejados
3. **Gere uma chave privada** para o Admin SDK:
   - Acesse Configurações do Projeto → Contas de Serviço
   - Clique em "Gerar nova chave privada"
   - Baixe o arquivo JSON
4. **Configure as variáveis** no `.env` com os dados do arquivo

### Configuração do Mapbox

1. **Crie uma conta** em [Mapbox](https://www.mapbox.com)
2. **Gere um token** em [Access Tokens](https://account.mapbox.com/access-tokens/)
3. **Adicione o token** na variável `MAPBOX_ACCESS_TOKEN`

### Portas dos Serviços

| Serviço | Porta | URL de Acesso |
|---------|-------|---------------|
| 🚀 **API Principal** | 4041 | http://localhost:4041 |
| 📚 **Swagger Docs** | 4041 | http://localhost:4041/swagger |
| 🗄️ **PostgreSQL** | 5432 | localhost:5432 |
| ❤️ **Health Check** | 4041 | http://localhost:4041/api/health |

## 🎯 Uso

### Iniciando o Servidor

```bash
# Desenvolvimento com hot-reload
npm run dev

# Produção
npm start

# Com Docker
docker-compose up -d
```

### Verificando o Status

```bash
# Health check
curl http://localhost:4041/api/health

# Versão da API
curl http://localhost:4041/api/version
```

### Scripts Disponíveis

```bash
# 🔧 Desenvolvimento
npm run dev              # Inicia em modo desenvolvimento
npm run start:watch      # Inicia com --watch do Node.js

# 🧪 Testes
npm test                 # Testes unitários
npm run test:integration # Testes de integração
npm run test:all         # Todos os testes
npm run test:coverage    # Cobertura de testes
npm run coverage:open    # Abre relatório de cobertura

# 📚 Documentação
npm run swagger          # Gera documentação Swagger

# 🐳 Docker
docker-compose up -d     # Sobe todos os serviços
docker-compose logs -f   # Visualiza logs
docker-compose down      # Para todos os serviços
```

## 📚 API Documentation

### Swagger UI
Acesse a documentação interativa em: **http://localhost:4041/swagger**

### Principais Endpoints

#### 🔐 Autenticação
```http
POST /api/auth/login     # Login de usuário
POST /api/auth/register  # Registro de usuário
POST /api/auth/refresh   # Renovar token
```

#### 🏪 Estabelecimentos
```http
GET    /api/businesses          # Listar estabelecimentos
POST   /api/businesses          # Criar estabelecimento
GET    /api/businesses/:id      # Obter estabelecimento
PUT    /api/businesses/:id      # Atualizar estabelecimento
DELETE /api/businesses/:id      # Deletar estabelecimento
```

#### 🛍 Sacolas
```http
GET    /api/bags                     # Listar todas as sacolas
POST   /api/bags                     # Criar sacola
GET    /api/bags/:id                 # Obter sacola específica
PUT    /api/bags/:id                 # Atualizar sacola
DELETE /api/bags/:id                 # Deletar sacola
GET    /api/bags/business/:id        # Sacolas por estabelecimento
GET    /api/bags/business/:id/active # Sacolas ativas por estabelecimento
PATCH  /api/bags/:id/status          # Alterar status da sacola
```

#### 📦 Pedidos
```http
GET    /api/orders              # Listar pedidos
POST   /api/orders              # Criar pedido
GET    /api/orders/:id          # Obter pedido
PUT    /api/orders/:id/status   # Atualizar status
POST   /api/orders/:id/items    # Adicionar item
DELETE /api/orders/:id/items/:itemId # Remover item
```

#### 📍 Localização
```http
GET /api/location/nearby/client           # Estabelecimentos próximos
GET /api/location/geocode                 # Geocodificar endereço
GET /api/location/bags/nearby/client      # Sacolas próximas
```

### Autenticação

A API usa **Bearer Token** (JWT) para autenticação:

```bash
# Exemplo de requisição autenticada
curl -H "Authorization: Bearer SEU_JWT_TOKEN" \
     http://localhost:4041/api/bags
```

## 🧪 Testes

### Executando os Testes

```bash
# Todos os testes
npm run test:all

# Apenas testes unitários
npm test

# Apenas testes de integração
npm run test:integration

# Com cobertura
npm run test:coverage

# Modo watch
npm run test:watch
```

### Cobertura de Testes

```bash
# Gerar relatório HTML
npm run test:coverage:html

# Abrir relatório no navegador
npm run coverage:open
```

### Estrutura de Testes

```
tests/
├── unit/                    # Testes unitários
│   ├── application/         # Testes de serviços
│   ├── domain/             # Testes de entidades
│   └── infrastructure/     # Testes de repositórios
└── integration/            # Testes de integração
    └── api/                # Testes de endpoints
```

### Exemplo de Teste

```javascript
// tests/unit/application/services/BagService.test.js
describe('BagService', () => {
  test('should create bag successfully', async () => {
    const bagData = {
      type: 'Mista',
      price: 15.99,
      description: 'Sacola mista'
    };
    
    const result = await bagService.createBag(bagData);
    
    expect(result.type).toBe('Mista');
    expect(result.price).toBe(15.99);
  });
});
```

## 🚀 Deploy

### Deploy com Docker

```bash
# Build da imagem
docker build -t sustentabag-backend .

# Executar container
docker run -d \
  --name sustentabag-api \
  -p 4041:4041 \
  --env-file .env.production \
  sustentabag-backend
```

### Deploy em Produção

1. **Configure variáveis de ambiente** para produção:
```env
NODE_ENV=production
LOG_LEVEL=error
JWT_EXPIRATION=1h
DB_HOST=sua-db-producao.com
```

2. **Build e deploy**:
```bash
# Build do projeto
npm run build

# Start em produção
npm start
```

### Monitoramento

- **Health Check**: `GET /api/health`
- **Métricas**: Logs estruturados com Morgan
- **Erros**: Sistema centralizado de tratamento

## 🤝 Contribuição

### Como Contribuir

1. **Fork** o projeto
2. **Crie** uma branch para sua feature:
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```
3. **Commit** suas mudanças:
   ```bash
   git commit -m 'feat: adiciona nova funcionalidade'
   ```
4. **Push** para a branch:
   ```bash
   git push origin feature/nova-funcionalidade
   ```
5. **Abra** um Pull Request

### Padrões de Código

- **ESLint**: Linting automático
- **Prettier**: Formatação de código
- **Conventional Commits**: Padrão de mensagens
- **Clean Architecture**: Arquitetura em camadas

### Estrutura de Commits

```
feat: nova funcionalidade
fix: correção de bug
docs: atualização de documentação
style: formatação de código
refactor: refatoração
test: adição de testes
chore: tarefas de manutenção
```

## ❓ FAQ (Perguntas Frequentes)

### 🔐 **Autenticação e Segurança**

**P: Como funciona a autenticação?**  
R: O sistema usa JWT + Firebase Auth. O Firebase autentica o usuário e o backend gera um JWT para autorização nas APIs.

**P: O token JWT expira?**  
R: Sim, em 24h por padrão. Configure no `.env` com `JWT_EXPIRATION`.

**P: Posso usar a API sem Firebase?**  
R: Não atualmente. O Firebase é essencial para autenticação e notificações push.

### 🗺️ **Geolocalização**

**P: É obrigatório configurar o Mapbox?**  
R: Não. O sistema funciona sem Mapbox, mas recursos de geolocalização ficam limitados.

**P: Como obtenho um token do Mapbox?**  
R: Crie uma conta gratuita em [mapbox.com](https://www.mapbox.com) e gere um token de acesso.

### 🛍️ **Funcionalidades**

**P: Quais tipos de sacola existem?**  
R: Três tipos: **Doce** (produtos doces), **Salgada** (produtos salgados) e **Mista** (produtos diversos).

**P: Como funciona o sistema de status das sacolas?**  
R: Status 1 = Ativa (disponível para venda), Status 0 = Inativa (indisponível).

### 🐛 **Problemas Comuns**

**P: Erro "Port 4041 already in use"**  
R: Mude a porta no `.env`: `PORT=4042` ou pare o processo que está usando a porta.

**P: Firebase não conecta**  
R: Verifique se todas as variáveis `FIREBASE_*` estão no `.env` e se a chave privada está formatada corretamente.

**P: Mapbox retorna erro 401**  
R: Gere um novo token em [Mapbox](https://account.mapbox.com/access-tokens/) e atualize `MAPBOX_ACCESS_TOKEN`.

**P: Banco não sincroniza**  
R: Execute `docker-compose down -v && docker-compose up -d` para recriar volumes.

### 🚀 **Performance**

**P: Como otimizar a performance?**  
R: Use índices no banco, cache Redis (futuro), paginação nas listagens e compressão gzip.

**P: Qual o limite de requisições?**  
R: Não há limite configurado atualmente. Considere implementar rate limiting em produção.

## 📄 Licença

Este projeto está sob a licença **ISC**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🔗 Links Úteis

- **🌐 Repositório**: [GitHub](https://github.com/Sustenta-Bag/sustentabag-backend-monolito)
- **📚 Documentação**: [Swagger UI](http://localhost:4041/swagger)
- **🐛 Issues**: [GitHub Issues](https://github.com/Sustenta-Bag/sustentabag-backend-monolito/issues)
- **🔥 Firebase**: [Console](https://console.firebase.google.com)
- **🗺️ Mapbox**: [Dashboard](https://account.mapbox.com)

---

## 👥 Equipe

Desenvolvido com ❤️ pela equipe **SustentaBag** como projeto integrador acadêmico.

**📧 Contato**: Para dúvidas ou sugestões, abra uma [issue](https://github.com/Sustenta-Bag/sustentabag-backend-monolito/issues) no GitHub.

---

<div align="center">

**🌱 Juntos por um futuro mais sustentável! 🌱**

[![GitHub](https://img.shields.io/github/license/Sustenta-Bag/sustentabag-backend-monolito)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.1.0-blue)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://docker.com)

</div>
