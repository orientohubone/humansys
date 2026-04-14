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

    // Ensure the URL starts with /api for Express routing
    if (typeof req.url === "string" && !req.url.startsWith("/api")) {
      req.url = `/api${req.url.startsWith("/") ? "" : "/"}${req.url}`;
    }

    return app(req, res);
  } catch (err: any) {
    console.error("❌ Handler error:", err?.message || err);
    // Always return JSON — never let Vercel serve an HTML error page
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({
      error: "Internal Server Error",
      message: process.env.NODE_ENV === "development" ? err?.message : "An unexpected error occurred",
    }));
  }
}
