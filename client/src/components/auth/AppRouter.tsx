import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Loader2 } from 'lucide-react';
import { usePreloadRoutes } from '@/components/common/LazyLoadManager';
import { useRouterOptimization } from '@/hooks/useRouterOptimization';
import { RouterRefresher } from '@/components/common/RouterRefresher';
import { BrainSysLoadingState } from '@/components/common/BrainSysLoadingState';

// Lazy load heavy components with better error handling
const Dashboard = React.lazy(() => 
  import('@/pages/Dashboard').then(module => ({ default: module.Dashboard }))
  .catch(() => ({ default: () => <div>Erro ao carregar Dashboard</div> }))
);

const Home = React.lazy(() => 
  import('@/pages/Home').then(module => ({ default: module.Home }))
  .catch(() => ({ default: () => <div>Erro ao carregar Home</div> }))
);

const FounderDashboard = React.lazy(() => 
  import('@/pages/FounderDashboard')
    .then(module => {
      console.log('✅ FounderDashboard module loaded:', module);
      return { default: module.FounderDashboard || module.default };
    })
    .catch(error => {
      console.error('❌ Erro ao carregar FounderDashboard:', error);
      return { default: () => <div>Erro ao carregar FounderDashboard</div> };
    })
);

const Login = React.lazy(() => 
  import('@/pages/Login').then(module => ({ default: module.Login }))
  .catch(() => ({ default: () => <div>Erro ao carregar Login</div> }))
);

const Landing = React.lazy(() => 
  import('@/pages/Landing').then(module => ({ default: module.Landing }))
  .catch(() => ({ default: () => <div>Erro ao carregar Landing</div> }))
);

const Profile = React.lazy(() => 
  import('@/pages/Profile').then(module => ({ default: module.Profile }))
  .catch(() => ({ default: () => <div>Erro ao carregar Profile</div> }))
);

const SecurityManagement = React.lazy(() => 
  import('@/pages/SecurityManagement').then(module => ({ default: module.SecurityManagement }))
  .catch(() => ({ default: () => <div>Erro ao carregar SecurityManagement</div> }))
);

// Lazy load BrainsysIAO component
const BrainsysIAO = React.lazy(() => 
  import('@/pages/BrainsysIAO').then(module => ({ default: module.BrainsysIAO }))
  .catch(() => ({ default: () => <div>Erro ao carregar BrainsysIAO</div> }))
);

// Lazy load BrainSys modules
const BrainSysCareers = React.lazy(() => import('@/pages/brainsys/Careers'));
const BrainSysWellness = React.lazy(() => import('@/pages/brainsys/Wellness'));
const BrainSysMotivation = React.lazy(() => import('@/pages/brainsys/Motivation'));
const BrainSysSmartRecruitment = React.lazy(() => import('@/pages/brainsys/SmartRecruitment'));
const BrainSysCompetencies = React.lazy(() => import('@/pages/brainsys/Competencies'));

import { Collaborators } from '@/pages/Collaborators';
import { OptimizedRecruitment } from '@/pages/OptimizedRecruitment';
import BrainSys from '@/pages/BrainSys';
import Index from '@/pages/Index';
import { Onboarding } from '@/pages/Onboarding';
import { Training } from '@/pages/Training';
import { LMS } from '@/pages/LMS';
import { ModernTraining } from '@/pages/ModernTraining';
import { Feedback } from '@/pages/Feedback';
import { Goals } from '@/pages/Goals';
import { Analytics } from '@/pages/Analytics';
import { Changelog } from '@/pages/Changelog';
import { Plans } from '@/pages/Plans';
import { Documentation } from '@/pages/Documentation';
import { Settings } from '@/pages/Settings';
import { Certificates } from '@/pages/Certificates';
import { Documents } from '@/pages/Documents';
import { Meetings } from '@/pages/Meetings';
import { ModernSurveys } from '@/pages/ModernSurveys';
import { Checkout } from '@/pages/Checkout';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { Careers } from '@/pages/Careers';
import { Blog } from '@/pages/Blog';
import { Privacy } from '@/pages/Privacy';
import { Help } from '@/pages/Help';
import NotFound from '@/pages/NotFound';
import { Disc } from '@/pages/Disc';
import { TestModules } from '@/pages/TestModules';
import { CreativeDiscWithErrorBoundary } from '@/pages/CreativeDisc';
import { TermsOfservices } from '@/pages/TermsOfservices';
import { PayrollModule } from '@/pages/PayrollModule';
import { TimesheetModule } from '@/pages/TimesheetModule';
import { PublicJobPage } from '@/pages/PublicJobPage';
import { ContextConfiguration } from '@/pages/strategic-vision/ContextConfiguration';
import { OrgChart } from '@/pages/strategic-vision/OrgChart';
import { Simulations } from '@/pages/strategic-vision/Simulations';
import { Alerts } from '@/pages/strategic-vision/Alerts';
import { Health } from '@/pages/strategic-vision/Health';
import { Development } from '@/pages/strategic-vision/Development';
import { Roadmaps } from '@/pages/strategic-vision/Roadmaps';

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-4">
      <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
      <div className="space-y-2">
        <p className="text-lg font-medium">Carregando página...</p>
        <p className="text-sm text-muted-foreground">Aguarde um momento</p>
      </div>
    </div>
  </div>
);

