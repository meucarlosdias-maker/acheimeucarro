-- ==========================================================
-- Função para criar revenda (bypass RLS via security definer)
-- Execute no SQL Editor do Supabase
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

grant execute on function criar_revenda to anon;
grant execute on function criar_revenda to authenticated;
