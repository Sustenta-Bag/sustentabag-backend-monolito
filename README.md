# SustentaBag Backend Monolito

[![CI](https://github.com/Sustenta-Bag/sustentabag-backend-monolito/actions/workflows/ci.yml/badge.svg)](https://github.com/Sustenta-Bag/sustentabag-backend-monolito/actions/workflows/ci.yml)
[![Análise de Segurança](https://github.com/Sustenta-Bag/sustentabag-backend-monolito/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/Sustenta-Bag/sustentabag-backend-monolito/actions/workflows/codeql-analysis.yml)

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
tests/
  ├── unit/                 # Testes unitários
  │   ├── domain/           # Testes para o domínio
  │   ├── application/      # Testes para a aplicação
  │   └── infrastructure/   # Testes para a infraestrutura
  └── integration/          # Testes de integração
      └── api/              # Testes para os endpoints da API
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

## Testes

O projeto utiliza Jest para testes unitários e de integração:

### Estrutura de Testes

- **Testes Unitários**: Testam componentes individuais como entidades, serviços e repositórios
- **Testes de Integração**: Testam a interação entre componentes, como as APIs (em desenvolvimento)

### Executando Testes

```bash
# Executar testes unitários
npm test

# Executar testes de integração (em implementação)
npm run test:integration

# Executar todos os testes
npm run test:all

# Executar testes em modo watch (durante desenvolvimento)
npm run test:watch

# Verificar a cobertura de testes
npm run test:coverage

# Gerar relatório de cobertura HTML para testes
npm run test:coverage:html

# Gerar relatório de cobertura HTML apenas para testes unitários
npm run test:coverage:unit:html
```

### Relatórios de Cobertura HTML

Os relatórios de cobertura HTML fornecem uma visualização detalhada da cobertura de testes do projeto, facilitando a identificação de áreas que precisam de melhorias.

Para acessar os relatórios:

1. Execute um dos comandos de cobertura HTML: `npm run test:coverage:html` ou `npm run test:coverage:unit:html`
2. Use o comando `npm run coverage:open` para abrir automaticamente o relatório no navegador
   ou abra manualmente o arquivo `coverage/index.html` no seu navegador
3. Navegue pelos diretórios para verificar a cobertura de código específica

O relatório HTML inclui:
- Métricas de cobertura por arquivo e diretório
- Código fonte com destaque de linhas testadas e não testadas
- Resumo da cobertura de instruções, branches, funções e linhas

```bash
# Gerar e abrir o relatório de cobertura em um único comando
npm run test:coverage:unit:html && npm run coverage:open
```

### Estratégia de Testes

1. **Testes de Entidades**: Validam o comportamento das entidades de domínio
2. **Testes de Serviços**: Validam a lógica de negócio nos serviços da aplicação
3. **Testes de Repositórios**: Validam as operações de persistência
4. **Testes de API**: Validam as requisições HTTP e respostas (em implementação)

**Nota**: Os testes de integração para a API estão em desenvolvimento e serão implementados em versões futuras.

## CI/CD Pipeline

O projeto conta com pipelines de integração contínua (CI) usando GitHub Actions.

### Pipelines Disponíveis

1. **CI Pipeline (`ci.yml`)**: 
   - Executa em cada push para as branches principais (main, master, develop) e branches de feature (feature/*)
   - É acionada automaticamente quando um PR é aberto ou atualizado para as branches principais
   - Roda os testes unitários para verificar se o código está funcionando corretamente
   - Gera relatórios de cobertura de código para garantir qualidade
   - **Funciona em:** Repositórios públicos e privados

2. **Análise de Segurança (`codeql-analysis.yml`)**:
   - Executa análise de segurança usando GitHub CodeQL
   - Detecta vulnerabilidades de segurança no código
   - Executa em pushes para branches principais e de feature, pull requests, e semanalmente
   - **Funciona melhor em:** Repositórios públicos (gratuito) ou privados com GitHub Enterprise
   - **Comportamento em repositórios privados sem Enterprise:** Tentará executar, mas não publicará resultados se o Advanced Security não estiver habilitado

3. **Análise de Vulnerabilidades (`npm-audit.yml`)**:
   - Verifica dependências do projeto quanto a vulnerabilidades conhecidas
   - Gera relatórios detalhados com contagem de problemas por severidade
   - Funciona em qualquer tipo de repositório sem restrições
   - Realiza verificação semanal automática

4. **Fluxo de Branches e Tags (`branch-management.yml`)**:
   - Implementa o fluxo GitFlow automatizado entre branches feature → develop → main
   - Cria tags numeradas automaticamente na develop após merge de PRs
   - Permite promoção manual controlada de develop para main
   - Gera changelogs e releases no GitHub
   - Mantém histórico completo de versões

### Como usar o Gerenciamento de Branches e Tags

O projeto utiliza um workflow GitFlow simplificado e automatizado:

#### 1. Desenvolvimento em Feature Branches

1. Crie uma branch a partir da develop: `git checkout -b feature/nome-da-feature develop`
2. Desenvolva sua funcionalidade e faça commits
3. Envie para o GitHub: `git push origin feature/nome-da-feature`
4. Abra um Pull Request da sua feature para a branch **develop**

#### 2. Geração Automática de Tags na Develop

Quando um PR é aprovado e mergeado na develop:
- Um workflow automático é acionado
- Uma tag numerada é criada (exemplo: `dev-001`, `dev-002`)
- Um changelog é gerado com todas as alterações
- Não é necessária nenhuma ação manual

#### 3. Promoção para Main (Produção)

Quando quiser promover as alterações de develop para main (release):

1. Acesse a página do GitHub: `https://github.com/[seu-usuario]/sustentabag-backend-monolito/actions`
2. Clique no workflow "Fluxo de Branches e Tags"
3. Clique no botão "Run workflow"
4. Em "Promover develop para main", selecione **true**
5. Opcionalmente, forneça uma versão específica para a tag (ex: 1.0.0)
6. Clique em "Run workflow"

O processo:
- Cria uma nova tag de versão na main (ex: `v1.0.0`)
- Faz o merge da última tag da develop para a main
- Cria uma release no GitHub com changelog detalhado

#### 4. Visibilidade do Processo

Após a execução do workflow:
- A aba "Releases" do GitHub mostrará todas as versões oficiais
- As tags serão visíveis em `https://github.com/[seu-usuario]/sustentabag-backend-monolito/tags`
- O histórico de execuções do workflow exibirá os logs e relatórios

#### Exemplo de Uso

```bash
# Criar branch de feature a partir da develop
git checkout develop
git pull
git checkout -b feature/nova-funcionalidade

# Desenvolver e commitar
git add .
git commit -m "Implementa nova funcionalidade"
git push origin feature/nova-funcionalidade

# Após aprovação e merge do PR, a tag é criada automaticamente na develop
# Para promover para produção, use a interface web do GitHub Actions
```

#### Diagrama do Fluxo GitFlow Automatizado

```
Fluxo de trabalho:

  [feature/xyz]  ──merge PR──▶  [develop]  ──promoção manual─▶  [main]
                                   │                              │
                                   ▼                              ▼
                               tag: dev-001                  tag: v1.0.0
                               tag: dev-002                  tag: v1.0.1
                               tag: dev-003                  tag: v1.0.2
                                   │                              │
                                   └─────────── merge ────────────┘
```

#### Configuração Necessária para os Workflows

Para que os workflows funcionem corretamente, especialmente o gerenciamento automático de branches e tags, certifique-se de:

1. **Configurar sua identidade Git local**:
   ```bash
   git config --global user.name "Seu Nome"
   git config --global user.email "seu.email@exemplo.com"
   ```

2. **Configuração de Permissões para o Workflow**:

   **Opção A - Se você tem acesso administrativo às configurações de Actions**:
   - Acesse as configurações do repositório no GitHub
   - Vá para "Settings" > "Actions" > "General"
   - Em "Workflow permissions", selecione "Read and write permissions"
   - Marque a opção "Allow GitHub Actions to create and approve pull requests"
   - Clique em "Save"

   **Opção B - Se as permissões de workflow estão bloqueadas (comum em organizações)**:
   - Crie um Personal Access Token (PAT) com escopo `repo`:
     1. Acesse [https://github.com/settings/tokens](https://github.com/settings/tokens)
     2. Clique em "Generate new token" > "Generate new token (classic)"
     3. Dê um nome ao token, como "SustentaBag Workflow Token"
     4. Selecione o escopo `repo` completo
     5. Clique em "Generate token" e copie o token gerado
   - Adicione o token como um Secret no repositório:
     1. Vá para o repositório > "Settings" > "Secrets and variables" > "Actions"
     2. Clique em "New repository secret"
     3. Nome: `PERSONAL_ACCESS_TOKEN`
     4. Valor: cole o token que você copiou
     5. Clique em "Add secret"

3. **Criar Estrutura de Branches Inicial**:
   Se você ainda não tem as branches principais configuradas:
   ```bash
   # Criar branch develop a partir da main
   git checkout main
   git checkout -b develop
   git push origin develop
   ```

4. **Verificar Acesso em Repositórios Privados**:
   Em repositórios privados, você precisa ter permissão de administrador ou proprietário
   para que os workflows possam criar tags e fazer push para branches protegidas.

### Configuração para Diferentes Tipos de Repositórios

#### Para Repositórios Públicos
Todos os workflows funcionam sem configuração adicional. O GitHub Advanced Security está habilitado gratuitamente.

#### Para Repositórios Privados
- O workflow de testes (`ci.yml`) e o linting (`lint.yml`) funcionam normalmente
- O workflow de análise de segurança (`codeql-analysis.yml`) será executado, mas:
  - Não publicará resultados sem GitHub Advanced Security
  - Não impedirá outros workflows de funcionarem

#### Para Repositórios em Organizações
Para organizações com GitHub Enterprise, o administrador pode habilitar o Advanced Security para todos os repositórios nas configurações da organização.

## Contribuindo

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

ISC