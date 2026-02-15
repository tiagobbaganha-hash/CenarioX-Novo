# 🚀 GUIA DE APLICAÇÃO DE MIGRATIONS

## Passo a Passo

### 1. Acesse o SQL Editor do Supabase

Abra o link abaixo no seu navegador:

```
https://supabase.com/dashboard/project/uhftjsgvjzctcrrpyxxn/sql/new
```

---

### 2. Aplique a Migration 1 (Schema Inicial)

Copie TODO o conteúdo do arquivo:

```
supabase/migrations/20260215010000_init_schema.sql
```

Cole no SQL Editor e clique em **RUN**.

✅ **Sucesso:** Você verá "Success. No rows returned" ou similar.

---

### 3. Aplique a Migration 2 (RLS)

Copie TODO o conteúdo do arquivo:

```
supabase/migrations/20260215011000_enable_rls.sql
```

Cole no SQL Editor e clique em **RUN**.

✅ **Sucesso:** Você verá "Success. No rows returned" ou similar.

---

### 4. Verifique se tudo foi criado

Execute a query abaixo no SQL Editor:

```sql
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

✅ **Esperado:** Você deve ver as seguintes tabelas:

- assets
- audit_logs
- cms_blocks
- deposits
- ledger_entries
- permissions
- promo_codes
- promo_redemptions
- role_permissions
- roles
- transactions
- user_roles
- users
- wallets
- withdrawals

---

### 5. Verifique se RLS está habilitado

Execute:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true;
```

✅ **Esperado:** Você deve ver pelo menos:

- users
- user_roles
- wallets
- ledger_entries
- transactions
- withdrawals
- deposits
- audit_logs

---

### 6. Verifique os papéis/roles foram criados

Execute:

```sql
SELECT * FROM public.roles ORDER BY name;
```

✅ **Esperado:**

- admin
- analyst
- finance
- super_admin
- support
- user

---

### 7. Teste a conexão local

Execute no terminal do projeto:

```bash
node scripts/verify-supabase.mjs
```

✅ **Esperado:** Deve exibir "✅ Migrations já aplicadas ou banco configurado!"

---

## ⚠️ Troubleshooting

### Erro: "relation already exists"

Isso significa que a migration já foi aplicada antes. Pode ignorar se as tabelas existem.

### Erro: "permission denied"

Certifique-se de estar usando a service role key, não a anon key.

### Erro na RLS Policy

Verifique se a função `current_user_role_names()` foi criada corretamente na migration 2.

---

## 📝 Observações

- As migrations são **idempotentes** (usam `IF NOT EXISTS` e `ON CONFLICT`)
- Pode executar múltiplas vezes sem problema
- Se der erro, consulte os logs no painel do Supabase

---

**Após aplicar as migrations, a API estará pronta para rodar!**
