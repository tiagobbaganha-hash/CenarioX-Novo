create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key,
  email text not null unique,
  status text not null default 'active',
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

create table if not exists public.user_roles (
  user_id uuid not null references public.users(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz,
  primary key (user_id, role_id)
);

create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  currency text not null default 'BRL',
  balance numeric(18,2) not null default 0,
  winning_balance numeric(18,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, currency)
);

create table if not exists public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  entry_type text not null,
  amount numeric(18,2) not null,
  balance_after numeric(18,2) not null,
  reference_type text,
  reference_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  provider text not null,
  provider_ref text,
  amount numeric(18,2) not null,
  currency text not null default 'BRL',
  status text not null,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.withdrawals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  amount numeric(18,2) not null,
  status text not null default 'pending',
  wallet text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.deposits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  amount numeric(18,2) not null,
  provider text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  bonus_type text not null,
  bonus_value numeric(18,2) not null,
  max_redemptions int,
  active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.promo_redemptions (
  id uuid primary key default gen_random_uuid(),
  promo_code_id uuid not null references public.promo_codes(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  redeemed_at timestamptz not null default now(),
  unique (promo_code_id, user_id)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid,
  action text not null,
  resource text,
  method text,
  status_code int,
  ip_address text,
  user_agent text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  url text not null,
  kind text not null,
  metadata jsonb,
  created_by uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.cms_blocks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content jsonb not null,
  status text not null default 'draft',
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_transactions_user on public.transactions(user_id, created_at desc);
create index if not exists idx_withdrawals_user on public.withdrawals(user_id, created_at desc);
create index if not exists idx_deposits_user on public.deposits(user_id, created_at desc);
create index if not exists idx_ledger_user on public.ledger_entries(user_id, created_at desc);
create index if not exists idx_audit_created on public.audit_logs(created_at desc);

insert into public.roles(name, description)
values
  ('super_admin', 'Acesso total'),
  ('admin', 'Admin geral'),
  ('finance', 'Equipe financeira'),
  ('support', 'Equipe de suporte'),
  ('analyst', 'Equipe de análise'),
  ('user', 'Usuário final')
on conflict (name) do nothing;

insert into public.permissions(code, description)
values
  ('dashboard.read', 'Ler dashboard'),
  ('users.manage', 'Gerenciar usuários'),
  ('roles.manage', 'Gerenciar papéis'),
  ('finance.read', 'Ler finanças'),
  ('finance.manage', 'Gerenciar finanças'),
  ('cms.manage', 'Gerenciar CMS'),
  ('assets.manage', 'Gerenciar assets'),
  ('audit.read', 'Ler audit logs')
on conflict (code) do nothing;
