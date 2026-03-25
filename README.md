# Brain Agriculture API

API REST para gerenciamento de produtores rurais — NestJS · TypeScript · PostgreSQL · Docker.

---

## Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose
- [Node.js 20+](https://nodejs.org/) (somente para rodar localmente sem Docker)

---

## Rodar com Docker (recomendado)

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd brain-agriculture

# 2. Suba os containers (API + PostgreSQL)
docker-compose up -d

# 3. Acesse
# API:     http://localhost:3000/api/v1
# Swagger: http://localhost:3000/docs
```

> O banco é criado e as tabelas sincronizadas automaticamente na primeira inicialização.

---

## Rodar localmente (sem Docker)

```bash
# 1. Instale as dependências
npm install

# 2. Configure as variáveis de ambiente
cp .env.example .env

# 3. Suba apenas o banco via Docker
docker-compose up -d postgres

# 4. Inicie a API em modo desenvolvimento
npm run start:dev
```

---

## Popular o banco com dados de exemplo

```bash
npm run seed
```

Isso cria **6 produtores**, **11 fazendas**, **18 safras** e **33 culturas** prontos para testar.

---

## Rodar os testes

```bash
# Todos os testes unitários
npm test

# Com relatório de cobertura
npm run test:cov
```

---

## Documentação da API

Com a aplicação rodando, acesse **http://localhost:3000/docs** para a interface Swagger com todos os endpoints documentados e testáveis.

### Endpoints disponíveis

| Recurso | Rota base |
|---|---|
| Produtores | `GET/POST /api/v1/producers` |
| Produtor | `GET/PUT/DELETE /api/v1/producers/:id` |
| Fazendas | `GET/POST /api/v1/farms` |
| Fazenda | `GET/PUT/DELETE /api/v1/farms/:id` |
| Safras | `GET/POST /api/v1/harvests` |
| Safra | `GET/PUT/DELETE /api/v1/harvests/:id` |
| Culturas | `GET/POST /api/v1/crops` |
| Cultura | `GET/PUT/DELETE /api/v1/crops/:id` |
| Dashboard | `GET /api/v1/dashboard` |

---

## pgAdmin

Acesse **http://localhost:5050** — login `admin@admin.com` / `admin`.

Conexão com o banco:

| Host | Port | Database | Username | Password |
|---|---|---|---|---|
| `localhost` | `5432` | `brain_agriculture` | `postgres` | `postgres` |

---

## Estrutura do projeto

```
src/
├── common/
│   ├── decorators/         # IsValidDocument (CPF/CNPJ)
│   ├── filters/            # HttpExceptionFilter
│   ├── interceptors/       # LoggingInterceptor, TransformInterceptor
│   ├── interfaces/         # IApiResponse, IBaseRepository
│   ├── strategies/         # CpfValidationStrategy, CnpjValidationStrategy, DocumentValidatorContext
│   └── types/
├── database/
│   └── seeds/              # Dados de exemplo
└── modules/
    ├── producers/
    │   ├── dto/
    │   ├── entities/
    │   ├── factories/       # ProducerFactory
    │   ├── interfaces/
    │   ├── mappers/         # ProducerMapper
    │   ├── repositories/    # ProducerRepository
    │   └── types/
    ├── farms/               # mesma estrutura + FarmFactory, FarmMapper, FarmRepository
    ├── harvests/            # mesma estrutura + HarvestMapper, HarvestRepository
    ├── crops/               # mesma estrutura + CropMapper, CropRepository
    └── dashboard/           # DashboardMapper
```

### Design Patterns

| Pattern | Onde |
|---|---|
| **Strategy** | Validação de CPF/CNPJ — `CpfValidationStrategy`, `CnpjValidationStrategy`, `DocumentValidatorContext` |
| **Repository** | Acesso ao banco — `ProducerRepository`, `FarmRepository`, `HarvestRepository`, `CropRepository` |
| **Factory** | Criação de entidades — `ProducerFactory`, `FarmFactory` |
| **Mapper** | Transformação entity → response — `ProducerMapper`, `FarmMapper`, `HarvestMapper`, `CropMapper`, `DashboardMapper` |

---

## Variáveis de ambiente

O arquivo `.env.example` contém todas as variáveis com seus valores padrão para desenvolvimento local.