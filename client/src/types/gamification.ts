
export interface GamificationStats {
  totalPoints: number;
  totalBadges: number;
  currentStreak: number;
  longestStreak: number;
  rank: number;
  level: number;
  nextLevelProgress: number;
  recentAchievements: Achievement[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'milestone' | 'speed' | 'quality' | 'engagement';
  criteria: {
    type: string;
    value: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserAchievement {
  id: string;
  badge_id: string;
  user_id = string;
  earned_at: string;
  badge?: Badge;
}

export interface Achievement {
  id: string;
  badge_id: string;
  user_id = string;
  earned_at: string;
  badge: Badge;
}

export interface LeaderboardEntry {
  user_id = string;
  name: string;
  points: number;
  badges_count: number;
  rank: number;
  department: string;
}

export interface OnboardingProgress {
  progress_percentage: number;
  completed_steps: number;
  total_steps: number;
  badges_earned: Badge[];
  gamification_score: number;
  current_streak: number;
  estimated_completion: string;
  next_milestone?: Badge;
  performance_rating: 'excellent' | 'good' | 'average' | 'needs_improvement';
  time_spent_minutes: number;
}

export interface GoalMilestone {
  id: string;
  title: string;
  target_value: number;
  completed: boolean;
  completed_at?: string;
}

export interface GoalProgress {
  id: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  progress_percentage: number;
  due_date: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  milestones: GoalMilestone[];
}
