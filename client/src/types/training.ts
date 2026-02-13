
export interface Training {
  id: string;
  title: string;
  description: string;
  duration: string;
  instructor?: string;
  status: 'active' | 'inactive';
  participants: number;
  user_id = string;
  created_at: string;
  updated_at: string;
}

export interface CreateTrainingData {
  title: string;
  description: string;
  duration: string;
  instructor?: string;
}
