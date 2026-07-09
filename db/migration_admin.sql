-- ==========================================================
-- MIGRAÇÃO: Painel Master - Admin, Planos, Expiração
-- Execute no SQL Editor do Supabase
-- ==========================================================

-- 1. TABELA DE ADMINS ---------------------------------------
create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  nome text not null,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table admins enable row level security;

create policy "admins_select_self" on admins
  for select using (auth.uid() = user_id);

-- 2. NOVAS COLUNAS EM REVENDAS ------------------------------
alter table revendas add column if not exists email text;
alter table revendas add column if not exists cnpj text;
alter table revendas add column if not exists website text;
alter table revendas add column if not exists instagram text;
alter table revendas add column if not exists facebook text;
alter table revendas add column if not exists descricao text;
alter table revendas add column if not exists horario_funcionamento text;

-- Planos
alter table revendas add column if not exists plano text
  check (plano in ('bronze', 'prata', 'ouro'));

alter table revendas add column if not exists plano_duracao_meses int
  check (plano_duracao_meses in (3, 6, 12));

alter table revendas add column if not exists plano_inicio date;
alter table revendas add column if not exists plano_fim date;

-- 3. PERMISSÕES ----------------------------------------------
grant select on admins to anon;
grant all on admins to authenticated;

grant select on revendas to anon;
grant all on revendas to authenticated;
