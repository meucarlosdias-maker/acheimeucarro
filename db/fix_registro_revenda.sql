-- ==========================================================
-- Permite revenda se cadastrar + admin aprovar
-- Execute no SQL Editor do Supabase
-- ==========================================================

drop policy if exists "admin_all_revendas" on revendas;
drop policy if exists "admin_all_veiculos" on veiculos;
drop policy if exists "admin_all_fotos" on veiculo_fotos;
drop policy if exists "admin_all_cidades" on cidades;

-- Admin tem acesso total (USING + WITH CHECK)
create policy "admin_all_revendas" on revendas
  for all using (exists (select 1 from admins where admins.user_id = auth.uid()))
  with check (exists (select 1 from admins where admins.user_id = auth.uid()));

create policy "admin_all_veiculos" on veiculos
  for all using (exists (select 1 from admins where admins.user_id = auth.uid()))
  with check (exists (select 1 from admins where admins.user_id = auth.uid()));

create policy "admin_all_cidades" on cidades
  for all using (exists (select 1 from admins where admins.user_id = auth.uid()))
  with check (exists (select 1 from admins where admins.user_id = auth.uid()));

-- Revenda: pode criar o próprio registro e ver o próprio
create policy "revenda_insert_own" on revendas
  for insert with check (auth.uid() = user_id);

create policy "revenda_select_own" on revendas
  for select using (auth.uid() = user_id);

create policy "revenda_update_own2" on revendas
  for update using (auth.uid() = user_id);

-- Grants para authenticated
grant insert, update on revendas to authenticated;
grant insert on veiculos to authenticated;
grant insert on veiculo_fotos to authenticated;
