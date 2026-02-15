# Guia de Deploy - CenarioX

Este guia descreve como fazer deploy da plataforma CenarioX no **Cloudflare** com domínio **cenariox.com.br**.

---

## 1. Pré-requisitos

- Conta Cloudflare com domínio `cenariox.com.br` configurado
- Supabase remoto com migrations aplicadas
- Variáveis de ambiente configuradas

---

## 2. Deploy do Frontend Público (apps/web)

O frontend público usa arquivos estáticos copiados do layout original.

### Cloudflare Pages

```bash
cd apps/web
npx wrangler pages deploy . --project-name=cenariox-web --branch=main
```

- Configurar domínio customizado em Cloudflare Pages: `www.cenariox.com.br` ou `cenariox.com.br`

---

## 3. Deploy do Painel Administrativo (apps/admin)

```bash
cd apps/admin
npm run build
npx wrangler pages deploy dist --project-name=cenariox-admin --branch=main
```

- Configurar domínio: `admin.cenariox.com.br`
- Variáveis de ambiente no Cloudflare Pages: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 4. Deploy da API (apps/api)

### Opção A: Cloudflare Workers (requer adaptação)

A API atual usa Fastify, que precisa ser portada para o runtime do Workers. **Recomendação:** usar alternativa com Hono ou adaptar para Edge.

### Opção B: Container em provedor compatível (Railway, Render, Fly.io)

```bash
cd apps/api
docker build -t cenariox-api .
# Deploy no provedor escolhido
```

### Variáveis de Ambiente (API)

Configurar no painel do Cloudflare ou provedor:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
APPLE_CLIENT_ID
APPLE_TEAM_ID
APPLE_KEY_ID
APPLE_PRIVATE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
MERCADOPAGO_ACCESS_TOKEN
MERCADOPAGO_WEBHOOK_SECRET
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ZONE_ID
CLOUDFLARE_ACCOUNT_ID
JWT_SECRET
ENCRYPTION_KEY
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
SENTRY_DSN
APP_BASE_URL
```

---

## 5. Configuração de DNS no Cloudflare

| Tipo  | Nome              | Target                        | Proxy |
|-------|-------------------|-------------------------------|-------|
| CNAME | @                 | cenariox-web.pages.dev        | ✅    |
| CNAME | www               | cenariox-web.pages.dev        | ✅    |
| CNAME | admin             | cenariox-admin.pages.dev      | ✅    |
| A     | api               | <IP do container API>         | ✅    |

---

## 6. Aplicar Migrations no Supabase

1. Acesse o painel: https://supabase.com/dashboard/project/uhftjsgvjzctcrrpyxxn/editor
2. Execute em ordem:
   - `supabase/migrations/20260215010000_init_schema.sql`
   - `supabase/migrations/20260215011000_enable_rls.sql`

Ou via CLI (se instalada):

```bash
supabase db push
```

---

## 7. Configurar OAuth (Google + Apple)

### Google Cloud Console

1. Criar credenciais OAuth 2.0
2. Adicionar redirect: `https://uhftjsgvjzctcrrpyxxn.supabase.co/auth/v1/callback`
3. Configurar em Supabase Dashboard > Authentication > Providers > Google

### Apple Developer

1. Configurar Sign In with Apple no portal
2. Adicionar bundle: `com.cenariox.app`
3. Configurar em Supabase Dashboard > Authentication > Providers > Apple

---

## 8. Configurar Webhooks (Stripe + Mercado Pago)

### Stripe

URL: `https://api.cenariox.com.br/api/v1/payments/stripe/webhook`

- Adicionar secret em `STRIPE_WEBHOOK_SECRET`

### Mercado Pago

URL: `https://api.cenariox.com.br/api/v1/payments/mercadopago/webhook`

- Adicionar secret em `MERCADOPAGO_WEBHOOK_SECRET`

---

## 9. Segurança e Hardening

- **Rate Limit:** já implementado em `@fastify/rate-limit`
- **CORS:** configurado para aceitar domínios de produção
- **Headers de Segurança:** adicionar no Cloudflare (HSTS, CSP, etc.)
- **WAF:** habilitar regras no Cloudflare WAF

---

## 10. Observabilidade

- Configurar Sentry DSN em `SENTRY_DSN` para captura de erros
- Logs estruturados via Pino (API)
- Dashboard Cloudflare Analytics

---

## 11. Checklist Final

- [ ] Migrations aplicadas no Supabase
- [ ] DNS configurado no Cloudflare
- [ ] Variáveis de ambiente configuradas em produção
- [ ] OAuth Google e Apple funcionando
- [ ] Webhooks Stripe e Mercado Pago configurados
- [ ] Rate limit e RBAC testados
- [ ] Audit logs validados no Supabase
- [ ] Certificado SSL ativo (Cloudflare)
- [ ] Monitoramento ativo (Sentry)

---

**Após deploy, o site estará disponível em:**

- Frontend público: `https://www.cenariox.com.br`
- Admin: `https://admin.cenariox.com.br`
- API: `https://api.cenariox.com.br`
