import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  Trophy,
  Brain,
  Star,
  Heart,
  Zap,
  Crown,
  Medal,
  Gift,
  Lightbulb,
  MessageSquare,
  ThumbsUp,
  Plus,
  Settings,
  Play,
  Volume2,
  Bookmark,
  Share2,
  Target,
  Award,
  Users,
  TrendingUp,
  Calendar,
  ArrowLeft
} from 'lucide-react';

interface MotivationPill {
  id: string;
  type: 'text' | 'audio' | 'video';
  content: string;
  mediaUrl?: string;
  category: 'motivation' | 'productivity' | 'wellness' | 'leadership';
  author: string;
  targetAudience?: string[];
  engagementScore: number;
  likes: number;
  comments: number;
  createdAt: Date;
}

interface BadgeType {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'engagement' | 'collaboration' | 'achievement' | 'leadership';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: Date;
}

interface RecognitionEntry {
  id: string;
  fromUserName: string;
  toUserName: string;
  type: 'collaboration' | 'innovation' | 'achievement' | 'leadership';
  message: string;
  points: number;
  reactions: number;
  createdAt: Date;
}

interface PowerLevel {
  userId: string;
  userName: string;
  currentLevel: number;
  totalPoints: number;
  weeklyPoints: number;
  badges: BadgeType[];
  rank: number;
  weeklyRank: number;
  department: string;
}

