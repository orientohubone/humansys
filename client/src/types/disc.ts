
export interface DiscQuestion {
  id: string;
  category: 'D' | 'I' | 'S' | 'C';
  question: string;
  options: string[];
}

export interface DiscAnswer {
  question_id: string;
  selected_option: number;
  weight: number;
}

export interface DiscProfile {
  id: string;
  user_id: string;
  dominance: number;
  influence: number;
  steadiness: number;
  conscientiousness: number;
  primary_style: 'D' | 'I' | 'S' | 'C';
  secondary_style?: 'D' | 'I' | 'S' | 'C';
  completed_at: string;
  insights: DiscInsight[];
  recommendations: string[];
}

export interface DiscInsight {
  category: string;
  description: string;
  strength_level: number;
  development_areas: string[];
  ai_prediction: string;
}

export interface DiscReport {
  profile: DiscProfile;
  detailed_analysis: string;
  career_recommendations: string[];
  team_compatibility: string;
  leadership_style: string;
  communication_preferences: string[];
  stress_indicators: string[];
  growth_opportunities: string[];
}

export interface DiscGamification {
  badges: DiscBadge[];
  level: number;
  experience_points: number;
  achievements: DiscAchievement[];
  progress_streak: number;
}

export interface DiscBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned_at?: string;
}

export interface DiscAchievement {
  id: string;
  title: string;
  description: string;
  points: number;
  unlocked: boolean;
  progress: number;
  max_progress: number;
}
