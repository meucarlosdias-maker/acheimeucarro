const { Client } = require('pg');

const client = new Client({
  host: 'aws-0-sa-east-1.pooler.supabase.com',
  port: 6543,
  database: 'supabase_pooler',
  user: 'postgres.iliickfuktqhpwsqvpbu',
  password: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsaWlja2Z1a3RxaHB3c3F2cGJ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzU0MTg5OCwiZXhwIjoyMDk5MTE3ODk4fQ.e6ki7tEyN74ahdNLreAMShAc54UzxISSLrz-GLrF6zA',
});

async function run() {
  await client.connect();
  console.log('Connected!');

  await client.query(`GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;`);
  await client.query(`GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;`);
  await client.query(`GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;`);
  console.log('Grants done!');

  await client.query(`
    CREATE POLICY IF NOT EXISTS "admin_all_admins" ON admins
      FOR ALL USING (exists (select 1 from admins where admins.user_id = auth.uid()))
      WITH CHECK (exists (select 1 from admins where admins.user_id = auth.uid()));
  `);
  console.log('Admin policy added!');

  await client.query(`
    INSERT INTO admins (user_id, nome, email) VALUES
      ('0243d7c2-9e60-4467-a2b8-ea58b5848b3c', 'Admin Master', 'admin@acheimeucarro.com.br'),
      ('f735bd72-fc0b-4283-a485-612ce4475cc7', 'Admin Revenda', 'admin@revenda001.com.br')
    ON CONFLICT (user_id) DO NOTHING;
  `);
  console.log('Admins inserted!');

  await client.end();
}

run().catch(err => { console.error('Error:', err.message); process.exit(1); });
