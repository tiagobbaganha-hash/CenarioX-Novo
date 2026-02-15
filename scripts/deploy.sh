#!/usr/bin/env bash
set -e

echo "=== Deploy CenarioX para Cloudflare e Container ==="
echo ""

echo "📦 1. Build do monorepo"
npm run build

echo ""
echo "🌐 2. Deploy do Frontend Público (Web) no Cloudflare Pages"
cd apps/web
npx wrangler pages deploy . --project-name=cenariox-web --branch=main || echo "⚠️  Erro ao fazer deploy do web"
cd ../..

echo ""
echo "🔑 3. Deploy do Admin no Cloudflare Pages"
cd apps/admin
npx wrangler pages deploy dist --project-name=cenariox-admin --branch=main || echo "⚠️  Erro ao fazer deploy do admin"
cd ../..

echo ""
echo "🚀 4. Build da imagem Docker da API"
cd apps/api
docker build -t cenariox-api:latest . || echo "⚠️  Erro ao buildar imagem Docker"
cd ../..

echo ""
echo "📤 5. Push da API (configurar manualmente no Railway/Fly.io/Render)"
echo "   → Railway: railway up"
echo "   → Fly.io: fly deploy"
echo "   → Render: conectar ao Git e configurar build"

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "Próximos passos:"
echo "  - Configure variáveis de ambiente em cada plataforma"
echo "  - Configure DNS no Cloudflare conforme docs/DEPLOY.md"
echo "  - Aplique migrations no Supabase via SQL Editor"
echo "  - Configure webhooks do Stripe e Mercado Pago"
