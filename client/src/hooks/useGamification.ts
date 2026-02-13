
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GamificationStats, Badge, UserAchievement, LeaderboardEntry, Achievement, OnboardingProgress } from '@/types/gamification';

export const useGamification = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<GamificationStats>({
    totalPoints: 0,
    totalBadges: 0,
    currentStreak: 0,
    longestStreak: 0,
    rank: 0,
    level: 1,
    nextLevelProgress: 0,
    recentAchievements: []
  });
  
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - em produção, isso viria da API
  useEffect(() => {
    const loadGamificationData = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock badges
      const mockBadges: Badge[] = [
        {
          id: '1',
          name: 'Primeira Meta',
          description: 'Complete sua primeira meta',
          icon: '🎯',
          color: 'bg-blue-500',
          category: 'milestone',
          criteria: { type: 'goals_completed', value: 1 },
          rarity: 'common'
        },
        {
          id: '2',
          name: 'Velocista',
          description: 'Complete um treinamento em menos de 2 horas',
          icon: '⚡',
          color: 'bg-yellow-500',
          category: 'speed',
          criteria: { type: 'training_finished', value: 1 },
          rarity: 'rare'
        },
        {
          id: '3',
          name: 'Perfeccionista',
          description: 'Obtenha nota máxima em 3 treinamentos',
          icon: '⭐',
          color: 'bg-purple-500',
          category: 'quality',
          criteria: { type: 'perfect_score', value: 3 },
          rarity: 'epic'
        },
        {
          id: '4',
          name: 'Mentor',
          description: 'Ajude 5 colegas com feedback positivo',
          icon: '👥',
          color: 'bg-green-500',
          category: 'engagement',
          criteria: { type: 'help_others', value: 5 },
          rarity: 'legendary'
        }
      ];
      
      // Mock user achievements
      const mockAchievements: Achievement[] = [
        {
          id: '1',
          badge_id: '1',
          user_id = user?.id || '',
          earned_at: new Date().toISOString(),
          badge: mockBadges[0]
        }
      ];
      
      // Mock stats
      const mockStats: GamificationStats = {
        totalPoints: 1250,
        totalBadges: 1,
        currentStreak: 5,
        longestStreak: 12,
        rank: 8,
        level: 3,
        nextLevelProgress: 65,
        recentAchievements: mockAchievements
      };
      
      // Mock leaderboard
      const mockLeaderboard: LeaderboardEntry[] = [
        {
          user_id = '1',
          name: 'Ana Silva',
          points: 2840,
          badges_count: 8,
          rank: 1,
          department: 'Tecnologia'
        },
        {
          user_id = '2',
          name: 'Carlos Santos',
          points: 2650,
          badges_count: 7,
          rank: 2,
          department: 'Marketing'
        },
        {
          user_id = '3',
          name: 'Maria Oliveira',
          points: 2450,
          badges_count: 6,
          rank: 3,
          department: 'Vendas'
        },
        {
          user_id = '4',
          name: 'João Costa',
          points: 2100,
          badges_count: 5,
          rank: 4,
          department: 'RH'
        },
        {
          user_id = '5',
          name: 'Pedro Lima',
          points: 1890,
          badges_count: 4,
          rank: 5,
          department: 'Financeiro'
        }
      ];
      
      setBadges(mockBadges);
      setUserAchievements(mockAchievements);
      setAchievements(mockAchievements);
      setStats(mockStats);
      setLeaderboard(mockLeaderboard);
      setIsLoading(false);
    };

    if (user) {
      loadGamificationData();
    }
  }, [user]);

  const checkForNewAchievements = async (action: string, value?: number) => {
    // Simular verificação de novas conquistas
    console.log('Checking achievements for action:', action, 'value:', value);
    
    // Em produção, isso faria uma chamada para a API para verificar
    // se o usuário desbloqueou novos badges baseado na ação realizada
  };

  const awardPoints = async (points: number, reason: string) => {
    console.log(`Awarding ${points} points for: ${reason}`);
    
    // Atualizar pontuação local (em produção, enviaria para API)
    setStats(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + points
    }));
  };

  const checkBadgeEligibility = (progress: OnboardingProgress, process: any) => {
    console.log('Checking badge eligibility for progress:', progress);
    // Mock implementation for checking if user earned new badges
  };

  const calculateProgress = (process: any, steps: any[]): OnboardingProgress => {
    const completedSteps = steps.filter(s => s.completed).length;
    const progressPercentage = Math.round((completedSteps / steps.length) * 100);
    
    // Determine performance rating
    let performanceRating: 'excellent' | 'good' | 'average' | 'needs_improvement';
    if (progressPercentage >= 90) performanceRating = 'excellent';
    else if (progressPercentage >= 70) performanceRating = 'good';
    else if (progressPercentage >= 50) performanceRating = 'average';
    else performanceRating = 'needs_improvement';
    
    return {
      progress_percentage: progressPercentage,
      completed_steps: completedSteps,
      total_steps: steps.length,
      badges_earned: badges.filter(b => achievements.some(a => a.badge_id === b.id)),
      gamification_score: stats.totalPoints,
      current_streak: stats.currentStreak,
      estimated_completion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      performance_rating: performanceRating,
      time_spent_minutes: completedSteps * 15 // Estimated 15 minutes per step
    };
  };

  return {
    stats,
    badges,
    userAchievements,
    achievements,
    leaderboard,
    isLoading,
    checkForNewAchievements,
    awardPoints,
    checkBadgeEligibility,
    calculateProgress
  };
};
