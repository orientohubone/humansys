
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, Mail, Lock, User, Eye, EyeOff, Sparkles, Crown, Zap, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Login = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao Humansys",
      });
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = "Verifique suas credenciais e tente novamente.";
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Email ou senha incorretos. Verifique seus dados e tente novamente.";
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Email não confirmado. Verifique sua caixa de entrada e confirme seu email.";
      } else if (error.message?.includes('Too many requests')) {
        errorMessage = "Muitas tentativas de login. Aguarde alguns minutos e tente novamente.";
      } else if (error.message?.includes('Failed to fetch')) {
        errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
      }
      
      toast({
        title: "Erro no login",
        description: errorMessage,
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
      const { error } = await signUp(signupData.email, signupData.password, signupData.name);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Seu teste grátis de 30 dias foi ativado. Bem-vindo ao Humansys!",
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

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with immersive green gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900">
        <div className="absolute inset-0 bg-gradient-to-tr from-green-500/30 via-emerald-500/20 to-teal-500/25 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-lime-600/10 via-green-600/15 to-emerald-800/20"></div>
        
        {/* Floating elements with green theme */}
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full opacity-25 blur-3xl animate-bounce" style={{ animationDuration: '7s' }}></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-green-400 to-teal-400 rounded-full opacity-20 blur-3xl animate-bounce" style={{ animationDelay: '2s', animationDuration: '9s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-gradient-to-r from-lime-400 to-emerald-400 rounded-full opacity-15 blur-3xl animate-pulse" style={{ animationDuration: '5s' }}></div>
        <div className="absolute top-10 right-1/3 w-64 h-64 bg-gradient-to-r from-teal-400 to-green-500 rounded-full opacity-20 blur-3xl animate-bounce" style={{ animationDelay: '3s', animationDuration: '8s' }}></div>
        <div className="absolute bottom-1/3 left-10 w-56 h-56 bg-gradient-to-r from-emerald-500 to-lime-400 rounded-full opacity-18 blur-3xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '6s' }}></div>
        
        {/* Sparkle effects with green theme */}
        <div className="absolute top-1/4 left-1/4">
          <Sparkles className="h-6 w-6 text-lime-300 animate-pulse" />
        </div>
        <div className="absolute top-3/4 right-1/4">
          <Star className="h-4 w-4 text-emerald-300 animate-ping" />
        </div>
        <div className="absolute top-1/3 right-1/3">
          <Zap className="h-5 w-5 text-green-300 animate-bounce" />
        </div>
        <div className="absolute bottom-1/4 left-1/3">
          <Sparkles className="h-5 w-5 text-teal-300 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute top-1/5 right-1/5">
          <Star className="h-3 w-3 text-lime-400 animate-ping" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      <Header showAuth={false} />
      
      <div className="relative z-10 container flex items-center justify-center min-h-[calc(100vh-4rem)] py-4 sm:py-8 px-4 sm:px-6">
        <div className="w-full max-w-md">
          {/* Hero section */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mb-4 sm:mb-6 shadow-2xl shadow-green-500/20">
              <Crown className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
              Humansys
            </h1>
            <p className="text-green-200 text-base sm:text-lg">
              O futuro da gestão de RH chegou
            </p>
          </div>

          <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
            <CardHeader className="text-center p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl text-white">Acesse sua conta</CardTitle>
              <CardDescription className="text-green-200 text-sm sm:text-base">
                Entre ou crie sua conta para começar sua jornada
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-4 sm:p-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/10 border-white/20 h-9 sm:h-10">
                  <TabsTrigger 
                    value="login" 
                    className="text-white text-sm sm:text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-500 data-[state=active]:text-white"
                  >
                    Entrar
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="text-white text-sm sm:text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-500 data-[state=active]:text-white"
                  >
                    Cadastrar
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="login-email" className="text-white text-sm sm:text-base">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 sm:top-3 h-4 w-4 text-green-300" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={loginData.email}
                          onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-green-200 backdrop-blur-sm focus:bg-white/20 focus:border-green-400 h-9 sm:h-10 text-sm sm:text-base"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="login-password" className="text-white text-sm sm:text-base">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 sm:top-3 h-4 w-4 text-green-300" />
                        <Input
                          id="login-password"
                          type={showLoginPassword ? "text" : "password"}
                          placeholder="Sua senha"
                          value={loginData.password}
                          onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                          className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-green-200 backdrop-blur-sm focus:bg-white/20 focus:border-green-400 h-9 sm:h-10 text-sm sm:text-base"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-0.5 sm:top-1 h-8 w-8 p-0 text-green-300 hover:text-white hover:bg-white/10"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                        >
                          {showLoginPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold py-2.5 sm:py-3 shadow-lg hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      Entrar na Plataforma
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-white">Nome completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-green-300" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Seu nome completo"
                          value={signupData.name}
                          onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-green-200 backdrop-blur-sm focus:bg-white/20 focus:border-green-400"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-white">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-green-300" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={signupData.email}
                          onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-green-200 backdrop-blur-sm focus:bg-white/20 focus:border-green-400"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-white">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-green-300" />
                        <Input
                          id="signup-password"
                          type={showSignupPassword ? "text" : "password"}
                          placeholder="Crie uma senha segura"
                          value={signupData.password}
                          onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                          className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-green-200 backdrop-blur-sm focus:bg-white/20 focus:border-green-400"
                          required
                          minLength={6}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-8 w-8 p-0 text-green-300 hover:text-white hover:bg-white/10"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                        >
                          {showSignupPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm p-4 rounded-lg border border-green-400/30">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                          <Crown className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-semibold text-green-200">🎉 Teste Premium Grátis</span>
                      </div>
                      <div className="text-green-100 text-sm">
                        30 dias de acesso completo à plataforma mais avançada de RH do mercado!
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Crown className="mr-2 h-4 w-4" />
                      )}
                      Começar Jornada Premium
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 text-center">
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-sm text-green-200 hover:text-white transition-colors"
                >
                  Esqueceu sua senha?
                </Button>
              </div>

              {/* Features highlight */}
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs text-emerald-200">IA Avançada</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-lime-400 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs text-green-200">Gamificação</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs text-teal-200">Analytics</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
