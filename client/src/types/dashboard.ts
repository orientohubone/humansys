
export interface DashboardStats {
  totalCollaborators: number;
  activeProcesses: number;
  completionRate: number;
  gamificationPoints: number;
}

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  created_at: string;
  entity_type?: string;
  entity_id?: string;
}

export interface PendingTask {
  id: number;
  title: string;
  priority: 'high' | 'medium' | 'low';
  deadline: string;
}

export interface TrendData {
  date: string;
  value: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivities: RecentActivity[];
  pendingTasks: PendingTask[];
  trends: TrendData[];
}
