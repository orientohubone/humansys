
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { OnboardingStep } from './useOnboarding';
import { Badge, Achievement, OnboardingProgress } from '@/types/gamification';

// Mock badges para desenvolvimento
const onboardingBadges: Badge[] = [
  {
    id: 'first-step',
    name: 'Primeiro Passo',
    description: 'Complete sua primeira etapa do onboarding',
    icon: '🚀',
    color: 'bg-blue-500',
    category: 'milestone',
    criteria: { type: 'steps_completed', value: 1 },
    rarity: 'common'
  },
  {
    id: 'halfway-hero',
    name: 'Herói da Metade',
    description: 'Complete 50% do onboarding',
    icon: '⭐',
    color: 'bg-yellow-500',
    category: 'milestone',
    criteria: { type: 'progress_percentage', value: 50 },
    rarity: 'rare'
  },
  {
    id: 'speed-runner',
    name: 'Velocista',
    description: 'Complete 3 etapas em menos de 30 minutos',
    icon: '⚡',
    color: 'bg-purple-500',
    category: 'speed',
    criteria: { type: 'speed_completion', value: 3 },
    rarity: 'epic'
  },
  {
    id: 'onboarding-champion',
    name: 'Campeão do Onboarding',
    description: 'Complete todo o processo de onboarding',
    icon: '🏆',
    color: 'bg-green-500',
    category: 'milestone',
    criteria: { type: 'progress_percentage', value: 100 },
    rarity: 'legendary'
  },
  {
    id: 'perfectionist',
    name: 'Perfeccionista',
    description: 'Complete todas as etapas sem erros',
    icon: '💎',
    color: 'bg-indigo-500',
    category: 'quality',
    criteria: { type: 'perfect_completion', value: 1 },
    rarity: 'legendary'
  }
];

export const useOnboardingGamification = (processId: string, steps: OnboardingStep[]) => {
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [availableBadges, setAvailableBadges] = useState<Badge[]>(onboardingBadges);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (processId && steps.length > 0) {
      calculateProgress();
    }
  }, [processId, steps]);

  const calculateProgress = () => {
    setIsLoading(true);

    try {
      const completedSteps = steps.filter(s => s.completed || s.status === 'completed').length;
      const progressPercentage = Math.round((completedSteps / steps.length) * 100);

      // Determinar rating de performance
      let performanceRating: 'excellent' | 'good' | 'average' | 'needs_improvement';
      if (progressPercentage >= 90) performanceRating = 'excellent';
      else if (progressPercentage >= 70) performanceRating = 'good';
      else if (progressPercentage >= 50) performanceRating = 'average';
      else performanceRating = 'needs_improvement';

      // Calcular badges earned
      const earnedBadges = availableBadges.filter(badge => {
        switch (badge.criteria.type) {
          case 'steps_completed':
            return completedSteps >= badge.criteria.value;
          case 'progress_percentage':
            return progressPercentage >= badge.criteria.value;
          default:
            return false;
        }
      });

      // Calcular score de gamificação baseado em badges e progresso
      const gamificationScore = earnedBadges.reduce((total, badge) => {
        const rarityPoints = {
          'common': 10,
          'rare': 25,
          'epic': 50,
          'legendary': 100
        };
        return total + rarityPoints[badge.rarity];
      }, completedSteps * 5);

      const progressData: OnboardingProgress = {
        progress_percentage: progressPercentage,
        completed_steps: completedSteps,
        total_steps: steps.length,
        badges_earned: earnedBadges,
        gamification_score: gamificationScore,
        current_streak: Math.min(completedSteps, 7), // Streak máximo de 7 dias
        estimated_completion: new Date(Date.now() + (steps.length - completedSteps) * 24 * 60 * 60 * 1000).toISOString(),
        performance_rating: performanceRating,
        time_spent_minutes: completedSteps * 15 // Estimativa de 15 minutos por etapa
      };

      setProgress(progressData);

      // Atualizar achievements
      const newAchievements: Achievement[] = earnedBadges.map(badge => ({
        id: `achievement-${badge.id}-${processId}`,
        badge_id: badge.id,
        user_id: processId, // Using processId as user_id for now
        earned_at: new Date().toISOString(),
        badge: badge
      }));

      setAchievements(newAchievements);
    } catch (error) {
      console.error('Erro ao calcular progresso de gamificação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const awardBonusPoints = (points: number, reason: string) => {
    if (progress) {
      setProgress(prev => prev ? {
        ...prev,
        gamification_score: prev.gamification_score + points
      } : null);

      console.log(`Pontos bônus concedidos: +${points} por ${reason}`);
    }
  };

  const refetch = () => {
    if (processId && steps.length > 0) {
      calculateProgress();
    }
  };

  return {
    progress,
    availableBadges,
    achievements,
    isLoading,
    awardBonusPoints,
    refetch
  };
};
