
export interface Meeting {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  type: 'onboarding' | 'feedback' | 'training' | 'general';
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  location?: string;
  meeting_url?: string;
  organizer_id: string;
  participants: MeetingParticipant[];
  created_at: string;
  updated_at: string;
}

export interface MeetingParticipant {
  id: string;
  meeting_id: string;
  user_id: string;
  email: string;
  name: string;
  role: 'organizer' | 'required' | 'optional';
  status: 'pending' | 'accepted' | 'declined' | 'tentative';
  response_time?: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
  participants: string[];
  conflicts?: string[];
}

export interface SchedulingSuggestion {
  id: string;
  start_time: string;
  end_time: string;
  confidence_score: number;
  reasoning: string;
  conflicts: number;
  available_participants: number;
  total_participants: number;
}

export interface AvailabilityPreference {
  user_id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  preferred: boolean;
}

export interface MeetingTemplate {
  id: string;
  name: string;
  duration: number; // minutes
  type: Meeting['type'];
  default_participants: string[];
  description_template: string;
  buffer_before?: number; // minutes
  buffer_after?: number; // minutes
}
