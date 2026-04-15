import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;

export type AuthUserRow = {
  id: string;
  email: string;
  password: string | null;
  full_name: string | null;
  role: string | null;
  status: string | null;
  is_founder: boolean | null;
  tenant_id: string | null;
};

function getSql() {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is required for auth functions");
  }

  return neon(DATABASE_URL);
}

export async function findUserByEmail(email: string): Promise<AuthUserRow | undefined> {
  const sql = getSql();

  const rows = await sql<AuthUserRow[]>`
    SELECT id, email, password, full_name, role, status, is_founder, tenant_id
    FROM users
    WHERE email = ${email}
    LIMIT 1
  `;

  return rows[0];
}

export async function createUser(user: Partial<AuthUserRow> & Record<string, any>) {
  const sql = getSql();

  const rows = await sql<AuthUserRow[]>`
    INSERT INTO users (
      id, email, password, full_name, role, status, is_founder, tenant_id,
      plan_type, total_credits, used_credits, remaining_credits,
      email_verified, created_at, updated_at, trial_ends_at
    ) VALUES (
      ${user.id},
      ${user.email},
      ${user.password},
      ${user.full_name},
      ${user.role},
      ${user.status},
      ${user.is_founder},
      ${user.tenant_id},
      ${user.plan_type ?? null},
      ${user.total_credits ?? null},
      ${user.used_credits ?? null},
      ${user.remaining_credits ?? null},
      ${user.email_verified ?? null},
      ${user.created_at ?? new Date()},
      ${user.updated_at ?? new Date()},
      ${user.trial_ends_at ?? null}
    )
    RETURNING id, email, password, full_name, role, status, is_founder, tenant_id
  `;

  return rows[0];
}
