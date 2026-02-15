#!/usr/bin/env bash
set -e

SUPABASE_URL="https://uhftjsgvjzctcrrpyxxn.supabase.co"
SUPABASE_SERVICE_ROLE="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoZnRqc2d2anpjdGNycnB5eHhuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDg0Mzg5OSwiZXhwIjoyMDg2NDE5ODk5fQ.Xt1-FxfLTFqNyr0P3vUn6z_gq6r-kxfwad2-vXPbxIc"

echo "=== Executando migrations no Supabase remoto ==="

echo "📦 Aplicando 20260215010000_init_schema.sql"
curl -X POST "${SUPABASE_URL}/rest/v1/rpc/exec_sql" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE}" \
  -H "Content-Type: application/json" \
  --data @<(echo "{\"query\": $(jq -Rs . < supabase/migrations/20260215010000_init_schema.sql)}") \
  || echo "⚠️  Migration pode ter falhado ou já foi aplicada."

echo ""
echo "🔐 Aplicando 20260215011000_enable_rls.sql"
curl -X POST "${SUPABASE_URL}/rest/v1/rpc/exec_sql" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE}" \
  -H "Content-Type: application/json" \
  --data @<(echo "{\"query\": $(jq -Rs . < supabase/migrations/20260215011000_enable_rls.sql)}") \
  || echo "⚠️  Migration pode ter falhado ou já foi aplicada."

echo ""
echo "✅ Migrations executadas! Verifique no painel do Supabase."
