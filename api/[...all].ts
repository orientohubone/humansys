import express from "express";
import path from "path";
import { registerRoutes } from "../server/routes";

let appInitPromise: Promise<express.Express> | null = null;

async function getApp(): Promise<express.Express> {
  if (!appInitPromise) {
    appInitPromise = (async () => {
      const app = express();

      app.use("/api", (req, res, next) => {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");

        if (req.method === "OPTIONS") {
          return res.status(200).json({ success: true, method: "OPTIONS" });
        }

        return next();
      });

      app.use("/api", express.json({ limit: "50mb" }));
      app.use("/api", express.urlencoded({ extended: true, limit: "50mb" }));

      // Best-effort static uploads path. In Vercel this is ephemeral, but keeps compatibility.
      app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

      await registerRoutes(app);
      return app;
    })();
  }

  return appInitPromise;
}

export default async function handler(req: any, res: any) {
  const app = await getApp();

  if (typeof req.url === "string" && !req.url.startsWith("/api")) {
    req.url = `/api${req.url.startsWith("/") ? "" : "/"}${req.url}`;
  }

  return app(req, res);
}