// Componente para debug de rotas
const RouteDebugger = () => {
  const location = useLocation();

  useEffect(() => {
    console.log(`🧭 Rota atual mudou para: ${location.pathname}`);
    console.log(`🔍 Location completa:`, location);

    // Verificar se é uma rota problemática
    if (location.pathname === '/dashboard') {
      console.log('⚠️ Detectada rota legacy /dashboard - deveria ser /app');
    }
    if (location.pathname === '/app/dashboard' && !location.pathname.includes('/app')) {
      console.log('⚠️ Rota /app/dashboard sendo acessada');
    }
  }, [location]);

  return null;
};

// AppLayout component to wrap the app routes
const AppLayout = () => {
  return <Outlet />;
};

function AppRouter() {
  // Preload rotas comuns para navegação mais rápida
  usePreloadRoutes();
  // Otimização avançada de roteamento (temporariamente desabilitada para debug)
  // useRouterOptimization();
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RouteDebugger />
      <RouterRefresher />
      <Routes>
        {/* Rota inicial */}
        <Route path="/" element={<Index />} />

        {/* Rotas públicas */}
        <Route path="/home" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/privacy" element={<Privacy/>} />
        <Route path="/termsofservices" element={<TermsOfservices/>} />
        <Route path="/brainsys" element={<BrainSys />} />
        <Route path="/vagas/:jobId" element={<PublicJobPage />} />
        
        {/* Rota de conveniência para Founder Dashboard */}
        <Route path="/founder" element={<ProtectedRoute requiredRole="founder"><FounderDashboard /></ProtectedRoute>} />

        {/* Todas as rotas protegidas ficam aqui */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="founder-dashboard" element={<ProtectedRoute requiredRole="founder"><FounderDashboard /></ProtectedRoute>} />
          {/* Strategic Vision Routes */}
          <Route path="strategic-vision/context" element={<ProtectedRoute requiredRole="founder"><ContextConfiguration /></ProtectedRoute>} />
          <Route path="strategic-vision/org-chart" element={<ProtectedRoute requiredRole="founder"><OrgChart /></ProtectedRoute>} />
          <Route path="strategic-vision/simulations" element={<ProtectedRoute requiredRole="founder"><Simulations /></ProtectedRoute>} />
          <Route path="strategic-vision/alerts" element={<ProtectedRoute requiredRole="founder"><Alerts /></ProtectedRoute>} />
          <Route path="strategic-vision/health" element={<ProtectedRoute requiredRole="founder"><Health /></ProtectedRoute>} />
          <Route path="strategic-vision/development" element={<ProtectedRoute requiredRole="founder"><Development /></ProtectedRoute>} />
          <Route path="strategic-vision/roadmaps" element={<ProtectedRoute requiredRole="founder"><Roadmaps /></ProtectedRoute>} />
          <Route path="brainsys-iao" element={<ProtectedRoute><BrainsysIAO /></ProtectedRoute>} />
          <Route path="brainsys" element={<ProtectedRoute><BrainSys /></ProtectedRoute>} />
          {/* BrainSys Modules */}
                <Route 
                  path="/app/brainsys/careers" 
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<BrainSysLoadingState module="Cargos & Salários" />}>
                        <BrainSysCareers />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/app/brainsys/wellness" 
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<BrainSysLoadingState module="Bem-estar & Saúde Mental" />}>
                        <BrainSysWellness />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/app/brainsys/smart-recruitment" 
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<BrainSysLoadingState module="Recrutamento Inteligente" />}>
                        <BrainSysSmartRecruitment />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/app/brainsys/competencies" 
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<BrainSysLoadingState module="Gestão de Competências" />}>
                        <BrainSysCompetencies />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
          <Route path="brainsys/motivation" element={
            <ProtectedRoute>
              <React.Suspense fallback={<BrainSysLoadingState module="Motivação & Gamificação" />}>
                <BrainSysMotivation />
              </React.Suspense>
            </ProtectedRoute>
          } />
          <Route path="collaborators" element={<ProtectedRoute><Collaborators /></ProtectedRoute>} />
          <Route path="recruitment" element={<ProtectedRoute><OptimizedRecruitment /></ProtectedRoute>} />
          <Route path="onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="payroll" element={<ProtectedRoute><PayrollModule /></ProtectedRoute>} />
          <Route path="timesheet" element={<ProtectedRoute><TimesheetModule /></ProtectedRoute>} />
          <Route path="training" element={<ProtectedRoute><Training /></ProtectedRoute>} />
          <Route path="lms" element={<ProtectedRoute><LMS /></ProtectedRoute>} />
          <Route path="feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
          <Route path="goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
          <Route path="analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="changelog" element={<ProtectedRoute><Changelog /></ProtectedRoute>} />
          <Route path="documentation" element={<ProtectedRoute><Documentation /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="settings/:tab" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="certificates" element={<ProtectedRoute><Certificates /></ProtectedRoute>} />
          <Route path="documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
          <Route path="meetings" element={<ProtectedRoute><Meetings /></ProtectedRoute>} />
          <Route path="surveys" element={<ProtectedRoute><ModernSurveys /></ProtectedRoute>} />
          <Route path="disc" element={<ProtectedRoute><Disc /></ProtectedRoute>} />
          <Route path="security-management" element={<ProtectedRoute><SecurityManagement /></ProtectedRoute>} />
          <Route path="test-modules" element={<ProtectedRoute><TestModules /></ProtectedRoute>} />
          <Route path="creative-disc" element={<ProtectedRoute><CreativeDiscWithErrorBoundary /></ProtectedRoute>} />
        </Route>

        {/* Página não encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;