import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAvatarPreloader } from '@/hooks/useAvatarPreloader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Moon, Sun, Monitor, LogOut, Settings, User, Loader2, Home, Bell, Search, Menu, X } from 'lucide-react';
import { useLocation, Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useDebounceNavigation } from '@/hooks/useDebounceNavigation';

interface HeaderProps {
  showAuth?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showAuth = true }) => {
  const { user, session, signOut, loading } = useAuth();
  const [currentLocation] = useLocation() as [string, any];
  const { toast } = useToast();
  const { debouncedNavigate } = useDebounceNavigation();
  
  const navigate = (path: string) => {
    debouncedNavigate(path);
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Hook para carregar dados do perfil do usuário
  const { 
    user: profileUser, 
    isLoading: profileLoading 
  } = useUserProfile(user?.id || session?.user?.id || '');

  // Pré-carregador de avatar para navegação suave
  const { shouldShowAvatar, preloadedUrl } = useAvatarPreloader({
    avatarUrl: profileUser?.avatar_url || user?.avatar_url || session?.user?.avatar_url,
    userId: user?.id || session?.user?.id
  });

  // Verificação de segurança para o useTheme
  let theme: any = 'light';
  let actualTheme: any = 'light';
  let setTheme: any = () => {};

  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
    actualTheme = themeContext.actualTheme;
    setTheme = themeContext.setTheme;
  } catch (error) {
    console.warn('Theme context not available:', error);
  }

  const getUserName = () => {
    // Priorizar dados do perfil carregado do banco
    if (profileUser?.full_name) return profileUser.full_name;
    if (user?.full_name) return user.full_name;
    if (profileUser?.email) return profileUser.email.split('@')[0];
    if (user?.email) return user.email.split('@')[0];
    return 'Usuário';
  };

  const getUserAvatar = () => {
    // Priorizar avatar do perfil carregado do banco
    const avatar = profileUser?.avatar_url || user?.avatar_url || session?.user?.avatar_url || '';
    console.log('🖼️ Header - Getting user avatar from profile:', avatar);
    
    // Para avatars de upload, usar versioning estável baseado no update time
    // Isso evita recarregamentos desnecessários durante navegação
    if (avatar && avatar.startsWith('/uploads/')) {
      const updateTime = (profileUser as any)?.updated_at || (user as any)?.updated_at;
      if (updateTime) {
        // Usar apenas data (sem horário) para versioning mais estável
        const versionDate = new Date(updateTime).toISOString().split('T')[0];
        return `${avatar}?v=${versionDate}`;
      }
    }
    
    return avatar;
  };

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      console.log('Starting logout...');

      localStorage.clear();
      sessionStorage.clear();

      toast({
        title: "Saindo...",
        description: "Redirecionando para login.",
      });

      await signOut();
      window.location.href = '/login';

    } catch (error: any) {
      console.error('Logout error:', error);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    }
  };

  const getThemeIcon = () => {
    if (theme === 'auto') return Monitor;
    return actualTheme === 'light' ? Moon : Sun;
  };

  const ThemeIcon = getThemeIcon();
  const isAuthPage = currentLocation === '/login' || currentLocation === '/';

  return (
    <header className="h-12 sm:h-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl flex items-center justify-between px-3 sm:px-4 md:px-6 relative z-20 border-0 rounded-tl-xl sm:rounded-tl-2xl lg:rounded-tl-3xl shadow-lg shadow-gray-200/10 dark:shadow-gray-900/10">
      <div className="w-full max-w-none mx-auto px-2 sm:px-4 md:px-6 lg:px-8 flex h-12 sm:h-16 items-center justify-between">
        <div className="flex items-center gap-2 sm:space-x-4">
          {/* Mobile Menu Button */}
          {showAuth && user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.dispatchEvent(new CustomEvent('toggleMobileMenu'))}
              className="lg:hidden h-8 sm:h-10 w-8 sm:w-10 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 p-0"
            >
              <Menu className="h-4 sm:h-5 w-4 sm:w-5" />
            </Button>
          )}
          
          <div 
            onClick={() => navigate(user ? '/app/dashboard' : '/')}
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group"
          >
            <img 
              src={actualTheme === 'dark' ? "/Humansysbranco.png" : "/Humansys.png"}
              alt="Logotipo da Humansys"
              className="h-7 sm:h-10 w-auto transition-transform duration-200 group-hover:scale-110 object-contain"
            />
          </div>

          {/* Mobile Menu Button */}
          {!user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden h-8 sm:h-10 w-8 sm:w-10 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 p-0"
            >
              {mobileMenuOpen ? (
                <X className="h-4 sm:h-5 w-4 sm:w-5" />
              ) : (
                <Menu className="h-4 sm:h-5 w-4 sm:w-5" />
              )}
            </Button>
          )}

          {/* Product Navigation - desktop menu */}
          {!user && (
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm">
                    Produto
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-xl bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 no-underline outline-none focus:shadow-md transition-colors"
                            href="/app/dashboard"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium text-green-900 dark:text-green-100">
                              Humansys
                            </div>
                            <p className="text-sm leading-tight text-green-700 dark:text-green-300">
                              Plataforma completa de gestão de RH com IA
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            href="/app/dashboard"
                          >
                            <div className="text-sm font-medium leading-none">Funcionalidades</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Explore todas as funcionalidades do sistema
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            href="/plans"
                          >
                            <div className="text-sm font-medium leading-none">Preços</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Conheça nossos planos e preços
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            href="/changelog"
                          >
                            <div className="text-sm font-medium leading-none">Novidades</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Veja as últimas atualizações
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            href="/brainsys"
                          >
                            <div className="text-sm font-medium leading-none">BrainSys</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Inteligência Artificial Organizacional
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}

          {/* Mobile Menu Items */}
          {!user && mobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg z-50">
              <div className="flex flex-col p-4 space-y-2">
                <button 
                  onClick={() => { navigate('/app/dashboard'); setMobileMenuOpen(false); }}
                  className="text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Funcionalidades
                </button>
                <button 
                  onClick={() => { navigate('/plans'); setMobileMenuOpen(false); }}
                  className="text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Preços
                </button>
                <button 
                  onClick={() => { navigate('/changelog'); setMobileMenuOpen(false); }}
                  className="text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Novidades
                </button>
                <button 
                  onClick={() => { navigate('/brainsys'); setMobileMenuOpen(false); }}
                  className="text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  BrainSys
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          {/* Search Button - only show when user is logged in and on desktop */}
          {user && (
            <Button
              variant="ghost"
              size="icon"
              className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-110 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 hidden sm:flex"
              disabled={loading}
            >
              <Search className="h-3 sm:h-4 w-3 sm:w-4" />
            </Button>
          )}

          {/* Notifications - only show when user is logged in and on desktop */}
          {user && (
            <Button
              variant="ghost"
              size="icon"
              className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-110 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 relative hidden md:flex"
              disabled={loading}
            >
              <Bell className="h-3 sm:h-4 w-3 sm:w-4" />
              <div className="absolute top-1.5 right-1.5 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-red-500 rounded-full animate-pulse" />
            </Button>
          )}

          {/* Theme Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-110 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50"
                disabled={loading}
              >
                <ThemeIcon className="h-3 sm:h-4 w-3 sm:w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg">
              <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer rounded-lg">
                <Sun className="mr-2 h-4 w-4" />
                Claro
                {theme === 'light' && <span className="ml-auto text-green-500">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer rounded-lg">
                <Moon className="mr-2 h-4 w-4" />
                Escuro
                {theme === 'dark' && <span className="ml-auto text-green-500">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('auto')} className="cursor-pointer rounded-lg">
                <Monitor className="mr-2 h-4 w-4" />
                Automático
                {theme === 'auto' && <span className="ml-auto text-green-500">✓</span>}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {showAuth && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-10 w-10 rounded-xl transition-all duration-200 hover:scale-110"
                  disabled={loading}
                >
                  <Avatar className="h-10 w-10 border-2 border-green-200 dark:border-green-800">
                    {shouldShowAvatar && (
                      <AvatarImage 
                        src={preloadedUrl} 
                        alt={getUserName()}
                        className="object-cover transition-opacity duration-200"
                        loading="eager"
                        onError={(e) => {
                          console.log('❌ Header - Erro ao carregar avatar:', preloadedUrl);
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                        onLoad={() => {
                          console.log('✅ Header - Avatar carregado com sucesso:', preloadedUrl);
                        }}
                      />
                    )}
                    <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 font-medium">
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        getUserName().charAt(0).toUpperCase()
                      )}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg" align="end">
                <DropdownMenuItem onClick={() => navigate('/app/profile')} className="cursor-pointer rounded-lg" disabled={loading}>
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/app/settings')} className="cursor-pointer rounded-lg" disabled={loading}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer rounded-lg text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400" disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="mr-2 h-4 w-4" />
                  )}
                  {loading ? 'Saindo...' : 'Sair'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : showAuth ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')} 
                className="transition-all duration-200 hover:scale-105 rounded-lg sm:rounded-xl text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50"
              >
                Entrar
              </Button>
              <Button 
                onClick={() => navigate('/checkout')} 
                className="transition-all duration-200 hover:scale-105 rounded-lg sm:rounded-xl text-xs sm:text-sm px-3 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md"
              >
                Teste Grátis
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};