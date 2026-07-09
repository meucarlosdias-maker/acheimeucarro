-- ==========================================================
-- ACHEI MEU CARRO — INIT COMPLETO
-- Cole este arquivo INTEIRO no SQL Editor do Supabase
-- ==========================================================

create extension if not exists "pgcrypto";

-- 1. CIDADES -------------------------------------------------
create table if not exists cidades (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  uf text not null,
  slug text not null unique,
  ativa boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2. ADMINS ---------------------------------------------------
create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  nome text not null,
  email text not null unique,
  created_at timestamptz not null default now()
);

-- 3. REVENDAS -------------------------------------------------
create table if not exists revendas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  cidade_id uuid not null references cidades(id),
  nome text not null,
  slug text not null unique,
  email text,
  telefone text,
  whatsapp text,
  endereco text,
  cnpj text,
  website text,
  instagram text,
  facebook text,
  horario_funcionamento text,
  descricao text,
  logo_url text,
  status text not null default 'pendente' check (status in ('pendente', 'aprovada', 'bloqueada')),
  plano text check (plano in ('bronze', 'prata', 'ouro')),
  plano_duracao_meses int check (plano_duracao_meses in (3, 6, 12)),
  plano_inicio date,
  plano_fim date,
  created_at timestamptz not null default now()
);

-- 4. MARCAS / MODELOS -----------------------------------------
create table if not exists marcas (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique
);

create table if not exists modelos (
  id uuid primary key default gen_random_uuid(),
  marca_id uuid not null references marcas(id) on delete cascade,
  nome text not null,
  unique (marca_id, nome)
);

