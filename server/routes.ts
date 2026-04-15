import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';
import { NextFunction } from 'connect';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { 
  insertUserSchema, 
  insertCollaboratorSchema, 
  insertDocumentSchema, 
  insertFeedbackSchema, 
  insertCertificateTemplateSchema, 
  insertTrainingSchema, 
  insertOnboardingProcessSchema,
  insertBusinessContextSchema,
  insertStrategicContextSchema,
  insertOrgChartPositionSchema,
  insertCompetencyProfileSchema,
  insertStrategicSimulationSchema,
  insertStrategicAlertSchema,
  insertGrowthHealthMetricsSchema,
  insertDevelopmentPlanSchema,
  insertStrategicRoadmapSchema,
  insertPayrollSchema,
  insertTimesheetSchema,
  insertSystemVersionSchema
} from "@shared/schema";
import { z } from "zod";
import nodemailer from 'nodemailer';

const enableDevFallbacks = process.env.ENABLE_DEV_FALLBACKS === "true";

async function getBrainSysIAO() {
  const mod = await import("./brainsys");
  return mod.brainSysIAO;
}

async function getStrategicAI() {
  return import("./services/strategicAI");
}

// Enhanced error handler with systematic response formatting
function createAPIResponse(data: any = null, error: string | null = null, status: number = 200) {
  const response = {
    success: error === null,
    timestamp: new Date().toISOString(),
    ...(data && { data }),
    ...(error && { error })
  };

  return { response, status };
}

// Middleware to ensure JSON responses and prevent HTML leakage
function ensureJSONResponse(req: Request, res: Response, next: NextFunction) {
  // Set headers immediately to prevent Vite interception
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('X-API-Response', 'true');

  // Override res.send to always return valid JSON
  const originalSend = res.send;
  const originalJson = res.json;

  res.send = function(data: any) {
    // Ensure content type is JSON
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // If data is not already JSON, wrap it
    if (typeof data === 'string' && !data.trim().startsWith('{') && !data.trim().startsWith('[')) {
      const jsonResponse = {
        success: true,
        message: data,
        timestamp: new Date().toISOString()
      };
      return originalSend.call(this, JSON.stringify(jsonResponse));
    }

    return originalSend.call(this, data);
  };

  res.json = function(data: any) {
    // Ensure content type is JSON
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return originalJson.call(this, data);
  };

  next();
}

// Helper function to validate request body
function validateBody<T>(schema: z.ZodSchema<T>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new Error(`Validation error: ${result.error.message}`);
  }
  return result.data;
}

// Helper middleware to validate authenticated user (for regular routes)
async function requireAuth(req: Request, res: Response): Promise<{valid: boolean; userId?: string}> {
  const userId = req.headers['x-user-id'] as string;
  
  if (!userId) {
    res.status(401).json({ error: "Authentication required" });
    return {valid: false};
  }

  try {
    const user = await storage.getUser(userId);
    
    if (!user) {
      res.status(401).json({ 
        error: "Invalid user",
        message: "User not found or session expired" 
      });
      return {valid: false};
    }

    // SECURITY: Return authenticated userId from database, not from request
    return {valid: true, userId: user.id};
  } catch (error) {
    console.error('❌ Error validating authentication:', error);
    res.status(500).json({ error: "Authentication check failed" });
    return {valid: false};
  }
}

// Helper middleware to validate founder role for Strategic Vision routes
async function requireFounder(req: Request, res: Response): Promise<{valid: boolean; userId?: string; tenantId?: string}> {
  const userId = req.headers['x-user-id'] as string;
  
  if (!userId) {
    res.status(401).json({ error: "Authentication required" });
    return {valid: false};
  }

  try {
    const user = await storage.getUser(userId);
    
    if (!user || user.role !== 'founder') {
      res.status(403).json({ 
        error: "Access denied",
        message: "Strategic Vision module is only accessible to founders" 
      });
      return {valid: false};
    }

    // SECURITY: Extract tenant_id from authenticated user, not from headers
    const tenantId = user.tenant_id;
    
    if (!tenantId) {
      res.status(500).json({ error: "User has no tenant assigned" });
      return {valid: false};
    }

    return {valid: true, userId, tenantId};
  } catch (error) {
    console.error('❌ Error validating founder role:', error);
    res.status(500).json({ error: "Authorization check failed" });
    return {valid: false};
  }
}

// Configure multer for file uploads
const uploadsDir = path.join(__dirname, '../uploads/avatars');

