
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GamificationStats, LeaderboardEntry } from '@/types/gamification';
import { ProgressBar } from './ProgressBar';
import { Trophy, Star, Zap, TrendingUp, Award } from 'lucide-react';

interface GamificationPanelProps {
  stats: GamificationStats;
  leaderboard: LeaderboardEntry[];
  onViewAllBadges?: () => void;
  onViewLeaderboard?: () => void;
}

export const GamificationPanel: React.FC<GamificationPanelProps> = ({
  stats,
  leaderboard,
  onViewAllBadges,
  onViewLeaderboard
}) => {
  const getLevelInfo = (level: number) => {
    const levelNames = [
      'Iniciante', 'Aprendiz', 'Competente', 'Proficiente', 
      'Especialista', 'Mestre', 'Guru', 'Lenda'
    ];
    return levelNames[Math.min(level - 1, levelNames.length - 1)] || 'Lenda';
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Seu Progresso</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalPoints}</div>
              <div className="text-sm opacity-90">Pontos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalBadges}</div>
              <div className="text-sm opacity-90">Badges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.currentStreak}</div>
              <div className="text-sm opacity-90">Sequência</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">#{stats.rank}</div>
              <div className="text-sm opacity-90">Ranking</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Nível {stats.level} - {getLevelInfo(stats.level)}</span>
              <span className="text-sm">Próximo nível</span>
            </div>
            <ProgressBar
              value={stats.nextLevelProgress}
              color="purple"
              size="md"
              animated
              className="bg-white/20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Conquistas Recentes</span>
          </CardTitle>
          {onViewAllBadges && (
            <Button variant="outline" size="sm" onClick={onViewAllBadges}>
              Ver Todos
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {stats.recentAchievements.length > 0 ? (
            <div className="space-y-2">
              {stats.recentAchievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3 p-2 bg-muted/50 rounded-lg">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Nova conquista desbloqueada!</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(achievement.earned_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <Award className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Complete suas primeiras tarefas para ganhar badges!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mini Leaderboard */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Top Performers</span>
          </CardTitle>
          {onViewLeaderboard && (
            <Button variant="outline" size="sm" onClick={onViewLeaderboard}>
              Ver Ranking
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {leaderboard.slice(0, 5).map((entry, index) => (
              <div key={entry.user_id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{entry.name}</div>
                  <div className="text-xs text-muted-foreground">{entry.department}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{entry.points}</div>
                  <Badge variant="secondary" className="text-xs">
                    {entry.badges_count} badges
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
