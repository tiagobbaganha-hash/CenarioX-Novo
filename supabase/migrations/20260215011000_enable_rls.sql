alter table public.users enable row level security;
alter table public.user_roles enable row level security;
alter table public.wallets enable row level security;
alter table public.ledger_entries enable row level security;
alter table public.transactions enable row level security;
alter table public.withdrawals enable row level security;
alter table public.deposits enable row level security;
alter table public.promo_redemptions enable row level security;
alter table public.audit_logs enable row level security;

create or replace function public.current_user_role_names()
returns text[]
language sql
security definer
set search_path = public
as $$
  select coalesce(array_agg(r.name), '{}')
  from public.user_roles ur
  join public.roles r on r.id = ur.role_id
  where ur.user_id = auth.uid()
    and ur.deleted_at is null;
$$;

create policy users_self_or_admin_select
on public.users
for select
using (
  id = auth.uid()
  or 'super_admin' = any (public.current_user_role_names())
  or 'admin' = any (public.current_user_role_names())
  or 'support' = any (public.current_user_role_names())
);

create policy users_self_update
on public.users
for update
using (id = auth.uid())
with check (id = auth.uid());

create policy transactions_owner_or_finance
on public.transactions
for select
using (
  user_id = auth.uid()
  or 'super_admin' = any (public.current_user_role_names())
  or 'admin' = any (public.current_user_role_names())
  or 'finance' = any (public.current_user_role_names())
);

create policy withdrawals_owner_or_finance
on public.withdrawals
for select
using (
  user_id = auth.uid()
  or 'super_admin' = any (public.current_user_role_names())
  or 'admin' = any (public.current_user_role_names())
  or 'finance' = any (public.current_user_role_names())
);

create policy deposits_owner_or_finance
on public.deposits
for select
using (
  user_id = auth.uid()
  or 'super_admin' = any (public.current_user_role_names())
  or 'admin' = any (public.current_user_role_names())
  or 'finance' = any (public.current_user_role_names())
);

create policy ledger_owner_or_finance
on public.ledger_entries
for select
using (
  user_id = auth.uid()
  or 'super_admin' = any (public.current_user_role_names())
  or 'admin' = any (public.current_user_role_names())
  or 'finance' = any (public.current_user_role_names())
  or 'analyst' = any (public.current_user_role_names())
);

create policy audit_admin_only
on public.audit_logs
for select
using (
  'super_admin' = any (public.current_user_role_names())
  or 'admin' = any (public.current_user_role_names())
);

create policy user_roles_admin_manage
on public.user_roles
for all
using (
  'super_admin' = any (public.current_user_role_names())
  or 'admin' = any (public.current_user_role_names())
)
with check (
  'super_admin' = any (public.current_user_role_names())
  or 'admin' = any (public.current_user_role_names())
);
