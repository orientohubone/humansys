
export interface Survey {
  id: string;
  title: string;
  description: string;
  type: 'climate' | 'feedback' | 'satisfaction' | 'engagement' | 'custom';
  status: 'draft' | 'active' | 'completed' | 'archived';
  questions: SurveyQuestion[];
  target_audience: string[];
  start_date: string;
  end_date: string;
  anonymous: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SurveyQuestion {
  id: string;
  type: 'multiple_choice' | 'rating' | 'text' | 'yes_no' | 'scale' | 'matrix';
  question: string;
  required: boolean;
  options?: string[];
  scale_min?: number;
  scale_max?: number;
  scale_labels?: { min: string; max: string; };
  conditional?: {
    depends_on: string;
    show_if: string;
  };
}

export interface SurveyResponse {
  id: string;
  survey_id: string;
  user_id?: string;
  answers: SurveyAnswer[];
  completed_at: string;
  ip_address?: string;
}

export interface SurveyAnswer {
  question_id: string;
  answer: string | string[] | number;
}

export interface SurveyAnalytics {
  total_responses: number;
  completion_rate: number;
  average_completion_time: number;
  real_time_responses: SurveyResponse[];
  sentiment_analysis: {
    positive: number;
    neutral: number;
    negative: number;
  };
  response_trends: {
    date: string;
    count: number;
  }[];
}
