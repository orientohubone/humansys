import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Meteors, Stars } from '@/components/ui/meteors';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Brain,
  Zap,
  Users,
  Trophy,
  MessageCircle,
  Star,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Award,
  Sparkles,
  Bell,
  Send,
  ThumbsUp,
  Eye,
  Calendar,
  BarChart3,
  Rocket,
  Heart,
  Coffee,
  BookOpen,
  Shield,
  Settings,
  Crown,
  DollarSign,
  Car
} from 'lucide-react';

interface Release {
  id: string;
  version: string;
  title: string;
  description: string;
  date: string;
  type: 'feature' | 'improvement' | 'bugfix';
  badge?: string;
}

interface Comment {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  maxProgress: number;
  xp: number;
  unlocked: boolean;
}

interface ExpertChallenge {
  id: string;
  title: string;
  description: string;
  action: string;
  icon: React.ReactNode;
  xp: number;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export const Home = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());

  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: 'Fernando Ramalho',
      avatar: '/uploads/avatars/fernando_avatar.png',
      content: 'Estou impressionado com a nova versão do BrainSys IAO! A integração com IA está revolucionando nossos processos de RH.',
      timestamp: '2 horas atrás',
      likes: 12,
      isLiked: true
    },
    {
      id: '2',
      user: 'Sistema',
      avatar: '/api/placeholder/40/40',
      content: '🎉 Bem-vindos à nova experiência Humansys! Agradecemos seu feedback constante para melhorarmos nossa plataforma.',
      timestamp: '1 dia atrás',
      likes: 24,
      isLiked: false
    }
  ]);

  const [releases] = useState<Release[]>([
    {
      id: '1',
      version: '5.0.8',
      title: 'Algorithm Seal Premium',
      description: 'Selo premium 3D com animações e gradientes para validar a tecnologia OntoTech.',
      date: '11 Jul 2025',
      type: 'feature',
      badge: 'Novo'
    },
    {
      id: '2',
      version: '5.0.7',
      title: 'BrainSys IAO Enhanced',
      description: 'Interface completamente redesenhada com estilo MindSight e esquema de cores verde.',
      date: '10 Jul 2025',
      type: 'improvement',
      badge: 'Melhorado'
    },
    {
      id: '3',
      version: '5.0.5',
      title: 'PWA & Mobile Responsivo',
      description: 'Aplicação instalável com funcionalidade offline e navegação otimizada para mobile.',
      date: '8 Jul 2025',
      type: 'feature'
    }
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Primeiro Login',
      description: 'Bem-vindo ao Humansys!',
      icon: <Rocket className="h-6 w-6" />,
      progress: 1,
      maxProgress: 1,
      xp: 100,
      unlocked: true
    },
    {
      id: '2',
      title: 'Explorador',
      description: 'Visitou 5 páginas diferentes',
      icon: <BookOpen className="h-6 w-6" />,
      progress: 3,
      maxProgress: 5,
      xp: 250,
      unlocked: false
    },
    {
      id: '3',
      title: 'Colaborativo',
      description: 'Fez seu primeiro comentário',
      icon: <MessageCircle className="h-6 w-6" />,
      progress: 0,
      maxProgress: 1,
      xp: 150,
      unlocked: false
    }
  ]);

  const [expertChallenges] = useState<ExpertChallenge[]>([
    {
      id: '1',
      title: 'Explorar BrainSys IAO',
      description: 'Acesse a inteligência artificial do sistema',
      action: 'Visite /app/brainsys-iao',
      icon: <Brain className="h-4 w-4" />,
      xp: 50,
      completed: false,
      difficulty: 'easy',
      category: 'IA'
    },
    {
      id: '2',
      title: 'Adicionar Primeiro Colaborador',
      description: 'Cadastre um membro em sua equipe',
      action: 'Vá para Colaboradores e adicione alguém',
      icon: <Users className="h-4 w-4" />,
      xp: 75,
      completed: false,
      difficulty: 'easy',
      category: 'Gestão'
    },
    {
      id: '3',
      title: 'Configurar Perfil Completo',
      description: 'Complete todas as informações do seu perfil',
      action: 'Acesse Configurações > Perfil',
      icon: <Settings className="h-4 w-4" />,
      xp: 100,
      completed: false,
      difficulty: 'medium',
      category: 'Configuração'
    },
    {
      id: '4',
      title: 'Criar Primeiro Treinamento',
      description: 'Configure um programa de capacitação',
      action: 'Use o módulo de Treinamentos',
      icon: <BookOpen className="h-4 w-4" />,
      xp: 150,
      completed: false,
      difficulty: 'medium',
      category: 'Desenvolvimento'
    },
    {
      id: '5',
      title: 'Análise DISC Avançada',
      description: 'Faça uma análise comportamental completa',
      action: 'Explore o módulo DISC com IA',
      icon: <Brain className="h-4 w-4" />,
      xp: 200,
      completed: false,
      difficulty: 'hard',
      category: 'IA'
    },
    {
      id: '6',
      title: 'Dashboard Founder Insights',
      description: 'Desbloqueie métricas estratégicas avançadas',
      action: 'Acesse o Founder Dashboard',
      icon: <Crown className="h-4 w-4" />,
      xp: 300,
      completed: false,
      difficulty: 'hard',
      category: 'Estratégia'
    }
  ]);

  const completedChallenges = expertChallenges.filter(c => c.completed).length;
  const totalChallenges = expertChallenges.length;
  const expertProgress = Math.floor((completedChallenges / totalChallenges) * 100);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: user?.full_name || user?.email || 'Usuário',
      avatar: user?.avatar_url || '/api/placeholder/40/40',
      content: newComment,
      timestamp: 'agora',
      likes: 0,
      isLiked: false
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
    toast({
      title: "Comentário adicionado!",
      description: "Seu comentário foi publicado no mural."
    });
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked 
          }
        : comment
    ));
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getReleaseTypeColor = (type: string) => {
    switch (type) {
      case 'feature': return 'bg-green-100 text-green-700 border-green-200';
      case 'improvement': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'bugfix': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-700 p-8 text-white"
        >
          {/* Fundo espacial com estrelas */}
          <div className="absolute inset-0">
            <Stars number={80} className="opacity-70" />
            <Meteors number={15} className="opacity-60" />
          </div>
          
          {/* Overlay para dar profundidade */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 via-green-800/30 to-emerald-700/50" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between">
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl lg:text-6xl font-bold drop-shadow-lg"
              >
                {getGreeting()}, {user?.full_name?.split(' ')[0] || 'Usuário'}!
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl opacity-90 drop-shadow-md"
              >
                Bem-vindo à sua central de comando inteligente
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center space-x-4"
              >
                <Badge variant="secondary" className="bg-emerald-800/30 text-emerald-100 border-emerald-400/30 backdrop-blur-sm">
                  <Brain className="h-4 w-4 mr-1" />
                  IA Ativa
                </Badge>
                <Badge variant="secondary" className="bg-emerald-800/30 text-emerald-100 border-emerald-400/30 backdrop-blur-sm">
                  <Zap className="h-4 w-4 mr-1" />
                  Tempo Real
                </Badge>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="relative"
            >
              <div className="w-32 h-32 bg-emerald-800/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-emerald-400/20 shadow-lg">
                <Brain className="h-16 w-16 text-emerald-200 animate-pulse drop-shadow-lg" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-400 rounded-full animate-ping" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { icon: Users, label: 'Colaboradores', value: '12', change: '+2', color: 'text-blue-600' },
            { icon: Trophy, label: 'Conquistas', value: '8', change: '+1', color: 'text-yellow-600' },
            { icon: TrendingUp, label: 'Engajamento', value: '94%', change: '+5%', color: 'text-green-600' },
            { icon: Activity, label: 'Atividades', value: '24', change: '+12', color: 'text-purple-600' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50 dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 ${stat.color} dark:text-current`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Releases Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-900/20 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-gray-900 dark:text-white">
                <Rocket className="h-6 w-6 mr-3 text-purple-600 dark:text-purple-400" />
                Últimas Atualizações
                <Badge className="ml-3 bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100">
                  Novo
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {releases.map((release) => (
                  <motion.div
                    key={release.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -5 }}
                    className="p-4 rounded-lg border bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm hover:shadow-lg transition-all border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge className={getReleaseTypeColor(release.type)}>
                          v{release.version}
                        </Badge>
                        {release.badge && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100 text-xs">
                            {release.badge}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{release.date}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">{release.title}</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">{release.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-yellow-50/30 dark:from-gray-800 dark:to-yellow-900/20 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-gray-900 dark:text-white">
                <Trophy className="h-6 w-6 mr-3 text-yellow-600 dark:text-yellow-400" />
                Conquistas & Gamificação
                <Badge className="ml-3 bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100">
                  {achievements.filter(a => a.unlocked).length}/{achievements.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg border transition-all ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/40 dark:to-orange-900/40 border-yellow-200 dark:border-yellow-600 shadow-md' 
                        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-full transition-all ${
                        achievement.unlocked 
                          ? 'bg-yellow-100 dark:bg-yellow-800/50 text-yellow-600 dark:text-yellow-300 shadow-sm' 
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500'
                      }`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{achievement.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{achievement.description}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                        <span>Progresso</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all ${
                            achievement.unlocked ? 'bg-yellow-500 dark:bg-yellow-400' : 'bg-gray-400 dark:bg-gray-500'
                          }`}
                          style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 dark:text-gray-400">+{achievement.xp} XP</span>
                        {achievement.unlocked && (
                          <Badge className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-100 text-xs px-2 py-0.5">
                            <Award className="h-3 w-3 mr-1" />
                            Conquistado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Mural */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/20 dark:bg-gray-800">
              <CardHeader className="pb-2 xs:pb-3 sm:pb-4">
                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-3">
                  <CardTitle className="flex items-center text-lg xs:text-xl sm:text-2xl text-gray-900 dark:text-white truncate">
                    <MessageCircle className="h-4 xs:h-5 sm:h-6 w-4 xs:w-5 sm:w-6 mr-2 xs:mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="truncate">Mural da Comunidade</span>
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-xs xs:text-sm h-8 xs:h-9 whitespace-nowrap flex-shrink-0">
                        <MessageCircle className="h-3 xs:h-4 w-3 xs:w-4 mr-1 xs:mr-2" />
                        <span className="hidden xs:inline">Ver Completo</span>
                        <span className="xs:hidden">Ver</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm xs:max-w-lg sm:max-w-2xl md:max-w-3xl max-h-[85vh] xs:max-h-[90vh] overflow-y-auto p-3 xs:p-4 sm:p-6">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-lg xs:text-xl sm:text-2xl truncate">
                          <MessageCircle className="h-4 xs:h-5 sm:h-6 w-4 xs:w-5 sm:w-6 text-blue-600 flex-shrink-0" />
                          <span className="truncate">Mural da Comunidade</span>
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-3 xs:space-y-4 sm:space-y-6 mt-3 xs:mt-4 sm:mt-6">
                        {/* Add Comment */}
                        <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                          <div className="flex items-start gap-2 xs:gap-3 sm:gap-4">
                            <img 
                              src={user?.avatar_url || '/api/placeholder/40/40'} 
                              alt="Seu avatar" 
                              className="w-8 xs:w-9 sm:w-10 h-8 xs:h-9 sm:h-10 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="flex-1 space-y-2 xs:space-y-3 sm:space-y-3">
                              <Textarea 
                                placeholder="Compartilhe suas ideias, feedback ou conquistas..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="resize-none text-xs xs:text-sm"
                              />
                              <div className="flex justify-end">
                                <Button onClick={handleAddComment} disabled={!newComment.trim()} className="text-xs xs:text-sm h-8 xs:h-9">
                                  <Send className="h-3 xs:h-4 w-3 xs:w-4 mr-1 xs:mr-2" />
                                  Publicar
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Comments */}
                        <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                          {comments.map((comment) => (
                            <motion.div
                              key={comment.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-start gap-2 xs:gap-3 sm:gap-4 p-2 xs:p-3 sm:p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                            >
                              <img 
                                src={comment.avatar} 
                                alt={comment.user} 
                                className="w-8 xs:w-9 sm:w-10 h-8 xs:h-9 sm:h-10 rounded-full object-cover flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1 xs:gap-2 mb-0.5 xs:mb-1 sm:mb-1 flex-wrap">
                                  <span className="font-medium text-xs xs:text-sm text-gray-900 dark:text-white truncate">{comment.user}</span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">{comment.timestamp}</span>
                                </div>
                                <p className="text-xs xs:text-sm text-gray-700 dark:text-gray-300 mb-2 xs:mb-3 line-clamp-3">{comment.content}</p>
                                <div className="flex items-center gap-2 xs:gap-4 flex-wrap">
                                  <button
                                    onClick={() => handleLikeComment(comment.id)}
                                    className={`flex items-center gap-0.5 xs:gap-1 text-xs xs:text-sm transition-colors ${
                                      comment.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                                    }`}
                                  >
                                    <ThumbsUp className="h-3 xs:h-4 w-3 xs:w-4" />
                                    <span className="hidden xs:inline">{comment.likes}</span>
                                  </button>
                                  <span className="flex items-center gap-0.5 xs:gap-1 text-xs xs:text-sm text-gray-500">
                                    <Eye className="h-3 xs:h-4 w-3 xs:w-4" />
                                    <span className="hidden xs:inline">{Math.floor(Math.random() * 50) + 10}</span>
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {comments.slice(0, 2).map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm"
                  >
                    <img 
                      src={comment.avatar} 
                      alt={comment.user} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm text-gray-900 dark:text-white">{comment.user}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{comment.content}</p>
                    </div>
                  </motion.div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Dialog>
                    <DialogTrigger>
                      Ver todos os comentários
                    </DialogTrigger>
                  </Dialog>
                </Button>
              </CardContent>
            </Card>

            {/* Expert Mode Challenge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-emerald-50/30 dark:from-gray-800 dark:to-emerald-900/20 dark:bg-gray-800 overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-xl text-gray-900 dark:text-white">
                      <Shield className="h-6 w-6 mr-3 text-emerald-600 dark:text-emerald-400" />
                      Modo Expert Humansys
                      <Badge className="ml-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white">
                        {expertProgress}%
                      </Badge>
                    </CardTitle>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Progresso Geral</p>
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{completedChallenges}/{totalChallenges}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500"
                      style={{ width: `${expertProgress}%` }}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    {expertChallenges.map((challenge, index) => {
                      const getDifficultyColor = (difficulty: string) => {
                        switch (difficulty) {
                          case 'easy': return 'bg-green-100 text-green-700 border-green-200';
                          case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
                          case 'hard': return 'bg-red-100 text-red-700 border-red-200';
                          default: return 'bg-gray-100 text-gray-700 border-gray-200';
                        }
                      };

                      return (
                        <motion.div
                          key={challenge.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          className={`p-3 rounded-lg border transition-all hover:shadow-md ${
                            challenge.completed 
                              ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700' 
                              : 'bg-white dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-600/50 border-gray-200 dark:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-full ${
                                challenge.completed 
                                  ? 'bg-green-100 dark:bg-green-800/50 text-green-600 dark:text-green-300' 
                                  : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                              }`}>
                                {challenge.completed ? <Award className="h-4 w-4" /> : challenge.icon}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-sm text-gray-900 dark:text-white">{challenge.title}</h4>
                                <p className="text-xs text-gray-600 dark:text-gray-300">{challenge.description}</p>
                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{challenge.action}</p>
                              </div>
                            </div>
                            <div className="text-right space-y-1">
                              <Badge className={`text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                                {challenge.difficulty === 'easy' && 'Fácil'}
                                {challenge.difficulty === 'medium' && 'Médio'}
                                {challenge.difficulty === 'hard' && 'Difícil'}
                              </Badge>
                              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">+{challenge.xp} XP</p>
                              {challenge.completed && (
                                <Badge className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-100 text-xs">
                                  Concluído
                                </Badge>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  {expertProgress === 100 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 p-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg text-white text-center"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Crown className="h-6 w-6" />
                        <span className="font-bold">Parabéns! Modo Expert Desbloqueado!</span>
                        <Crown className="h-6 w-6" />
                      </div>
                      <p className="text-sm mt-2 opacity-90">
                        Você dominou todas as funcionalidades do Humansys
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Right Column - Quick Actions & Info */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-lg text-gray-900 dark:text-white">
                  <Target className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { icon: Users, label: 'Gerenciar Equipe', href: '/collaborators', color: 'bg-blue-500' },
                  { icon: BookOpen, label: 'Treinamentos', href: '/training', color: 'bg-green-500' },
                  { icon: BarChart3, label: 'Relatórios', href: '/analytics', color: 'bg-purple-500' },
                  { icon: Settings, label: 'Configurações', href: '/settings', color: 'bg-gray-500' }
                ].map((action, index) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <Button variant="ghost" className="w-full justify-start p-3 h-auto text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                      <div className={`p-2 rounded-full ${action.color} text-white mr-3`}>
                        <action.icon className="h-4 w-4" />
                      </div>
                      {action.label}
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-lg text-gray-900 dark:text-white">
                  <Clock className="h-5 w-5 mr-2 text-orange-600 dark:text-orange-400" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: Users, text: 'Novo colaborador adicionado', time: '2h atrás', color: 'text-blue-600 dark:text-blue-400' },
                  { icon: Trophy, text: 'Conquista desbloqueada', time: '4h atrás', color: 'text-yellow-600 dark:text-yellow-400' },
                  { icon: Bell, text: 'Relatório gerado', time: '6h atrás', color: 'text-green-600 dark:text-green-400' }
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <div className={`p-1.5 rounded-full bg-gray-100 dark:bg-gray-600 ${activity.color}`}>
                      <activity.icon className="h-3 w-3" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.text}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Weather Widget - New Design System */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card 
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Coffee className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                      Clima
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                      24°C
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      São Paulo
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Dollar Exchange Card - New Design System */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <Card 
                className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                      USD/BRL
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                      R$ 5,42
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        +0,12%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Traffic Card - New Design System */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <Card 
                className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800 shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Car className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    <h3 className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                      Trânsito
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                      Trânsito Moderado
                    </div>
                    <div className="text-sm text-yellow-600 dark:text-yellow-400">
                      Tempo estimado: 25 min
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};