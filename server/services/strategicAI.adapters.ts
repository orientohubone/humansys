// Adapter functions to transform database schema fields into AI-friendly formats
// This keeps AI prompts readable while using actual schema field names

import type {
  StrategicContext,
  OrgChartPosition,
  CompetencyProfile,
  StrategicSimulation,
  GrowthHealthMetrics
} from "@shared/schema";

// ========== STRATEGIC CONTEXT ADAPTER ==========

export interface AIStrategicContext {
  vision: string;
  mission: string;
  core_values: string[];
  growth_targets: {
    revenue_target?: string;
    headcount_target?: number;
    timeline?: string;
  };
  market_context: string;
  current_challenges: string[];
  company_name: string;
  sector?: string;
  stage?: string;
  current_arr?: number;
  headcount?: number;
}

export function adaptStrategicContextForAI(context: StrategicContext): AIStrategicContext {
  return {
    vision: context.vision_3_5_years || 'Not defined',
    mission: context.growth_objectives || 'Not defined',
    core_values: context.core_values || [],
    growth_targets: {
      revenue_target: context.current_arr ? `Current ARR: $${context.current_arr}` : undefined,
      headcount_target: context.headcount,
      timeline: context.stage || undefined
    },
    market_context: [
      context.competitive_advantage,
      context.market_trends?.join(', '),
      context.opportunities?.join(', ')
    ].filter(Boolean).join('. ') || 'Not provided',
    current_challenges: context.challenges || [],
    company_name: context.company_name,
    sector: context.sector || undefined,
    stage: context.stage || undefined,
    current_arr: context.current_arr || undefined,
    headcount: context.headcount || undefined
  };
}

// ========== ORG CHART POSITION ADAPTER ==========

export interface AIOrgChartPosition {
  id: string;
  position_title: string;
  department: string;
  seniority_level: string;
  status: string;
  is_key_position: boolean;
}

export function adaptOrgChartPositionForAI(position: OrgChartPosition): AIOrgChartPosition {
  // Map seniority level from role_level (1-10) to semantic levels
  const getSeniorityLevel = (roleLevel?: number): string => {
    if (!roleLevel) return 'Not specified';
    if (roleLevel <= 3) return 'Junior';
    if (roleLevel <= 5) return 'Pleno';
    if (roleLevel <= 7) return 'Senior';
    if (roleLevel === 8) return 'Lead';
    if (roleLevel === 9) return 'Manager';
    return 'Director';
  };

  return {
    id: position.id,
    position_title: position.position_name,
    department: position.department,
    seniority_level: getSeniorityLevel(position.role_level),
    status: position.hire_status || 'unknown',
    is_key_position: position.is_key_role || false
  };
}

export function adaptOrgChartPositionsForAI(positions: OrgChartPosition[]): AIOrgChartPosition[] {
  return positions.map(adaptOrgChartPositionForAI);
}

// ========== GROWTH HEALTH METRICS ADAPTER ==========

export interface AIGrowthHealthMetrics {
  overall_health_score: number;
  financial_health: number;
  operational_health: number;
  people_health: number;
  strategic_health: number;
  detailed_indicators: Record<string, any>;
}

export function adaptHealthMetricsForAI(metrics: GrowthHealthMetrics): AIGrowthHealthMetrics {
  return {
    overall_health_score: metrics.total_score,
    financial_health: metrics.financial_health_score,
    operational_health: metrics.operational_health_score,
    people_health: metrics.people_health_score,
    strategic_health: metrics.strategic_health_score,
    detailed_indicators: {
      financial: metrics.financial_metrics,
      operational: metrics.operational_metrics,
      people: metrics.people_metrics,
      strategic: metrics.strategic_metrics
    }
  };
}

// ========== SIMULATION ADAPTER ==========

export interface AISimulation {
  scenario_type: string;
  scenario_description: string;
  parameters: Record<string, any>;
}

export function adaptSimulationForAI(simulation: Partial<StrategicSimulation>): AISimulation {
  return {
    scenario_type: simulation.simulation_type || 'general',
    scenario_description: simulation.scenario_description || 'No description provided',
    parameters: (simulation.parameters as Record<string, any>) || {}
  };
}

// ========== COMPETENCY PROFILE ADAPTER ==========

export interface AICompetencyProfile {
  competencies: Record<string, number>;
  strengths: string[];
  development_areas: string[];
}

export function adaptCompetencyProfileForAI(profile: CompetencyProfile | undefined): AICompetencyProfile | undefined {
  if (!profile) return undefined;

  const competencies = (profile.competencies as Record<string, number>) || {};
  
  // Identify strengths (competencies >= 8) and development areas (competencies < 6)
  const strengths: string[] = [];
  const development_areas: string[] = [];

  Object.entries(competencies).forEach(([competency, level]) => {
    if (level >= 8) {
      strengths.push(competency);
    } else if (level < 6) {
      development_areas.push(competency);
    }
  });

  return {
    competencies,
    strengths,
    development_areas
  };
}

console.log('✅ Strategic AI Adapters initialized');
