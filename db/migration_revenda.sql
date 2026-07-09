-- ==========================================================
-- MIGRAÇÃO: Painel Revenda - video_url nos veiculos
-- Execute no SQL Editor do Supabase
-- ==========================================================

alter table veiculos add column if not exists video_url text;
