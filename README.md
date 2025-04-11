# Sacola Service

Microserviço para gerenciamento de sacolas ecológicas utilizando arquitetura DDD (Domain-Driven Design).

## Descrição

Este serviço gerencia sacolas ecológicas, permitindo o cadastro, busca, atualização e remoção de sacolas, implementando uma arquitetura baseada em DDD com Node.js.

## Tecnologias

- Node.js
- Express
- PostgreSQL
- Sequelize ORM
- Jest (Testes)
- Arquitetura DDD
- Swagger (Documentação da API)

## Estrutura do Projeto

```
src/
  ├── domain/             # Regras de negócio e entidades
  │   ├── entities/       # Entidades do domínio
  │   └── repositories/   # Interfaces dos repositórios
  ├── application/        # Casos de uso e serviços
  │   └── services/       # Serviços da aplicação
  ├── infrastructure/     # Implementações técnicas
  │   ├── database/       # Configuração e modelos do banco de dados
  │   ├── http/           # Configurações relacionadas ao HTTP
  │   └── repositories/   # Implementação dos repositórios
  └── interfaces/         # Interfaces com o usuário
      ├── controllers/    # Controladores
      ├── middleware/     # Middlewares
      └── routes/         # Rotas da API
```

## Configuração

### Pré-requisitos

- Node.js (v14+)
- PostgreSQL

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
PORT=3000
NODE_ENV=development

# PostgreSQL Database Config
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=sacola_service
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

### Instalação

1. Clone o repositório:
```
git clone https://github.com/Sustenta-Bag/sacola-service.git
```

2. Instale as dependências:
```
cd sacola-service
npm install
```

3. Inicie o servidor de desenvolvimento:
```
npm run dev
```

## Endpoints da API

| Método | Endpoint                       | Descrição                              |
|--------|--------------------------------|----------------------------------------|
| POST   | /api/bags                      | Criar uma nova sacola                  |
| GET    | /api/bags                      | Listar todas as sacolas                |
| GET    | /api/bags/:id                  | Obter detalhes de uma sacola           |
| PUT    | /api/bags/:id                  | Atualizar informações de uma sacola    |
| DELETE | /api/bags/:id                  | Remover uma sacola                     |
| GET    | /api/company/:companyId/bags   | Listar sacolas de uma empresa          |
| GET    | /api/company/:companyId/bags/active | Listar sacolas ativas de uma empresa |
| PATCH  | /api/bags/:id/status           | Alterar o status de uma sacola         |

## Modelo de Dados

A entidade Sacola (Bag) possui os seguintes atributos:

| Campo       | Tipo          | Descrição                                   |
|-------------|---------------|---------------------------------------------|
| id          | INT           | Identificador único da sacola (idSacola)    |
| type        | ENUM          | Tipo da sacola: 'Doce', 'Salgada', 'Mista' |
| price       | FLOAT         | Preço da sacola                             |
| description | TEXT          | Descrição da sacola                         |
| companyId   | INT           | ID da empresa (vem do microserviço empresa) |
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
docker build -t sacola-service .
```

## Testes

Execute os testes com:

```
npm test
```

Para verificar a cobertura de testes:

```
npm run test:coverage
```

## Contribuindo

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

ISC