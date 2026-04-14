import pg from 'pg';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const { Pool } = pg;

// Load .env manually from project root
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

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found');
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

async function fixDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Connecting to database...');
    await client.query('SELECT 1');
    console.log('✅ Connected to Neon database');

    // 1. Delete stale collaborator rows that have null user_id
    console.log('\n🔧 Cleaning up stale collaborator rows...');
    const deleteResult = await client.query(
      'DELETE FROM collaborators WHERE user_id IS NULL'
    );
    console.log(`✅ Deleted ${deleteResult.rowCount} stale collaborator rows`);

    // 2. Check current columns in users table
    console.log('\n🔧 Checking users table columns...');
    const colsResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    const existingCols = colsResult.rows.map(r => r.column_name);
    console.log('📋 Current users columns:', existingCols);

    // 3. Add missing required columns
    const requiredColumns = [
      { name: 'password', type: 'VARCHAR(255)' },
      { name: 'full_name', type: 'VARCHAR(255)' },
      { name: 'position', type: 'VARCHAR(255)' },
      { name: 'company_name', type: 'VARCHAR(255)' },
      { name: 'company_cnpj', type: 'VARCHAR(50)' },
      { name: 'avatar_url', type: 'TEXT' },
      { name: 'role', type: "VARCHAR(100) DEFAULT 'user'" },
      { name: 'status', type: "VARCHAR(50) DEFAULT 'active'" },
      { name: 'phone', type: 'VARCHAR(50)' },
      { name: 'department', type: 'VARCHAR(255)' },
      { name: 'bio', type: 'TEXT' },
      { name: 'plan_type', type: "VARCHAR(50) DEFAULT 'trial'" },
      { name: 'total_credits', type: 'INTEGER DEFAULT 1000' },
      { name: 'used_credits', type: 'INTEGER DEFAULT 0' },
      { name: 'remaining_credits', type: 'INTEGER DEFAULT 1000' },
      { name: 'trial_ends_at', type: 'TIMESTAMP' },
      { name: 'tenant_id', type: 'VARCHAR(255)' },
      { name: 'is_founder', type: 'BOOLEAN DEFAULT FALSE' },
      { name: 'email_verified', type: 'BOOLEAN DEFAULT FALSE' },
      { name: 'email_verification_token', type: 'VARCHAR(255)' },
      { name: 'email_verification_sent_at', type: 'TIMESTAMP' },
      { name: 'created_at', type: 'TIMESTAMP DEFAULT NOW()' },
      { name: 'updated_at', type: 'TIMESTAMP DEFAULT NOW()' },
    ];

    console.log('\n🔧 Adding missing columns to users table...');
    for (const col of requiredColumns) {
      if (!existingCols.includes(col.name)) {
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`);
        console.log(`  ✅ Added column: ${col.name}`);
      } else {
        console.log(`  ✓ Column exists: ${col.name}`);
      }
    }

    // 4. Check if system_versions table exists, create if not
    console.log('\n🔧 Checking system_versions table...');
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'system_versions'
      )
    `);
    
    if (!tableCheck.rows[0].exists) {
      await client.query(`
        CREATE TABLE IF NOT EXISTS system_versions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          tenant_id VARCHAR(255) NOT NULL,
          version VARCHAR(50) NOT NULL,
          title TEXT NOT NULL,
          summary TEXT NOT NULL,
          changes JSONB NOT NULL,
          release_date TIMESTAMP NOT NULL DEFAULT NOW(),
          author_id UUID REFERENCES users(id),
          impact_tags TEXT[],
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log('✅ Created system_versions table');
    } else {
      console.log('✓ system_versions table exists');
    }

    // 5. Verify final state
    console.log('\n🔧 Final verification...');
    const finalCheck = await client.query(
      `SELECT id, email, full_name, password, role, tenant_id FROM users LIMIT 5`
    );
    console.log(`✅ Users table OK - ${finalCheck.rowCount} users found`);
    finalCheck.rows.forEach(u => {
      console.log(`  - ${u.email} | role: ${u.role} | has_password: ${!!u.password} | tenant: ${u.tenant_id || 'NONE'}`);
    });

    console.log('\n✅ Database fix completed successfully!');
    console.log('👉 Now run: npm run dev');

  } catch (error) {
    console.error('❌ Error fixing database:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

fixDatabase().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
