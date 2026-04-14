import pg from 'pg';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const { Pool } = pg;

const envPath = resolve(process.cwd(), '.env');
const envContent = readFileSync(envPath, 'utf8');
const envVars = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => {
      const idx = line.indexOf('=');
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
);

const DATABASE_URL = process.env.DATABASE_URL || envVars.DATABASE_URL;
const pool = new Pool({ connectionString: DATABASE_URL });

const result = await pool.query(`
  UPDATE users 
  SET 
    password = '12345678',
    full_name = 'Fernando Ramalho',
    role = 'founder',
    is_founder = true,
    tenant_id = id::varchar,
    plan_type = 'enterprise',
    total_credits = 999999,
    remaining_credits = 999999,
    used_credits = 0,
    email_verified = true
  WHERE email = 'fernandoluizsouzaramalho@gmail.com'
  RETURNING id, email, role, tenant_id, password, full_name
`);

if (result.rowCount > 0) {
  console.log('✅ Founder user updated:');
  console.log(result.rows[0]);
} else {
  console.log('⚠️ No user found with that email');
}

await pool.end();