// Ensure uploads directory exists
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Created uploads directory:', uploadsDir);
  }
} catch (error) {
  console.error('❌ Failed to create uploads directory:', error);
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const userId = req.body.userId || 'user';
      const extension = path.extname(file.originalname);
      const filename = `${userId}_${Date.now()}${extension}`;
      cb(null, filename);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/gif', 
      'image/webp',
      'image/bmp',
      'image/tiff'
    ];

    const fileExtension = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'];

    if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error(`Formato não suportado: ${file.mimetype}. Use: JPG, PNG, GIF, WebP, BMP ou TIFF`));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  console.log('🔧 Starting systematic API routes registration...');

  // Prevent Vite from intercepting API routes
  app.use('/api', (req: Request, res: Response, next: NextFunction) => {
    // Force API route handling, prevent Vite dev server interception
    res.setHeader('X-API-Route', 'true');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
  });

  // Apply JSON response middleware to all API routes
  app.use('/api', ensureJSONResponse);

  // Enhanced error handling middleware
  app.use('/api', (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('🚨 API Error Middleware caught:', {
      error: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      body: req.body
    });

    const { response, status } = createAPIResponse(null, err.message || 'Internal server error', 500);
    res.status(status).json(response);
  });

  // Health check with comprehensive status
  app.get('/api/health', (req: Request, res: Response) => {
    console.log('🔧 Health check requested');

    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      server: 'humansys-api',
      version: '1.0.0',
      database: 'connected',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      env: process.env.NODE_ENV || 'development'
    };

    const { response } = createAPIResponse(healthData);
    res.json(response);
  });

  // Session cleanup endpoint
  app.post('/api/auth/cleanup', async (req: Request, res: Response) => {
    try {
      console.log('🧹 Session cleanup requested');
      
      // Get all users from database to check valid IDs
      const validUsers = await storage.getAllUsers();
      const validUserIds = validUsers.map(user => user.id);
      
      console.log('✅ Valid user IDs in database:', validUserIds);
      
      res.json({
        success: true,
        message: 'Session cleanup completed',
        validUsers: validUsers.map(user => ({
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          tenant_id: user.tenant_id,
          trial_ends_at: user.trial_ends_at,
          remaining_credits: user.remaining_credits
        }))
      });
    } catch (error) {
      console.error('❌ Session cleanup error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to cleanup sessions' 
      });
    }
  });

  // Get all users route with multi-tenant isolation
  app.get("/api/users", async (req: Request, res: Response) => {
    try {
      console.log('📡 GET /api/users - Fetching all users from database');

      // Fetch all users from the database
      const dbUsers = await storage.getAllUsers();
      
      // Transform database users to API response format
      const users = dbUsers.map(user => ({
        id: user.id,
        name: user.full_name || user.email.split('@')[0],
        email: user.email,
        role: user.role || 'user',
        created_at: user.created_at || new Date().toISOString(),
        status: user.status || 'active'
      }));

      console.log('✅ GET /api/users - Returning', users.length, 'users from database');
      res.json(users);

    } catch (error) {
      console.error('❌ Error in multi-tenant GET /api/users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  // Create new user route with systematic validation and response
  app.post("/api/users", async (req: Request, res: Response) => {
    console.log('📡 POST /api/users - Systematic user creation:', req.body);

    try {
      const { name, email, role } = req.body;

      // Systematic validation
      if (!name || !email) {
        const { response, status } = createAPIResponse(
          null, 
          "Name and email are required",
          400
        );
        return res.status(status).json(response);
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        const { response, status } = createAPIResponse(
          null, 
          "Invalid email format",
          400
        );
        return res.status(status).json(response);
      }

      // Generate UUID with error handling
      let userId: string;
      try {
        const { randomUUID } = await import('crypto');
        userId = randomUUID();
        console.log('✅ Generated UUID:', userId);
      } catch (uuidError) {
        console.error('❌ UUID generation failed:', uuidError);
        const { response, status } = createAPIResponse(
          null, 
          "Failed to generate user ID",
          500
        );
        return res.status(status).json(response);
      }

      // Create user object with systematic structure
      const newUser = {
        id: userId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: role || 'user',
        created_at: new Date().toISOString(),
        status: 'active'
      };

      // Save to storage with error handling
      try {
        const userForStorage = {
          id: newUser.id,
          email: newUser.email,
          full_name: newUser.name,
          password: 'temp123',
          role: newUser.role,
          created_at: newUser.created_at,
          status: newUser.status
        };

        await storage.createUser(userForStorage);
        console.log('✅ User systematically created and saved:', newUser);

        // Ensure JSON response with explicit headers
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.status(201).json(newUser);

      } catch (storageError) {
        console.error('❌ Storage error:', storageError);
        const { response, status } = createAPIResponse(
          null, 
          `Database error: ${storageError instanceof Error ? storageError.message : 'Unknown storage error'}`,
          500
        );
        return res.status(status).json(response);
      }

    } catch (error) {
      console.error('❌ Systematic error in POST /api/users:', error);
      const { response, status } = createAPIResponse(
        null, 
        `Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
      res.status(status).json(response);
    }
  });

  // Update user status with systematic error handling
  app.put("/api/users/:id/status", async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      const userId = req.params.id;

      console.log('📡 PUT /api/users/:id/status - Systematic status update:', userId, status);

      if (!['active', 'inactive'].includes(status)) {
        const { response, status: httpStatus } = createAPIResponse(
          null, 
          "Invalid status. Must be 'active' or 'inactive'",
          400
        );
        return res.status(httpStatus).json(response);
      }

      const updatedUser = await storage.updateUserStatus(userId, status);

      if (!updatedUser) {
        const { response, status: httpStatus } = createAPIResponse(
          null, 
          'User not found',
          404
        );
        return res.status(httpStatus).json(response);
      }

      const userResponse = {
        id: updatedUser.id,
        name: updatedUser.full_name || updatedUser.email.split('@')[0],
        email: updatedUser.email,
        role: updatedUser.role || 'user',
        created_at: updatedUser.created_at || new Date().toISOString(),
        status: updatedUser.status || 'active'
      };

      console.log('✅ User status systematically updated:', userResponse);
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.json(userResponse);

    } catch (error) {
      console.error('❌ Systematic error updating user status:', error);
      const { response, status } = createAPIResponse(
        null, 
        `Failed to update user status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        400
      );
      res.status(status).json(response);
    }
  });

  // Update user role with systematic error handling and founder protection
  app.put("/api/users/:id/role", async (req: Request, res: Response) => {
    try {
      const { role } = req.body;
      const userId = req.params.id;

      console.log('📡 PUT /api/users/:id/role - Systematic role update:', userId, role);

      // Define all valid roles
      const validRoles = ['founder', 'admin', 'user'];

      if (!validRoles.includes(role)) {
        const { response, status } = createAPIResponse(
          null, 
          `Invalid role. Must be one of: ${validRoles.join(', ')}`,
          400
        );
        return res.status(status).json(response);
      }

      // Check if this is the founder user
      const user = await storage.getUser(userId);
      const isFounder = user?.email === 'fernandoluizsouzaramalho@gmail.com' || user?.id === '00000000-0000-0000-0000-000000000001';

      // Special handling for founder user
      let finalRole = role;
      if (isFounder) {
        console.log('👑 Founder user detected');
        // Founder can have any role but prefer founder when possible
        if (role === 'user') {
          finalRole = 'admin'; // Don't allow founder to be just user
          console.log('👑 Founder cannot be downgraded to user, setting as admin');
        }
      }

      const updatedUser = await storage.updateUserRole(userId, finalRole);

      if (!updatedUser) {
        const { response, status: httpStatus } = createAPIResponse(
          null, 
          'User not found',
          404
        );
        return res.status(httpStatus).json(response);
      }

      const userResponse = {
        id: updatedUser.id,
        name: updatedUser.full_name || updatedUser.email.split('@')[0],
        email: updatedUser.email,
        role: updatedUser.role || finalRole,
        created_at: updatedUser.created_at || new Date().toISOString(),
        status: updatedUser.status || 'active'
      };

      console.log('✅ User role systematically updated:', userResponse);
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.json(userResponse);

    } catch (error) {
      console.error('❌ Systematic error updating user role:', error);
      const { response, status } = createAPIResponse(
        null, 
        `Failed to update user role: ${error instanceof Error ? error.message : 'Unknown error'}`,
        400
      );
      res.status(status).json(response);
    }
  });

  // Delete user with systematic error handling
  app.delete("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      console.log('📡 DELETE /api/users/:id - Systematic user deletion:', userId);

      await storage.deleteUser(userId);
      console.log('✅ User systematically deleted');

      res.status(204).send();

    } catch (error) {
      console.error('❌ Systematic error deleting user:', error);
      const { response, status } = createAPIResponse(
        null, 
        `Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`,
        400
      );
      res.status(status).json(response);
    }
  });

  // Gamification routes
  app.get("/api/gamification/:userId", async (req: Request, res: Response) => {
    try {
      let gamification = await storage.getGamification(req.params.userId);
      if (!gamification) {
        gamification = await storage.createGamification(req.params.userId);
      }
      res.json(gamification);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch gamification data" });
    }
  });

  // Company routes (for founder dashboard)
  app.get("/api/companies", async (req: Request, res: Response) => {
    try {
      const companies = await storage.getCompanies();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  });

  app.post("/api/companies", async (req: Request, res: Response) => {
    try {
      const { name, domain } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Company name required" });
      }
      const company = await storage.createCompany({ name, domain });
      res.status(201).json(company);
    } catch (error) {
      res.status(400).json({ error: "Failed to create company" });
    }
  });

  // Avatar upload route
  app.post('/api/upload-avatar', upload.single('avatar'), async (req: Request, res: Response) => {
    try {
      console.log('📸 Avatar upload request received');
      console.log('📸 Request headers:', req.headers);
      console.log('📸 Request body:', req.body);
      console.log('📸 Request file:', req.file ? {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        filename: req.file.filename
      } : 'No file');

      if (!req.file) {
        console.error('❌ No file received');
        return res.status(400).json({ 
          success: false,
          error: 'No file provided' 
        });
      }

      if (!req.body.userId) {
        console.error('❌ No userId provided');
        return res.status(400).json({ 
          success: false,
          error: 'User ID required' 
        });
      }

      const userId = req.body.userId;
      const filename = req.file.filename;
      const avatarUrl = `/uploads/avatars/${filename}`;

      console.log('📸 File uploaded successfully:', {
        originalName: req.file.originalname,
        filename: filename,
        size: req.file.size,
        path: req.file.path,
        avatarUrl: avatarUrl
      });

      // Update user avatar in database
      try {
        await storage.updateUser(userId, { avatar_url: avatarUrl });
        console.log('✅ User avatar updated in database');
      } catch (dbError) {
        console.error('❌ Failed to update avatar in database:', dbError);
        // Continue anyway, as file is uploaded
      }

      console.log('📤 Sending response:', { 
        success: true, 
        avatar_url: avatarUrl,
        message: 'Avatar uploaded successfully'
      });

      res.json({ 
        success: true, 
        avatar_url: avatarUrl,
        message: 'Avatar uploaded successfully',
        file_info: {
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      });

    } catch (error) {
      console.error('❌ Avatar upload error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Upload failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      server: 'humansys-api'
    });
  });

  // Users endpoint health check
  app.get('/api/users/health', (req: Request, res: Response) => {
    console.log('🔧 Users health check called');
    res.setHeader('Content-Type', 'application/json');
    res.json({ 
      status: 'ok', 
      service: 'users',
      timestamp: new Date().toISOString(),
      message: 'Users API endpoint is working'
    });
  });

  // Authentication routes
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      console.log('🔐 Signup attempt:', req.body);
      
      const { email, password, full_name } = req.body;
      
      if (!email || !password || !full_name) {
        return res.status(400).json({ 
          error: 'Email, senha e nome completo são obrigatórios' 
        });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email.toLowerCase().trim());
      if (existingUser) {
        return res.status(409).json({ 
          error: 'Este email já está cadastrado' 
        });
      }

      // Create new user with proper structure and isolated environment
      const { randomUUID } = await import('crypto');
      const userId = randomUUID();
      
      const userData = {
        id: userId,
        email: email.toLowerCase().trim(),
        password: password, // In production, this should be hashed
        full_name: full_name.trim(),
        role: 'user',
        status: 'active',
        // Multi-tenant credit system
        plan_type: 'trial',
        total_credits: 1000,
        used_credits: 0,
        remaining_credits: 1000,
        trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        created_at: new Date(),
        updated_at: new Date()
      };

      console.log('📝 Creating new user:', { 
        id: userData.id, 
        email: userData.email, 
        full_name: userData.full_name 
      });

      const newUser = await storage.createUser(userData);
      
      // Remove password from response
      const { password: _, ...userResponse } = newUser;
      
      console.log('✅ User created successfully');
      res.status(201).json({ 
        user: userResponse,
        message: 'Usuário criado com sucesso' 
      });
      
    } catch (error) {
      console.error('❌ Signup error:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Falha no cadastro" 
      });
    }
  });

  app.post("/api/auth/signin", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      console.log('🔐 Login attempt for:', email);

      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email e senha são obrigatórios' 
        });
      }

      // For founder, use actual database record (auto-create if not exists)
      if (email.toLowerCase().trim() === 'fernandoluizsouzaramalho@gmail.com') {
        console.log('👑 Founder login - loading from database');

        try {
          let founderUser = await storage.getUserByEmail(email.toLowerCase().trim());
          
          // Auto-create founder if doesn't exist
          if (!founderUser) {
            console.log('🆕 Founder user not found - creating automatically');
            
            const newFounder = {
              id: crypto.randomUUID(),
              email: email.toLowerCase().trim(),
              password: password, // Store the password they used
              full_name: 'Fernando Ramalho',
              role: 'founder',
              status: 'active',
              is_founder: true,
              tenant_id: crypto.randomUUID(), // Founder gets own tenant
              plan_type: 'enterprise',
              total_credits: 999999,
              used_credits: 0,
              remaining_credits: 999999,
              email_verified: true,
              created_at: new Date(),
              updated_at: new Date()
            };
            
            founderUser = await storage.createUser(newFounder);
            console.log('✅ Founder user created successfully:', founderUser.id);
          }

          console.log('✅ Founder user authenticated:', {
            id: founderUser.id,
            email: founderUser.email,
            role: founderUser.role
          });
          
          // Remove password before returning
          const { password: _, ...userData } = founderUser;
          
          return res.json({ 
            user: userData,
            access_token: 'founder-token-123'
          });
        } catch (dbError) {
          console.error('❌ Database error for founder:', dbError);
          if (enableDevFallbacks) {
            const fallbackFounderUser = {
              id: '00000000-0000-0000-0000-000000000001',
              email: 'fernandoluizsouzaramalho@gmail.com',
              full_name: 'Fernando Ramalho',
              role: 'founder',
              status: 'active',
              is_founder: true,
              tenant_id: '00000000-0000-0000-0000-000000000001',
            };

            console.warn('⚠️ Using founder auth fallback in development mode (database unavailable)');
            return res.json({
              user: fallbackFounderUser,
              access_token: 'founder-token-fallback-dev'
            });
          }

          return res.status(500).json({ error: 'Database error' });
        }
      }

      // For other users, only allow login if they exist in database
      try {
        const user = await storage.getUserByEmail(email);
        if (user && user.password === password) {
          console.log('✅ Database user login successful');
          return res.json({ 
            user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role },
            access_token: 'user-token-123'
          });
        }
      } catch (dbError) {
        console.log('❌ Database lookup failed:', dbError);
      }

      // Return error if user not found - no auto-creation on login
      console.log('❌ User not found in database:', email);
      return res.status(401).json({ 
        error: 'Credenciais inválidas. Usuário não encontrado ou senha incorreta.' 
      });

    } catch (error) {
      console.error('❌ Login error:', error);
      res.status(400).json({ error: "Signin failed" });
    }
  });

  // User profile routes
  app.get('/api/users/:id', async (req: Request, res: Response) => {
    try {
      console.log('👤 GET /api/users/:id - userId:', req.params.id);
      
      const user = await storage.getUser(req.params.id);
      
      if (!user) {
        const { response, status } = createAPIResponse(null, 'User not found', 404);
        return res.status(status).json(response);
      }

      // Remove password before returning
      const { password, ...userWithoutPassword } = user;
      
      const { response, status } = createAPIResponse(userWithoutPassword);
      res.status(status).json(response);
    } catch (error) {
      console.error('❌ Error fetching user:', error);
      if (enableDevFallbacks) {
        const fallbackUser = {
          id: req.params.id,
          email: req.params.id === '00000000-0000-0000-0000-000000000001'
            ? 'fernandoluizsouzaramalho@gmail.com'
            : 'dev-user@local',
          full_name: req.params.id === '00000000-0000-0000-0000-000000000001'
            ? 'Fernando Ramalho'
            : 'Usuário Dev',
          role: req.params.id === '00000000-0000-0000-0000-000000000001'
            ? 'founder'
            : 'user',
          status: 'active',
          tenant_id: req.params.id === '00000000-0000-0000-0000-000000000001'
            ? '00000000-0000-0000-0000-000000000001'
            : undefined,
        };
        const { response, status } = createAPIResponse(fallbackUser);
        return res.status(status).json(response);
      }
      const { response, status } = createAPIResponse(null, 'Internal server error', 500);
      res.status(status).json(response);
    }
  });

  app.put('/api/users/:id', async (req: Request, res: Response) => {
    try {
      console.log('📝 PUT /api/users/:id - userId:', req.params.id);
      console.log('📝 Update data:', req.body);
      
      const updatedUser = await storage.updateUser(req.params.id, req.body);
      
      if (!updatedUser) {
        const { response, status } = createAPIResponse(null, 'User not found', 404);
        return res.status(status).json(response);
      }

      // Remove password before returning
      const { password, ...userWithoutPassword } = updatedUser;
      
      const { response, status } = createAPIResponse(userWithoutPassword);
      res.status(status).json(response);
    } catch (error) {
      console.error('❌ Error updating user:', error);
      const { response, status } = createAPIResponse(null, 'Internal server error', 500);
      res.status(status).json(response);
    }
  });

  app.post('/api/users/:id/avatar', upload.single('avatar'), async (req: Request, res: Response) => {
    try {
      console.log('📸 POST /api/users/:id/avatar - userId:', req.params.id);
      
      if (!req.file) {
        const { response, status } = createAPIResponse(null, 'No file uploaded', 400);
        return res.status(status).json(response);
      }

      const avatarUrl = `/uploads/avatars/${req.file.filename}`;
      console.log('📸 Avatar saved at:', avatarUrl);
      
      // Update avatar URL in database
      const updatedUser = await storage.updateUser(req.params.id, {
        avatar_url: avatarUrl
      });
      
      if (!updatedUser) {
        // Remove file if user not found
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('❌ Error removing file:', unlinkError);
        }
        const { response, status } = createAPIResponse(null, 'User not found', 404);
        return res.status(status).json(response);
      }

      const { response, status } = createAPIResponse({ avatar_url: avatarUrl });
      res.status(status).json(response);
    } catch (error) {
      console.error('❌ Error uploading avatar:', error);
      
      // Remove file on error
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('❌ Error removing file:', unlinkError);
        }
      }
      
      const { response, status } = createAPIResponse(null, 'Internal server error', 500);
      res.status(status).json(response);
    }
  });

  // Collaborator routes
  app.get("/api/collaborators", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      console.log('📡 GET /api/collaborators - userId:', userId);

      if (!userId) {
        console.log('❌ User ID not provided');
        return res.status(400).json({ error: "User ID required" });
      }

      const collaborators = await storage.getCollaborators(userId);
      console.log('📤 Retornando', collaborators.length, 'colaboradores');
      res.json(collaborators);
    } catch (error) {
      console.error('❌ Erro ao buscar colaboradores:', error);
      res.status(500).json({ 
        error: "Failed to fetch collaborators",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post("/api/collaborators", async (req: Request, res: Response) => {
    try {
      const userId = req.body.userId;
      console.log('📡 POST /api/collaborators - userId:', userId);
      console.log('📡 Request body keys:', Object.keys(req.body));

      if (!userId) {
        console.log('❌ User ID not provided');
        return res.status(400).json({ error: "User ID required" });
      }

      // Remover userId do body para validação
      const { userId: userIdFromBody, user_id: userIdUnderscore, ...collaboratorData } = req.body;

      console.log('🔍 Validating collaborator data:', collaboratorData);

      // Validação mais robusta
      try {
        const validatedData = validateBody(insertCollaboratorSchema, collaboratorData);
        console.log('✅ Data validated successfully');

        // Adicionar tenant_id e user_id ao objeto validado
        const collaboratorWithIds = {
          ...validatedData,
          user_id: userId,
          tenant_id: userId // Use user_id as tenant_id for multi-tenant isolation
        };

        const collaborator = await storage.createCollaborator(collaboratorWithIds);
        console.log('📤 Colaborador criado com sucesso:', collaborator.id);

        res.status(201).json(collaborator);
      } catch (validationError) {
        console.error('❌ Validation error:', validationError);
        throw validationError;
      }

    } catch (error) {
      console.error('❌ Erro completo ao criar colaborador:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        userId: req.body.userId
      });

      let errorMessage = "Failed to create collaborator";
      let statusCode = 500;

      if (error instanceof Error) {
        if (error.message.includes('invalid input syntax for type uuid')) {
          errorMessage = "Erro na sessão do usuário. Tente fazer login novamente.";
          statusCode = 401;
        } else if (error.message.includes('validation')) {
          errorMessage = "Dados do colaborador inválidos. Verifique os campos obrigatórios.";
          statusCode = 400;
        } else {
          errorMessage = error.message;
        }
      }

      res.status(statusCode).json({ 
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.put("/api/collaborators/:id", async (req: Request, res: Response) => {
    try {
      const collaborator = await storage.updateCollaborator(req.params.id, req.body);
      res.json(collaborator);
    } catch (error) {
      res.status(400).json({ error: "Failed to update collaborator" });
    }
  });

  app.delete("/api/collaborators/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteCollaborator(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: "Failed to delete collaborator" });
    }
  });

  // Document routes
  app.get("/api/documents", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "User ID required" });
      }
      const documents = await storage.getDocuments(userId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  app.post("/api/documents", async (req: Request, res: Response) => {
    try {
      const userId = req.body.userId;
      if (!userId) {
        return res.status(400).json({ error: "User ID required" });
      }
      const documentData = validateBody(insertDocumentSchema, req.body);
      const document = await storage.createDocument(userId, documentData);
      res.status(201).json(document);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to create document" });
    }
  });

  app.put("/api/documents/:id", async (req: Request, res: Response) => {
    try {
      const document = await storage.updateDocument(req.params.id, req.body);
      res.json(document);
    } catch (error) {
      res.status(400).json({ error: "Failed to update document" });
    }
  });

  app.delete("/api/documents/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteDocument(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: "Failed to delete document" });
    }
  });

  // Feedback routes
  app.get("/api/feedbacks", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "User ID required" });
      }
      const feedbacks = await storage.getFeedbacks(userId);
      res.json(feedbacks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch feedbacks" });
    }
  });

  app.post("/api/feedbacks", async (req: Request, res: Response) => {
    try {
      const userId = req.body.user_id || req.body.userId;
      console.log('📡 POST /api/feedback - userId:', userId, 'body:', req.body);

      if (!userId) {
        console.log('❌ User ID not provided');
        return res.status(400).json({ error: "User ID required" });
      }

      const feedbackData = validateBody(insertFeedbackSchema, req.body);
      const feedback = await storage.createFeedback(userId, feedbackData);

      // Registrar ação no BrainSys IAO
      try {
        if (process.env.ENABLE_BRAINSYS === "true") {
          const brainSysIAO = await getBrainSysIAO();
          await brainSysIAO.recordUserAction(userId, 'feedback_given', {
            feedback_id: feedback.id,
            feedback_type: feedbackData.type,
            rating: feedbackData.rating,
            urgent: feedbackData.urgent
          });
        }
      } catch (brainSysError) {
        console.warn('⚠️ Erro ao registrar no BrainSys:', brainSysError);
      }

      console.log('📤 Feedback criado com sucesso:', feedback.id);
      res.status(201).json(feedback);
    } catch (error) {
      console.error('❌ Erro ao criar feedback:', error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Failed to create feedback",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Payroll routes
  app.get("/api/payroll", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      console.log('📡 GET /api/payroll - userId:', userId);

      if (!userId) {
        console.log('❌ User ID not provided');
        return res.status(400).json({ error: "User ID required" });
      }

      const payrolls = await storage.getPayrolls(userId);
      console.log('📤 Retornando', payrolls.length, 'folhas de pagamento');
      res.json(payrolls);
    } catch (error) {
      console.error('❌ Erro ao buscar folhas de pagamento:', error);
      res.status(500).json({ 
        error: "Failed to fetch payrolls",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post("/api/payroll", async (req: Request, res: Response) => {
    try {
      const userId = req.body.user_id || req.body.userId;
      console.log('📡 POST /api/payroll - userId:', userId, 'body:', req.body);

      if (!userId) {
        console.log('❌ User ID not provided');
        return res.status(400).json({ error: "User ID required" });
      }

      const payrollData = validateBody(insertPayrollSchema, req.body);
      const payroll = await storage.createPayroll(payrollData);

      console.log('📤 Folha de pagamento criada com sucesso:', payroll.id);
      res.status(201).json(payroll);
    } catch (error) {
      console.error('❌ Erro ao criar folha de pagamento:', error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Failed to create payroll",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.put("/api/payroll/:id", async (req: Request, res: Response) => {
    try {
      console.log('📡 PUT /api/payroll/:id - id:', req.params.id);
      const payroll = await storage.updatePayroll(req.params.id, req.body);
      
      if (!payroll) {
        return res.status(404).json({ error: "Payroll not found" });
      }
      
      console.log('📤 Folha de pagamento atualizada com sucesso');
      res.json(payroll);
    } catch (error) {
      console.error('❌ Erro ao atualizar folha de pagamento:', error);
      res.status(400).json({ 
        error: "Failed to update payroll",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.delete("/api/payroll/:id", async (req: Request, res: Response) => {
    try {
      console.log('📡 DELETE /api/payroll/:id - id:', req.params.id);
      await storage.deletePayroll(req.params.id);
      console.log('📤 Folha de pagamento deletada com sucesso');
      res.status(204).send();
    } catch (error) {
      console.error('❌ Erro ao deletar folha de pagamento:', error);
      res.status(400).json({ 
        error: "Failed to delete payroll",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Timesheet routes
  app.get("/api/timesheet", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      console.log('📡 GET /api/timesheet - userId:', userId);

      if (!userId) {
        console.log('❌ User ID not provided');
        return res.status(400).json({ error: "User ID required" });
      }

      const timesheets = await storage.getTimesheets(userId);
      console.log('📤 Retornando', timesheets.length, 'registros de ponto');
      res.json(timesheets);
    } catch (error) {
      console.error('❌ Erro ao buscar registros de ponto:', error);
      res.status(500).json({ 
        error: "Failed to fetch timesheets",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post("/api/timesheet", async (req: Request, res: Response) => {
    try {
      const userId = req.body.user_id || req.body.userId;
      console.log('📡 POST /api/timesheet - userId:', userId, 'body:', req.body);

      if (!userId) {
        console.log('❌ User ID not provided');
        return res.status(400).json({ error: "User ID required" });
      }

      const timesheetData = validateBody(insertTimesheetSchema, req.body);
      const timesheet = await storage.createTimesheet(timesheetData);

      console.log('📤 Registro de ponto criado com sucesso:', timesheet.id);
      res.status(201).json(timesheet);
    } catch (error) {
      console.error('❌ Erro ao criar registro de ponto:', error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Failed to create timesheet",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.put("/api/timesheet/:id", async (req: Request, res: Response) => {
    try {
      console.log('📡 PUT /api/timesheet/:id - id:', req.params.id);
      const timesheet = await storage.updateTimesheet(req.params.id, req.body);
      
      if (!timesheet) {
        return res.status(404).json({ error: "Timesheet not found" });
      }
      
      console.log('📤 Registro de ponto atualizado com sucesso');
      res.json(timesheet);
    } catch (error) {
      console.error('❌ Erro ao atualizar registro de ponto:', error);
      res.status(400).json({ 
        error: "Failed to update timesheet",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.delete("/api/timesheet/:id", async (req: Request, res: Response) => {
    try {
      console.log('📡 DELETE /api/timesheet/:id - id:', req.params.id);
      await storage.deleteTimesheet(req.params.id);
      console.log('📤 Registro de ponto deletado com sucesso');
      res.status(204).send();
    } catch (error) {
      console.error('❌ Erro ao deletar registro de ponto:', error);
      res.status(400).json({ 
        error: "Failed to delete timesheet",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Certificate template routes
  app.get("/api/certificate-templates", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "User ID required" });
      }
      const templates = await storage.getCertificateTemplates(userId);
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch certificate templates" });
    }
  });

  app.post("/api/certificate-templates", async (req: Request, res: Response) => {
    try {
      const userId = req.body.userId;
      if (!userId) {
        return res.status(400).json({ error: "User ID required" });
      }
      const templateData = validateBody(insertCertificateTemplateSchema, req.body);
      const template = await storage.createCertificateTemplate(userId, templateData);
      res.status(201).json(template);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to create certificate template" });
    }
  });

  // Training routes
  app.get("/api/trainings", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      console.log('📡 GET /api/trainings - userId:', userId);

      if (!userId) {
        console.log('❌ User ID not provided');
        return res.status(400).json({ error: "User ID required" });
      }

      const trainings = await storage.getTrainings(userId);
      console.log('📤 Retornando', trainings.length, 'treinamentos');
      res.json(trainings);
    } catch (error) {
      console.error('❌ Erro ao buscar treinamentos:', error);
      res.status(500).json({ 
        error: "Failed to fetch trainings",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post("/api/trainings", async (req: Request, res: Response) => {
    try {
      const userId = req.body.user_id || req.body.userId;
      console.log('📡 POST /api/trainings - userId:', userId, 'body:', req.body);

      if (!userId) {
        console.log('❌ User ID not provided');
        return res.status(400).json({ error: "User ID required" });
      }

      // Remover user_id do body para validação
      const { user_id, userId: userIdFromBody, ...trainingData } = req.body;
      const validatedData = validateBody(insertTrainingSchema, trainingData);

      const training = await storage.createTraining(userId, validatedData);
      console.log('📤 Treinamento criado com sucesso:', training.id);
      res.status(201).json(training);
    } catch (error) {
      console.error('❌ Erro ao criar treinamento:', error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Failed to create training",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Onboarding routes
  app.get("/api/onboarding", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "User ID required" });
      }
      const processes = await storage.getOnboardingProcesses(userId);
      res.json(processes);
    } catch (error) {
      if (enableDevFallbacks) {
        console.warn("⚠️ Onboarding fallback in development mode (database unavailable)");
        return res.json([]);
      }
      res.status(500).json({ error: "Failed to fetch onboarding processes" });
    }
  });

  app.post("/api/onboarding", async (req: Request, res: Response) => {
    try {
      const userId = req.body.userId || req.body.user_id;
      if (!userId) {
        return res.status(400).json({ error: "User ID required" });
      }
      
      // Remove userId/user_id from body for validation
      const { userId: userIdFromBody, user_id: userIdUnderscore, ...processData } = req.body;
      
      // Convert start_date string to Date if it's provided
      if (processData.start_date && typeof processData.start_date === 'string') {
        processData.start_date = new Date(processData.start_date);
      }
      
      const validatedData = validateBody(insertOnboardingProcessSchema, processData);
      
      // Add user_id to validated data
      const processWithUserId = {
        ...validatedData,
        user_id: userId
      };
      
      const process = await storage.createOnboardingProcess(processWithUserId);
      res.status(201).json(process);
    } catch (error) {
      console.error('❌ Error creating onboarding:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to create onboarding process" });
    }
  });

  app.put("/api/onboarding/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      console.log('📡 PUT /api/onboarding/:id - Updating process:', id, updateData);
      
      const updatedProcess = await storage.updateOnboardingProcess(id, updateData);
      
      if (!updatedProcess) {
        return res.status(404).json({ error: "Onboarding process not found" });
      }
      
      console.log('✅ Onboarding process updated successfully');
      res.json(updatedProcess);
    } catch (error) {
      console.error('❌ Error updating onboarding process:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to update onboarding process" });
    }
  });

  // Profile routes
  app.get('/api/profile/:userId', async (req, res) => {
    try {
      const { userId } = req.params;

      console.log('📡 GET /api/profile/:userId - Request for user:', userId);

      if (!userId) {
        console.error('❌ User ID is required');
        return res.status(400).json({ error: 'User ID is required' });
      }

      const user = await storage.getUser(userId);

      if (!user) {
        console.log('📝 User not found, returning empty profile structure');
        // Return empty profile structure instead of 404
        const emptyProfile = {
          id: userId,
          full_name: '',
          position: '',
          company_name: '',
          company_cnpj: '',
          avatar_url: ''
        };
        return res.json(emptyProfile);
      }

      // Return user profile data
      const profileData = {
        id: user.id,
        full_name: user.full_name || '',
        position: user.position || '',
        company_name: user.company_name || '',
        company_cnpj: user.company_cnpj || '',
        avatar_url: user.avatar_url || ''
      };

      console.log('✅ Profile loaded successfully:', profileData);
      res.json(profileData);
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.put('/api/profile/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const updateData = req.body;

      console.log('💾 PUT /api/profile/:userId - Update request for user:', userId, 'Data:', updateData);

      if (!userId) {
        console.error('❌ User ID is required');
        return res.status(400).json({ error: 'User ID is required' });
      }

      // Validate and sanitize data
      const allowedFields = ['full_name', 'position', 'company_name', 'company_cnpj', 'avatar_url'];
      const validData: any = {};

      for (const [key, value] of Object.entries(updateData)) {
        if (allowedFields.includes(key) && value !== undefined && value !== null) {
          validData[key] = typeof value === 'string' ? value.trim() : value;
        }
      }

      if (Object.keys(validData).length === 0) {
        console.error('❌ No valid data to update');
        return res.status(400).json({ error: 'No valid data to update' });
      }

      console.log('💾 Valid data to update:', validData);

      // Check if user exists first
      let user = await storage.getUser(userId);

      if (!user) {
        console.log('👤 User not found, creating new profile');
        // Create user if doesn't exist
        try {
          const createData = {
            id: userId,
            email: `user_${userId}@temp.com`,
            password: 'temp123',
            full_name: validData.full_name || '',
            ...validData
          };
          user = await storage.createUser(createData);
          console.log('✅ User created successfully:', user);
        } catch (createError) {
          console.error('❌ Error creating user:', createError);
          return res.status(500).json({ 
            error: 'Could not create user profile',
            details: createError instanceof Error ? createError.message : 'Unknown error'
          });
        }
      } else {
        // Update existing user
        try {
          user = await storage.updateUser(userId, validData);
          console.log('✅ User updated successfully:', user);
        } catch (updateError) {
          console.error('❌ Error updating user:', updateError);
          return res.status(500).json({ 
            error: 'Could not update user profile',
            details: updateError instanceof Error ? updateError.message : 'Unknown error'
          });
        }
      }

      if (!user) {
        console.error('❌ User operation failed');
        return res.status(500).json({ error: 'User operation failed' });
      }

      const profile = {
        id: user.id,
        full_name: user.full_name || '',
        position: user.position || '',
        company_name: user.company_name || '',
        company_cnpj: user.company_cnpj || '',
        avatar_url: user.avatar_url || null
      };

      res.json(profile);
    } catch (error) {
      console.error('❌ Error in profile update:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post('/api/profile/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const userData = req.body;

      console.log('👤 POST /api/profile/:userId - Create profile for user:', userId, 'Data:', userData);

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      // Create new user profile
      const createData: any = {
        id: req.params.userId,
        email: req.body.email || `user_${req.params.userId}@temp.com`,
        password: 'temp123'
      };

      const newUser = await storage.createUser(createData);

      console.log('✅ Profile created successfully:', newUser);
      res.json(newUser);
    } catch (error) {
      console.error('❌ Error creating profile:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // User credits routes
  app.get('/api/credits/:userId', async (req, res) => {
    try {
      const { userId } = req.params;

      console.log('💳 GET /api/credits/:userId - Request for user:', userId);

      if (!userId) {
        console.error('❌ User ID is required for credits');
        return res.status(400).json({ error: 'User ID is required' });
      }

      // Check if user exists first
      const user = await storage.getUser(userId);
      if (!user) {
        console.error('❌ User not found:', userId);
        return res.status(404).json({ error: 'User not found' });
      }

      // Return user-specific credits based on their plan
      const creditsData = {
        remaining_credits: user.remaining_credits || 1000,
        used_credits: user.used_credits || 0,
        total_credits: user.total_credits || 1000,
        plan_type: user.plan_type || 'trial'
      };

      console.log('✅ Credits loaded successfully for user:', userId, creditsData);
      res.json(creditsData);
    } catch (error) {
      console.error('❌ Error fetching credits:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.put("/api/credits/:userId", async (req: Request, res: Response) => {
    try {
      const credits = await storage.updateUserCredits(req.params.userId, req.body);
      res.json(credits);
    } catch (error) {
      res.status(400).json({ error: "Failed to update user credits" });
    }
  });

  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      console.log('🔐 Login attempt for:', email);

      if (!email || !password) {
        console.log('❌ Email or password missing');
        return res.status(400).json({ error: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        console.log('❌ User not found:', email);
        return res.status(401).json({ error: "Invalid credentials" });
      }

      if (!user.password) {
        console.log('❌ User has no password set:', email);
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log('❌ Invalid password for:', email);
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Registrar login no BrainSys IAO apenas quando habilitado.
      try {
        if (process.env.ENABLE_BRAINSYS === "true") {
          const brainSysIAO = await getBrainSysIAO();
          await brainSysIAO.recordUserAction(user.id, 'login', {
            timestamp: new Date(),
            user_agent: req.headers['user-agent'],
            ip_address: req.ip
          });
        }
      } catch (brainSysError) {
        console.warn('⚠️ Erro ao registrar login no BrainSys:', brainSysError);
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      console.log('✅ Login successful for:', email);
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error('❌ Login error:', error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Avatar upload route
  app.post('/api/upload-avatar', upload.single('avatar'), async (req: Request, res: Response) => {
    try {
      console.log('📸 Avatar upload request received');
      console.log('📸 Request headers:', req.headers);
      console.log('📸 Request body:', req.body);
      console.log('📸 Request file:', req.file ? {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        filename: req.file.filename
      } : 'No file');

      if (!req.file) {
        console.error('❌ No file received');
        return res.status(400).json({ 
          success: false,
          error: 'No file provided' 
        });
      }

      if (!req.body.userId) {
        console.error('❌ No userId provided');
        return res.status(400).json({ 
          success: false,
          error: 'User ID required' 
        });
      }

      const userId = req.body.userId;
      const filename = req.file.filename;
      const avatarUrl = `/uploads/avatars/${filename}`;

      console.log('📸 File uploaded successfully:', {
        originalName: req.file.originalname,
        filename: filename,
        size: req.file.size,
        path: req.file.path,
        avatarUrl: avatarUrl
      });

      // Update user avatar in database
      try {
        await storage.updateUser(userId, { avatar_url: avatarUrl });
        console.log('✅ User avatar updated in database');
      } catch (dbError) {
        console.error('❌ Failed to update avatar in database:', dbError);
        // Continue anyway, as file is uploaded
      }

      console.log('📤 Sending response:', { 
        success: true, 
        avatar_url: avatarUrl,
        message: 'Avatar uploaded successfully'
      });

      res.json({ 
        success: true, 
        avatar_url: avatarUrl,
        message: 'Avatar uploaded successfully',
        file_info: {
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      });

    } catch (error) {
      console.error('❌ Avatar upload error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Upload failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // BrainSys IAO endpoints
  app.post('/api/brainsys/initialize', async (req: Request, res: Response) => {
    try {
      const brainSysIAO = await getBrainSysIAO();
      await brainSysIAO.initialize();
      res.json({ success: true, message: 'BrainSys IAO inicializado com sucesso' });
    } catch (error) {
      console.error('❌ Erro ao inicializar BrainSys IAO:', error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      });
    }
  });

  app.get('/api/brainsys/status', async (req: Request, res: Response) => {
    try {
      const brainSysIAO = await getBrainSysIAO();
      const status = await brainSysIAO.getSystemStatus();
      res.json(status);
    } catch (error) {
      console.error('❌ Erro ao obter status do BrainSys:', error);
      res.status(500).json({ error: 'Falha ao obter status do sistema' });
    }
  });

  app.post('/api/brainsys/analyze-entity', async (req: Request, res: Response) => {
    try {
      const brainSysIAO = await getBrainSysIAO();
      const { entityId, context } = req.body;

      if (!entityId || !context) {
        return res.status(400).json({ error: 'EntityId e context são obrigatórios' });
      }

      const analysis = await brainSysIAO.analyzeEntity(entityId, context);
      res.json(analysis);
    } catch (error) {
      console.error('❌ Erro ao analisar entidade:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Erro na análise' 
      });
    }
  });

  app.post('/api/brainsys/analyze-team', async (req: Request, res: Response) => {
    try {
      const brainSysIAO = await getBrainSysIAO();
      const { teamId } = req.body;

      if (!teamId) {
        return res.status(400).json({ error: 'TeamId é obrigatório' });
      }

      const analysis = await brainSysIAO.analyzeTeam(teamId);
      res.json(analysis);
    } catch (error) {
      console.error('❌ Erro ao analisar equipe:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Erro na análise' 
      });
    }
  });

  app.post('/api/brainsys/record-action', async (req: Request, res: Response) => {
    try {
      const brainSysIAO = await getBrainSysIAO();
      const { userId, actionType, actionData } = req.body;

      if (!userId || !actionType) {
        return res.status(400).json({ error: 'UserId e actionType são obrigatórios' });
      }

      await brainSysIAO.recordUserAction(userId, actionType, actionData || {});
      res.json({ success: true, message: 'Ação registrada com sucesso' });
    } catch (error) {
      console.error('❌ Erro ao registrar ação:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Erro ao registrar ação' 
      });
    }
  });

  app.get('/api/brainsys/insights/:entityId', async (req: Request, res: Response) => {
    try {
      const brainSysIAO = await getBrainSysIAO();
      const { entityId } = req.params;
      const { context = 'PERFORMANCE_REVIEW' } = req.query;

      const insights = await brainSysIAO.analyzeEntity(entityId, context);
      res.json(insights);
    } catch (error) {
      console.error('❌ Erro ao obter insights:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Erro ao obter insights' 
      });
    }
  });

  app.get('/api/brainsys/memory-insights', async (req: Request, res: Response) => {
    try {
      const brainSysIAO = await getBrainSysIAO();
      const memory = brainSysIAO.getMemory();
      const insights = memory.getMemoryInsights();
      res.json(insights);
    } catch (error) {
      console.error('❌ Erro ao obter insights da memória:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Erro ao obter insights da memória' 
      });
    }
  });

  app.get('/api/brainsys/patterns/:entityId', async (req: Request, res: Response) => {
    try {
      const brainSysIAO = await getBrainSysIAO();
      const { entityId } = req.params;
      const memory = brainSysIAO.getMemory();
      const patterns = memory.getEntityPatterns(entityId);
      res.json(patterns);
    } catch (error) {
      console.error('❌ Erro ao obter padrões:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Erro ao obter padrões' 
      });
    }
  });

  app.get('/api/brainsys/feedback-metrics', async (req: Request, res: Response) => {
    try {
      const brainSysIAO = await getBrainSysIAO();
      const feedbackLoop = brainSysIAO.getFeedbackLoop();
      const metrics = feedbackLoop.getSystemMetrics();
      const adaptationHistory = feedbackLoop.getAdaptationHistory().slice(0, 10);

      res.json({ metrics, adaptationHistory });
    } catch (error) {
      console.error('❌ Erro ao obter métricas de feedback:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Erro ao obter métricas' 
      });
    }
  });

  // AI Training Generation routes
  app.post('/api/training/generate', async (req: Request, res: Response) => {
    try {
      console.log('🤖 AI Training Generation request:', req.body);
      
      const { 
        topic, 
        difficulty, 
        training_type, 
        duration, 
        organizational_context, 
        target_audience, 
        specific_objectives 
      } = req.body;

      // Validate required fields
      if (!topic || !difficulty || !training_type || !duration || !target_audience || !organizational_context) {
        return res.status(400).json({ 
          error: 'Campos obrigatórios: topic, difficulty, training_type, duration, target_audience, organizational_context' 
        });
      }

      // Generate mock training content for now
      // In production, this would call the actual AI service
      const generatedTraining = {
        title: `${topic} - Treinamento Personalizado`,
        description: `Treinamento ${difficulty} sobre ${topic} desenvolvido especificamente para ${target_audience} na indústria ${organizational_context.industry}`,
        learning_objectives: [
          `Dominar os conceitos fundamentais de ${topic}`,
          `Aplicar técnicas práticas no ambiente de trabalho`,
          `Desenvolver habilidades de ${topic.toLowerCase()} específicas para ${organizational_context.industry}`,
          `Implementar melhorias baseadas em ${topic}`
        ],
        content_modules: [
          {
            title: `Fundamentos de ${topic}`,
            description: `Conceitos básicos e princípios essenciais`,
            content: `Conteúdo detalhado sobre os fundamentos de ${topic} adaptado para ${organizational_context.communication_style}`,
            duration: '30 min',
            activities: ['Leitura dirigida', 'Quiz interativo', 'Exercício prático']
          },
          {
            title: `Aplicação Prática`,
            description: `Como aplicar no dia a dia`,
            content: `Exemplos práticos e casos de uso específicos para ${organizational_context.industry}`,
            duration: '45 min',
            activities: ['Simulação', 'Estudo de caso', 'Exercício em grupo']
          }
        ],
        simulations: [
          {
            id: `sim_${Date.now()}`,
            name: `Simulação: ${topic} em Ação`,
            scenario: `Você está trabalhando em uma empresa ${organizational_context.company_size} na área de ${organizational_context.industry}. Sua equipe enfrenta um desafio relacionado a ${topic}. Como você aplicaria os conceitos aprendidos?`,
            challenge_type: topic.toLowerCase(),
            difficulty_level: difficulty,
            estimated_duration: '20 min',
            decision_points: [
              {
                situation: `Um membro da equipe está com dificuldades para aplicar ${topic}. Como você abordaria esta situação?`,
                options: [
                  'Oferecer treinamento individual imediato',
                  'Incluir em um programa de desenvolvimento mais amplo',
                  'Propor mentoria com especialista interno',
                  'Recomendar recursos externos de aprendizado'
                ],
                correct_answer: 'Propor mentoria com especialista interno',
                feedback: `A mentoria interna é eficaz pois considera o contexto específico da empresa ${organizational_context.industry} e o estilo ${organizational_context.communication_style}.`
              },
              {
                situation: `Sua equipe precisa implementar ${topic} em um projeto crítico. Qual seria sua abordagem?`,
                options: [
                  'Implementação gradual com feedback contínuo',
                  'Implementação completa imediata',
                  'Teste piloto com grupo reduzido',
                  'Aguardar mais treinamento antes de implementar'
                ],
                correct_answer: 'Implementação gradual com feedback contínuo',
                feedback: `A implementação gradual permite ajustes baseados no feedback e reduz riscos, especialmente importante em ${organizational_context.industry}.`
              }
            ]
          }
        ],
        assessment_criteria: [
          {
            criteria: 'Compreensão conceitual',
            weight: 30,
            evaluation_method: 'Quiz e discussões'
          },
          {
            criteria: 'Aplicação prática',
            weight: 50,
            evaluation_method: 'Simulações e exercícios'
          },
          {
            criteria: 'Participação e engajamento',
            weight: 20,
            evaluation_method: 'Observação e autoavaliação'
          }
        ],
        workplace_applications: [
          `Aplicação direta em projetos de ${organizational_context.industry}`,
          `Melhoria de processos usando ${topic}`,
          `Desenvolvimento de equipe com foco em ${topic}`,
          `Implementação de melhores práticas de ${topic}`
        ],
        estimated_completion_time: duration,
        difficulty_level: difficulty,
        training_type: training_type,
        target_audience: target_audience,
        organizational_context: organizational_context
      };

      console.log('✅ Training generated successfully');
      res.json(generatedTraining);
    } catch (error) {
      console.error('❌ Error generating training:', error);
      res.status(500).json({ 
        error: 'Falha ao gerar treinamento',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Organizational Context routes
  app.get('/api/organizational-context', async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID required' });
      }

      const context = await storage.getActiveOrganizationalContext(userId);
      
      if (!context) {
        // Return default context
        const defaultContext = {
          industry: 'Tecnologia',
          company_size: 'Média (51-200)',
          communication_style: 'Colaborativo e aberto',
          training_priorities: ['Liderança', 'Comunicação', 'Inovação', 'Produtividade'],
          common_challenges: ['Gestão remota', 'Colaboração entre equipes', 'Adaptação a mudanças']
        };
        return res.json(defaultContext);
      }

      res.json(context);
    } catch (error) {
      console.error('❌ Error fetching organizational context:', error);
      res.status(500).json({ 
        error: 'Failed to fetch organizational context',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post('/api/organizational-context', async (req: Request, res: Response) => {
    try {
      const { userId, ...contextData } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID required' });
      }

      const context = await storage.createOrganizationalContext(userId, {
        ...contextData,
        is_active: true
      });

      res.status(201).json(context);
    } catch (error) {
      console.error('❌ Error creating organizational context:', error);
      res.status(500).json({ 
        error: 'Failed to create organizational context',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Training Enrollment routes
  app.post('/api/training-enrollments', async (req: Request, res: Response) => {
    try {
      console.log('📚 POST /api/training-enrollments - Request body:', req.body);
      const { user_id, training_id, status = 'enrolled', progress = 0 } = req.body;
      
      if (!user_id || !training_id) {
        return res.status(400).json({ error: 'User ID and Training ID required' });
      }

      // Check if already enrolled
      const existingEnrollment = await storage.getTrainingEnrollment(training_id, user_id);
      if (existingEnrollment) {
        return res.status(400).json({ error: 'Already enrolled in this training' });
      }

      const enrollment = await storage.createTrainingEnrollment({
        user_id,
        training_id,
        status,
        progress,
        enrolled_at: new Date()
      });

      console.log('✅ Training enrollment created:', enrollment.id);
      res.status(201).json(enrollment);
    } catch (error) {
      console.error('❌ Error enrolling in training:', error);
      res.status(500).json({ 
        error: 'Failed to enroll in training',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post('/api/training/enroll', async (req: Request, res: Response) => {
    try {
      const { userId, trainingId } = req.body;
      
      if (!userId || !trainingId) {
        return res.status(400).json({ error: 'User ID and Training ID required' });
      }

      // Check if already enrolled
      const existingEnrollment = await storage.getTrainingEnrollment(trainingId, userId);
      if (existingEnrollment) {
        return res.status(400).json({ error: 'Already enrolled in this training' });
      }

      const enrollment = await storage.createTrainingEnrollment({
        user_id: userId,
        training_id: trainingId,
        status: 'enrolled',
        progress: 0,
        enrolled_at: new Date()
      });

      res.status(201).json(enrollment);
    } catch (error) {
      console.error('❌ Error enrolling in training:', error);
      res.status(500).json({ 
        error: 'Failed to enroll in training',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  // Debug endpoint
  app.get('/api/debug/system-status', async (req: Request, res: Response) => {
    try {
      const systemStatus = {
        timestamp: new Date().toISOString(),
        database: 'connected',
        server: 'running',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        platform: process.platform,
        node_version: process.version,
        environment: process.env.NODE_ENV || 'development'
      };

      res.json(systemStatus);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get system status' });
    }
  });

  // Business Context routes for BrainSys IAO calibration
  app.get("/api/business-context/:userId", async (req: Request, res: Response) => {
    try {
      console.log('🏢 GET /api/business-context/:userId - userId:', req.params.userId);
      const userId = req.params.userId;
      
      const context = await storage.getBusinessContext(userId);
      const { response, status } = createAPIResponse(context);
      res.status(status).json(response);
    } catch (error) {
      console.error('❌ Error fetching business context:', error);
      const { response, status } = createAPIResponse(null, 'Failed to fetch business context', 500);
      res.status(status).json(response);
    }
  });

  app.post("/api/business-context", async (req: Request, res: Response) => {
    try {
      console.log('🏢 POST /api/business-context - data:', req.body);
      
      const validatedData = insertBusinessContextSchema.parse(req.body);
      
      const context = await storage.createBusinessContext(validatedData);
      const { response, status } = createAPIResponse(context);
      res.status(status).json(response);
    } catch (error) {
      console.error('❌ Error creating business context:', error);
      if (error instanceof z.ZodError) {
        const { response, status } = createAPIResponse(null, 'Invalid business context data', 400);
        return res.status(status).json(response);
      }
      const { response, status } = createAPIResponse(null, 'Failed to create business context', 500);
      res.status(status).json(response);
    }
  });

  app.put("/api/business-context/:userId", async (req: Request, res: Response) => {
    try {
      console.log('🏢 PUT /api/business-context/:userId - userId:', req.params.userId);
      const userId = req.params.userId;
      
      const context = await storage.updateBusinessContext(userId, req.body);
      
      if (!context) {
        const { response, status } = createAPIResponse(null, 'Business context not found', 404);
        return res.status(status).json(response);
      }
      
      const { response, status } = createAPIResponse(context);
      res.status(status).json(response);
    } catch (error) {
      console.error('❌ Error updating business context:', error);
      const { response, status } = createAPIResponse(null, 'Failed to update business context', 500);
      res.status(status).json(response);
    }
  });

  // Job Vacancies routes
  app.get("/api/job-vacancies", async (req: Request, res: Response) => {
    try {
      const vacancies = await storage.getJobVacancies();
      res.json(vacancies);
    } catch (error) {
      console.error('❌ Error fetching job vacancies:', error);
      res.status(500).json({ error: "Failed to fetch job vacancies" });
    }
  });

  app.get("/api/job-vacancies/user/:userId", async (req: Request, res: Response) => {
    try {
      const vacancies = await storage.getJobVacanciesByUser(req.params.userId);
      res.json(vacancies);
    } catch (error) {
      console.error('❌ Error fetching user job vacancies:', error);
      res.status(500).json({ error: "Failed to fetch job vacancies" });
    }
  });

  app.get("/api/job-vacancies/:id", async (req: Request, res: Response) => {
    try {
      const vacancy = await storage.getJobVacancy(req.params.id);
      if (!vacancy) {
        return res.status(404).json({ error: "Job vacancy not found" });
      }
      res.json(vacancy);
    } catch (error) {
      console.error('❌ Error fetching job vacancy:', error);
      res.status(500).json({ error: "Failed to fetch job vacancy" });
    }
  });

  app.post("/api/job-vacancies", async (req: Request, res: Response) => {
    try {
      const vacancyData = req.body;
      const vacancy = await storage.createJobVacancy(vacancyData);
      res.status(201).json(vacancy);
    } catch (error) {
      console.error('❌ Error creating job vacancy:', error);
      res.status(400).json({ error: "Failed to create job vacancy" });
    }
  });

  app.put("/api/job-vacancies/:id", async (req: Request, res: Response) => {
    try {
      const vacancy = await storage.updateJobVacancy(req.params.id, req.body);
      if (!vacancy) {
        return res.status(404).json({ error: "Job vacancy not found" });
      }
      res.json(vacancy);
    } catch (error) {
      console.error('❌ Error updating job vacancy:', error);
      res.status(400).json({ error: "Failed to update job vacancy" });
    }
  });

  app.delete("/api/job-vacancies/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteJobVacancy(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Job vacancy not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error('❌ Error deleting job vacancy:', error);
      res.status(400).json({ error: "Failed to delete job vacancy" });
    }
  });

  // Job Applications routes
  app.get("/api/job-applications", async (req: Request, res: Response) => {
    try {
      // HYBRID AUTH: Prefer x-user-id header (secure), fallback to query param (legacy)
      const headerUserId = req.headers['x-user-id'] as string;
      const queryUserId = req.query.userId as string;
      
      let userId: string;
      
      if (headerUserId) {
        // SECURE: Validate header userId against database
        const user = await storage.getUser(headerUserId);
        if (!user) {
          return res.status(401).json({ error: "Invalid authentication header" });
        }
        userId = user.id;
        console.log('🔒 GET /api/job-applications: Using authenticated userId from header:', userId);
      } else if (queryUserId) {
        // LEGACY: Accept query param for backward compatibility (less secure)
        userId = queryUserId;
        console.log('⚠️  GET /api/job-applications: Using userId from query param (legacy mode):', userId);
      } else {
        return res.status(400).json({ error: "User ID required via x-user-id header or userId query param" });
      }
      
      const applications = await storage.getAllJobApplications(userId);
      console.log('✅ Retornando', applications.length, 'applications');
      res.json(applications);
    } catch (error) {
      console.error('❌ Error fetching all job applications:', error);
      res.status(500).json({ error: "Failed to fetch job applications" });
    }
  });

  app.get("/api/job-applications/vacancy/:vacancyId", async (req: Request, res: Response) => {
    try {
      const applications = await storage.getJobApplications(req.params.vacancyId);
      res.json(applications);
    } catch (error) {
      console.error('❌ Error fetching job applications:', error);
      res.status(500).json({ error: "Failed to fetch job applications" });
    }
  });

  app.get("/api/job-applications/:id", async (req: Request, res: Response) => {
    try {
      const application = await storage.getJobApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ error: "Job application not found" });
      }
      res.json(application);
    } catch (error) {
      console.error('❌ Error fetching job application:', error);
      res.status(500).json({ error: "Failed to fetch job application" });
    }
  });

  app.post("/api/job-applications", async (req: Request, res: Response) => {
    try {
      const applicationData = req.body;
      const application = await storage.createJobApplication(applicationData);
      res.status(201).json(application);
    } catch (error) {
      console.error('❌ Error creating job application:', error);
      res.status(400).json({ error: "Failed to create job application" });
    }
  });

  app.put("/api/job-applications/:id", async (req: Request, res: Response) => {
    try {
      const application = await storage.updateJobApplication(req.params.id, req.body);
      if (!application) {
        return res.status(404).json({ error: "Job application not found" });
      }
      res.json(application);
    } catch (error) {
      console.error('❌ Error updating job application:', error);
      res.status(400).json({ error: "Failed to update job application" });
    }
  });

  app.delete("/api/job-applications/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteJobApplication(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Job application not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error('❌ Error deleting job application:', error);
      res.status(400).json({ error: "Failed to delete job application" });
    }
  });

  // ========== STRATEGIC VISION ROUTES (FOUNDERS ONLY) ==========
  
  // Strategic Context routes
  app.get("/api/strategic-vision/context", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const context = await storage.getStrategicContext(auth.tenantId!);
      res.json(context || null);
    } catch (error) {
      console.error('❌ Error fetching strategic context:', error);
      res.status(500).json({ error: "Failed to fetch strategic context" });
    }
  });

  app.post("/api/strategic-vision/context", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const contextData = validateBody(insertStrategicContextSchema, {...req.body, tenant_id: auth.tenantId});
      const context = await storage.createStrategicContext(contextData);
      res.status(201).json(context);
    } catch (error) {
      console.error('❌ Error creating strategic context:', error);
      res.status(400).json({ error: "Failed to create strategic context" });
    }
  });

  app.put("/api/strategic-vision/context/:id", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const context = await storage.updateStrategicContext(req.params.id, auth.tenantId!, req.body);
      if (!context) {
        return res.status(404).json({ error: "Strategic context not found" });
      }
      res.json(context);
    } catch (error) {
      console.error('❌ Error updating strategic context:', error);
      res.status(400).json({ error: "Failed to update strategic context" });
    }
  });

  // Org Chart Position routes
  app.get("/api/strategic-vision/org-chart", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const positions = await storage.getOrgChartPositions(auth.tenantId!);
      res.json(positions);
    } catch (error) {
      console.error('❌ Error fetching org chart positions:', error);
      res.status(500).json({ error: "Failed to fetch org chart positions" });
    }
  });

  app.get("/api/strategic-vision/org-chart/:id", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const position = await storage.getOrgChartPosition(req.params.id, auth.tenantId!);
      if (!position) {
        return res.status(404).json({ error: "Position not found" });
      }
      res.json(position);
    } catch (error) {
      console.error('❌ Error fetching org chart position:', error);
      res.status(500).json({ error: "Failed to fetch org chart position" });
    }
  });

  app.post("/api/strategic-vision/org-chart", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const positionData = validateBody(insertOrgChartPositionSchema, {...req.body, tenant_id: auth.tenantId});
      const position = await storage.createOrgChartPosition(positionData);
      res.status(201).json(position);
    } catch (error) {
      console.error('❌ Error creating org chart position:', error);
      res.status(400).json({ error: "Failed to create org chart position" });
    }
  });

  app.put("/api/strategic-vision/org-chart/:id", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const position = await storage.updateOrgChartPosition(req.params.id, auth.tenantId!, req.body);
      if (!position) {
        return res.status(404).json({ error: "Position not found" });
      }
      res.json(position);
    } catch (error) {
      console.error('❌ Error updating org chart position:', error);
      res.status(400).json({ error: "Failed to update org chart position" });
    }
  });

  app.delete("/api/strategic-vision/org-chart/:id", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const deleted = await storage.deleteOrgChartPosition(req.params.id, auth.tenantId!);
      if (!deleted) {
        return res.status(404).json({ error: "Position not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error('❌ Error deleting org chart position:', error);
      res.status(400).json({ error: "Failed to delete org chart position" });
    }
  });

  // Competency Profile routes
  app.get("/api/strategic-vision/competencies/:positionId", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const profile = await storage.getCompetencyProfile(req.params.positionId, auth.tenantId!);
      res.json(profile || null);
    } catch (error) {
      console.error('❌ Error fetching competency profile:', error);
      res.status(500).json({ error: "Failed to fetch competency profile" });
    }
  });

  app.post("/api/strategic-vision/competencies", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const profileData = validateBody(insertCompetencyProfileSchema, {...req.body, tenant_id: auth.tenantId});
      const profile = await storage.createCompetencyProfile(profileData);
      res.status(201).json(profile);
    } catch (error) {
      console.error('❌ Error creating competency profile:', error);
      res.status(400).json({ error: "Failed to create competency profile" });
    }
  });

  app.put("/api/strategic-vision/competencies/:id", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const profile = await storage.updateCompetencyProfile(req.params.id, auth.tenantId!, req.body);
      if (!profile) {
        return res.status(404).json({ error: "Competency profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error('❌ Error updating competency profile:', error);
      res.status(400).json({ error: "Failed to update competency profile" });
    }
  });

  // Strategic Simulation routes
  app.get("/api/strategic-vision/simulations", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const simulations = await storage.getSimulations(auth.tenantId!);
      res.json(simulations);
    } catch (error) {
      console.error('❌ Error fetching simulations:', error);
      res.status(500).json({ error: "Failed to fetch simulations" });
    }
  });

  app.post("/api/strategic-vision/simulations", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const simulationData = validateBody(insertStrategicSimulationSchema, {...req.body, tenant_id: auth.tenantId});
      const simulation = await storage.createSimulation(simulationData);
      res.status(201).json(simulation);
    } catch (error) {
      console.error('❌ Error creating simulation:', error);
      res.status(400).json({ error: "Failed to create simulation" });
    }
  });

  app.put("/api/strategic-vision/simulations/:id", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const simulation = await storage.updateSimulation(req.params.id, auth.tenantId!, req.body);
      if (!simulation) {
        return res.status(404).json({ error: "Simulation not found" });
      }
      res.json(simulation);
    } catch (error) {
      console.error('❌ Error updating simulation:', error);
      res.status(400).json({ error: "Failed to update simulation" });
    }
  });

  // Strategic Alert routes
  app.get("/api/strategic-vision/alerts", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const alerts = await storage.getActiveAlerts(auth.tenantId!);
      res.json(alerts);
    } catch (error) {
      console.error('❌ Error fetching alerts:', error);
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  app.post("/api/strategic-vision/alerts", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const alertData = validateBody(insertStrategicAlertSchema, {...req.body, tenant_id: auth.tenantId});
      const alert = await storage.createAlert(alertData);
      res.status(201).json(alert);
    } catch (error) {
      console.error('❌ Error creating alert:', error);
      res.status(400).json({ error: "Failed to create alert" });
    }
  });

  app.put("/api/strategic-vision/alerts/:id/acknowledge", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const alert = await storage.acknowledgeAlert(req.params.id, auth.tenantId!, auth.userId!);
      if (!alert) {
        return res.status(404).json({ error: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      console.error('❌ Error acknowledging alert:', error);
      res.status(400).json({ error: "Failed to acknowledge alert" });
    }
  });

  app.put("/api/strategic-vision/alerts/:id/resolve", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const alert = await storage.resolveAlert(req.params.id, auth.tenantId!);
      if (!alert) {
        return res.status(404).json({ error: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      console.error('❌ Error resolving alert:', error);
      res.status(400).json({ error: "Failed to resolve alert" });
    }
  });

  // Growth Health Metrics routes
  app.get("/api/strategic-vision/health/latest", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const metrics = await storage.getLatestHealthMetrics(auth.tenantId!);
      res.json(metrics || null);
    } catch (error) {
      console.error('❌ Error fetching latest health metrics:', error);
      res.status(500).json({ error: "Failed to fetch latest health metrics" });
    }
  });

  app.get("/api/strategic-vision/health/history", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const history = await storage.getHealthMetricsHistory(auth.tenantId!);
      res.json(history);
    } catch (error) {
      console.error('❌ Error fetching health metrics history:', error);
      res.status(500).json({ error: "Failed to fetch health metrics history" });
    }
  });

  app.post("/api/strategic-vision/health", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const metricsData = validateBody(insertGrowthHealthMetricsSchema, {...req.body, tenant_id: auth.tenantId});
      const metrics = await storage.createHealthMetrics(metricsData);
      res.status(201).json(metrics);
    } catch (error) {
      console.error('❌ Error creating health metrics:', error);
      res.status(400).json({ error: "Failed to create health metrics" });
    }
  });

  // Development Plan routes
  app.get("/api/strategic-vision/development-plans", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const plans = await storage.getDevelopmentPlans(auth.tenantId!);
      res.json(plans);
    } catch (error) {
      console.error('❌ Error fetching development plans:', error);
      res.status(500).json({ error: "Failed to fetch development plans" });
    }
  });

  app.get("/api/strategic-vision/development-plans/:id", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const plan = await storage.getDevelopmentPlan(req.params.id, auth.tenantId!);
      if (!plan) {
        return res.status(404).json({ error: "Development plan not found" });
      }
      res.json(plan);
    } catch (error) {
      console.error('❌ Error fetching development plan:', error);
      res.status(500).json({ error: "Failed to fetch development plan" });
    }
  });

  app.post("/api/strategic-vision/development-plans", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const planData = validateBody(insertDevelopmentPlanSchema, {...req.body, tenant_id: auth.tenantId});
      const plan = await storage.createDevelopmentPlan(planData);
      res.status(201).json(plan);
    } catch (error) {
      console.error('❌ Error creating development plan:', error);
      res.status(400).json({ error: "Failed to create development plan" });
    }
  });

  app.put("/api/strategic-vision/development-plans/:id", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const plan = await storage.updateDevelopmentPlan(req.params.id, auth.tenantId!, req.body);
      if (!plan) {
        return res.status(404).json({ error: "Development plan not found" });
      }
      res.json(plan);
    } catch (error) {
      console.error('❌ Error updating development plan:', error);
      res.status(400).json({ error: "Failed to update development plan" });
    }
  });

  // Strategic Roadmap routes
  app.get("/api/strategic-vision/roadmaps", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const roadmaps = await storage.getRoadmaps(auth.tenantId!);
      res.json(roadmaps);
    } catch (error) {
      console.error('❌ Error fetching roadmaps:', error);
      res.status(500).json({ error: "Failed to fetch roadmaps" });
    }
  });

  app.get("/api/strategic-vision/roadmaps/:id", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const roadmap = await storage.getRoadmap(req.params.id, auth.tenantId!);
      if (!roadmap) {
        return res.status(404).json({ error: "Roadmap not found" });
      }
      res.json(roadmap);
    } catch (error) {
      console.error('❌ Error fetching roadmap:', error);
      res.status(500).json({ error: "Failed to fetch roadmap" });
    }
  });

  app.post("/api/strategic-vision/roadmaps", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const roadmapData = validateBody(insertStrategicRoadmapSchema, {...req.body, tenant_id: auth.tenantId});
      const roadmap = await storage.createRoadmap(roadmapData);
      res.status(201).json(roadmap);
    } catch (error) {
      console.error('❌ Error creating roadmap:', error);
      res.status(400).json({ error: "Failed to create roadmap" });
    }
  });

  app.put("/api/strategic-vision/roadmaps/:id", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const roadmap = await storage.updateRoadmap(req.params.id, auth.tenantId!, req.body);
      if (!roadmap) {
        return res.status(404).json({ error: "Roadmap not found" });
      }
      res.json(roadmap);
    } catch (error) {
      console.error('❌ Error updating roadmap:', error);
      res.status(400).json({ error: "Failed to update roadmap" });
    }
  });

  // ========== STRATEGIC AI ROUTES (FOUNDERS ONLY) ==========
  
  // Analyze Strategic Context
  app.post("/api/strategic-vision/ai/analyze-context", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const strategicAI = await getStrategicAI();
      const context = await storage.getStrategicContext(auth.tenantId!);
      if (!context) {
        return res.status(404).json({ error: "Strategic context not found. Please configure it first." });
      }
      
      const analysis = await strategicAI.analyzeStrategicContext(context);
      res.json(analysis);
    } catch (error) {
      console.error('❌ Error analyzing strategic context:', error);
      res.status(500).json({ error: "Failed to analyze strategic context" });
    }
  });

  // Suggest Org Chart
  app.post("/api/strategic-vision/ai/suggest-orgchart", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const strategicAI = await getStrategicAI();
      const context = await storage.getStrategicContext(auth.tenantId!);
      const positions = await storage.getOrgChartPositions(auth.tenantId!);
      
      if (!context) {
        return res.status(404).json({ error: "Strategic context not found" });
      }
      
      const suggestions = await strategicAI.suggestOrgChart(context, positions);
      res.json(suggestions);
    } catch (error) {
      console.error('❌ Error suggesting org chart:', error);
      res.status(500).json({ error: "Failed to suggest org chart" });
    }
  });

  // Simulate Strategic Decision
  app.post("/api/strategic-vision/ai/simulate", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const strategicAI = await getStrategicAI();
      const context = await storage.getStrategicContext(auth.tenantId!);
      if (!context) {
        return res.status(404).json({ error: "Strategic context not found" });
      }
      
      const simulationData = req.body;
      const result = await strategicAI.simulateStrategicDecision(simulationData, context);
      res.json(result);
    } catch (error) {
      console.error('❌ Error simulating decision:', error);
      res.status(500).json({ error: "Failed to simulate decision" });
    }
  });

  // Generate Intelligent Alerts
  app.post("/api/strategic-vision/ai/generate-alerts", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const strategicAI = await getStrategicAI();
      const context = await storage.getStrategicContext(auth.tenantId!);
      const metrics = await storage.getLatestHealthMetrics(auth.tenantId!);
      const alerts = await storage.getActiveAlerts(auth.tenantId!);
      
      if (!context || !metrics) {
        return res.status(404).json({ error: "Missing required data for alert generation" });
      }
      
      const generatedAlerts = await strategicAI.generateIntelligentAlerts(metrics, context, alerts);
      res.json(generatedAlerts);
    } catch (error) {
      console.error('❌ Error generating alerts:', error);
      res.status(500).json({ error: "Failed to generate alerts" });
    }
  });

  // Analyze Health Metrics
  app.post("/api/strategic-vision/ai/analyze-health", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const strategicAI = await getStrategicAI();
      const context = await storage.getStrategicContext(auth.tenantId!);
      const metrics = await storage.getLatestHealthMetrics(auth.tenantId!);
      
      if (!context || !metrics) {
        return res.status(404).json({ error: "Missing required data for health analysis" });
      }
      
      const analysis = await strategicAI.analyzeHealthMetrics(metrics, context);
      res.json(analysis);
    } catch (error) {
      console.error('❌ Error analyzing health metrics:', error);
      res.status(500).json({ error: "Failed to analyze health metrics" });
    }
  });

  // Suggest Leadership Development
  app.post("/api/strategic-vision/ai/suggest-development/:positionId", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const strategicAI = await getStrategicAI();
      const context = await storage.getStrategicContext(auth.tenantId!);
      const position = await storage.getOrgChartPosition(req.params.positionId, auth.tenantId!);
      
      if (!context || !position) {
        return res.status(404).json({ error: "Required data not found" });
      }
      
      const profile = await storage.getCompetencyProfile(req.params.positionId, auth.tenantId!);
      const suggestion = await strategicAI.suggestLeadershipDevelopment(position, profile, context);
      res.json(suggestion);
    } catch (error) {
      console.error('❌ Error suggesting development:', error);
      res.status(500).json({ error: "Failed to suggest leadership development" });
    }
  });

  // Generate Growth Roadmap
  app.post("/api/strategic-vision/ai/generate-roadmap", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const strategicAI = await getStrategicAI();
      const context = await storage.getStrategicContext(auth.tenantId!);
      const positions = await storage.getOrgChartPositions(auth.tenantId!);
      
      if (!context) {
        return res.status(404).json({ error: "Strategic context not found" });
      }
      
      const roadmap = await strategicAI.generateGrowthRoadmap(context, positions);
      res.json(roadmap);
    } catch (error) {
      console.error('❌ Error generating roadmap:', error);
      res.status(500).json({ error: "Failed to generate growth roadmap" });
    }
  });

  // Analyze Competency Gaps
  app.post("/api/strategic-vision/ai/analyze-gaps/:positionId", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const strategicAI = await getStrategicAI();
      const context = await storage.getStrategicContext(auth.tenantId!);
      const position = await storage.getOrgChartPosition(req.params.positionId, auth.tenantId!);
      const profile = await storage.getCompetencyProfile(req.params.positionId, auth.tenantId!);
      
      if (!context || !position || !profile) {
        return res.status(404).json({ error: "Required data not found" });
      }
      
      const analysis = await strategicAI.analyzeCompetencyGaps(position, profile, context);
      res.json(analysis);
    } catch (error) {
      console.error('❌ Error analyzing competency gaps:', error);
      res.status(500).json({ error: "Failed to analyze competency gaps" });
    }
  });

  // ========== SYSTEM VERSIONS ROUTES (FOUNDERS ONLY) ==========
  
  // List all system versions (with optional filters)
  app.get("/api/founder/system-versions", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const { limit, category, search } = req.query;
      
      const versions = await storage.listSystemVersions({
        tenantId: auth.tenantId!,
        limit: limit ? parseInt(limit as string) : 50,
        category: category as string,
        search: search as string,
      });
      
      res.json(versions);
    } catch (error) {
      console.error('❌ Error fetching system versions:', error);
      res.status(500).json({ error: "Failed to fetch system versions" });
    }
  });
  
  // Get single system version
  app.get("/api/founder/system-versions/:id", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const version = await storage.getSystemVersion(req.params.id, auth.tenantId!);
      
      if (!version) {
        return res.status(404).json({ error: "System version not found" });
      }
      
      res.json(version);
    } catch (error) {
      console.error('❌ Error fetching system version:', error);
      res.status(500).json({ error: "Failed to fetch system version" });
    }
  });
  
  // Create new system version (for future admin panel)
  app.post("/api/founder/system-versions", async (req: Request, res: Response) => {
    const auth = await requireFounder(req, res);
    if (!auth.valid) return;
    
    try {
      const versionData = validateBody(insertSystemVersionSchema, {
        ...req.body,
        tenant_id: auth.tenantId,
        author_id: auth.userId,
      });
      
      const version = await storage.createSystemVersion(versionData);
      res.status(201).json(version);
    } catch (error) {
      console.error('❌ Error creating system version:', error);
      res.status(400).json({ error: "Failed to create system version" });
    }
  });
  
  console.log('✅ System Versions API routes registered (Founders only)');
  console.log('✅ Strategic AI API routes registered (Founders only)');
  console.log('✅ Strategic Vision API routes registered (Founders only)');
  console.log('✅ Systematic API routes registration completed');
  console.log('📡 Enhanced error handling and response formatting active');

  // Fallback for unmatched API routes (must be last)
  app.use('/api/*', (req: Request, res: Response) => {
    console.log(`❌ Unmatched API route: ${req.method} ${req.url}`);
    const { response, status } = createAPIResponse(
      { available_endpoints: ['/api/users', '/api/health', '/api/auth/signin', '/api/training/generate', '/api/business-context'] },
      `API endpoint not found: ${req.url}`,
      404
    );
    res.status(status).json(response);
  });

  const httpServer = createServer(app);
  return httpServer;
}
