#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function applyMigration(filePath) {
  console.log(`\n📦 Aplicando migration: ${path.basename(filePath)}`);
  
  const sql = fs.readFileSync(filePath, 'utf-8');
  
  // O SDK do Supabase não expõe execSQL diretamente, então usamos rpc com pg_stat_statements
  // ou aplicamos via SQL Editor manual
  
  console.log('⚠️  Por favor, aplique manualmente via SQL Editor:');
  console.log(`   ${supabaseUrl.replace('https://', 'https://supabase.com/dashboard/project/')}/sql/new`);
  console.log('');
  console.log('   Conteúdo do arquivo:');
  console.log('   ' + filePath);
}

async function checkTables() {
  console.log('\n🔍 Verificando tabelas existentes...');
  
  const { data: roles, error: rolesError } = await supabase.from('roles').select('name').limit(1);
  
  if (rolesError) {
    console.log('❌ Tabela "roles" não encontrada ou RLS impedindo acesso.');
    console.log('   Mensagem:', rolesError.message);
    return false;
  }
  
  console.log('✅ Tabela "roles" acessível!');
  console.log('   Dados:', roles);
  return true;
}

async function main() {
  console.log('=== Verificador de Migrations Supabase ===\n');
  console.log(`📡 Conectando em: ${supabaseUrl}`);
  
  const tablesExist = await checkTables();
  
  if (!tablesExist) {
    console.log('\n📝 Migrations precisam ser aplicadas manualmente:');
    applyMigration(path.join(__dirname, '../supabase/migrations/20260215010000_init_schema.sql'));
    applyMigration(path.join(__dirname, '../supabase/migrations/20260215011000_enable_rls.sql'));
  } else {
    console.log('\n✅ Migrations já aplicadas ou banco configurado!');
  }
}

main().catch(console.error);
