import express from "express";
import { registerRoutes } from "../server/routes";
import { initializeDatabase } from "../server/db";

let appInitPromise: Promise<express.Express> | null = null;

async function getApp(): Promise<express.Express> {
  if (!appInitPromise) {
    appInitPromise = (async () => {
      const app = express();

      // Ensure all /api responses are JSON
      app.use("/api", (req, res, next) => {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        // CORS — restrict to your Vercel domain in production
        const origin = req.headers.origin || "*";
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");

        if (req.method === "OPTIONS") {
          return res.status(200).json({ ok: true });
        }
        return next();
      });

      app.use("/api", express.json({ limit: "10mb" }));
      app.use("/api", express.urlencoded({ extended: true, limit: "10mb" }));

      // Best-effort DB init — never crashes the function
      try {
        await initializeDatabase();
      } catch (err: any) {
        console.error("⚠️ DB init skipped:", err?.message);
      }

      await registerRoutes(app);
      return app;
    })();
  }

  return appInitPromise;
}

export default async function handler(req: any, res: any) {
  try {
    const app = await getApp();

    // Normalização extrema da URL para Vercel
    // Se a URL já contiver /api, mas o Express estiver montado em /api, 
    // precisamos garantir que não duplique ou que o Express entenda o path.
    const url = req.url || "/";
    
    // Log para debug nos logs da Vercel
    console.log(`📡 Incoming request: ${req.method} ${url}`);

    return app(req, res);
  } catch (err: any) {
    console.error("❌ Fatal Handler Error:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err?.message || "Check server logs",
      path: req.url
    });
  }
}
