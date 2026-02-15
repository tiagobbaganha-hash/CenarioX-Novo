# FASE 1 - Estrutura Inicial

## Entregáveis

1. Monorepo estruturado (`apps/web`, `apps/admin`, `apps/api`, `packages/db`)
2. Layout legado copiado para `apps/web`
3. Backend TypeScript com Auth + RBAC + Audit Log
4. Migrations SQL iniciais versionadas em `supabase/migrations`
5. `.env.example` completo sem valores

## Checklist de segurança

- [x] Sem segredos em código/README
- [x] Variáveis obrigatórias declaradas em `.env.example`
- [x] Validação de payload com Zod
- [x] Rate limit por IP
- [x] RBAC por papel (`super_admin`, `admin`, `finance`, `support`, `analyst`, `user`)
- [x] Audit log automático por requisição API
- [x] RLS habilitado nas tabelas sensíveis

## Variáveis de ambiente usadas

Ver `.env.example`.

## Comandos de execução

```bash
npm install
docker compose up -d
npm run dev
```

## Deploy (resumo)

- `apps/web` e `apps/admin`: Cloudflare Pages
- `apps/api`: Cloudflare Workers / container em provedor compatível
- DNS em `cenariox.com.br` via Cloudflare
