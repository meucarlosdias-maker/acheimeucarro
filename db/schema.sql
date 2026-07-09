-- ==========================================================
-- ACHEI MEU CARRO — SCHEMA INICIAL (Fase 2)
-- Cole este arquivo inteiro no SQL Editor do seu projeto Supabase
-- ==========================================================

create extension if not exists "pgcrypto";

-- CIDADES ---------------------------------------------------
create table if not exists cidades (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  uf text not null,
  slug text not null unique,
  ativa boolean not null default true,
  created_at timestamptz not null default now()
);

-- REVENDAS ----------------------------------------------------
-- user_id é o dono (login) da revenda no painel administrativo (Fase 3)
create table if not exists revendas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  cidade_id uuid not null references cidades(id),
  nome text not null,
  slug text not null unique,
  endereco text,
  telefone text,
  whatsapp text,
  logo_url text,
  status text not null default 'pendente' check (status in ('pendente', 'aprovada', 'bloqueada')),
  created_at timestamptz not null default now()
);

-- MARCAS / MODELOS ---------------------------------------------
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

-- VEICULOS -------------------------------------------------------
create table if not exists veiculos (
  id uuid primary key default gen_random_uuid(),
  revenda_id uuid not null references revendas(id) on delete cascade,
  marca_id uuid not null references marcas(id),
  modelo_id uuid not null references modelos(id),
  versao text,
  ano_fab int,
  ano_modelo int,
  km int not null default 0,
  preco numeric(12, 2) not null,
  combustivel text,
  cambio text,
  cor text,
  portas int,
  categoria text check (categoria in ('Sedã', 'Hatch', 'SUV', 'Picape', 'Utilitário')),
  descricao text,
  status text not null default 'ativo' check (status in ('ativo', 'vendido', 'pausado')),
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- FOTOS DOS VEICULOS ----------------------------------------------
create table if not exists veiculo_fotos (
  id uuid primary key default gen_random_uuid(),
  veiculo_id uuid not null references veiculos(id) on delete cascade,
  url text not null,
  ordem int not null default 0
);

-- BANNERS DO HERO (gerenciados pelo admin master do portal) --------
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

-- ÍNDICES ÚTEIS -----------------------------------------------------
create index if not exists idx_veiculos_status on veiculos(status);
create index if not exists idx_veiculos_revenda on veiculos(revenda_id);
create index if not exists idx_veiculos_marca on veiculos(marca_id);
create index if not exists idx_revendas_cidade on revendas(cidade_id);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================================
alter table cidades enable row level security;
alter table revendas enable row level security;
alter table marcas enable row level security;
alter table modelos enable row level security;
alter table veiculos enable row level security;
alter table veiculo_fotos enable row level security;
alter table banners_hero enable row level security;

-- Leitura pública (o site inteiro usa isso) -------------------------
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

create policy "banners_select_public" on banners_hero
  for select using (ativo = true);

-- Escrita: cada revenda só mexe no que é dela (usaremos de verdade na Fase 3,
-- mas já deixamos a regra pronta e ativa desde já)
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
