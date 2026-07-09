-- Habilita SELECT para o usuário anônimo (necessário mesmo com RLS)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
