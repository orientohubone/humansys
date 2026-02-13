import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, Mail, Lock, User, Eye, EyeOff, Shield, Sparkles, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AuthErrorModal } from '@/components/auth/AuthErrorModal';
import humansysLogo from '/Humansys.png';
import humansysLogoBranco from '/Humansysbranco.png';

export const Login = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [lastError, setLastError] = useState<string>('');
  const { signIn, signUp, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  const handleRetryLogin = async (modalCredentials?: { email: string; password: string }) => {
    setShowErrorModal(false);

    if (modalCredentials) {
      setLoginData({
        email: modalCredentials.email,
        password: modalCredentials.password
      });

      setTimeout(async () => {
        setIsLoading(true);
        try {
          const result = await signIn(modalCredentials.email, modalCredentials.password);

          if (result.success) {
            toast({
              title: "Login realizado com sucesso!",
              description: "Bem-vindo de volta!",
            });
            return;
          } else {
            setLastError(result.error || 'Credenciais inválidas');
            setShowErrorModal(true);
          }
        } catch (error: any) {
          setLastError(error.message || 'Erro inesperado no login');
          setShowErrorModal(true);
        } finally {
          setIsLoading(false);
        }
      }, 100);
    } else {
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

      const isFounder = loginData.email === 'fernandoluizsouzaramalho@gmail.com';
      const redirectPath = isFounder ? '/app/founder-dashboard' : '/app';

      toast({
        title: "Login realizado!",
        description: `Redirecionando para o ${isFounder ? 'founder ' : ''}dashboard...`,
      });

      setTimeout(() => {
        navigate(redirectPath);
      }, 1000);

    } catch (error: any) {
      console.error('Login error:', error);
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
      const urlParams = new URLSearchParams(window.location.search);
      const source = urlParams.get('source') || 'trial';
      const plan = urlParams.get('plan') || 'trial';

      let credits = 999999;
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

      const { error } = await signUp(signupData.email, signupData.password, signupData.name);

      if (error) {
        throw new Error(error);
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
    if (!authLoading) {
      setInitialCheckDone(true);

      if (user) {
        navigate('/app', { replace: true });
      }
    }
  }, [user, navigate, authLoading]);

  if (!initialCheckDone) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-950 dark:to-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400" />
          <p className="text-gray-600 dark:text-gray-300">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen w-full flex relative overflow-hidden bg-white dark:bg-gray-950">
      {/* Lado Esquerdo - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-3 xs:p-4 sm:p-6 md:p-8 lg:p-12 bg-white dark:bg-gray-950 relative z-10 min-h-screen lg:overflow-y-auto overflow-y-auto">
        <div className="w-full max-w-sm space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-8">
          
          {/* Logo Humansys */}
          <div className="text-center mb-6 xs:mb-8">
            <div className="flex justify-center">
              <img 
                src={humansysLogo} 
                alt="Humansys Logo" 
                className="h-16 xs:h-20 sm:h-24 md:h-28 w-auto object-contain transform hover:scale-105 transition-all duration-300 block dark:hidden"
              />
              <img 
                src={humansysLogoBranco} 
                alt="Humansys Logo Branco" 
                className="h-16 xs:h-20 sm:h-24 md:h-28 w-auto object-contain transform hover:scale-105 transition-all duration-300 hidden dark:block"
              />
            </div>
          </div>

          {/* Card do Formulário */}
          <Card className="border border-gray-200 dark:border-gray-800 shadow-xl bg-white dark:bg-gray-900 overflow-hidden">
            <CardContent className="p-4 xs:p-5 sm:p-6 md:p-8">
              <Tabs defaultValue="login" className="w-full">
                {/* Tabs Navigation */}
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 mb-6 xs:mb-8 h-12 xs:h-14 rounded-lg gap-1 p-1">
                  <TabsTrigger 
                    value="login" 
                    className="text-sm xs:text-base font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                  >
                    <Mail className="h-4 w-4 xs:h-5 xs:w-5 mr-1.5 xs:mr-2" />
                    <span className="hidden xs:inline">Entrar</span>
                    <span className="xs:hidden">Acesso</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="text-sm xs:text-base font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                  >
                    <User className="h-4 w-4 xs:h-5 xs:w-5 mr-1.5 xs:mr-2" />
                    <span className="hidden xs:inline">Cadastrar</span>
                    <span className="xs:hidden">Nova</span>
                  </TabsTrigger>
                </TabsList>

                {/* Login Form */}
                <TabsContent value="login" className="space-y-4 xs:space-y-5 sm:space-y-6">
                  <form onSubmit={handleLogin} className="space-y-4 xs:space-y-5 sm:space-y-6">
                    {/* Email Field */}
                    <div className="space-y-2 xs:space-y-2.5">
                      <Label htmlFor="login-email" className="text-xs xs:text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center">
                        <Mail className="h-3.5 w-3.5 xs:h-4 xs:w-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                        Usuário
                      </Label>
                      <div className="relative group">
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="Digite seu email"
                          value={loginData.email}
                          onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                          className="h-11 xs:h-12 sm:h-13 text-sm xs:text-base border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-lg xs:rounded-xl focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all duration-300 pl-10 xs:pl-11 group-hover:border-emerald-300 dark:group-hover:border-emerald-600"
                          required
                        />
                        <Mail className="absolute left-3 xs:left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 xs:h-5 xs:w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 transition-colors" />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2 xs:space-y-2.5">
                      <Label htmlFor="login-password" className="text-xs xs:text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center">
                        <Lock className="h-3.5 w-3.5 xs:h-4 xs:w-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                        Senha
                      </Label>
                      <div className="relative group">
                        <Input
                          id="login-password"
                          type={showLoginPassword ? "text" : "password"}
                          placeholder="Digite sua senha"
                          value={loginData.password}
                          onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                          className="h-11 xs:h-12 sm:h-13 text-sm xs:text-base border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-lg xs:rounded-xl focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all duration-300 pl-10 xs:pl-11 pr-11 xs:pr-12 group-hover:border-emerald-300 dark:group-hover:border-emerald-600"
                          required
                        />
                        <Lock className="absolute left-3 xs:left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 xs:h-5 xs:w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 transition-colors" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 xs:right-2.5 top-1/2 transform -translate-y-1/2 h-9 w-9 p-0 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                        >
                          {showLoginPassword ? (
                            <EyeOff className="h-4 w-4 xs:h-5 xs:w-5" />
                          ) : (
                            <Eye className="h-4 w-4 xs:h-5 xs:w-5" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Remember and Forgot Password */}
                    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-3">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 xs:w-4.5 xs:h-4.5 border-2 border-gray-300 dark:border-gray-600 rounded accent-emerald-600 dark:accent-emerald-400 cursor-pointer" 
                        />
                        <span className="text-xs xs:text-sm text-gray-600 dark:text-gray-400 font-medium group-hover:text-gray-900 dark:group-hover:text-gray-300">
                          Manter conectado
                        </span>
                      </label>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-xs xs:text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold justify-start xs:justify-end"
                      >
                        Recuperar senha
                      </Button>
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      className="w-full h-12 xs:h-13 sm:h-14 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-base xs:text-lg rounded-lg xs:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mt-2 xs:mt-3 flex items-center justify-center gap-2" 
                      disabled={isLoading}
                      data-testid="button-login-submit"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 xs:h-6 xs:w-6 animate-spin" />
                          <span>Entrando...</span>
                        </>
                      ) : (
                        <>
                          <Shield className="h-5 w-5 xs:h-6 xs:w-6" />
                          <span>ENTRAR</span>
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* Signup Form */}
                <TabsContent value="signup" className="space-y-4 xs:space-y-5 sm:space-y-6">
                  <form onSubmit={handleSignup} className="space-y-4 xs:space-y-5 sm:space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2 xs:space-y-2.5">
                      <Label htmlFor="signup-name" className="text-xs xs:text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center">
                        <User className="h-3.5 w-3.5 xs:h-4 xs:w-4 mr-2 text-blue-600 dark:text-blue-400" />
                        Nome Completo
                      </Label>
                      <div className="relative group">
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Digite seu nome completo"
                          value={signupData.name}
                          onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                          className="h-11 xs:h-12 sm:h-13 text-sm xs:text-base border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-lg xs:rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 pl-10 xs:pl-11 group-hover:border-blue-300 dark:group-hover:border-blue-600"
                          required
                        />
                        <User className="absolute left-3 xs:left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 xs:h-5 xs:w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2 xs:space-y-2.5">
                      <Label htmlFor="signup-email" className="text-xs xs:text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center">
                        <Mail className="h-3.5 w-3.5 xs:h-4 xs:w-4 mr-2 text-blue-600 dark:text-blue-400" />
                        Email
                      </Label>
                      <div className="relative group">
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Digite seu email"
                          value={signupData.email}
                          onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                          className="h-11 xs:h-12 sm:h-13 text-sm xs:text-base border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-lg xs:rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 pl-10 xs:pl-11 group-hover:border-blue-300 dark:group-hover:border-blue-600"
                          required
                        />
                        <Mail className="absolute left-3 xs:left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 xs:h-5 xs:w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2 xs:space-y-2.5">
                      <Label htmlFor="signup-password" className="text-xs xs:text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center">
                        <Lock className="h-3.5 w-3.5 xs:h-4 xs:w-4 mr-2 text-blue-600 dark:text-blue-400" />
                        Senha
                      </Label>
                      <div className="relative group">
                        <Input
                          id="signup-password"
                          type={showSignupPassword ? "text" : "password"}
                          placeholder="Digite uma senha (min. 6 caracteres)"
                          value={signupData.password}
                          onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                          className="h-11 xs:h-12 sm:h-13 text-sm xs:text-base border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-lg xs:rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 pl-10 xs:pl-11 pr-11 xs:pr-12 group-hover:border-blue-300 dark:group-hover:border-blue-600"
                          required
                        />
                        <Lock className="absolute left-3 xs:left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 xs:h-5 xs:w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 xs:right-2.5 top-1/2 transform -translate-y-1/2 h-9 w-9 p-0 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                        >
                          {showSignupPassword ? (
                            <EyeOff className="h-4 w-4 xs:h-5 xs:w-5" />
                          ) : (
                            <Eye className="h-4 w-4 xs:h-5 xs:w-5" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      className="w-full h-12 xs:h-13 sm:h-14 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold text-base xs:text-lg rounded-lg xs:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mt-2 xs:mt-3 flex items-center justify-center gap-2" 
                      disabled={isLoading}
                      data-testid="button-signup-submit"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 xs:h-6 xs:w-6 animate-spin" />
                          <span>Criando conta...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 xs:h-6 xs:w-6" />
                          <span>CRIAR CONTA</span>
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Footer Info */}
          <div className="text-center text-xs xs:text-sm text-gray-500 dark:text-gray-400">
            <p>Sua plataforma confiável de gestão de RH</p>
          </div>
        </div>
      </div>

      {/* Lado Direito - Gradiente Galáxico (visível apenas em lg+) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-600 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900">
        {/* Elementos de Fundo Galáticos */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Círculos decorativos */}
          <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -top-48 -right-48 animate-pulse" />
          <div className="absolute w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl -bottom-36 -left-36 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute w-64 h-64 bg-cyan-300/20 rounded-full blur-3xl top-1/2 left-1/4 animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Stars */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
          <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 bg-emerald-200 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-cyan-200 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Conteúdo Lado Direito */}
        <div className="relative z-10 text-center text-white px-8 space-y-6">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold">Bem-vindo ao Humansys</h2>
            <p className="text-lg text-emerald-100">Sua solução completa em gestão de recursos humanos</p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="space-y-2">
              <Sparkles className="h-8 w-8 mx-auto text-emerald-200" />
              <p className="text-sm font-semibold">IA Integrada</p>
            </div>
            <div className="space-y-2">
              <Star className="h-8 w-8 mx-auto text-yellow-200" />
              <p className="text-sm font-semibold">Performance</p>
            </div>
            <div className="space-y-2">
              <Shield className="h-8 w-8 mx-auto text-blue-200" />
              <p className="text-sm font-semibold">Segurança</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      {showErrorModal && (
        <AuthErrorModal
          isOpen={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          error={lastError}
          onRetry={handleRetryLogin}
        />
      )}
    </div>
  );
};
