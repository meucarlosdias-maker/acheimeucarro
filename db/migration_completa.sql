-- ==========================================================
-- MIGRAÇÃO COMPLETA — Execute no SQL Editor do Supabase
-- Inclui: colunas, RLS, função criar_revenda, permissões
-- ==========================================================

-- 1. GARANTIR COLUNAS EM REVENDAS ---------------------------
alter table revendas add column if not exists email text;
alter table revendas add column if not exists cnpj text;
alter table revendas add column if not exists website text;
alter table revendas add column if not exists instagram text;
alter table revendas add column if not exists facebook text;
alter table revendas add column if not exists descricao text;
alter table revendas add column if not exists horario_funcionamento text;

alter table revendas add column if not exists plano text
  check (plano in ('bronze', 'prata', 'ouro'));

alter table revendas add column if not exists plano_duracao_meses int
  check (plano_duracao_meses in (3, 6, 12));

alter table revendas add column if not exists plano_inicio date;
alter table revendas add column if not exists plano_fim date;

-- 2. GARANTIR QUE cidade_id EXISTE --------------------------
alter table revendas alter column cidade_id set not null;

-- 3. DROPAR POLICIES ANTIGAS E RECRIAR ----------------------
drop policy if exists "admin_all_revendas" on revendas;
drop policy if exists "admin_all_veiculos" on veiculos;
drop policy if exists "admin_all_fotos" on veiculo_fotos;
drop policy if exists "admin_all_cidades" on cidades;
drop policy if exists "revenda_insert_own" on revendas;
drop policy if exists "revenda_select_own" on revendas;
drop policy if exists "revenda_update_own2" on revendas;
drop policy if exists "admins_select_self" on admins;

-- Admin: acesso total (USING + WITH CHECK)
create policy "admin_all_revendas" on revendas
  for all using (exists (select 1 from admins where admins.user_id = auth.uid()))
  with check (exists (select 1 from admins where admins.user_id = auth.uid()));

create policy "admin_all_veiculos" on veiculos
  for all using (exists (select 1 from admins where admins.user_id = auth.uid()))
  with check (exists (select 1 from admins where admins.user_id = auth.uid()));

create policy "admin_all_cidades" on cidades
  for all using (exists (select 1 from admins where admins.user_id = auth.uid()))
  with check (exists (select 1 from admins where admins.user_id = auth.uid()));

-- Revenda: insert próprio (para cadastro), select próprio
create policy "revenda_insert_own" on revendas
  for insert with check (auth.uid() = user_id);

create policy "revenda_select_own" on revendas
  for select using (auth.uid() = user_id);

create policy "revenda_update_own" on revendas
  for update using (auth.uid() = user_id);

-- Admin: select próprio
create policy "admins_select_self" on admins
  for select using (auth.uid() = user_id);

-- 4. FUNÇÃO criar_revenda (security definer) -----------------
create or replace function criar_revenda(
  p_nome text,
  p_slug text,
  p_email text,
  p_user_id uuid,
  p_cidade_id uuid,
  p_telefone text default null,
  p_whatsapp text default null,
  p_endereco text default null,
  p_cnpj text default null,
  p_website text default null,
  p_instagram text default null,
  p_facebook text default null,
  p_horario_funcionamento text default null,
  p_descricao text default null
)
returns void
language plpgsql
security definer
as $$
begin
  insert into revendas (nome, slug, email, user_id, cidade_id, telefone, whatsapp, endereco, cnpj, website, instagram, facebook, horario_funcionamento, descricao, status)
  values (p_nome, p_slug, p_email, p_user_id, p_cidade_id, p_telefone, p_whatsapp, p_endereco, p_cnpj, p_website, p_instagram, p_facebook, p_horario_funcionamento, p_descricao, 'aprovada');
end;
$$;

-- 5. PERMISSÕES ----------------------------------------------
grant select on admins to anon;
grant all on admins to authenticated;

grant select on revendas to anon;
grant all on revendas to authenticated;

grant select on cidades to anon;
grant all on cidades to authenticated;

grant execute on function criar_revenda to anon;
grant execute on function criar_revenda to authenticated;

-- 6. GRANTS GLOBAIS ------------------------------------------
grant usage on schema public to anon;
grant usage on schema public to authenticated;
grant select on all tables in schema public to anon;
grant select on all tables in schema public to authenticated;
