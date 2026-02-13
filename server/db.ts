import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";
import type { User } from "@shared/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://localhost:5432/humansys",
});

// Add error handler to prevent unhandled error events from crashing the server
pool.on('error', (err) => {
  console.error('⚠️ Unexpected database pool error:', err);
  // Log but don't crash - let the pool handle reconnection
});

export const db = drizzle(pool, { schema });

// Initialize database and create tables if they don't exist
export const initializeDatabase = async () => {
  try {
    console.log('🔧 Initializing database...');

    // Create tables manually since we don't have migrations setup
    await pool.query(`
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

    // Add missing columns if they don't exist
    try {
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS position VARCHAR(255),
        ADD COLUMN IF NOT EXISTS company_name VARCHAR(255),
        ADD COLUMN IF NOT EXISTS company_cnpj VARCHAR(50),
        ADD COLUMN IF NOT EXISTS avatar_url TEXT,
        ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active',
        ADD COLUMN IF NOT EXISTS role VARCHAR(100) DEFAULT 'user',
        ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
        ADD COLUMN IF NOT EXISTS department VARCHAR(255),
        ADD COLUMN IF NOT EXISTS bio TEXT;
      `);
      console.log('✅ Added missing columns to users table');
    } catch (alterError) {
      console.log('ℹ️ Columns may already exist or alter failed:', alterError.message);
    }

    // Verify critical columns exist
    try {
      console.log('🔍 Verifying database schema...');
      
      // Test if we can query basic user data
      const testResult = await pool.query('SELECT id, email FROM users LIMIT 1');
      console.log('✅ Database schema verification passed');
      
      // Check if additional columns exist
      const columnCheck = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name IN ('full_name', 'position', 'company_name', 'company_cnpj', 'avatar_url', 'status', 'role')
      `);
      
      const existingColumns = columnCheck.rows.map(row => row.column_name);
      console.log('📋 Existing user columns:', existingColumns);
      
    } catch (verifyError) {
      console.error('❌ Schema verification failed:', verifyError.message);
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS collaborators (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        position VARCHAR(255),
        department VARCHAR(255),
        admission_date DATE,
        birth_date DATE,
        phone VARCHAR(50),
        address TEXT,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        type VARCHAR(100),
        tags TEXT[],
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        rating INTEGER,
        category VARCHAR(100),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS trainings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'active',
        duration INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS certificate_templates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS onboarding_processes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        steps JSONB,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_credits (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        total INTEGER NOT NULL DEFAULT 0,
        used INTEGER NOT NULL DEFAULT 0,
        remaining INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS gamification (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        level INTEGER DEFAULT 1,
        experience INTEGER DEFAULT 0,
        points INTEGER DEFAULT 0,
        badges TEXT[],
        achievements TEXT[],
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        domain VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_roles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
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