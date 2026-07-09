-- ==========================================================
-- ADICIONAR ADMINISTRADOR
-- 1. Crie o usuário em Authentication > Users > Add User
-- 2. Substitua o email abaixo e execute este script
-- ==========================================================

insert into admins (user_id, nome, email)
select id, 'Administrador', email
from auth.users
where email = 'admin@acheimeucarro.com.br'
on conflict (user_id) do nothing;
