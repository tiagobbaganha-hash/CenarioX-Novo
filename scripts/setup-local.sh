#!/usr/bin/env bash
set -e

echo "=== CenarioX Setup Local ==="

echo "1. Copiando .env.example para .env (ajuste com suas credenciais reais)"
if [[ ! -f ".env" ]]; then
  cp .env.example .env
  echo "   → .env criado. IMPORTANTE: Preencha todas as variáveis!"
else
  echo "   → .env já existe, pulando."
fi

echo ""
echo "2. Instalando dependências do monorepo"
npm install

echo ""
echo "3. Subindo infra local (Postgres + Redis) com Docker Compose"
docker compose up -d

echo ""
echo "4. Aguardando Postgres ficar pronto..."
sleep 3

echo ""
echo "5. Aplicando migrations no Supabase remoto"
echo "   → Visite https://supabase.com/dashboard/project/uhftjsgvjzctcrrpyxxn/editor"
echo "   → Execute manualmente os arquivos em supabase/migrations/ na ordem:"
echo "     - 20260215010000_init_schema.sql"
echo "     - 20260215011000_enable_rls.sql"
echo "   (ou utilize a CLI do Supabase se instalada)"

echo ""
echo "6. Compilando o projeto"
npm run build

echo ""
echo "✅ Setup completo! Execute 'npm run dev' para rodar local."
echo ""
echo "Serviços disponíveis:"
echo "  - API:   http://localhost:3001"
echo "  - Admin: http://localhost:5173"
echo "  - Web:   http://localhost:4173/index.html"
