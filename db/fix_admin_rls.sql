-- ==========================================================
-- Permissões para o admin master gerenciar revendas
-- Execute no SQL Editor do Supabase
-- ==========================================================

-- Admin pode fazer tudo em revendas
create policy "admin_all_revendas" on revendas
  for all using (
    exists (select 1 from admins where admins.user_id = auth.uid())
  );

-- Admin pode fazer tudo em veiculos
create policy "admin_all_veiculos" on veiculos
  for all using (
    exists (select 1 from admins where admins.user_id = auth.uid())
  );

-- Admin pode fazer tudo em veiculo_fotos
create policy "admin_all_fotos" on veiculo_fotos
  for all using (
    exists (select 1 from admins where admins.user_id = auth.uid())
  );

-- Admin pode fazer tudo em cidades
create policy "admin_all_cidades" on cidades
  for all using (
    exists (select 1 from admins where admins.user_id = auth.uid())
  );

-- Permissões de escrita para authenticated
grant insert, update, delete on revendas to authenticated;
grant insert, update, delete on veiculos to authenticated;
grant insert, update, delete on veiculo_fotos to authenticated;
grant insert, update, delete on cidades to authenticated;
