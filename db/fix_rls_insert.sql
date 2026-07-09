-- ==========================================================
-- CORREÇÃO: Policies com WITH CHECK para INSERT
-- Execute no SQL Editor do Supabase
-- ==========================================================

-- Dropar policies antigas e recriar com WITH CHECK
drop policy if exists "admin_all_revendas" on revendas;
drop policy if exists "admin_all_veiculos" on veiculos;
drop policy if exists "admin_all_fotos" on veiculo_fotos;
drop policy if exists "admin_all_cidades" on cidades;

create policy "admin_all_revendas" on revendas
  for all using (exists (select 1 from admins where admins.user_id = auth.uid()))
  with check (exists (select 1 from admins where admins.user_id = auth.uid()));

create policy "admin_all_veiculos" on veiculos
  for all using (exists (select 1 from admins where admins.user_id = auth.uid()))
  with check (exists (select 1 from admins where admins.user_id = auth.uid()));

create policy "admin_all_fotos" on veiculo_fotos
  for all using (exists (select 1 from admins where admins.user_id = auth.uid()))
  with check (exists (select 1 from admins where admins.user_id = auth.uid()));

create policy "admin_all_cidades" on cidades
  for all using (exists (select 1 from admins where admins.user_id = auth.uid()))
  with check (exists (select 1 from admins where admins.user_id = auth.uid()));
