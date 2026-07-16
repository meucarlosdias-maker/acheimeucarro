const { createClient } = require('@supabase/supabase-js');

const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsaWlja2Z1a3RxaHB3c3F2cGJ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzU0MTg5OCwiZXhwIjoyMDk5MTE3ODk4fQ.e6ki7tEyN74ahdNLreAMShAc54UzxISSLrz-GLrF6zA';
const URL = 'https://iliickfuktqhpwsqvpbu.supabase.co';

const supabase = createClient(URL, KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  // Try to use supabase's internal database connection via the project API
  // Approach: Use the auth admin API to create the admin user
  // Then use a raw HTTP request to PostgREST with a special setup
  
  console.log('Attempting to insert admin using service_role key...');
  
  const sql = `
    INSERT INTO admins (user_id, nome, email)
    VALUES ('0243d7c2-9e60-4467-a2b8-ea58b5848b3c', 'Admin Master', 'admin@acheimeucarro.com.br')
    ON CONFLICT (user_id) DO NOTHING;
  `;
  
  // Try direct fetch to PostgREST with service_role key
  const url = `${URL}/rest/v1/admins`;
  const headers = {
    'apikey': KEY,
    'Authorization': `Bearer ${KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
  };
  
  const body = JSON.stringify({
    user_id: '0243d7c2-9e60-4467-a2b8-ea58b5848b3c',
    nome: 'Admin Master',
    email: 'admin@acheimeucarro.com.br',
  });
  
  try {
    const fetch = require('node-fetch');
    const response = await fetch(url, { method: 'POST', headers, body });
    const text = await response.text();
    console.log(`Status: ${response.status}, Response: ${text}`);
  } catch (e) {
    // node-fetch might not be available, try using built-in fetch
    try {
      const response = await fetch(url, { method: 'POST', headers, body });
      const text = await response.text();
      console.log(`Status: ${response.status}, Response: ${text}`);
    } catch (e2) {
      console.log(`Error: ${e2.message}`);
    }
  }
}

main().catch(console.error);
