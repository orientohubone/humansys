import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { Pool } from "pg";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";
import type { User } from "@shared/schema";

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://localhost:5432/humansys";

// Use Neon HTTP driver in serverless (Vercel), pg Pool for local dev
const isServerless = !!process.env.VERCEL;

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({ connectionString: DATABASE_URL });
    pool.on('error', (err) => {
      console.error('⚠️ Database pool error:', err.message);
    });
  }
  return pool;
}

// Unified db instance — uses HTTP/neon on Vercel, pg Pool locally
export const db = isServerless
  ? drizzleNeon(neon(DATABASE_URL), { schema })
  : drizzlePg(getPool(), { schema });

// Raw query helper (used by initializeDatabase)
async function rawQuery(sql: string): Promise<void> {
  if (isServerless) {
    await neon(DATABASE_URL)(sql);
  } else {
    await getPool().query(sql);
  }
}


// Initialize database and create tables if they don't exist
export const initializeDatabase = async () => {
  try {
    console.log('🔧 Initializing database...');

    await rawQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255),
        full_name VARCHAR(255),
        position VARCHAR(255),
        company_name VARCHAR(255),
        company_cnpj VARCHAR(50),
        avatar_url TEXT,
        status VARCHAR(50) DEFAULT 'active',
        role VARCHAR(100) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Add missing columns if they don't exist (ALTER TABLE IF NOT EXISTS is PostgreSQL 9.6+)
    const alterColumns = [
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS department VARCHAR(255)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_type VARCHAR(50) DEFAULT 'trial'`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS total_credits INTEGER DEFAULT 1000`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS used_credits INTEGER DEFAULT 0`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS remaining_credits INTEGER DEFAULT 1000`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(255)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS is_founder BOOLEAN DEFAULT FALSE`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE`,
    ];
    for (const sql of alterColumns) {
      try { await rawQuery(sql + ';'); } catch { /* column may already exist */ }
    }

    console.log('✅ Database initialized successfully');
  } catch (error: any) {
    // Log but NEVER throw — startup failures must not crash the serverless function
    console.error('❌ Error initializing database (non-fatal):', error?.message || error);
  }
};


export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  try {
    console.log('📝 DB: Updating user', id, 'with data:', data);

    const [updatedUser] = await db
      .update(schema.users)
      .set({ ...data, updated_at: new Date() })
      .where(eq(schema.users.id, id))
      .returning();

    if (!updatedUser) {
      console.log('📝 DB: User not found, returning null');
      return null;
    }

    console.log('✅ DB: User updated successfully:', updatedUser);
    return updatedUser;
  } catch (error) {
    console.error('❌ DB: Error updating user:', error);
    return null;
  }
}

export async function createUser(userData: Partial<User>): Promise<User | null> {
  try {
    console.log('👤 DB: Creating user with data:', userData);

    // Check if user already exists by email
    if (userData.email) {
      const [existingUser] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, userData.email));

      if (existingUser) {
        console.log('📝 DB: User already exists, updating instead');
        return await updateUser(existingUser.id, userData);
      }
    }

    // Create new user
    const [newUser] = await db
      .insert(schema.users)
      .values({
        ...userData,
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning();

    console.log('✅ DB: User created successfully:', newUser);
    return newUser;
  } catch (error) {
    console.error('❌ DB: Error creating user:', error);
    return null;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id));

    return user || null;
  } catch (error) {
    console.error('❌ DB: Error getting user by id:', error);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));

    return user || null;
  } catch (error) {
    console.error('❌ DB: Error getting user by email:', error);
    return null;
  }
}