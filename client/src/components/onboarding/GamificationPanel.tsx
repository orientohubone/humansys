
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Zap, Award, TrendingUp } from 'lucide-react';
import { OnboardingProgress, Badge as GameBadge, Achievement } from '@/types/gamification';
import { cn } from '@/lib/utils';

interface GamificationPanelProps {
  progress: OnboardingProgress;
  achievements: Achievement[];
  availableBadges: GameBadge[];
  className?: string;
}

export const GamificationPanel: React.FC<GamificationPanelProps> = ({
  progress,
  achievements,
  availableBadges,
  className
}) => {
  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-blue-500';
    return 'bg-gray-500';
  };

  const getProgressMessage = (percentage: number) => {
    if (percentage === 100) return 'Parabéns! Onboarding concluído! 🎉';
    if (percentage >= 75) return 'Quase lá! Você está indo muito bem! 💪';
    if (percentage >= 50) return 'Ótimo progresso! Continue assim! ⭐';
    if (percentage >= 25) return 'Bom começo! Vamos continuar! 🚀';
    return 'Bem-vindo! Vamos começar sua jornada! 👋';
  };

  const earnedBadgeIds = achievements.map(a => a.badge_id);
  const nextBadge = availableBadges.find(badge => !earnedBadgeIds.includes(badge.id));

  return (
    <div className={cn("space-y-6", className)}>
      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Progresso do Onboarding</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {progress.progress_percentage}%
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {getProgressMessage(progress.progress_percentage)}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Etapas concluídas</span>
              <span>{progress.completed_steps}/{progress.total_steps}</span>
            </div>
            <Progress value={progress.progress_percentage} className="h-3" />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <Trophy className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
              <div className="text-lg font-semibold">{progress.badges_earned.length}</div>
              <div className="text-xs text-muted-foreground">Badges</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <Star className="h-6 w-6 text-purple-600 mx-auto mb-1" />
              <div className="text-lg font-semibold">{progress.gamification_score}</div>
              <div className="text-xs text-muted-foreground">Pontos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges Earned */}
      {progress.badges_earned.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <span>Badges Conquistados</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {progress.badges_earned.map(badge => (
                <div key={badge.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl">{badge.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{badge.name}</h4>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Badge */}
      {nextBadge && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-orange-600" />
              <span>Próximo Badge</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
              <div className="text-3xl opacity-50">{nextBadge.icon}</div>
              <div className="flex-1">
                <h4 className="font-medium">{nextBadge.name}</h4>
                <p className="text-sm text-muted-foreground">{nextBadge.description}</p>
                <Badge variant="outline" className="mt-2">
                  {nextBadge.category === 'milestone' && 'Marco'}
                  {nextBadge.category === 'speed' && 'Velocidade'}
                  {nextBadge.category === 'quality' && 'Qualidade'}
                  {nextBadge.category === 'engagement' && 'Engajamento'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Motivational Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Estatísticas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Sequência atual</span>
              <Badge variant="secondary">{progress.current_streak} etapas</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Previsão de conclusão</span>
              <span className="text-sm text-muted-foreground">
                {new Date(progress.estimated_completion).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
