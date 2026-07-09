-- Grants para authenticated
grant insert, update, delete on banners_hero to authenticated;
grant insert, update, delete on banners_promocionais to authenticated;
grant insert on marcas to authenticated;
grant insert on modelos to authenticated;

-- Policy: authenticated pode inserir marcas
drop policy if exists "marcas_insert_auth" on marcas;
create policy "marcas_insert_auth" on marcas
  for insert with check (auth.role() = 'authenticated');

-- Policy: authenticated pode inserir modelos
drop policy if exists "modelos_insert_auth" on modelos;
create policy "modelos_insert_auth" on modelos
  for insert with check (auth.role() = 'authenticated');

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
