-- Habilita RLS (caso ainda não esteja)
alter table banners_hero enable row level security;
alter table banners_promocionais enable row level security;

-- Policy: admin pode fazer tudo em banners_hero
drop policy if exists "admin_all_banners_hero" on banners_hero;
create policy "admin_all_banners_hero" on banners_hero
  for all using (exists (select 1 from admins where admins.user_id = auth.uid()))
  with check (exists (select 1 from admins where admins.user_id = auth.uid()));

-- Policy: admin pode fazer tudo em banners_promocionais
drop policy if exists "admin_all_banners_promo" on banners_promocionais;
create policy "admin_all_banners_promo" on banners_promocionais
  for all using (exists (select 1 from admins where admins.user_id = auth.uid()))
  with check (exists (select 1 from admins where admins.user_id = auth.uid()));

-- Grants para authenticated (necessário para o RLS funcionar com usuário logado)
grant insert, update, delete on banners_hero to authenticated;
grant insert, update, delete on banners_promocionais to authenticated;
