# Execução Local - CenarioX

## Setup rápido

```bash
# 1. Clone o repositório
git clone <repo-url>
cd CenarioX-Novo

# 2. Execute o script de setup
./scripts/setup-local.sh

# 3. Preencha o arquivo .env com suas credenciais
# (Use .env.example como referência)

# 4. Inicie os serviços
npm run dev
```

---

## Executando individualmente

### API (Backend)

```bash
npm run dev:api
# ou
cd apps/api
npm run dev
```

- Porta padrão: **3001**
- Health check: `http://localhost:3001/health`

### Admin (Painel)

```bash
npm run dev:admin
# ou
cd apps/admin
npm run dev
```

- Porta padrão: **5173**
- URL: `http://localhost:5173`

### Web (Frontend Público)

```bash
npm run dev:web
# ou
cd apps/web
npm run dev
```

- Porta padrão: **4173**
- URL: `http://localhost:4173/index.html`

---

## Infraestrutura Local (Docker Compose)

O projeto inclui Postgres e Redis locais para desenvolvimento:

```bash
# Subir containers
docker compose up -d

# Ver logs
docker compose logs -f

# Parar containers
docker compose down

# Limpar volumes
docker compose down -v
```

**Conexões:**

- Postgres: `postgresql://cenariox:cenariox@localhost:5432/cenariox`
- Redis: `redis://localhost:6379`

---

## Aplicar Migrations

As migrations SQL estão em `supabase/migrations/`.

### Supabase Remoto (recomendado)

1. Acesse: https://supabase.com/dashboard/project/uhftjsgvjzctcrrpyxxn/editor
2. Execute os arquivos na ordem:
   - `20260215010000_init_schema.sql`
   - `20260215011000_enable_rls.sql`

### Supabase CLI (opcional)

```bash
supabase db push
```

---

## Testes

```bash
# Rodar todos os testes
npm run test

# Testar apenas API
npm run test -w apps/api

# Testar com coverage
npm run test -- --coverage
```

---

## Build de Produção

```bash
# Build total
npm run build

# Build por workspace
npm run build -w apps/api
npm run build -w apps/admin
npm run build -w apps/web
```

---

## Validar TypeScript

```bash
# Lint total
npm run lint

# Lint por workspace
npm run lint -w apps/api
npm run lint -w apps/admin
```

---

## Estrutura de portas

| Serviço       | Porta | URL                                      |
|---------------|-------|------------------------------------------|
| API           | 3001  | http://localhost:3001                    |
| Admin         | 5173  | http://localhost:5173                    |
| Web (Legacy)  | 4173  | http://localhost:4173/index.html         |
| Postgres      | 5432  | postgresql://localhost:5432/cenariox     |
| Redis         | 6379  | redis://localhost:6379                   |

---

## Comandos úteis

```bash
# Reinstalar dependências
rm -rf node_modules apps/*/node_modules packages/*/node_modules
npm install

# Atualizar dependências
npm update --workspaces

# Ver árvore de workspaces
npm ls --workspaces

# Ver variáveis de ambiente carregadas
cd apps/api && node -e "require('dotenv').config(); console.log(process.env)"
```

---

## Troubleshooting

### Erro de porta já em uso

```bash
# Identificar processo usando a porta
lsof -ti:3001 | xargs kill -9
```

### Erro de conexão com Supabase

Verifique se o `.env` tem os valores corretos:

```bash
grep SUPABASE .env
```

### Erro de build em apps/api

```bash
cd apps/api
rm -rf dist node_modules
npm install
npm run build
```

---

**Dúvidas?** Consulte [PHASE1.md](PHASE1.md) ou [DEPLOY.md](DEPLOY.md).
