#!/usr/bin/env bash
set -e

echo "=== Aplicar Migrations no Supabase - Guia Manual ==="
echo ""
echo "1. Acesse o SQL Editor do Supabase:"
echo "   https://supabase.com/dashboard/project/uhftjsgvjzctcrrpyxxn/sql/new"
echo ""
echo "2. Copie e execute o conteúdo de cada migration na ordem:"
echo ""
echo "   ▶️  supabase/migrations/20260215010000_init_schema.sql"
echo "   ▶️  supabase/migrations/20260215011000_enable_rls.sql"
echo ""
echo "3. Verifique se as tabelas foram criadas:"
echo "   - users, roles, permissions, user_roles"
echo "   - wallets, ledger_entries, transactions, withdrawals, deposits"
echo "   - promo_codes, audit_logs, assets, cms_blocks"
echo ""
echo "4. Verifique se RLS está habilitado:"
echo "   SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';"
echo ""
echo "5. Teste conexão local:"

cat << 'EOF'

node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
supabase.from('roles').select('*').then(({ data, error }) => {
  if (error) console.error('❌ Erro:', error.message);
  else console.log('✅ Roles encontradas:', data);
});
"
EOF

echo ""
echo "📝 Migrations estão em: supabase/migrations/"
