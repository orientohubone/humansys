import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { useIAAssistant } from '@/contexts/IAAssistantContext';

import {
  Users,
  UserPlus,
  MessageSquare,
  Target,
  BookOpen,
  Award,
  FileText,
  BarChart3,
  Settings,
  Home,
  Calendar,
  Briefcase,
  Crown,
  ClipboardList,
  Brain,
  ChevronRight,
  ChevronLeft,
  Activity,
  Bot,
  Sparkles,
  UserCheck,
  LogOut,
  Building2,
  GraduationCap,
  TrendingUp,
  Users2,
  Zap,
  PieChart,
  Lightbulb,
  Shield,
  Star,
  Rocket,
  MoreHorizontal,
  DollarSign,
  Clock
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface SidebarProps {
  className?: string;
}

interface MenuItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  badge?: string;
  badgeColor?: string;
  description?: string;
  isNew?: boolean;
  isPro?: boolean;
  category?: string;
}

interface MenuCategory {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  items: MenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFounder, setIsFounder] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle IA Assistant opening
  const { open: openIAAssistant } = useIAAssistant();
  const handleOpenIAAssistant = () => {
    openIAAssistant();
  };

  // Check founder role
  useEffect(() => {
    if (!user) {
      setIsFounder(false);
      return;
    }

    try {
      const hasFounderAccess = user.email === 'fernandoluizsouzaramalho@gmail.com' || user.role === 'founder';
      setIsFounder(hasFounderAccess);
    } catch (error) {
      console.error('Error checking founder role:', error);
      setIsFounder(false);
    }
  }, [user?.id, user?.email, user?.role]);

  // Update CSS variable for sidebar width globally
  useEffect(() => {
    const sidebarWidth = collapsed ? '80px' : '256px';
    document.documentElement.style.setProperty('--sidebar-width', sidebarWidth);
  }, [collapsed]);

  // Listen for mobile menu toggle events
  useEffect(() => {
    const handleMobileMenuToggle = () => {
      setMobileMenuOpen(prev => !prev);
    };

    window.addEventListener('toggleMobileMenu', handleMobileMenuToggle);
    return () => window.removeEventListener('toggleMobileMenu', handleMobileMenuToggle);
  }, []);

  const getMenuCategories = (): MenuCategory[] => {
    const isFounderPath = location.pathname.startsWith('/founder');

    if (isFounderPath && isFounder) {
      return [
        {
          id: 'dashboards',
          label: 'Dashboards',
          icon: PieChart,
          items: [
            { 
              icon: Crown, 
              label: 'Dashboard Founder', 
              path: '/app/founder-dashboard', 
              description: 'Métricas estratégicas avançadas',
              isPro: true
            },
            { icon: Home, label: 'Dashboard Principal', path: '/app/dashboard', description: 'Visão operacional' },
          ]
        }
      ];
    }

    const categories: MenuCategory[] = [
      {
        id: 'dashboards',
        label: 'Início',
        icon: Home,
        items: [
          { icon: Home, label: 'Início', path: '/app', description: 'Central de comando inteligente', isNew: true },
          { icon: BarChart3, label: 'Dashboard', path: '/app/dashboard', description: 'Visão geral da empresa' },
          ...(isFounder ? [
            { 
              icon: Crown, 
              label: 'Founder Dashboard', 
              path: '/app/founder-dashboard', 
              description: 'Métricas estratégicas avançadas',
              isPro: true
            }
          ] : []),
        ]
      },
      {
        id: 'intelligence',
        label: 'Inteligência',
        icon: Brain,
        items: [
          { icon: Rocket, label: 'Brainsys IAO', path: '/app/brainsys-iao', description: 'Orquestrador de IA', isNew: true },
          { icon: Lightbulb, label: 'Análise DISC', path: '/app/disc', badge: 'IA', badgeColor: 'bg-purple-500', description: 'Perfil comportamental com IA', isNew: true },
          { icon: BarChart3, label: 'Analytics', path: '/app/analytics', description: 'Relatórios avançados' },
        ]
      },
      {
        id: 'people',
        label: 'Gestão de Pessoas',
        icon: Users2,
        items: [
          { icon: Users, label: 'Colaboradores', path: '/app/collaborators', description: 'Gestão completa da equipe' },
          { icon: UserPlus, label: 'Recrutamento', path: '/app/recruitment', description: 'Processo seletivo' },
          { icon: Briefcase, label: 'Onboarding', path: '/app/onboarding', description: 'Integração de novos membros' },
          { icon: DollarSign, label: 'Salários e Benefícios', path: '/app/payroll', description: 'Gestão de folha de pagamento', isNew: true },
          { icon: Clock, label: 'Ponto Digital', path: '/app/timesheet', description: 'Controle de ponto eletrônico', isNew: true },
          { icon: Calendar, label: 'Reuniões 1:1', path: '/app/meetings', description: 'Acompanhamento individual' },
          { icon: Star, label: 'Feedback', path: '/app/feedback', description: 'Avaliações e feedback' },
        ]
      },
      {
        id: 'development',
        label: 'Desenvolvimento',
        icon: GraduationCap,
        items: [
          { icon: Target, label: 'Metas & PDI', path: '/app/goals', description: 'Objetivos e desenvolvimento' },
          { icon: BookOpen, label: 'Treinamentos', path: '/app/training', description: 'Capacitação da equipe' },
          { icon: Brain, label: 'Gerenciar Cursos', path: '/app/lms', description: 'LMS - Sistema de Treinamentos', isNew: true },
          { icon: Award, label: 'Certificados', path: '/app/certificates', description: 'Reconhecimentos e certificações' },
        ]
      },
      {
        id: 'engagement',
        label: 'Engajamento',
        icon: TrendingUp,
        items: [
          { icon: ClipboardList, label: 'Pesquisas', path: '/app/surveys', description: 'Engajamento e satisfação' },
        ]
      },
      {
        id: 'management',
        label: 'Gestão',
        icon: Shield,
        items: [
          { icon: FileText, label: 'Documentos', path: '/app/documents', description: 'Gestão de documentos' },
          { icon: Settings, label: 'Configurações', path: '/app/settings', description: 'Personalização do sistema' },
        ]
      }
    ];

    return categories;
  };

  const menuCategories = getMenuCategories();
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Desktop Sidebar */}
      <div 
        className={cn(
          "fixed left-0 top-0 z-30 flex flex-col transition-all duration-300 ease-out h-screen",
          "hidden lg:flex",
          collapsed ? "w-20" : "w-64",
          className
        )}
      >
        <aside className="h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col shadow-2xl shadow-black/30 border-r border-slate-700/50 backdrop-blur-xl overflow-hidden">
          {/* Desktop Content */}
          {/* Header with Logo and Toggle */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
            <div 
              className="w-10 h-10 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group flex-shrink-0"
              onClick={() => setCollapsed(!collapsed)}
            >
              <Sparkles className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-300" />
            </div>

            {!collapsed && (
              <div className="flex items-center gap-2 flex-1 ml-3 min-w-0">
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-white truncate">HumanSys</h2>
                  <p className="text-xs text-slate-400 truncate">Gestão Inteligente</p>
                </div>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="h-8 w-8 hover:bg-white/10 text-white rounded-lg flex-shrink-0"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden sidebar-scroll px-2 py-3">
            <div className="space-y-4">
              {menuCategories.map((category) => (
                <div key={category.id} className="space-y-1">
                  {/* Category Header */}
                  {!collapsed && (
                    <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <category.icon className="h-3 w-3" />
                      <span className="truncate">{category.label}</span>
                    </div>
                  )}

                  {/* Category Items */}
                  <div className="space-y-1">
                    {category.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);

                      return (
                        <SidebarIcon
                          key={item.path}
                          icon={<Icon className={cn("transition-all duration-200", collapsed ? "h-5 w-5" : "h-4 w-4")} />}
                          tooltip={item.label}
                          description={item.description}
                          isActive={active}
                          onClick={() => {
                            console.log(`🚀 Navegando para: ${item.path}`);
                            try {
                              navigate(item.path, { replace: false });
                            } catch (error) {
                              console.error('Erro na navegação, tentando fallback:', error);
                              window.location.href = item.path;
                            }
                          }}
                          badge={item.badge}
                          badgeColor={item.badgeColor}
                          isNew={item.isNew}
                          isPro={item.isPro}
                          collapsed={collapsed}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          {/* Bottom Actions - Desktop */}
          <div className="mt-auto border-t border-slate-700/50 p-3 space-y-2">
            {/* IA Assistant - Destacado */}
            <div className="relative">
              <SidebarIcon
                icon={
                  <div className="relative">
                    <Bot className={cn("transition-all duration-200", collapsed ? "h-5 w-5" : "h-4 w-4")} />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  </div>
                }
                tooltip="IA Assistant"
                description="Assistente BrainSys AI"
                onClick={handleOpenIAAssistant}
                badge="AI"
                badgeColor="bg-gradient-to-r from-blue-500 to-cyan-500"
                collapsed={collapsed}
                isSpecial={true}
              />
            </div>

            {/* Profile */}
            <div className="group relative cursor-pointer">
              <div 
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200"
                onClick={() => navigate('/app/settings?tab=profile')}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 p-0.5 shadow-lg flex-shrink-0">
                  <div className="w-full h-full bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
                    {user?.avatar_url ? (
                      <img 
                        src={user.avatar_url} 
                        alt={user.full_name || user.email} 
                        className="w-full h-full rounded-lg object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-xs font-bold text-emerald-400">
                        {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                </div>

                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">
                      {user?.full_name || user?.email}
                    </p>
                    <p className="text-xs text-slate-400 truncate">Ver perfil</p>
                  </div>
                )}

                <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full border border-slate-800 animate-pulse" />
              </div>
            </div>

            {/* Logout */}
            <SidebarIcon
              icon={<LogOut className={cn("transition-all duration-200", collapsed ? "h-5 w-5" : "h-4 w-4")} />}
              tooltip="Sair"
              description="Encerrar sessão"
              onClick={handleLogout}
              collapsed={collapsed}
            />
          </div>
        </aside>
      </div>
      
      {/* Mobile Sidebar */}
      <div 
        className={cn(
          "fixed left-0 top-0 z-50 flex flex-col transition-all duration-300 ease-out h-screen w-72 max-w-[90vw] sm:w-80",
          "lg:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <aside className="h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col shadow-2xl shadow-black/30 border-r border-slate-700/50 backdrop-blur-xl overflow-hidden">
          {/* Mobile Header with Close Button */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">HumanSys</h2>
                <p className="text-xs text-slate-400">Gestão Inteligente</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
              className="h-8 w-8 hover:bg-white/10 text-white rounded-lg"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden sidebar-scroll px-2 py-3">
            <div className="space-y-4">
              {menuCategories.map((category) => (
                <div key={category.id} className="space-y-1">
                  {/* Category Header */}
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <category.icon className="h-3 w-3" />
                    <span className="truncate">{category.label}</span>
                  </div>

                  {/* Category Items */}
                  <div className="space-y-1">
                    {category.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);

                      return (
                        <div 
                          key={item.path}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer",
                            active 
                              ? "bg-gradient-to-br from-emerald-400/20 to-green-500/20 text-emerald-400 shadow-lg border border-emerald-500/30" 
                              : "bg-slate-800/50 hover:bg-gradient-to-br hover:from-emerald-400/10 hover:to-green-500/10 text-slate-300 hover:text-emerald-400 border border-slate-700/50 hover:border-emerald-500/30"
                          )}
                          onClick={() => {
                            console.log(`🚀 Navegando para: ${item.path}`);
                            try {
                              navigate(item.path, { replace: false });
                              setMobileMenuOpen(false); // Close mobile menu after navigation
                            } catch (error) {
                              console.error('Erro na navegação, tentando fallback:', error);
                              window.location.href = item.path;
                            }
                          }}
                        >
                          <Icon className="h-5 w-5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{item.label}</div>
                            {item.description && (
                              <div className="text-xs text-slate-400 truncate">{item.description}</div>
                            )}
                          </div>
                          {/* Badges */}
                          {item.badge && (
                            <div className={cn(
                              "text-white text-xs px-2 py-1 rounded font-bold",
                              item.badgeColor || "bg-emerald-500"
                            )}>
                              {item.badge}
                            </div>
                          )}
                          {item.isNew && !item.badge && (
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                          )}
                          {item.isPro && (
                            <Sparkles className="h-3 w-3 text-yellow-400 animate-pulse" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
            ))}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto border-t border-slate-700/50 p-3 space-y-2">
          {/* IA Assistant - Destacado */}
          <div className="relative">
            <SidebarIcon
              icon={
                <div className="relative">
                  <Bot className={cn("transition-all duration-200", collapsed ? "h-5 w-5" : "h-4 w-4")} />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                </div>
              }
              tooltip="IA Assistant"
              description="Assistente BrainSys AI"
              onClick={handleOpenIAAssistant}
              badge="AI"
              badgeColor="bg-gradient-to-r from-blue-500 to-cyan-500"
              collapsed={collapsed}
              isSpecial={true}
            />
          </div>

          {/* Profile */}
          <div className="group relative cursor-pointer">
            <div 
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200"
              onClick={() => navigate('/app/settings?tab=profile')}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 p-0.5 shadow-lg flex-shrink-0">
                <div className="w-full h-full bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
                  {user?.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.full_name || user.email} 
                      className="w-full h-full rounded-lg object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-xs font-bold text-emerald-400">
                      {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
              </div>

              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">
                    {user?.full_name || user?.email}
                  </p>
                  <p className="text-xs text-slate-400 truncate">Ver perfil</p>
                </div>
              )}

              <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full border border-slate-800 animate-pulse" />
            </div>
          </div>

          {/* Logout */}
          <SidebarIcon
            icon={<LogOut className={cn("transition-all duration-200", collapsed ? "h-5 w-5" : "h-4 w-4")} />}
            tooltip="Sair"
            description="Encerrar sessão"
            onClick={handleLogout}
            collapsed={collapsed}
          />
        </div>
      </aside>
    </div>
    </TooltipProvider>
  );
};

interface SidebarIconProps {
  icon: React.ReactNode;
  tooltip: string;
  description?: string;
  isActive?: boolean;
  onClick?: () => void;
  badge?: string;
  badgeColor?: string;
  isNew?: boolean;
  isPro?: boolean;
  collapsed: boolean;
  isSpecial?: boolean;
}

function SidebarIcon({ 
  icon, 
  tooltip, 
  description, 
  isActive = false, 
  onClick, 
  badge,
  badgeColor,
  isNew,
  isPro,
  collapsed,
  isSpecial = false
}: SidebarIconProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (collapsed) {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top + rect.height / 2,
        left: rect.right + 8
      });
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };
  const iconContent = (
    <div 
      className={cn(
        "flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 relative overflow-hidden cursor-pointer",
        collapsed ? "justify-center min-h-[60px]" : "flex-row justify-start min-h-auto",
        isActive 
          ? "bg-gradient-to-br from-emerald-400/20 to-green-500/20 text-emerald-400 shadow-lg shadow-emerald-500/20 border border-emerald-500/30" 
          : isSpecial
          ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-400 hover:bg-gradient-to-br hover:from-blue-400/30 hover:to-cyan-500/30 border border-blue-500/30 hover:border-blue-400/50"
          : "bg-slate-800/50 hover:bg-gradient-to-br hover:from-emerald-400/10 hover:to-green-500/10 text-slate-300 hover:text-emerald-400 border border-slate-700/50 hover:border-emerald-500/30"
      )}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={cn("flex items-center justify-center flex-shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")}>
        {icon}
      </div>

      {!collapsed && (
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium truncate">{tooltip}</div>
          {description && (
            <div className="text-xs text-slate-400 truncate">{description}</div>
          )}
        </div>
      )}

      {/* Active indicator */}
      {isActive && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-400 rounded-l-full" />
      )}

      {/* Badges */}
      {badge && (
        <div className={cn(
          "absolute -top-0.5 -right-0.5 text-white text-[8px] px-1 py-0.5 rounded font-extrabold shadow-lg z-10 border border-white/20 min-w-[16px] text-center",
          badgeColor || "bg-emerald-500",
          badge === 'PRO' && "animate-pulse"
        )}>
          {badge}
        </div>
      )}

      {/* New indicator */}
      {isNew && !badge && (
        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full flex items-center justify-center z-10">
          <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
        </div>
      )}

      {/* Pro indicator */}
      {isPro && (
        <div className="absolute -top-0.5 -right-0.5 z-10">
          <Sparkles className="h-2.5 w-2.5 text-yellow-400 filter drop-shadow-lg animate-pulse" />
        </div>
      )}
    </div>
  );

  return (
    <>
      {iconContent}
      {collapsed && showTooltip && createPortal(
        <div 
          className="fixed bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-2xl border border-slate-700 whitespace-nowrap pointer-events-none"
          style={{ 
            zIndex: 99999,
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: 'translateY(-50%)'
          }}
        >
          <div className="font-medium text-emerald-400">{tooltip}</div>
          {description && (
            <div className="text-xs text-slate-400 mt-1 max-w-[200px]">{description}</div>
          )}
          {(badge || isNew || isPro) && (
            <div className="flex items-center gap-1 mt-1">
              {badge && (
                <div className={cn(
                  "text-[9px] px-1.5 py-0.5 rounded font-bold",
                  badgeColor || "bg-emerald-500 text-white"
                )}>
                  {badge}
                </div>
              )}
              {isNew && <span className="text-[9px] text-emerald-400">• Novo</span>}
              {isPro && <span className="text-[9px] text-yellow-400">• Pro</span>}
            </div>
          )}
          {/* Arrow pointing to the left */}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-l-[8px] border-l-emerald-500 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent" />
        </div>,
        document.body
      )}
    </>
  );
}