-- 5. VEICULOS -------------------------------------------------
create table if not exists veiculos (
  id uuid primary key default gen_random_uuid(),
  revenda_id uuid not null references revendas(id) on delete cascade,
  marca_id uuid not null references marcas(id),
  modelo_id uuid not null references modelos(id),
  versao text,
  ano_fab int,
  ano_modelo int,
  km int not null default 0,
  preco numeric(12,2) not null,
  combustivel text,
  cambio text,
  cor text,
  portas int,
  categoria text check (categoria in ('Sedã','Hatch','SUV','Picape','Utilitário')),
  video_url text,
  descricao text,
  status text not null default 'ativo' check (status in ('ativo','vendido','pausado')),
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- 6. FOTOS ----------------------------------------------------
create table if not exists veiculo_fotos (
  id uuid primary key default gen_random_uuid(),
  veiculo_id uuid not null references veiculos(id) on delete cascade,
  url text not null,
  ordem int not null default 0
);

-- 7. BANNERS HERO --------------------------------------------
create table if not exists banners_hero (
  id uuid primary key default gen_random_uuid(),
  ordem int not null default 0,
  imagem_url text not null,
  eyebrow text,
  titulo text not null,
  subtitulo text,
  texto_botao text,
  link_botao text,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

-- 8. BANNERS PROMOCIONAIS ------------------------------------
create table if not exists banners_promocionais (
  id uuid primary key default gen_random_uuid(),
  ordem int not null default 0,
  imagem_url text,
  titulo text not null,
  link_url text,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

-- 9. ÍNDICES --------------------------------------------------
create index if not exists idx_veiculos_status on veiculos(status);
create index if not exists idx_veiculos_revenda on veiculos(revenda_id);
create index if not exists idx_veiculos_marca on veiculos(marca_id);
create index if not exists idx_revendas_cidade on revendas(cidade_id);

-- ==========================================================
-- RLS
-- ==========================================================
alter table cidades enable row level security;
alter table admins enable row level security;
alter table revendas enable row level security;
alter table marcas enable row level security;
alter table modelos enable row level security;
alter table veiculos enable row level security;
alter table veiculo_fotos enable row level security;
alter table banners_hero enable row level security;
alter table banners_promocionais enable row level security;

-- (dropar policies antigas para garantir)
drop policy if exists "cidades_select_public" on cidades;
drop policy if exists "marcas_select_public" on marcas;
drop policy if exists "modelos_select_public" on modelos;
drop policy if exists "revendas_select_public" on revendas;
drop policy if exists "veiculos_select_public" on veiculos;
drop policy if exists "fotos_select_public" on veiculo_fotos;
drop policy if exists "banners_hero_select_public" on banners_hero;
drop policy if exists "banners_promo_select_public" on banners_promocionais;
drop policy if exists "revendas_update_own" on revendas;
drop policy if exists "veiculos_all_own" on veiculos;
drop policy if exists "fotos_all_own" on veiculo_fotos;
drop policy if exists "admin_all_revendas" on revendas;
drop policy if exists "admin_all_veiculos" on veiculos;
drop policy if exists "admin_all_cidades" on cidades;
drop policy if exists "admin_all_fotos" on veiculo_fotos;
drop policy if exists "admins_select_self" on admins;

-- PÚBLICO (leitura) ------------------------------------------
create policy "cidades_select_public" on cidades
  for select using (ativa = true);

create policy "marcas_select_public" on marcas
  for select using (true);

create policy "modelos_select_public" on modelos
  for select using (true);

create policy "revendas_select_public" on revendas
  for select using (status = 'aprovada');

create policy "veiculos_select_public" on veiculos
  for select using (status = 'ativo');

create policy "fotos_select_public" on veiculo_fotos
  for select using (
    exists (select 1 from veiculos v where v.id = veiculo_fotos.veiculo_id and v.status = 'ativo')
  );

create policy "banners_hero_select_public" on banners_hero
  for select using (ativo = true);

create policy "banners_promo_select_public" on banners_promocionais
  for select using (ativo = true);

-- REVENDA (próprio registro) ---------------------------------
create policy "revendas_select_own" on revendas
  for select using (auth.uid() = user_id);

create policy "revendas_insert_own" on revendas
  for insert with check (auth.uid() = user_id);

create policy "revendas_update_own" on revendas
  for update using (auth.uid() = user_id);

create policy "veiculos_all_own" on veiculos
  for all using (
    exists (select 1 from revendas r where r.id = veiculos.revenda_id and r.user_id = auth.uid())
  )
  with check (
    exists (select 1 from revendas r where r.id = veiculos.revenda_id and r.user_id = auth.uid())
  );

create policy "fotos_all_own" on veiculo_fotos
  for all using (
    exists (
      select 1 from veiculos v
      join revendas r on r.id = v.revenda_id
      where v.id = veiculo_fotos.veiculo_id and r.user_id = auth.uid()
    )
  );

-- ADMIN MASTER -------------------------------------------------
create policy "admins_select_self" on admins
  for select using (auth.uid() = user_id);

create policy "admin_all_revendas" on revendas
  for all using (exists (select 1 from admins where admins.user_id = auth.uid()))
  with check (exists (select 1 from admins where admins.user_id = auth.uid()));

create policy "admin_all_veiculos" on veiculos
  for all using (exists (select 1 from admins where admins.user_id = auth.uid()))
  with check (exists (select 1 from admins where admins.user_id = auth.uid()));

create policy "admin_all_cidades" on cidades
  for all using (exists (select 1 from admins where admins.user_id = auth.uid()))
  with check (exists (select 1 from admins where admins.user_id = auth.uid()));

create policy "admin_all_fotos" on veiculo_fotos
  for all using (exists (select 1 from admins where admins.user_id = auth.uid()))
  with check (exists (select 1 from admins where admins.user_id = auth.uid()));

-- ==========================================================
-- FUNÇÃO criar_revenda (security definer)
-- ==========================================================
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

-- ==========================================================
-- GRANTS
-- ==========================================================
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on revendas to authenticated;
grant insert, update, delete on veiculos to authenticated;
grant insert, update, delete on veiculo_fotos to authenticated;
grant insert, update, delete on cidades to authenticated;
grant all on admins to authenticated;
grant execute on function criar_revenda to anon, authenticated;

-- ==========================================================
-- SEED (opcional — descomente e adapte)
-- ==========================================================

-- Cidades
-- insert into cidades (nome, uf, slug, ativa) values
--   ('São Paulo', 'SP', 'sao-paulo', true),
--   ('Rio de Janeiro', 'RJ', 'rio-de-janeiro', true),
--   ('Belo Horizonte', 'MG', 'belo-horizonte', true),
--   ('Curitiba', 'PR', 'curitiba', true),
--   ('Porto Alegre', 'RS', 'porto-alegre', true),
--   ('Joinville', 'SC', 'joinville-sc', true);

-- Marcas
-- insert into marcas (nome) values
--   ('Chevrolet'), ('Fiat'), ('Ford'), ('Honda'), ('Hyundai'),
--   ('Jeep'), ('Nissan'), ('Renault'), ('Toyota'), ('Volkswagen');
