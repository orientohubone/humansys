import type { Request, Response } from "express";
import { randomUUID } from "crypto";
import { createUser, findUserByEmail } from "./db.js";

function sendJson(res: Response, status: number, body: any) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  return res.json(body);
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const { email, password, full_name } = req.body || {};
    console.log("🔐 [auth/signup] signup attempt:", email);

    if (!email || !password || !full_name) {
      return sendJson(res, 400, {
        error: "Email, senha e nome completo são obrigatórios",
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser) {
      return sendJson(res, 409, { error: "Este email já está cadastrado" });
    }

    const newUser = await createUser({
      id: randomUUID(),
      email: normalizedEmail,
      password,
      full_name: String(full_name).trim(),
      role: "user",
      status: "active",
      plan_type: "trial",
      total_credits: 1000,
      used_credits: 0,
      remaining_credits: 1000,
      trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      created_at: new Date(),
      updated_at: new Date(),
    });

    const { password: _, ...userResponse } = newUser;
    return sendJson(res, 201, {
      user: userResponse,
      message: "Usuário criado com sucesso",
    });
  } catch (error) {
    console.error("❌ [auth/signup] error:", error);
    return sendJson(res, 500, {
      error: error instanceof Error ? error.message : "Falha no cadastro",
    });
  }
}
