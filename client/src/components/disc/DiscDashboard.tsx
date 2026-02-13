
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DiscProfile, DiscGamification } from '@/types/disc';
import { discService } from '@/services/discService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Plus, 
  Trophy, 
  Target, 
  Users, 
  Clock, 
  Star,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';

interface DiscDashboardProps {
  onStartAssessment: () => void;
  onViewProfile: (profile: DiscProfile) => void;
}

export const DiscDashboard: React.FC<DiscDashboardProps> = React.memo(({
  onStartAssessment,
  onViewProfile
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<DiscProfile[]>([]);
  const [gamification, setGamification] = useState<DiscGamification | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfiles = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const userProfiles = await discService.getUserProfiles(user.id);
      setProfiles(userProfiles);

      if (userProfiles.length > 0) {
        const latestProfile = userProfiles[0];
        const gamificationData = discService.generateGamificationData(latestProfile);
        setGamification(gamificationData);
      }
    } catch (error) {
      console.error('Erro ao carregar perfis:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os perfis",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  useEffect(() => {
    loadUserProfiles();
  }, [loadUserProfiles]);

  const getStyleColor = useCallback((style: string) => {
    const colors = {
      D: 'bg-red-500 text-white',
      I: 'bg-yellow-500 text-white',
      S: 'bg-green-500 text-white',
      C: 'bg-blue-500 text-white'
    };
    return colors[style as keyof typeof colors] || 'bg-gray-500 text-white';
  }, []);

  const getStyleName = useCallback((style: string) => {
    const names = {
      D: 'Dominante',
      I: 'Influente',
      S: 'Estável',
      C: 'Consciencioso'
    };
    return names[style as keyof typeof names] || style;
  }, []);

  const handleProfileClick = useCallback((profile: DiscProfile) => {
    onViewProfile(profile);
  }, [onViewProfile]);

  const statsCards = useMemo(() => {
    if (profiles.length === 0) return null;

    return (
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Análises</p>
                <p className="text-2xl font-bold">{profiles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Nível</p>
                <p className="text-2xl font-bold">{gamification?.level || 1}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">XP</p>
                <p className="text-2xl font-bold">{gamification?.experience_points || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Badges</p>
                <p className="text-2xl font-bold">{gamification?.badges.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }, [profiles.length, gamification]);

  const profilesList = useMemo(() => {
    if (profiles.length === 0) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Suas Análises DISC
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profiles.map((profile) => (
              <div 
                key={profile.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleProfileClick(profile)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getStyleColor(profile.primary_style)}`}>
                    {profile.primary_style}
                  </div>
                  <div>
                    <h4 className="font-medium">
                      Perfil {getStyleName(profile.primary_style)}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(profile.completed_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {profile.primary_style}/{profile.secondary_style}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Ver Relatório
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }, [profiles, getStyleColor, getStyleName, handleProfileClick]);

  const introductionCard = useMemo(() => {
    if (profiles.length > 0) return null;

    return (
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Bem-vindo à Análise DISC!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              A análise DISC é uma ferramenta poderosa que revela seu estilo comportamental 
              e como você se relaciona com outros em diferentes situações.
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center p-4 bg-card border rounded-lg">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-red-600 dark:text-red-400 font-bold">D</span>
                </div>
                <h4 className="font-medium text-sm">Dominante</h4>
                <p className="text-xs text-muted-foreground">Direto, decidido</p>
              </div>
              <div className="text-center p-4 bg-card border rounded-lg">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-yellow-600 dark:text-yellow-400 font-bold">I</span>
                </div>
                <h4 className="font-medium text-sm">Influente</h4>
                <p className="text-xs text-muted-foreground">Sociável, otimista</p>
              </div>
              <div className="text-center p-4 bg-card border rounded-lg">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 dark:text-green-400 font-bold">S</span>
                </div>
                <h4 className="font-medium text-sm">Estável</h4>
                <p className="text-xs text-muted-foreground">Paciente, confiável</p>
              </div>
              <div className="text-center p-4 bg-card border rounded-lg">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">C</span>
                </div>
                <h4 className="font-medium text-sm">Consciencioso</h4>
                <p className="text-xs text-muted-foreground">Preciso, analítico</p>
              </div>
            </div>
            <div className="flex justify-center pt-4">
              <Button onClick={onStartAssessment} size="lg">
                <Brain className="h-5 w-5 mr-2" />
                Fazer Primeira Análise
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }, [profiles.length, onStartAssessment]);

  const loadingState = useMemo(() => {
    if (!loading) return null;

    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }, [loading]);

  const gamificationSection = useMemo(() => {
    if (!gamification) return null;

    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Badges Conquistados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {gamification.badges.map((badge) => (
                <div key={badge.id} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                  <div className={`w-10 h-10 rounded-full bg-${badge.color}-100 flex items-center justify-center`}>
                    <Award className={`h-5 w-5 text-${badge.color}-600`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{badge.name}</h4>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gamification.achievements.map((achievement) => (
                <div key={achievement.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{achievement.title}</span>
                    <Badge variant={achievement.unlocked ? "default" : "secondary"}>
                      {achievement.points} XP
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  <Progress 
                    value={(achievement.progress / achievement.max_progress) * 100} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {achievement.progress}/{achievement.max_progress}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }, [gamification]);

  if (loading) {
    return loadingState;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            Análise DISC
          </h1>
          <p className="text-muted-foreground">
            Descubra e desenvolva seu perfil comportamental
          </p>
        </div>
        <Button onClick={onStartAssessment} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Nova Análise
        </Button>
      </div>

      {/* Introdução para novos usuários */}
      {introductionCard}

      {/* Stats Cards */}
      {statsCards}

      {/* Perfis Realizados */}
      {profilesList}

      {/* Gamificação */}
      {gamificationSection}

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700">
        <CardContent className="p-6">
          <div className="text-center">
            <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Continue Desenvolvendo</h3>
            <p className="text-muted-foreground mb-4">
              Faça análises regulares para acompanhar sua evolução comportamental
            </p>
            <Button onClick={onStartAssessment}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Análise DISC
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

DiscDashboard.displayName = 'DiscDashboard';
