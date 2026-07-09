-- ==========================================================
-- MIGRAÇÃO: Banners Promocionais
-- Execute no SQL Editor do Supabase
-- ==========================================================

create table if not exists banners_promocionais (
  id uuid primary key default gen_random_uuid(),
  ordem int not null default 0,
  imagem_url text,
  titulo text,
  link_url text,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table banners_promocionais enable row level security;

create policy "banners_promocionais_select_public" on banners_promocionais
  for select using (ativo = true);

grant select on banners_promocionais to anon;
grant all on banners_promocionais to authenticated;
