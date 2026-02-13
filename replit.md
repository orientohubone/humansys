# Humansys - HR Management Platform with AI

## Overview
Humansys is a comprehensive HR management platform designed as a Progressive Web App (PWA) with full-stack capabilities, integrating artificial intelligence for predictive analytics, behavioral assessment (DISC), and automated HR processes. Its vision is to provide a complete solution for HR management, from employee lifecycle to advanced AI-driven insights, aiming to be a market leader in AI-powered HR solutions. Key capabilities include multi-tenant support, gamification, and a wide array of HR modules like payroll, timesheets, training, and feedback systems.

## Recent Changes (November 2025)

### Production Deployment Fix (November 23, 2025)
**Critical Issue Resolved: Site Not Loading After Publish**
- **Root Cause**: Service Worker v1.0.0 was caching outdated file paths (`/static/js/bundle.js`, `/static/css/main.css`) from old build system. Vite now outputs to `/assets/` with versioned filenames, causing cache mismatch.
- **Solution Implemented**:
  1. Upgraded Service Worker from v1.0.0 → v2.0.0 (auto-clears old cache)
  2. Removed hardcoded URLs for static assets - now only caches essential files
  3. **Critical Fix**: Added explicit skip rule for JavaScript/CSS files - lets browser handle versioning instead of Service Worker cache
  4. Ensured `server/public/` contains compiled assets for production Express.static serving
- **Impact**: Site now loads correctly on desktop and mobile after publish; Service Worker properly handles cache invalidation on updates
- **File Changes**: 
  - `public/sw.js`: Updated to v2.0.0 with improved cache strategy
  - Build process: Assets now copied to `server/public/` for production serving

### Backend-Frontend Integration Sprint
Completed comprehensive audit and integration of 5 major HR modules previously using mock data:

**Backend Implementations:**
- **Payroll & Timesheet APIs**: Created complete backend infrastructure with 10 storage methods (getAllJobApplications with tenant isolation JOIN, getPayrolls, createPayroll, etc.) and 8 RESTful routes (GET, POST, PUT, DELETE for both modules). All operations enforce tenant isolation via user_id filtering.
- **Job Applications API**: Added getAllJobApplications(userId) method with JOIN to job_vacancies for proper tenant isolation. Implemented hybrid authentication (x-user-id header preferred, userId query param fallback) for backward compatibility and gradual migration.
- **Onboarding API**: Added PUT /api/onboarding/:id route for updating process progress.
- **Authentication Middleware**: Created requireAuth() helper for validating authenticated users (planned for gradual rollout).

