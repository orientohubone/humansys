
export interface Collaborator {
  id: string;
  user_id = string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'vacation';
  phone?: string;
  location?: string;
  join_date: string;
  created_at: string;
  updated_at: string;
  skills: string[];
  hireDate: string;
}

export interface CollaboratorsData {
  collaborators: Collaborator[];
  stats: {
    total: number;
    active: number;
    inactive: number;
    vacation: number;
    departments: number;
  };
}

export interface LoadingState {
  isLoading: boolean;
  currentStage: 'initial' | 'collaborators' | 'stats' | 'complete';
  progress: number;
}

export interface CreateCollaboratorData {
  name: string;
  email: string;
  role: string;
  department: string;
  status?: 'active' | 'inactive' | 'vacation';
  phone?: string;
  location?: string;
  join_date?: string;
}
