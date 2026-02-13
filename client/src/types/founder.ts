
export interface Company {
  id: string;
  name: string;
  domain: string | null;
  plan_type: string;
  mrr: number;
  arr: number;
  status: string;
  trial_ends_at: string | null;
  subscription_started_at: string;
  created_at: string;
  updated_at: string;
}

export interface RevenueEvent {
  id: string;
  company_id: string;
  event_type: string;
  plan_from: string | null;
  plan_to: string | null;
  mrr_change: number;
  amount: number;
  created_at: string;
}

export interface CustomerHealthScore {
  id: string;
  company_id: string;
  health_score: number;
  engagement_score: number;
  adoption_score: number;
  satisfaction_score: number;
  churn_risk: 'low' | 'medium' | 'high';
  last_activity_at: string | null;
  calculated_at: string;
  company?: Company;
}

export interface UserActivityLog {
  id: string;
  user_id = string;
  company_id: string;
  activity_type: string;
  feature_name: string | null;
  session_duration: number | null;
  created_at: string;
}

export interface FounderAnalytics {
  revenue: {
    total_mrr: number;
    total_arr: number;
    mrr_growth: number;
    churn_rate: number;
    ltv: number;
    cac: number;
  };
  customers: {
    total_customers: number;
    active_customers: number;
    trial_customers: number;
    churned_customers: number;
    new_customers_this_month: number;
  };
  engagement: {
    dau: number;
    mau: number;
    avg_session_duration: number;
    feature_adoption_rate: number;
  };
  health: {
    healthy_customers: number;
    at_risk_customers: number;
    critical_customers: number;
    avg_health_score: number;
  };
}

export interface RevenueChartData {
  month: string;
  mrr: number;
  arr: number;
  customers: number;
  churn_rate: number;
}

export interface ChurnAnalysis {
  period: string;
  churned: number;
  total: number;
  rate: number;
  reasons: Array<{
    reason: string;
    count: number;
    percentage: number;
  }>;
}

export interface CohortData {
  cohort_month: string;
  customers: number;
  retention_rates: Record<string, number>;
}
