import express from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import { initializeDatabase } from "./db";
import { runUserCorrections } from "./userCorrections";
import type { ViteDevServer } from "vite";

const app = express();
const port = process.env.PORT || 5000;
const skipDbInit = process.env.SKIP_DB_INIT === "true";

console.log('🚀 Starting Humansys Server...');

// CRITICAL: API routes MUST be registered BEFORE any other middleware
// This ensures API calls are never intercepted by Vite or static serving

// 1. IMMEDIATE API ROUTE PROTECTION - Priority middleware
app.use('/api', (req, res, next) => {
  console.log(`🛡️ API Guardian: ${req.method} ${req.originalUrl}`);

  // Force JSON response headers
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-API-Handler', 'express');
  res.setHeader('X-Priority', 'absolute');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  // Prevent any caching or interception
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    console.log('✅ API Guardian: Handling OPTIONS preflight');
    return res.status(200).json({ success: true, method: 'OPTIONS' });
  }

  next();
});

// 2. Body parsing for API routes
app.use('/api', express.json({ limit: '50mb' }));
app.use('/api', express.urlencoded({ extended: true, limit: '50mb' }));

// 3. Serve uploaded files with optimized caching for smooth navigation
app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path) => {
    // Cache images for better performance during navigation
    // but allow revalidation for consistency across tabs
    res.setHeader('Cache-Control', 'public, max-age=300, must-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    // Set proper content type for images
    if (path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    }
  }
}));

// 4. API Error Handler Middleware
app.use('/api', (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('🚨 API Error Handler:', err);

  if (!res.headersSent) {
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({
      error: 'Internal server error',
      message: err.message,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    });
  }
});

async function createServer() {
  try {
    if (skipDbInit) {
      console.warn("Skipping database initialization because SKIP_DB_INIT=true");
    } else {
      try {
        console.log('🔧 Initializing database...');
        await initializeDatabase();
        console.log('✅ Database initialized');

        console.log('🔧 Running multi-tenant user corrections...');
        await runUserCorrections();
        console.log('✅ Multi-tenant corrections completed');
      } catch (dbError) {
        if (process.env.NODE_ENV === "production") {
          throw dbError;
        }
        console.warn("Database initialization failed in development mode. Continuing startup without database.");
        console.warn(dbError);
      }
    }

    console.log('🔧 Registering API routes...');
    const httpServer = await registerRoutes(app);
    console.log('✅ API routes registered');

    // Setup Vite ONLY after API routes are secured
    if (process.env.NODE_ENV !== "production") {
      console.log('🔧 Setting up Vite development server...');
      await setupVite(app, httpServer);
      console.log('✅ Vite development server configured');
    } else {
      console.log('🔧 Setting up static file serving...');
      serveStatic(app);
      console.log('✅ Static file serving configured');
    }

    // Global error handler for non-API routes
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('🚨 Global Error Handler:', err);

      if (req.originalUrl.startsWith('/api')) {
        // API errors should already be handled by API error middleware
        return next(err);
      }

      // Non-API errors
      res.status(500).send('Internal Server Error');
    });

    // Start server with port retry in development mode
    const basePort = typeof port === "string" ? parseInt(port, 10) : port;
    const maxPortAttempts = 10;
    let activePort = basePort;
    let server: any = null;

    for (let attempt = 0; attempt < maxPortAttempts; attempt++) {
      const candidatePort = basePort + attempt;
      const listenResult = await new Promise<any>((resolve, reject) => {
        const candidateServer = httpServer.listen(candidatePort, "0.0.0.0", () => {
          resolve({ server: candidateServer, port: candidatePort });
        });

        candidateServer.once("error", (error: any) => {
          if (error.code === "EADDRINUSE" && process.env.NODE_ENV !== "production") {
            console.warn(`Port ${candidatePort} is already in use, trying ${candidatePort + 1}...`);
            resolve(null);
            return;
          }
          reject(error);
        });
      });

      if (listenResult) {
        server = listenResult.server;
        activePort = listenResult.port;
        break;
      }
    }

    if (!server) {
      throw new Error(`No available port found between ${basePort} and ${basePort + maxPortAttempts - 1}`);
    }

    console.log(`Server running on http://0.0.0.0:${activePort}`);
    console.log(`API available at http://0.0.0.0:${activePort}/api`);
    console.log(`Health check: http://0.0.0.0:${activePort}/api/health`);

    // Handle server errors after startup
    server.on("error", (error: any) => {
      console.error("Server error:", error);
      process.exit(1);
    });
    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('📴 Received SIGTERM, shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server shut down completed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('📴 Received SIGINT, shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server shut down completed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
createServer().catch((error) => {
  console.error('❌ Server startup failed:', error);
  process.exit(1);
});

