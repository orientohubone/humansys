
# Contexto Completo da Aplicação Humansys

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Estrutura de Dados](#estrutura-de-dados)
5. [Sistema de Autenticação](#sistema-de-autenticação)
6. [Módulos e Funcionalidades](#módulos-e-funcionalidades)
7. [Configuração de Deploy](#configuração-de-deploy)
8. [Estrutura de Arquivos](#estrutura-de-arquivos)
9. [Fluxos de Negócio](#fluxos-de-negócio)
10. [Integrações e APIs](#integrações-e-apis)

---

## 🎯 Visão Geral

**Humansys** é uma plataforma completa de gestão de RH com capacidades de Inteligência Artificial, projetada como Progressive Web App (PWA). A aplicação oferece análise preditiva, avaliação comportamental (DISC), e processos automatizados de RH para empresas modernas.

### Objetivo Principal
Digitalizar e otimizar processos de RH através de IA, gamificação e analytics avançados.

### Público-Alvo
- **Empresas**: Gestão completa de RH
- **Founders**: Dashboard executivo com métricas de negócio
- **Colaboradores**: Experiência gamificada e desenvolvimento pessoal

---

## 🏗️ Arquitetura do Sistema

### **Frontend Architecture**
```
React 18 + TypeScript
├── Vite (Build Tool)
├── Tailwind CSS + shadcn/ui
├── React Query (Server State)
├── React Router (Navigation)
└── PWA (Mobile-First)
```

### **Backend Architecture**
```
Node.js + Express + TypeScript
├── ES Modules
├── Drizzle ORM
├── PostgreSQL (Neon Serverless)
├── RESTful API
└── JWT Authentication
```

### **Deploy Strategy**
```
Replit Autoscale
├── Development: Vite dev server (port 5000)
├── Production: Express server
├── Build: npm run build → dist/public
└── Port Forwarding: 5000 → 80/443
```

---

## 🛠️ Stack Tecnológico

### **Core Dependencies**
```json
{
  "frontend": {
    "react": "^18.x",
    "typescript": "^5.x",
    "vite": "^5.x",
    "tailwindcss": "^3.x",
    "@tanstack/react-query": "^5.x",
    "@radix-ui/*": "primitives"
  },
  "backend": {
    "@neondatabase/serverless": "PostgreSQL",
    "drizzle-orm": "Type-safe ORM",
    "express": "Server framework",
    "jsonwebtoken": "Authentication"
  },
  "build": {
    "tsx": "TypeScript execution",
    "esbuild": "Fast bundling",
    "vite": "Development server"
  }
}
```

### **AI & Analytics**
- **OpenAI SDK**: Multi-agent assistants
- **Stripe**: Payment processing
- **Nodemailer**: Email automation

---

## 🗄️ Estrutura de Dados

### **Schema Principal** (`shared/schema.ts`)

#### **Core Tables**
```typescript
// Usuários principais
users: {
  id: uuid (PK),
  email: varchar(255) UNIQUE,
  password: varchar(255),
  full_name: varchar(255),
  position: varchar(255),
  company_name: varchar(255),
  company_cnpj: varchar(50),
  avatar_url: text,
  created_at: timestamp,
  updated_at: timestamp
}

// Colaboradores (funcionários)
collaborators: {
  id: uuid (PK),
  user_id: uuid (FK → users.id),
  name: text NOT NULL,
  email: text NOT NULL,
  role: text NOT NULL,
  department: text NOT NULL,
  status: text DEFAULT 'active',
  phone: text,
  location: text,
  join_date: timestamp,
  created_at: timestamp,
  updated_at: timestamp
}

// Multi-tenant para founder dashboard
companies: {
  id: uuid (PK),
  name: text NOT NULL,
  domain: text,
  plan_type: text DEFAULT 'starter',
  status: text DEFAULT 'active',
  mrr: real,
  arr: real,
  trial_ends_at: timestamp,
  subscription_started_at: timestamp,
  created_at: timestamp,
  updated_at: timestamp
}
```

#### **Módulos RH**
```typescript
// Documentos
documents: { id, user_id, title, description, category, version, file_url, access_level, download_count }

// Feedbacks
feedbacks: { id, user_id, from_user_id, to_collaborator_id, type, subject, content, rating, status, anonymous, urgent }

// Treinamentos
trainings: { id, user_id, title, description, duration, instructor, status, category, participants }

// Onboarding
onboardingProcesses: { id, user_id, collaborator_id, status, progress, current_step, start_date, position, department }

// Templates de certificados
certificateTemplates: { id, user_id, name, description, type, template_url, auto_fill_data, active }
```

#### **Gamificação & Engajamento**
```typescript
// Sistema de créditos
userCredits: { id, user_id, total, used, remaining, updated_at }

// Gamificação
gamification: { 
  user_id (PK), 
  total_points, 
  level, 
  total_badges, 
  rank, 
  current_streak, 
  longest_streak, 
  next_level_progress, 
  recent_achievements 
}

// Roles de usuário
userRoles: { id, user_id, role, created_at }
```

---

## 🔐 Sistema de Autenticação

### **Configuração de Auth**
```typescript
// Founder principal
FOUNDER_EMAIL = "fernandoluizsouzaramalho@gmail.com"
FOUNDER_UUID = "00000000-0000-0000-0000-000000000001"

// JWT Configuration
JWT_SECRET = process.env.JWT_SECRET
TOKEN_EXPIRY = "24h"
```

### **Fluxo de Autenticação**
1. **Login**: Validação email/senha → JWT token
2. **Context**: AuthContext gerencia estado global
3. **Protected Routes**: ProtectedRoute component
4. **Role-based Access**: Verificação de permissões
5. **Fallback**: Criação automática para demo

### **Roles & Permissions**
- **founder**: Acesso total + founder dashboard
- **admin**: Gestão completa da empresa
- **manager**: Gestão de equipe
- **user**: Acesso básico

---

## 🎯 Módulos e Funcionalidades

### **1. Dashboard Principal** (`/app/dashboard`)
```typescript
// Componentes principais
- StatsCard: Métricas em tempo real
- ActivityItem: Atividades recentes  
- CreditsCard: Sistema de créditos
- TrendChart: Gráficos de tendência
- NewCollaboratorDialog: Criação rápida
- FeedbackDialog: Feedback estruturado
- TrainingDialog: Criação de treinamentos
```

**Features:**
- Cards de estatísticas dinâmicas
- Atividades em tempo real
- Sistema de créditos gamificado
- Ações rápidas (colaboradores, feedbacks, treinamentos)
- Gráficos interativos

### **2. Gestão de Colaboradores** (`/app/collaborators`)
```typescript
// Componentes especializados
- CollaboratorCard: Cards visuais com avatares
- AdvancedSearch: Busca inteligente
- SmartFilters: Filtros avançados
- CollaboratorActions: Ações em massa
```

**Features:**
- CRUD completo com validação
- Upload de avatar (base64)
- Filtros por departamento, status, role
- Busca avançada multi-campo
- Cards visuais responsivos

### **3. BrainSys IA** (`/app/brainsys`)
```typescript
// Módulos de IA
- BrainsysIAO: Interface principal
- Motivation: Engajamento e reconhecimento
- Careers: Desenvolvimento profissional  
- Wellness: Bem-estar corporativo
```

**Features:**
- Multi-agent AI assistants
- Integração OpenAI configurável
- Módulos especializados por área
- Interface conversacional

### **4. Founder Dashboard** (`/founder/dashboard`)
```typescript
// Analytics empresariais
- RevenueChart: Análise de receita (MRR/ARR)
- ChurnAnalysisChart: Análise de churn
- CustomerHealthTable: Health score empresas
- EngagementMetrics: Métricas de engajamento
- FounderKPICards: KPIs executivos
```

**Features:**
- Métricas de negócio avançadas
- Análise preditiva de clientes
- Dashboard executivo
- Relatórios automatizados

### **5. DISC Assessment** (`/app/disc`)
```typescript
// Análise comportamental
- DiscAssessment: Questionário interativo
- DiscResults: Resultados visuais
- DiscDashboard: Painel de insights
```

**Features:**
- Avaliação comportamental completa
- Insights gerados por IA
- Visualizações interativas
- Relatórios personalizados

### **6. Outros Módulos**
- **Training**: Gestão de treinamentos com enrollment
- **Documents**: Biblioteca de documentos com analytics
- **Feedback**: Sistema estruturado de feedback
- **Onboarding**: Processos automatizados
- **Certificates**: Templates de certificados
- **Goals**: Gestão de metas e objetivos

---

## 🚀 Configuração de Deploy

### **Arquivo .replit**
```toml
run = "npm run dev"
deploymentTarget = "autoscale"
build = ["npm", "run", "build"]
run = ["npm", "run", "start"]
```

### **Workflows Ativos**
```bash
# Deploy Sync Restart (Workflow principal)
pkill -f "node|tsx|vite" || true
rm -rf client/node_modules/.vite client/dist client/node_modules/.cache
cd client && npm install --force
sleep 3
npm run dev
```

### **Scripts Package.json**
```json
{
  "scripts": {
    "dev": "tsx server/index.ts",
    "build": "npm run build:client && npm run build:server",
    "build:client": "cd client && npm run build",
    "build:server": "esbuild server/index.ts --bundle --platform=node --target=node18 --outfile=dist/index.js --external:@neondatabase/serverless",
    "start": "node dist/index.js"
  }
}
```

### **Environment Variables**
```bash
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=...
REPL_ID=...
OPENAI_API_KEY=...
```

---

## 📁 Estrutura de Arquivos

### **Organização Frontend** (`client/src/`)
```
├── pages/           # Páginas principais
├── components/      # Componentes organizados por funcionalidade
│   ├── dashboard/   # Componentes do dashboard
│   ├── collaborators/ # Gestão de colaboradores
│   ├── founder/     # Dashboard founder
│   ├── brainsys/    # Módulos de IA
│   ├── ui/          # Componentes base (shadcn/ui)
│   └── ...
├── hooks/           # Custom hooks para lógica de negócio
├── contexts/        # Contextos globais (Auth, Theme)
├── services/        # Serviços para APIs
├── types/           # Definições TypeScript
├── data/            # Dados estáticos
└── utils/           # Utilitários
```

### **Organização Backend** (`server/`)
```
├── index.ts         # Servidor principal
├── routes.ts        # Todas as rotas API
├── storage.ts       # Operações de banco
├── vite.ts          # Setup Vite development
└── db.ts           # Configuração de banco
```

### **Schema Compartilhado** (`shared/`)
```
└── schema.ts        # Schema Drizzle + Zod validation
```

---

## 🔄 Fluxos de Negócio

### **Fluxo de Autenticação**
```mermaid
User Login → Validate Credentials → Generate JWT → Set Auth Context → Redirect Dashboard
```

### **Fluxo de Criação de Colaborador**
```mermaid
Dashboard → NewCollaboratorDialog → Form Validation → API Call → Database Insert → Cache Update → UI Refresh
```

### **Fluxo de Upload de Avatar**
```mermaid
File Select → Base64 Conversion → API Upload → File Save (/uploads/avatars) → Database Update → UI Update
```

### **Fluxo de Análise DISC**
```mermaid
Start Assessment → Answer Questions → AI Analysis → Generate Report → Save Results → Display Insights
```

---

## 🔌 Integrações e APIs

### **APIs Internas** (`server/routes.ts`)
```typescript
// Autenticação
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me

// Usuários
GET    /api/users
PUT    /api/users/:id
POST   /api/users/:id/avatar

// Colaboradores  
GET    /api/collaborators
POST   /api/collaborators
PUT    /api/collaborators/:id
DELETE /api/collaborators/:id

// Dashboard
GET /api/dashboard/stats
GET /api/dashboard/activities
GET /api/dashboard/credits

// Founder Analytics
GET /api/founder/analytics
GET /api/founder/companies
GET /api/founder/revenue-data

// Módulos RH
GET/POST /api/documents
GET/POST /api/feedbacks  
GET/POST /api/trainings
GET/POST /api/onboarding
GET/POST /api/certificates

// Gamificação
GET/PUT /api/gamification/:userId
```

### **APIs Externas**
- **OpenAI**: Assistentes de IA e análises
- **Stripe**: Processamento de pagamentos
- **Neon**: PostgreSQL serverless
- **Nodemailer**: Email automation

---

## 📊 Métricas e Analytics

### **Dashboard Metrics**
- Total de colaboradores
- Atividades recentes
- Sistema de créditos
- Gamificação (pontos, badges, level)

### **Founder Analytics**
- MRR (Monthly Recurring Revenue)
- ARR (Annual Recurring Revenue)  
- Churn rate
- Customer health score
- Engagement metrics

### **Performance Monitoring**
- React Query cache management
- Error boundaries
- Performance hooks
- System health indicators

---

## 🎮 Sistema de Gamificação

### **Componentes**
```typescript
// Pontos e níveis
total_points: integer
level: integer
next_level_progress: real

// Badges e conquistas
total_badges: integer
recent_achievements: jsonb

// Streaks
current_streak: integer
longest_streak: integer

// Ranking
rank: integer
```

### **Mecânicas**
- Pontos por ações (criar colaborador, feedback, etc.)
- Níveis baseados em experiência
- Badges por conquistas específicas
- Streaks por consistência
- Ranking entre usuários

---

## 💾 Sistema de Cache

### **React Query Configuration**
```typescript
// Cache global
staleTime: 5 * 60 * 1000  // 5 minutes
cacheTime: 10 * 60 * 1000 // 10 minutes

// Cache strategies
- Optimistic updates
- Background refetching  
- Smart invalidation
- Prefetching
```

### **Cache Management**
- Intelligent cache invalidation
- Progressive loading
- Performance monitoring
- Memory optimization

---

## 🔧 Configurações de Desenvolvimento

### **Vite Configuration**
```typescript
// Hot Module Replacement
// TypeScript strict mode
// Path aliases (@/)
// Environment variables
// Build optimization
```

### **TypeScript Configuration**
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

---

## 📈 Roadmap e Evolutivo

### **Funcionalidades Implementadas** ✅
- Sistema completo de autenticação
- Dashboard interativo
- Gestão de colaboradores
- BrainSys IA com múltiplos módulos
- Founder dashboard com analytics
- Sistema de gamificação
- PWA funcional
- Upload de arquivos

### **Em Desenvolvimento** 🚧
- Otimizações de performance
- Novos módulos de IA
- Analytics avançados
- Integrações adicionais

### **Futuras Implementações** 🔮
- Mobile app nativo
- API pública
- Integrações com ERPs
- Machine learning avançado

---

## 🛡️ Segurança e Compliance

### **Medidas de Segurança**
- JWT authentication
- Password hashing
- Input validation (Zod)
- SQL injection protection (Drizzle ORM)
- CORS configuration
- Environment variable protection

### **Data Privacy**
- LGPD compliance ready
- User data encryption
- Secure file upload
- Access control by roles

---

## 📞 Suporte e Manutenção

### **Logs e Debugging**
- Error boundaries
- Performance monitoring
- System health checks
- Debug panels

### **Backup e Recovery**
- Database backups (Neon)
- File storage backup
- Configuration backup
- Disaster recovery plan

---

**Última atualização**: Janeiro 2025  
**Versão do documento**: 1.0  
**Mantido por**: Equipe de Desenvolvimento Humansys

---

*Este documento serve como referência técnica completa para desenvolvimento, manutenção e evolução da plataforma Humansys.*
