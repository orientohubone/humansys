import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, Mail, Lock, User, Eye, EyeOff, Building2, Shield, Zap, Users, TrendingUp, Award, Brain, Activity, Cpu, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AuthErrorModal } from '@/components/auth/AuthErrorModal';


export const Login = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [floatingElements, setFloatingElements] = useState<number[]>([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [lastError, setLastError] = useState<string>('');
  const { signIn, signUp, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Criar elementos flutuantes dinâmicos
  useEffect(() => {
    const elements = Array.from({ length: 8 }, (_, i) => i);
    setFloatingElements(elements);
  }, []);

  const handleRetryLogin = async (modalCredentials?: { email: string; password: string }) => {
    console.log('🔄 Retry login chamado com:', modalCredentials);

    setShowErrorModal(false);

    // Se temos credenciais do modal, usá-las
    if (modalCredentials) {
      console.log('📝 Usando credenciais do modal para retry');
      setLoginData({
        email: modalCredentials.email,
        password: modalCredentials.password
      });

      // Aguardar um pouco para o estado atualizar
      setTimeout(async () => {
        setIsLoading(true);
        try {
          console.log('🔐 Tentando login com credenciais do modal...');
          const result = await signIn(modalCredentials.email, modalCredentials.password);

          if (result.success) {
            console.log('✅ Login bem-sucedido via modal');
            toast({
              title: "Login realizado com sucesso!",
              description: "Bem-vindo de volta!",
            });
            navigate('/dashboard');
          } else {
            console.log('❌ Falha no login via modal:', result.error);
            setLastError(result.error || 'Credenciais inválidas');
            setShowErrorModal(true);
          }
        } catch (error: any) {
          console.error('❌ Erro no retry login:', error);
          setLastError(error.message || 'Erro inesperado no login');
          setShowErrorModal(true);
        } finally {
          setIsLoading(false);
        }
      }, 100);
    } else {
      // Usar dados atuais do formulário
      setTimeout(() => {
        handleLogin({ preventDefault: () => {} } as React.FormEvent);
      }, 300);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn(loginData.email, loginData.password);

      if (result.success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao Humansys",
        });
        navigate('/dashboard');
      } else {
        const errorMessage = result.error || "Erro no login";

        if (result.error?.includes('Invalid login credentials')) {
          setLastError(result.error);
          setShowErrorModal(true);
        } else {
          toast({
            title: "Erro no login",
            description: errorMessage,
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Detectar se é cadastro de teste grátis (vindo dos botões na landing)
      const urlParams = new URLSearchParams(window.location.search);
      const source = urlParams.get('source') || 'trial';
      const plan = urlParams.get('plan') || 'trial';

      console.log('📝 Tipo de cadastro detectado:', { source, plan });

      // Definir créditos baseado no plano
      let credits = 999999; // Padrão para trial
      if (plan !== 'trial') {
        switch (plan) {
          case 'basic':
            credits = 10000;
            break;
          case 'professional':
            credits = 50000;
            break;
          case 'enterprise':
            credits = 200000;
            break;
          default:
            credits = 999999;
        }
      }

      const userData = {
        name: signupData.name,
        source,
        plan,
        credits
      };

      const result = await signUp(signupData.email, signupData.password, userData);

      if (result.error) {
        throw result.error;
      }

      // Se requer confirmação de email
      if (result.requiresEmailConfirmation) {
        toast({
          title: "Confirme seu email",
          description: "Enviamos um link de confirmação para ativar seu teste grátis de 30 dias",
          duration: 8000,
        });
        return;
      }

      toast({
        title: "Cadastro realizado com sucesso!",
        description: `Bem-vindo ao Humansys! ${credits >= 999999 ? 'Teste grátis ativado!' : `${credits.toLocaleString()} créditos disponíveis`}`,
      });
      navigate('/');
    } catch (error: any) {
      console.error('Signup error:', error);

      let errorMessage = "Não foi possível criar sua conta. Tente novamente.";

      if (error.message?.includes('User already registered')) {
        errorMessage = "Este email já está cadastrado. Tente fazer login ou use outro email.";
      } else if (error.message?.includes('Password should be at least')) {
        errorMessage = "A senha deve ter pelo menos 6 caracteres.";
      } else if (error.message?.includes('Unable to validate email')) {
        errorMessage = "Email inválido. Verifique o formato do email.";
      } else if (error.message?.includes('Failed to fetch')) {
        errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
      }

      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Aguardar o contexto de auth finalizar a verificação inicial
    if (!authLoading) {
      setInitialCheckDone(true);

      // Verificar se o usuário está autenticado
      if (user) {
        console.log('✅ Usuário já logado, redirecionando para:');
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate, authLoading]);

  // Mostrar loading durante verificação inicial
  if (!initialCheckDone) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se o usuário já está logado, não mostrar a tela de login
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex relative overflow-hidden">
      {/* Elementos flutuantes animados */}
      {floatingElements.map((element, index) => (
        <div
          key={element}
          className={`absolute opacity-20 animate-pulse`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${index * 0.5}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        >
          {index % 4 === 0 && <Brain className="h-6 w-6 text-green-500 animate-bounce" />}
          {index % 4 === 1 && <Cpu className="h-4 w-4 text-blue-500 animate-spin" style={{ animationDuration: '3s' }} />}
          {index % 4 === 2 && <Database className="h-5 w-5 text-purple-500 animate-pulse" />}
          {index % 4 === 3 && <Activity className="h-4 w-4 text-green-400 animate-bounce" />}
        </div>
      ))}

      {/* Seção da Esquerda - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* Logo e Título Animado */}
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg transform hover:scale-110 transition-all duration-300 p-1 overflow-hidden">
                <img 
                  src="/IA HUMANSYS.png" 
                  alt="Humansys Logo" 
                  className="w-full h-full object-contain"
                  style={{ 
                    display: 'block'
                  }}
                />
              </div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              HUMANSYS
            </h1>
            <p className="text-xl text-green-600 font-semibold mb-2 animate-pulse">PORTAL DE GESTÃO</p>
            <p className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-lg inline-block">
              🚀 DADOS REAIS ATIVADOS
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600">IA Ativa</span>
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <span className="text-blue-600">Cloud Ready</span>
              </div>
            </div>
          </div>

          {/* Card do Formulário com Efeitos */}
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm relative overflow-hidden">
            {/* Efeito de borda animada */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-lg p-[2px]">
              <div className="bg-white rounded-lg h-full w-full"></div>
            </div>

            <CardContent className="p-8 relative z-10">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-gray-100 to-gray-200 mb-8 h-14 rounded-xl shadow-inner">
                  <TabsTrigger 
                    value="login" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-base font-semibold transition-all duration-300"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Entrar
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-base font-semibold transition-all duration-300"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Cadastrar
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="login-email" className="text-gray-700 text-sm uppercase tracking-wider font-semibold flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-green-500" />
                        USUÁRIO
                      </Label>
                      <div className="relative group">
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="Digite o seu usuário"
                          value={loginData.email}
                          onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                          className="h-14 text-base border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-500 transition-all duration-300 pl-12 group-hover:border-green-300"
                          required
                        />
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="login-password" className="text-gray-700 text-sm uppercase tracking-wider font-semibold flex items-center">
                        <Lock className="h-4 w-4 mr-2 text-green-500" />
                        SENHA
                      </Label>
                      <div className="relative group">
                        <Input
                          id="login-password"
                          type={showLoginPassword ? "text" : "password"}
                          placeholder="Digite sua senha"
                          value={loginData.password}
                          onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                          className="h-14 text-base border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-500 transition-all duration-300 pl-12 pr-12 group-hover:border-green-300"
                          required
                        />
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-2 h-10 w-10 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                        >
                          {showLoginPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input type="checkbox" id="remember" className="w-4 h-4 rounded border-2 border-green-500 text-green-500 focus:ring-green-500" />
                        <label htmlFor="remember" className="text-sm text-gray-600 font-medium">
                          Manter Conectado
                        </label>
                      </div>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-sm text-green-600 hover:text-green-700 font-semibold"
                      >
                        Recuperar Senha
                      </Button>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group" 
                      disabled={isLoading}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                          Entrando...
                        </>
                      ) : (
                        <>
                          <Shield className="mr-3 h-6 w-6" />
                          ENTRAR
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="signup-name" className="text-gray-700 text-sm uppercase tracking-wider font-semibold flex items-center">
                        <User className="h-4 w-4 mr-2 text-blue-500" />
                        NOME COMPLETO
                      </Label>
                      <div className="relative group">
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Digite seu nome completo"
                          value={signupData.name}
                          onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                          className="h-14 text-base border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 pl-12 group-hover:border-blue-300"
                          required
                        />
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="signup-email" className="text-gray-700 text-sm uppercase tracking-wider font-semibold flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-blue-500" />
                        EMAIL
                      </Label>
                      <div className="relative group">
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Digite seu email"
                          value={signupData.email}
                          onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                          className="h-14 text-base border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 pl-12 group-hover:border-blue-300"
                          required
                        />
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="signup-password" className="text-gray-700 text-sm uppercase tracking-wider font-semibold flex items-center">
                        <Lock className="h-4 w-4 mr-2 text-blue-500" />
                        SENHA
                      </Label>
                      <div className="relative group">
                        <Input
                          id="signup-password"
                          type={showSignupPassword ? "text" : "password"}
                          placeholder="Crie uma senha segura"
                          value={signupData.password}
                          onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                          className="h-14 text-base border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 pl-12 pr-12 group-hover:border-blue-300"
                          required
                          minLength={6}
                        />
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-2 h-10 w-10 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                        >
                          {showSignupPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group" 
                      disabled={isLoading}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                          Criando...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-3 h-6 w-6" />
                          CRIAR CONTA
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Seção da Direita - Conteúdo Dinâmico */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-green-400 via-green-500 to-green-600 items-center justify-center p-12 relative overflow-hidden">
        {/* Padrão de fundo animado */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-24 h-24 border border-white rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 border border-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="text-center text-white space-y-8 max-w-lg relative z-10">
          <div className="space-y-6">
            <div className="relative">
              <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                Transforme sua Gestão de RH
              </h2>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
            </div>
            <p className="text-xl opacity-90 leading-relaxed">
              Plataforma completa com IA integrada para otimizar processos e desenvolver talentos
            </p>
          </div>

          {/* Módulo IA Destaque */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 mb-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center animate-pulse">
                  <Brain className="h-6 w-6 text-white animate-bounce" style={{ animationDuration: '2s' }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Brainsys IAO V.1</h3>
                  <p className="text-sm opacity-80">IA Organizacional</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>94.7% Precisão</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>ML Learning</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span>Tempo Real</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ícones de Features Animados */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col items-center space-y-3 group cursor-pointer">
              <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3">
                <Users className="h-10 w-10 text-white group-hover:animate-bounce" />
              </div>
              <span className="text-sm font-semibold">Gestão de Colaboradores</span>
            </div>

            <div className="flex flex-col items-center space-y-3 group cursor-pointer">
              <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300 transform group-hover:scale-110 group-hover:-rotate-3">
                <TrendingUp className="h-10 w-10 text-white group-hover:animate-bounce" />
              </div>
              <span className="text-sm font-semibold">Analytics Inteligente</span>
            </div>

            <div className="flex flex-col items-center space-y-3 group cursor-pointer">
              <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3">
                <Zap className="h-10 w-10 text-white group-hover:animate-bounce" />
              </div>
              <span className="text-sm font-semibold">IA Automatizada</span>
            </div>

            <div className="flex flex-col items-center space-y-3 group cursor-pointer">
              <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300 transform group-hover:scale-110 group-hover:-rotate-3">
                <Award className="h-10 w-10 text-white group-hover:animate-bounce" />
              </div>
              <span className="text-sm font-semibold">Certificações</span>
            </div>
          </div>

          {/* Badge Premium Animado */}
          <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-6 mt-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <Zap className="h-8 w-8 text-yellow-300 animate-pulse" />
                <span className="text-xl font-bold">Teste Premium Grátis</span>
              </div>
              <p className="text-sm opacity-90">
                30 dias de acesso completo à plataforma mais avançada de RH do mercado
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Erro de Autenticação */}
      <AuthErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        error={lastError}
        onRetry={handleRetryLogin}
        isLoading={isLoading}
        userEmail={loginData.email}
      />
    </div>
  );
};