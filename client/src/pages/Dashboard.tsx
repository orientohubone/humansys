import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ActivityItem } from '@/components/dashboard/ActivityItem';
import { CreditsCard } from '@/components/dashboard/CreditsCard';
import { useAuth } from '@/contexts/AuthContext';
import { Widget } from '@/components/dashboard/Widget';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  TrendingUp,
  Target,
  Zap,
  Plus,
  BarChart3,
  MessageSquare,
  FileText,
  Brain,
  Sparkles,
  Trophy,
  UserPlus,
  ArrowRight,
  Calendar,
  Clock,
  BookOpen,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { TaskItem } from '@/components/dashboard/TaskItem';
import { useIAAssistant } from '@/contexts/IAAssistantContext';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';

// ─── Performance Chart ────────────────────────────────────────────────────────
const PerformanceTrendsChart = () => {
  const data = [
    { month: 'Jan', produtividade: 78, engajamento: 85, satisfacao: 72 },
    { month: 'Fev', produtividade: 82, engajamento: 88, satisfacao: 75 },
    { month: 'Mar', produtividade: 85, engajamento: 90, satisfacao: 78 },
    { month: 'Abr', produtividade: 88, engajamento: 92, satisfacao: 82 },
    { month: 'Mai', produtividade: 91, engajamento: 89, satisfacao: 85 },
    { month: 'Jun', produtividade: 94, engajamento: 94, satisfacao: 88 },
  ];

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gProd" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gEng" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gSat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis fontSize={11} tickLine={false} axisLine={false} domain={[60, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(v: number, name: string) => [`${v}%`, name]}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
          <Area type="monotone" dataKey="produtividade" name="Produtividade"
            stroke="#6366f1" strokeWidth={2} fill="url(#gProd)" />
          <Area type="monotone" dataKey="engajamento" name="Engajamento"
            stroke="#10b981" strokeWidth={2} fill="url(#gEng)" />
          <Area type="monotone" dataKey="satisfacao" name="Satisfação"
            stroke="#f59e0b" strokeWidth={2} fill="url(#gSat)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// ─── Greeting helper ──────────────────────────────────────────────────────────
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const DashboardComponent = () => {
  const { user } = useAuth();
  const { open: openIAAssistant } = useIAAssistant();

  const navigate = (path: string) => { window.location.href = path; };

  const stats = { totalCollaborators: 24, activeProcesses: 8, completionRate: 85, gamificationPoints: 1250 };

  const activities = [
    { id: 1, type: 'collaborator_added', title: 'Novo colaborador adicionado',
      description: 'Maria Silva foi adicionada ao Marketing', timestamp: '2h atrás', icon: 'UserPlus', color: 'text-emerald-600' },
    { id: 2, type: 'training_completed', title: 'Treinamento concluído',
      description: 'João Santos completou Segurança da Informação', timestamp: '4h atrás', icon: 'BookOpen', color: 'text-blue-600' },
    { id: 3, type: 'feedback_received', title: 'Feedback recebido',
      description: 'Ana Costa enviou feedback sobre onboarding', timestamp: '1d atrás', icon: 'MessageSquare', color: 'text-purple-600' },
    { id: 4, type: 'goal_achieved', title: 'Meta alcançada',
      description: 'Equipe de vendas atingiu 100% da meta mensal', timestamp: '1d atrás', icon: 'Trophy', color: 'text-amber-600' },
    { id: 5, type: 'document_uploaded', title: 'Documento enviado',
      description: 'Relatório de performance Q1 enviado para análise', timestamp: '2d atrás', icon: 'FileText', color: 'text-slate-500' },
  ];

  const tasks = [
    { id: 1, title: 'Revisar onboarding de Maria Silva', priority: 'high' as const, dueDate: 'Hoje', status: 'pending' as const },
    { id: 2, title: 'Preparar relatório mensal de RH', priority: 'medium' as const, dueDate: 'Amanhã', status: 'in_progress' as const },
    { id: 3, title: 'Agendar reunião de feedback', priority: 'low' as const, dueDate: 'Esta semana', status: 'pending' as const },
  ];

  const quickActions = [
    { label: 'Adicionar Colaborador', icon: Users, path: '/app/collaborators' },
    { label: 'Novo Onboarding', icon: UserPlus, path: '/app/onboarding' },
    { label: 'Enviar Feedback', icon: MessageSquare, path: '/app/feedback' },
    { label: 'Definir Meta', icon: Target, path: '/app/goals' },
    { label: 'Análise DISC', icon: Brain, path: '/app/disc' },
    { label: 'Treinamentos', icon: BookOpen, path: '/app/training' },
  ];

  const firstName = user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'usuário';

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              {getGreeting()}, {firstName} 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5 capitalize">{getFormattedDate()}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" onClick={() => navigate('/changelog')}>
              <Trophy className="h-4 w-4 mr-2" />
              Novidades
            </Button>
            <Button size="sm" onClick={() => openIAAssistant()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0">
              <Sparkles className="h-4 w-4 mr-2" />
              BrainSys IAO
            </Button>
          </div>
        </div>

        {/* ── BrainSys IAO — compact hero strip ───────────────────────────── */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 border border-indigo-700/40 p-4 lg:p-5">
          {/* decorative blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-8 -right-8 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-indigo-500/15 rounded-full blur-3xl" />
          </div>

          <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            {/* Left: icon + info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-600 to-violet-700 rounded-xl flex items-center justify-center shadow-xl shadow-purple-900/40">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative rounded-full h-3 w-3 bg-emerald-500" />
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base font-bold text-white">BrainSys IAO</span>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] px-1.5 py-0">VIVA</Badge>
                </div>
                <p className="text-xs text-purple-200 mt-0.5 line-clamp-1">
                  Inteligência Artificial Operacional • Ontológica — análise contextual em tempo real
                </p>
              </div>
            </div>

            {/* Right: quick metrics */}
            <div className="flex items-center gap-3 sm:gap-4 text-center flex-shrink-0">
              {[
                { label: 'Precisão', value: '94.7%', color: 'text-purple-300' },
                { label: 'Insights', value: '12', color: 'text-blue-300' },
                { label: 'Impacto/Mês', value: 'R$ 45K', color: 'text-emerald-300' },
              ].map(m => (
                <div key={m.label} className="hidden sm:block">
                  <div className={`text-sm font-bold ${m.color}`}>{m.value}</div>
                  <div className="text-[10px] text-purple-300/70">{m.label}</div>
                </div>
              ))}
              <Button
                size="sm"
                onClick={() => navigate('/app/brainsys-iao')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm text-xs"
              >
                Despertar <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* ── KPI Stats Row ─────────────────────────────────────────────────── */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Colaboradores" value={stats.totalCollaborators} icon={Users} trend={12} />
          <StatsCard title="Processos Ativos" value={stats.activeProcesses} icon={Activity} trend={8} />
          <StatsCard title="Taxa de Conclusão" value={`${stats.completionRate}%`} icon={TrendingUp} trend={15} />
          <CreditsCard />
        </div>

        {/* ── Main Content — 2-column desktop layout ────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left column — charts + activities (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Performance Chart */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Tendências de Performance</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Últimos 6 meses — produtividade, engajamento e satisfação</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => navigate('/app/analytics')}>
                    Ver relatório <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <PerformanceTrendsChart />
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Atividades Recentes</CardTitle>
                  <Badge variant="secondary" className="text-xs">{activities.length} eventos</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="divide-y divide-border">
                  {activities.map((activity, i) => (
                    <div key={i} className="py-2 first:pt-0 last:pb-0">
                      <ActivityItem activity={activity} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column — goals, tasks, quick actions (1/3 width) */}
          <div className="space-y-6">

            {/* Monthly Goals */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Metas do Mês</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                {[
                  { label: 'Onboardings', value: 75, color: 'bg-indigo-500' },
                  { label: 'Treinamentos', value: 60, color: 'bg-purple-500' },
                  { label: 'Feedbacks', value: 90, color: 'bg-emerald-500' },
                ].map(goal => (
                  <div key={goal.label}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-medium">{goal.label}</span>
                      <span className="text-sm text-muted-foreground font-semibold">{goal.value}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${goal.color}`}
                        style={{ width: `${goal.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Pending Tasks */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Tarefas Pendentes</CardTitle>
                  <Badge variant="outline" className="text-xs">{tasks.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {tasks.map((task, i) => (
                    <TaskItem key={i} task={task} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map(action => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.path}
                        onClick={() => navigate(action.path)}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 hover:border-primary/30 transition-all duration-200 text-center group"
                      >
                        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground leading-tight">
                          {action.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export const Dashboard = DashboardComponent;