**Frontend Implementations:**
- **New Hooks Created**: usePayroll, useTimesheet, useJobVacancies, useJobApplications (all with complete CRUD operations, loading states, error handling, and toast notifications).
- **Hooks Fixed**: useFeedback and useDocuments corrected to send userId in GET requests; useOnboarding rewritten to use real API for processes while maintaining mock data for steps (backend table doesn't exist yet).
- **Components Integrated**: PayrollModule, TimesheetModule, Recruitment, and OptimizedRecruitment now connected to real backend APIs instead of mock data.

**Security & Architecture:**
- Hybrid authentication system on sensitive routes: prefers x-user-id header (validated against database) with fallback to query parameter for backward compatibility.
- All new APIs enforce tenant isolation through user_id filtering in WHERE clauses or JOINs.
- Comprehensive audit trail logging to distinguish authentication methods used (header vs query param).

**Critical Bug Fix (Error 426 - Upgrade Required):**
- **Root Cause**: setupVite() was not receiving the httpServer parameter, breaking WebSocket connection for Vite's HMR (Hot Module Replacement).
- **Solution**: Modified server/index.ts to pass httpServer to setupVite(app, httpServer), enabling proper WebSocket upgrade handling.
- **Impact**: Fixed application startup failure preventing frontend from loading.

**Next Steps Identified:**
- Add automated integration tests covering Payroll, Timesheet, and Recruitment CRUD lifecycles.
- Plan phased frontend migration to consistently send x-user-id headers across all modules.
- Monitor production logs to validate authentication paths and error handling under real usage.

## Tarefas Pendentes de Integração com Backend (Dezembro 2025)

### Prioridade 1 - Módulos HR Centrais (Alto Impacto)
1. **Módulo de Metas** (`client/src/pages/Goals.tsx`)
   - Situação: 801 linhas com dados mock extensos
   - Necessário: Criar tabela `goals` no schema, adicionar métodos CRUD em storage.ts, implementar endpoints API, substituir useState por useQuery/useMutation
   - Afeta: Criação de metas, edição, exclusão, rastreamento de marcos, gerenciamento de templates

2. **Treinamento & LMS** (`client/src/pages/Training.tsx` + `LMS.tsx`)
   - Situação: 560+ linhas com cursos e inscrições mock
   - Necessário: Criar tabelas `courses`, `course_enrollments`, `course_modules`, `course_lessons`, métodos de storage, endpoints
   - Afeta: Catálogo de cursos, gestão de inscrições, rastreamento de progresso, certificados de conclusão

3. **Certificados** (`client/src/pages/Certificates.tsx` + `ModernCertificates.tsx`)
   - Situação: Templates de certificados e certificados emitidos com dados mock
   - Necessário: Endpoints de backend para listar, emitir, validar certificados
   - Afeta: Geração de certificados, distribuição, verificação

### Prioridade 2 - Módulos BrainSys (Médio Impacto)
4. **BrainSys Bem-Estar** (`client/src/pages/brainsys/Wellness.tsx`)
   - Situação: Programas de bem-estar, atividades, métricas com dados mock
   - Necessário: Tabelas de rastreamento de bem-estar, métodos de storage, endpoints

5. **BrainSys Motivação** (`client/src/pages/brainsys/Motivation.tsx`)
   - Situação: Programas de motivação e dados de engajamento dos funcionários mock
   - Necessário: Backend de estratégias de motivação, rastreamento de progresso

6. **BrainSys Carreiras** (`client/src/pages/brainsys/Careers.tsx`)
   - Situação: Caminhos de carreira, competências, planos de desenvolvimento mock
   - Necessário: Tabelas de progressão de carreira, mapeamento de habilidades, rastreamento de desenvolvimento

### Prioridade 3 - Módulos Adicionais (Baixo Impacto)
7. **Pesquisas** (`client/src/pages/ModernSurveys.tsx`)
   - Situação: Templates de pesquisas e respostas com dados mock
   - Necessário: Operações CRUD de pesquisas, coleta de respostas, análise

8. **Recrutamento** (`client/src/pages/OptimizedRecruitment.tsx` - parcialmente feito)
   - Status: Parcialmente integrado, pode precisar de conclusão

### Padrão de Implementação (Usar para Todos os Módulos)
Para cada módulo, siga este fluxo de trabalho:
1. Definir ou atualizar schema do banco em `shared/schema.ts` com modelos Drizzle
2. Criar insert schema: `const insertGoalSchema = createInsertSchema(goalsTable).omit({ id: true, createdAt: true })`
3. Adicionar métodos de storage em `server/storage.ts` implementando a interface IStorage
4. Adicionar endpoints API em `server/routes.ts`:
   - `GET /api/{recurso}` - listar todos (com filtragem de userId para multi-tenancy)
   - `GET /api/{recurso}/:id` - obter um
   - `POST /api/{recurso}` - criar
   - `PUT /api/{recurso}/:id` - atualizar
   - `DELETE /api/{recurso}/:id` - deletar
5. Criar hooks React Query em `client/src/hooks/`:
   - `useGetRecursos()` - hook useQuery
   - `useCreateRecurso()` - hook useMutation
   - `useUpdateRecurso()` - hook useMutation
   - `useDeleteRecurso()` - hook useMutation
6. Substituir dados mock de useState no componente da página pelos hooks
7. Atualizar componentes para mostrar estados de carregamento/erro

### Considerações Importantes
- **Multi-tenancy**: Todas as queries DEVEM filtrar por userId para garantir isolamento de dados
- **Autenticação**: Enviar header `x-user-id` do frontend, validar com middleware requireAuth()
- **Tratamento de Erros**: Usar notificações toast para feedback do usuário (hook useToast já disponível)
- **TypeScript**: Garantir tipagem forte usando tipos inferidos do schema (ex: `typeof goalsTable.$inferSelect`)
- **Validação**: Usar createInsertSchema para validação de formulários antes de chamadas API

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The platform features a modern, accessible UI utilizing Tailwind CSS and shadcn/ui components, ensuring a consistent design across the application. A green/emerald gradient color scheme is prominent, particularly in AI-enhanced sections and gamification elements, to align with the platform's theme. The design prioritizes mobile responsiveness, with adaptive layouts, hamburger menus for navigation, and PWA capabilities for an installable, offline-first experience. Visual elements like 3D algorithm seals, animated brain graphics, and dynamic stats sections are incorporated for an immersive and engaging user experience. Dark mode compatibility is fully implemented across all components and landing pages.

### Technical Implementations
- **Frontend**: React 18 with TypeScript, Vite for build, React Query for server state, React Router for navigation, and PWA integration.
- **Backend**: Node.js with Express.js (TypeScript, ES modules), Drizzle ORM for type-safe database operations, and PostgreSQL (configured for Neon serverless). RESTful API pattern with structured error handling.
- **Authentication**: JWT-based authentication with secure session management and role-based access control. Context-based state management.
- **Database Schema**: Designed for multi-tenancy, including tables for Users (with subscription plans), Collaborators (employees), and Companies. Extensible for additional HR modules.
- **AI Integration**: AI-powered DISC assessments, predictive analytics (turnover, engagement), and multi-agent AI assistants leveraging OpenAI.
- **Gamification**: Points, badges, achievement tracking, leaderboards, and interface-specific micro-challenges with XP systems, integrated throughout the platform.
- **HR Modules**: Comprehensive modules for Dashboard, Collaborator Management, Training, Feedback & Reviews, Onboarding, Document Management, Payroll & Benefits, Digital Timesheets, and Strategic Vision (chess-themed organizational planning).
- **Strategic Vision Module** (October 2025): Chess-themed strategic planning module for founders only. Enables scenario simulations, organizational health tracking, cascade effect analysis, and growth roadmaps. Features 8 specialized tables: strategic contexts, org chart positions, competency profiles, strategic simulations, strategic alerts, growth health metrics, development plans, and strategic roadmaps.
- **Data Flow**: Frontend uses React Query for data fetching, communicating with standardized API endpoints. Database operations are type-safe via Drizzle ORM, utilizing connection pooling with Neon serverless PostgreSQL, and a robust migration system.
- **PWA & Service Worker**: Service Worker v2.0.0 implements smart caching: essential static files cached for offline access, while JS/CSS files skip caching to leverage Vite's automatic versioning system. This ensures seamless updates without breaking cached assets.

### System Design Choices
The architecture is designed for scalability and performance, utilizing serverless-ready components like Neon PostgreSQL and a stateless server design. Optimistic UI updates and real-time data synchronization are implemented for a better user experience. Environment configurations are managed via environment variables, supporting rapid development with HMR and optimized production builds. An immersive home dashboard provides personalized greetings, quick stats, and integrated gamification and community features.

## External Dependencies

### Core Dependencies
- `@neondatabase/serverless`: For PostgreSQL connection in serverless environments.
- `drizzle-orm`: Type-safe ORM for database interactions.
- `@tanstack/react-query`: For server state management and data fetching.
- `@radix-ui/*`: For accessible UI component primitives.
- `tailwindcss`: Utility-first CSS framework.

### AI and Analytics
- `@stripe/stripe-js`: For payment processing integration.
- `nodemailer`: For email functionality and notifications.
- `OpenAI SDK`: For AI assistant capabilities and integrations.

### Development Tools (used for project development and build processes)
- `tsx`: TypeScript execution for development.
- `esbuild`: Fast JavaScript bundler for production builds.
- `vite`: Development server and build tool.