export const BrainSysMotivation: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [isCreatingPill, setIsCreatingPill] = useState(false);

  // Mock data para pílulas de motivação
  const mockPills: MotivationPill[] = [
    {
      id: '1',
      type: 'text',
      content: 'O sucesso é a soma de pequenos esforços repetidos dia após dia. Continue firme nos seus objetivos!',
      category: 'motivation',
      author: 'Coach IA',
      engagementScore: 92,
      likes: 45,
      comments: 12,
      createdAt: new Date('2024-01-15T08:00:00Z')
    },
    {
      id: '2',
      type: 'video',
      content: 'Técnicas de produtividade para developers: Como usar o método Pomodoro',
      mediaUrl: '/videos/pomodoro-tech.mp4',
      category: 'productivity',
      author: 'Tech Lead',
      targetAudience: ['TI'],
      engagementScore: 88,
      likes: 32,
      comments: 8,
      createdAt: new Date('2024-01-14T14:30:00Z')
    },
    {
      id: '3',
      type: 'audio',
      content: 'Meditação guiada de 5 minutos para reduzir estresse no trabalho',
      mediaUrl: '/audio/meditation-5min.mp3',
      category: 'wellness',
      author: 'Wellness Coach',
      engagementScore: 95,
      likes: 67,
      comments: 18,
      createdAt: new Date('2024-01-14T10:15:00Z')
    }
  ];

  // Mock data para badges
  const mockBadges: BadgeType[] = [
    {
      id: '1',
      name: 'Colaborador do Mês',
      description: 'Reconhecido pela excelente colaboração',
      icon: '🤝',
      category: 'collaboration',
      rarity: 'epic',
      earnedAt: new Date('2024-01-10T00:00:00Z')
    },
    {
      id: '2',
      name: 'Inovador',
      description: 'Propôs ideias criativas que foram implementadas',
      icon: '💡',
      category: 'achievement',
      rarity: 'rare',
      earnedAt: new Date('2024-01-05T00:00:00Z')
    },
    {
      id: '3',
      name: 'Mentor',
      description: 'Ajudou outros colegas em seu desenvolvimento',
      icon: '🎓',
      category: 'leadership',
      rarity: 'legendary',
      earnedAt: new Date('2024-01-01T00:00:00Z')
    }
  ];

  // Mock data para reconhecimentos
  const mockRecognitions: RecognitionEntry[] = [
    {
      id: '1',
      fromUserName: 'Ana Silva',
      toUserName: 'João Santos',
      type: 'collaboration',
      message: 'Excelente trabalho em equipe no projeto X! Sua dedicação fez toda a diferença.',
      points: 50,
      reactions: 15,
      createdAt: new Date('2024-01-15T16:30:00Z')
    },
    {
      id: '2',
      fromUserName: 'Carlos Lima',
      toUserName: 'Maria Costa',
      type: 'innovation',
      message: 'Idea genial para otimizar o processo de deploy. Parabéns pela criatividade!',
      points: 75,
      reactions: 22,
      createdAt: new Date('2024-01-15T14:20:00Z')
    }
  ];

  // Mock data para leaderboard
  const mockLeaderboard: PowerLevel[] = [
    {
      userId: '1',
      userName: 'João Santos',
      currentLevel: 12,
      totalPoints: 2450,
      weeklyPoints: 180,
      badges: mockBadges,
      rank: 1,
      weeklyRank: 1,
      department: 'TI'
    },
    {
      userId: '2',
      userName: 'Maria Costa',
      currentLevel: 10,
      totalPoints: 2200,
      weeklyPoints: 165,
      badges: mockBadges.slice(0, 2),
      rank: 2,
      weeklyRank: 2,
      department: 'Marketing'
    },
    {
      userId: '3',
      userName: 'Ana Silva',
      currentLevel: 11,
      totalPoints: 2380,
      weeklyPoints: 140,
      badges: mockBadges.slice(1),
      rank: 3,
      weeklyRank: 3,
      department: 'Vendas'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'motivation': return Zap;
      case 'productivity': return Target;
      case 'wellness': return Heart;
      case 'leadership': return Crown;
      default: return Lightbulb;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-purple-500';
      case 'epic': return 'bg-blue-500';
      case 'rare': return 'bg-green-500';
      case 'common': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'collaboration': return Users;
      case 'innovation': return Lightbulb;
      case 'achievement': return Trophy;
      case 'leadership': return Crown;
      default: return Star;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => window.history.back()}
              className="hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Voltar"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Trophy className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">BrainSys Motiva</h1>
              <p className="text-muted-foreground">
                Gamificação e reconhecimento para engajamento máximo
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setIsCreatingPill(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Pílula
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>

        {/* BrainSys IAO Insights */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-yellow-600" />
                <CardTitle>Insights BrainSys IAO - Motivação</CardTitle>
                <Badge className="bg-yellow-500">Engagement AI</Badge>
              </div>
              <div className="text-right">
                <div className="text-sm text-yellow-600">Confiança: 96.4%</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div>
                  <h4 className="font-medium">Engajamento em Alta</h4>
                  <p className="text-sm text-muted-foreground">+24% nas últimas 2 semanas</p>
                  <div className="text-xs text-green-600 mt-1">Tendência sustentável</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                <Award className="h-8 w-8 text-blue-500" />
                <div>
                  <h4 className="font-medium">Reconhecimentos Ativos</h4>
                  <p className="text-sm text-muted-foreground">18 reconhecimentos esta semana</p>
                  <div className="text-xs text-blue-600 mt-1">Meta: 15/semana ✓</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                <Target className="h-8 w-8 text-purple-500" />
                <div>
                  <h4 className="font-medium">Oportunidade Detectada</h4>
                  <p className="text-sm text-muted-foreground">Departamento RH precisa de estímulo</p>
                  <div className="text-xs text-purple-600 mt-1">Ação sugerida: Pílula wellness</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="pills" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pills">Pílulas Diárias</TabsTrigger>
            <TabsTrigger value="gamification">Gamificação</TabsTrigger>
            <TabsTrigger value="recognition">Reconhecimento</TabsTrigger>
            <TabsTrigger value="leaderboard">Ranking</TabsTrigger>
          </TabsList>

          <TabsContent value="pills" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="all">Todas as Categorias</option>
                    <option value="motivation">Motivação</option>
                    <option value="productivity">Produtividade</option>
                    <option value="wellness">Bem-estar</option>
                    <option value="leadership">Liderança</option>
                  </select>

                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Programar Envio
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pills Grid */}
            <div className="grid gap-6">
              {mockPills.map((pill) => {
                const CategoryIcon = getCategoryIcon(pill.category);
                return (
                  <Card key={pill.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CategoryIcon className="h-6 w-6 text-blue-600" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline" className="capitalize">
                              {pill.category === 'motivation' ? 'Motivação' : 
                               pill.category === 'productivity' ? 'Produtividade' :
                               pill.category === 'wellness' ? 'Bem-estar' : 'Liderança'}
                            </Badge>
                            <Badge variant="secondary" className="capitalize">{pill.type}</Badge>
                            {pill.targetAudience && (
                              <Badge className="bg-purple-500">
                                {pill.targetAudience.join(', ')}
                              </Badge>
                            )}
                          </div>

                          <p className="text-gray-800 mb-3">{pill.content}</p>

                          {pill.mediaUrl && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-3 flex items-center space-x-2">
                              {pill.type === 'video' && <Play className="h-4 w-4 text-blue-600" />}
                              {pill.type === 'audio' && <Volume2 className="h-4 w-4 text-green-600" />}
                              <span className="text-sm text-gray-600">
                                {pill.type === 'video' ? 'Clique para assistir' : 'Clique para ouvir'}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Por {pill.author}</span>
                              <span>{new Date(pill.createdAt).toLocaleDateString('pt-BR')}</span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                {pill.likes}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {pill.comments}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Bookmark className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="gamification" className="space-y-6">
            {/* Power Level Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span>Seu Nível de Poder BrainSys</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2">
                      12
                    </div>
                    <div className="text-sm text-muted-foreground">Nível Atual</div>
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Progresso para Nível 13</span>
                      <span className="text-sm text-muted-foreground">2450/2600 XP</span>
                    </div>
                    <Progress value={94} className="mb-2" />
                    <div className="text-xs text-muted-foreground">150 XP para o próximo nível</div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">180</div>
                    <div className="text-sm text-muted-foreground">XP esta semana</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Badges Collection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Medal className="h-5 w-5 text-purple-500" />
                  <span>Coleção de Selos</span>
                </CardTitle>
                <CardDescription>
                  Suas conquistas e reconhecimentos especiais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {mockBadges.map((badge) => (
                    <div key={badge.id} className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <h4 className="font-medium text-sm mb-1">{badge.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
                      <Badge className={`text-xs ${getRarityColor(badge.rarity)}`}>
                        {badge.rarity === 'legendary' ? 'Lendário' :
                         badge.rarity === 'epic' ? 'Épico' :
                         badge.rarity === 'rare' ? 'Raro' : 'Comum'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recognition" className="space-y-6">
            {/* Recognition Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span>Feed de Reconhecimentos</span>
                </CardTitle>
                <CardDescription>
                  Celebre as conquistas da equipe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecognitions.map((recognition) => {
                    const TypeIcon = getTypeIcon(recognition.type);
                    return (
                      <div key={recognition.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                        <Avatar>
                          <AvatarFallback>{recognition.fromUserName[0]}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium">{recognition.fromUserName}</span>
                            <span className="text-muted-foreground">reconheceu</span>
                            <span className="font-medium">{recognition.toUserName}</span>
                            <TypeIcon className="h-4 w-4 text-blue-500" />
                          </div>

                          <p className="text-gray-700 mb-2">{recognition.message}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{new Date(recognition.createdAt).toLocaleDateString('pt-BR')}</span>
                              <Badge className="bg-yellow-500">+{recognition.points} XP</Badge>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Heart className="h-4 w-4 mr-1" />
                                {recognition.reactions}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-3">Reconhecer um colega</h4>
                  <div className="space-y-3">
                    <Input placeholder="Nome do colega" />
                    <Textarea placeholder="Escreva uma mensagem de reconhecimento..." />
                    <div className="flex items-center space-x-2">
                      <Button>
                        <Heart className="h-4 w-4 mr-2" />
                        Enviar Reconhecimento
                      </Button>
                      <select className="px-3 py-2 border rounded-md">
                        <option value="collaboration">Colaboração</option>
                        <option value="innovation">Inovação</option>
                        <option value="achievement">Conquista</option>
                        <option value="leadership">Liderança</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <span>Ranking BrainSys</span>
                </CardTitle>
                <CardDescription>
                  Top performers da semana e geral
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLeaderboard.map((user, index) => (
                    <div key={user.userId} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                        }`}>
                          {user.rank}
                        </div>

                        <Avatar>
                          <AvatarFallback>{user.userName[0]}</AvatarFallback>
                        </Avatar>

                        <div>
                          <div className="font-medium">{user.userName}</div>
                          <div className="text-sm text-muted-foreground">{user.department}</div>
                        </div>
                      </div>

                      <div className="flex-1 grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="font-bold text-lg">Nv. {user.currentLevel}</div>
                          <div className="text-xs text-muted-foreground">Nível</div>
                        </div>
                        <div>
                          <div className="font-bold text-lg">{user.totalPoints.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">XP Total</div>
                        </div>
                        <div>
                          <div className="font-bold text-lg text-green-600">+{user.weeklyPoints}</div>
                          <div className="text-xs text-muted-foreground">Esta Semana</div>
                        </div>
                      </div>

                      <div className="flex space-x-1">
                        {user.badges.slice(0, 3).map((badge) => (
                          <div key={badge.id} className="text-lg" title={badge.name}>
                            {badge.icon}
                          </div>
                        ))}
                        {user.badges.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{user.badges.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Pill Dialog */}
        {isCreatingPill && (
          <Card className="fixed inset-4 z-50 bg-white shadow-2xl rounded-lg overflow-auto">
            <CardHeader>
              <CardTitle>Nova Pílula de Motivação</CardTitle>
              <CardDescription>Criar conteúdo inspiracional para a equipe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tipo de Conteúdo</label>
                <select className="w-full mt-1 px-3 py-2 border rounded-md">
                  <option value="text">Texto</option>
                  <option value="audio">Áudio</option>
                  <option value="video">Vídeo</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Categoria</label>
                <select className="w-full mt-1 px-3 py-2 border rounded-md">
                  <option value="motivation">Motivação</option>
                  <option value="productivity">Produtividade</option>
                  <option value="wellness">Bem-estar</option>
                  <option value="leadership">Liderança</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Conteúdo</label>
                <Textarea placeholder="Escreva sua mensagem inspiracional..." className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Público-alvo (opcional)</label>
                <Input placeholder="Ex: TI, Marketing, Vendas" className="mt-1" />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreatingPill(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsCreatingPill(false)}>
                  Criar Pílula
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

// Export default para compatibilidade
export default BrainSysMotivation;