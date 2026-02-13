
export interface Competency {
  id: string;
  name: string;
  description: string;
  category: CompetencyCategory;
  weight?: number;
}

export interface CompetencyCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface CompetencyEvaluation {
  competencyId: string;
  rating: number;
  comment?: string;
  examples?: string[];
}

export interface StructuredFeedback {
  id: string;
  collaboratorId: string;
  evaluatorId: string;
  templateId: string;
  evaluations: CompetencyEvaluation[];
  overallRating?: number;
  generalComments?: string;
  developmentAreas?: string[];
  strengths?: string[];
  actionItems?: string[];
  status: 'draft' | 'submitted' | 'reviewed';
  createdAt: string;
  submittedAt?: string;
  reviewedAt?: string;
}

export interface FeedbackTemplate {
  id: string;
  name: string;
  description: string;
  competencies: string[];
  ratingScale: RatingScale;
  isDefault: boolean;
  category: 'performance' | '360' | 'development' | 'custom';
}

export interface RatingScale {
  min: number;
  max: number;
  labels: Record<number, string>;
  colors: Record<number, string>;
}
