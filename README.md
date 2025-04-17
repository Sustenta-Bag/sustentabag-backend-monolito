# SustentaBag Backend Monolito

Sistema backend monolítico para gerenciamento de sacolas ecológicas utilizando arquitetura DDD (Domain-Driven Design).

## Descrição

Este sistema gerencia sacolas ecológicas para o projeto SustentaBag, permitindo o cadastro, busca, atualização e remoção de sacolas, além de outras funcionalidades como autenticação e gerenciamento de usuários. O projeto implementa uma arquitetura baseada em DDD com Node.js.

## Tecnologias

- Node.js
- Express
- PostgreSQL com Sequelize ORM
- MongoDB com Mongoose (para determinadas funcionalidades)
- ESM Modules
- Jest (Testes)
- Swagger (Documentação da API)
- JWT (Autenticação)
- Yup e Express-validator (Validação)
- Docker e Docker Compose (Containerização)

## Estrutura do Projeto

```
src/
  ├── app.js                # Configuração da aplicação
  ├── index.js              # Ponto de entrada
  ├── server.js             # Servidor HTTP
  ├── application/          # Casos de uso e serviços
  │   ├── bootstrap.js      # Inicialização da aplicação
  │   ├── dtos/             # Objetos de transferência de dados
  │   ├── modules/          # Módulos da aplicação
  │   └── services/         # Serviços da aplicação
  ├── domain/               # Regras de negócio e entidades
  │   ├── entities/         # Entidades do domínio
  │   ├── models/           # Modelos de dados
  │   └── value/            # Objetos de valor
  ├── infrastructure/       # Implementações técnicas
  │   ├── config/           # Configurações
  │   ├── database/         # Configuração do banco de dados
  │   ├── errors/           # Tratamento de erros
  │   └── repositories/     # Implementação dos repositórios
  └── presentation/         # Interfaces com o usuário
      ├── controllers/      # Controladores
      ├── http/             # Configurações relacionadas ao HTTP
      ├── middleware/       # Middlewares
      ├── routes/           # Rotas da API
      └── routes/helper/    # Funções auxiliares para rotas
```

## Configuração

### Pré-requisitos

- Node.js (v14+)
- PostgreSQL
- MongoDB (opcional, dependendo das funcionalidades utilizadas)
- Docker e Docker Compose (opcional, para execução em container)

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
PORT=3000
NODE_ENV=development

# PostgreSQL Database Config
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=sustentabag
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# MongoDB Config (se aplicável)
MONGODB_URI=mongodb://localhost:27017/sustentabag

# JWT Config
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=24h
```

### Instalação

1. Clone o repositório:
```
git clone https://github.com/Sustenta-Bag/sustentabag-backend-monolito.git
```

2. Instale as dependências:
```
cd sustentabag-backend-monolito
npm install
```

3. Inicie o servidor de desenvolvimento:
```
npm run dev
```

## Endpoints Principais da API

| Método | Endpoint                       | Descrição                              |
|--------|--------------------------------|----------------------------------------|
| POST   | /api/bags                      | Criar uma nova sacola                  |
| GET    | /api/bags                      | Listar todas as sacolas                |
| GET    | /api/bags/:id                  | Obter detalhes de uma sacola           |
| PUT    | /api/bags/:id                  | Atualizar informações de uma sacola    |
| DELETE | /api/bags/:id                  | Remover uma sacola                     |
| POST   | /api/auth/login                | Login de usuário                       |
| POST   | /api/auth/register             | Registro de novo usuário               |
| GET    | /api/users                     | Listar usuários                        |

## Modelo de Dados Principal

A entidade Sacola (Bag) possui os seguintes atributos:

| Campo       | Tipo          | Descrição                                   |
|-------------|---------------|---------------------------------------------|
| id          | INT           | Identificador único da sacola               |
| type        | ENUM          | Tipo da sacola: 'Doce', 'Salgada', 'Mista' |
| price       | FLOAT         | Preço da sacola                             |
| description | TEXT          | Descrição da sacola                         |
| companyId   | INT           | ID da empresa                               |
| status      | INT           | Status: 0 (inativo) ou 1 (ativo)            |
| createdAt   | DATETIME      | Data de criação do registro                 |
| updatedAt   | DATETIME      | Data de atualização do registro             |

## Documentação da API

A documentação interativa da API está disponível através do Swagger:

```
http://localhost:3000/api-docs
```

## Docker

O projeto inclui configuração Docker para facilitar o desenvolvimento e deployment:

```
# Iniciar todos os serviços
docker-compose up -d

# Construir apenas o serviço
docker build -t sustentabag-backend .
```

## Scripts Disponíveis

```
npm start            # Inicia o servidor em modo produção
npm run dev          # Inicia o servidor em modo desenvolvimento com nodemon
npm run start:watch  # Inicia o servidor com watch mode nativo
npm run swagger      # Gera a documentação Swagger
npm run test         # Executa os testes
npm run test:watch   # Executa os testes em modo watch
npm run test:coverage # Verifica a cobertura dos testes
```

## Contribuindo

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

ISC