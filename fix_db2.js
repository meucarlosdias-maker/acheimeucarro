const { Client } = require('pg');

const c = new Client({
  host: 'db.iliickfuktqhpwsqvpbu.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsaWlja2Z1a3RxaHB3c3F2cGJ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzU0MTg5OCwiZXhwIjoyMDk5MTE3ODk4fQ.e6ki7tEyN74ahdNLreAMShAc54UzxISSLrz-GLrF6zA',
  connectionTimeoutMillis: 10000,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  try {
    await c.connect();
    console.log('Connected!');

    await c.query('GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role');
    await c.query('GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role');
    await c.query('GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role');
    console.log('Grants done!');

    await c.query(`INSERT INTO admins (user_id, nome, email) VALUES
      ('0243d7c2-9e60-4467-a2b8-ea58b5848b3c', 'Admin Master', 'admin@acheimeucarro.com.br'),
      ('f735bd72-fc0b-4283-a485-612ce4475cc7', 'Admin Revenda', 'admin@revenda001.com.br')
      ON CONFLICT (user_id) DO NOTHING`);
    console.log('Admins inserted!');

    await c.end();
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

run();
