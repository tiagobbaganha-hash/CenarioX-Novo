# CenarioX Platform (Monorepo)

Estrutura inicial para a plataforma de marketing preditivo com:

- `apps/web`: frontend público (layout existente importado)
- `apps/admin`: painel administrativo (React + Vite + TypeScript)
- `apps/api`: backend escalável (Fastify + TypeScript + Zod)
- `packages/db`: SQL versionado e artefatos de banco/RLS

## Requisitos

- Node.js 20+
- Docker (opcional para Postgres/Redis locais)

## Setup rápido

Execute o script de setup local:

```bash
./scripts/setup-local.sh
```

Ou manualmente:

```bash
# 1. Copie .env.example para .env e preencha os valores
cp .env.example .env

# 2. Instale dependências
npm install

# 3. (Opcional) Suba infraestrutura local
docker compose up -d

# 4. Rode apps em paralelo
npmEstrutura do Projeto

```
CenarioX-Novo/
├── apps/
│   ├── web/           # Frontend público (layout legado)
│   ├── admin/         # Painel administrativo (React + Vite)
│   └── api/           # Backend (Fastify + TypeScript + Zod)
├── packages/
│   └── db/            # Migrations SQL e schemas
├── supabase/
│   └── migrations/    # Migrations versionadas com RLS
├── scripts/           # Scripts de automação (setup, deploy)
├── docs/              # Documentação detalhada
├── .env.example       # Template de variáveis de ambiente
└── docker-compose.yml # Postgres + Redis locais
```

---detalhes.

---

## Deploy em Produção

```bash
./scripts/deploy.sh
```

Siga os passos descritos em [docs/DEPLOY.md](docs/DEPLOY.md) para configurar DNS, variáveis de ambiente e webhooks.

---

## Documentação

- [Fase 1 - Estrutura Inicial](docs/PHASE1.md)
- [Guia de Execução Local](docs/LOCAL.md)
- [Guia de Deploy](docs/DEPLOY.md)

## Fases

- Fase 1 entregue em `docs/PHASE1.md`
- Próximas fases: ver backlog no documento de fase

## Segurança

- Sem segredos hardcoded
- Todas as credenciais lidas por variável de ambiente
- Validação com Zod nos endpoints
- Rate limit + RBAC + Audit Log no backend
