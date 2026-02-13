import Anthropic from "@anthropic-ai/sdk";
import type {
  StrategicContext,
  OrgChartPosition,
  CompetencyProfile,
  StrategicSimulation,
  StrategicAlert,
  GrowthHealthMetrics
} from "@shared/schema";

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
});

// ========== STRATEGIC CONTEXT ANALYSIS ==========

export interface StrategicAnalysis {
  insights: string[];
  recommendations: string[];
  risks: string[];
  opportunities: string[];
  nextSteps: string[];
}

export async function analyzeStrategicContext(
  context: StrategicContext
): Promise<StrategicAnalysis> {
  const prompt = `Você é um consultor estratégico sênior especializado em crescimento empresarial.

Analise o seguinte contexto estratégico de uma empresa:

**Visão:** ${context.vision || 'Não definida'}
**Missão:** ${context.mission || 'Não definida'}
**Valores:** ${context.core_values?.join(', ') || 'Não definidos'}

**Metas de Crescimento:**
- Receita alvo: ${context.growth_targets?.revenue_target || 'Não definido'}
- Headcount alvo: ${context.growth_targets?.headcount_target || 'Não definido'}
- Cronograma: ${context.growth_targets?.timeline || 'Não definido'}

**Contexto do Mercado:** ${context.market_context || 'Não fornecido'}
**Desafios Atuais:** ${context.current_challenges?.join(', ') || 'Não especificados'}

Forneça uma análise estratégica estruturada em JSON com os seguintes campos:
{
  "insights": ["insight 1", "insight 2", ...],  // 3-5 insights chave sobre a situação atual
  "recommendations": ["rec 1", "rec 2", ...],   // 3-5 recomendações estratégicas
  "risks": ["risco 1", "risco 2", ...],        // 3-4 riscos principais identificados
  "opportunities": ["opp 1", "opp 2", ...],    // 3-4 oportunidades de crescimento
  "nextSteps": ["step 1", "step 2", ...]       // 3-5 próximos passos concretos
}

Seja específico, acionável e focado em crescimento sustentável.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      messages: [{
        role: "user",
        content: prompt
      }]
    });

    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return {
      insights: [],
      recommendations: [],
      risks: [],
      opportunities: [],
      nextSteps: []
    };
  } catch (error) {
    console.error('❌ Error analyzing strategic context:', error);
    throw new Error('Failed to analyze strategic context');
  }
}

// ========== ORG CHART SUGGESTIONS ==========

export interface OrgChartSuggestion {
  position_title: string;
  department: string;
  seniority_level: string;
  reporting_to?: string;
  rationale: string;
  priority: 'high' | 'medium' | 'low';
  estimated_timeline: string;
}

export async function suggestOrgChart(
  context: StrategicContext,
  currentPositions: OrgChartPosition[]
): Promise<OrgChartSuggestion[]> {
  const currentStructure = currentPositions.map(p => ({
    title: p.position_title,
    department: p.department,
    seniority: p.seniority_level,
    status: p.status
  }));

  const prompt = `Você é um consultor de estrutura organizacional especializado em empresas em crescimento.

**Contexto Estratégico:**
- Headcount alvo: ${context.growth_targets?.headcount_target || 'Não definido'}
- Timeline: ${context.growth_targets?.timeline || 'Não definido'}
- Desafios: ${context.current_challenges?.join(', ') || 'Não especificados'}

**Estrutura Atual (${currentPositions.length} posições):**
${JSON.stringify(currentStructure, null, 2)}

Sugira posições adicionais que a empresa deve criar para atingir seus objetivos de crescimento.

Retorne um array JSON com as sugestões:
[
  {
    "position_title": "nome da posição",
    "department": "departamento",
    "seniority_level": "Junior|Pleno|Senior|Lead|Manager|Director|VP|C-Level",
    "reporting_to": "título da posição superior (opcional)",
    "rationale": "justificativa detalhada de por que esta posição é necessária",
    "priority": "high|medium|low",
    "estimated_timeline": "quando contratar (ex: Q1 2025, Mês 3, etc)"
  }
]

Priorize posições críticas para o crescimento. Máximo 8 sugestões.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2500,
      messages: [{
        role: "user",
        content: prompt
      }]
    });

    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return [];
  } catch (error) {
    console.error('❌ Error suggesting org chart:', error);
    throw new Error('Failed to suggest org chart');
  }
}

// ========== SIMULATION ENGINE ==========

export interface SimulationResult {
  predicted_outcome: string;
  success_probability: number;  // 0-100
  cascade_effects: {
    area: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
    severity: number;  // 1-10
  }[];
  recommendations: string[];
  timeline_impact: string;
  resource_requirements: {
    financial?: string;
    human?: string;
    time?: string;
  };
}

export async function simulateStrategicDecision(
  simulation: Partial<StrategicSimulation>,
  context: StrategicContext
): Promise<SimulationResult> {
  const prompt = `Você é um estrategista de negócios especializado em análise de cenários e simulação de decisões.

**Decisão a Simular:**
- Tipo: ${simulation.scenario_type}
- Descrição: ${simulation.scenario_description}
- Parâmetros: ${JSON.stringify(simulation.parameters, null, 2)}

**Contexto da Empresa:**
- Visão: ${context.vision}
- Metas de crescimento: ${JSON.stringify(context.growth_targets, null, 2)}
- Desafios atuais: ${context.current_challenges?.join(', ')}

Simule os possíveis resultados desta decisão estratégica e retorne uma análise em JSON:
{
  "predicted_outcome": "descrição detalhada do resultado mais provável",
  "success_probability": 75,  // 0-100
  "cascade_effects": [
    {
      "area": "nome da área impactada (ex: Financeiro, RH, Operações, etc)",
      "impact": "positive|negative|neutral",
      "description": "descrição do impacto",
      "severity": 7  // 1-10
    }
  ],
  "recommendations": ["recomendação 1", "recomendação 2", ...],
  "timeline_impact": "impacto no cronograma geral",
  "resource_requirements": {
    "financial": "estimativa de investimento necessário",
    "human": "recursos humanos necessários",
    "time": "tempo estimado"
  }
}

Seja realista e considere efeitos de segunda e terceira ordem.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2500,
      messages: [{
        role: "user",
        content: prompt
      }]
    });

    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Failed to parse simulation result');
  } catch (error) {
    console.error('❌ Error simulating decision:', error);
    throw new Error('Failed to simulate strategic decision');
  }
}

// ========== INTELLIGENT ALERTS GENERATION ==========

export interface GeneratedAlert {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'risk' | 'opportunity' | 'action_required';
  title: string;
  description: string;
  affected_areas: string[];
  recommended_action: string;
}

export async function generateIntelligentAlerts(
  metrics: GrowthHealthMetrics,
  context: StrategicContext,
  currentAlerts: StrategicAlert[]
): Promise<GeneratedAlert[]> {
  const prompt = `Você é um sistema de alerta estratégico que identifica riscos e oportunidades para empresas em crescimento.

**Health Score Atual:** ${metrics.overall_health_score}/100

**Breakdown por Pilar:**
- Financeiro: ${metrics.financial_health}/100
- Operacional: ${metrics.operational_health}/100
- Pessoas: ${metrics.people_health}/100
- Estratégico: ${metrics.strategic_health}/100

**Indicadores Detalhados:** ${JSON.stringify(metrics.detailed_indicators, null, 2)}

**Metas da Empresa:** ${JSON.stringify(context.growth_targets, null, 2)}

**Alertas Atuais (${currentAlerts.length}):** ${currentAlerts.filter(a => a.status === 'active').map(a => a.title).join(', ')}

Identifique novos alertas estratégicos que o founder deveria conhecer. Evite duplicar alertas existentes.

Retorne um array JSON com os alertas:
[
  {
    "severity": "critical|high|medium|low",
    "category": "risk|opportunity|action_required",
    "title": "título conciso do alerta",
    "description": "descrição detalhada",
    "affected_areas": ["área 1", "área 2"],
    "recommended_action": "ação recomendada específica"
  }
]

Máximo 5 alertas, priorizados por impacto.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      messages: [{
        role: "user",
        content: prompt
      }]
    });

    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return [];
  } catch (error) {
    console.error('❌ Error generating alerts:', error);
    throw new Error('Failed to generate intelligent alerts');
  }
}

// ========== HEALTH METRICS ANALYSIS ==========

export interface HealthAnalysis {
  overall_assessment: string;
  strengths: string[];
  weaknesses: string[];
  critical_risks: {
    area: string;
    description: string;
    urgency: 'immediate' | 'short_term' | 'medium_term';
    mitigation: string;
  }[];
  improvement_plan: {
    pillar: string;
    current_score: number;
    target_score: number;
    actions: string[];
    timeline: string;
  }[];
}

export async function analyzeHealthMetrics(
  metrics: GrowthHealthMetrics,
  context: StrategicContext
): Promise<HealthAnalysis> {
  const prompt = `Você é um consultor de saúde organizacional especializado em empresas em crescimento.

**Health Score Geral:** ${metrics.overall_health_score}/100

**Scores por Pilar:**
- Financeiro: ${metrics.financial_health}/100
- Operacional: ${metrics.operational_health}/100
- Pessoas: ${metrics.people_health}/100
- Estratégico: ${metrics.strategic_health}/100

**Indicadores:** ${JSON.stringify(metrics.detailed_indicators, null, 2)}

**Contexto:** ${JSON.stringify({
  vision: context.vision,
  targets: context.growth_targets,
  challenges: context.current_challenges
}, null, 2)}

Analise a saúde organizacional e retorne um JSON estruturado:
{
  "overall_assessment": "avaliação geral da saúde da empresa",
  "strengths": ["força 1", "força 2", ...],  // 3-4 pontos fortes
  "weaknesses": ["fraqueza 1", "fraqueza 2", ...],  // 3-4 pontos fracos
  "critical_risks": [
    {
      "area": "nome da área",
      "description": "descrição do risco",
      "urgency": "immediate|short_term|medium_term",
      "mitigation": "ações de mitigação"
    }
  ],  // 2-3 riscos críticos
  "improvement_plan": [
    {
      "pillar": "nome do pilar",
      "current_score": 65,
      "target_score": 85,
      "actions": ["ação 1", "ação 2"],
      "timeline": "cronograma"
    }
  ]  // plano para cada pilar abaixo de 80
}

Seja específico e acionável.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2500,
      messages: [{
        role: "user",
        content: prompt
      }]
    });

    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Failed to parse health analysis');
  } catch (error) {
    console.error('❌ Error analyzing health metrics:', error);
    throw new Error('Failed to analyze health metrics');
  }
}

// ========== LEADERSHIP DEVELOPMENT SUGGESTIONS ==========

export interface DevelopmentSuggestion {
  position_id: string;
  position_title: string;
  current_readiness: number;  // 0-100
  gaps: {
    competency: string;
    current_level: number;
    required_level: number;
    priority: 'high' | 'medium' | 'low';
  }[];
  development_actions: {
    action: string;
    type: 'training' | 'mentoring' | 'project' | 'coaching';
    duration: string;
    expected_impact: number;  // 0-100
  }[];
  succession_readiness: string;
  timeline_to_ready: string;
}

export async function suggestLeadershipDevelopment(
  position: OrgChartPosition,
  profile: CompetencyProfile | undefined,
  context: StrategicContext
): Promise<DevelopmentSuggestion> {
  const prompt = `Você é um consultor de desenvolvimento de liderança especializado em crescimento de talentos.

**Posição:**
- Título: ${position.position_title}
- Departamento: ${position.department}
- Nível: ${position.seniority_level}
- É posição chave: ${position.is_key_position ? 'Sim' : 'Não'}

**Perfil de Competências ${profile ? 'Atual' : '(Não definido)'}:**
${profile ? JSON.stringify(profile, null, 2) : 'Nenhum perfil definido ainda'}

**Metas da Empresa:** ${JSON.stringify(context.growth_targets, null, 2)}

Analise a prontidão de liderança e sugira um plano de desenvolvimento. Retorne JSON:
{
  "position_id": "${position.id}",
  "position_title": "${position.position_title}",
  "current_readiness": 70,  // 0-100
  "gaps": [
    {
      "competency": "nome da competência",
      "current_level": 6,  // 1-10
      "required_level": 9,
      "priority": "high|medium|low"
    }
  ],
  "development_actions": [
    {
      "action": "descrição da ação de desenvolvimento",
      "type": "training|mentoring|project|coaching",
      "duration": "duração estimada",
      "expected_impact": 75  // 0-100
    }
  ],
  "succession_readiness": "avaliação de prontidão para sucessão",
  "timeline_to_ready": "tempo estimado para estar pronto"
}

Seja específico e focado em competências críticas para o crescimento.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      messages: [{
        role: "user",
        content: prompt
      }]
    });

    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Failed to parse development suggestion');
  } catch (error) {
    console.error('❌ Error suggesting leadership development:', error);
    throw new Error('Failed to suggest leadership development');
  }
}

// ========== GROWTH ROADMAP GENERATION ==========

export interface RoadmapMilestone {
  quarter: string;
  headcount_target: number;
  key_hires: {
    position: string;
    department: string;
    priority: 'critical' | 'high' | 'medium';
    rationale: string;
  }[];
  organizational_changes: string[];
  success_metrics: {
    metric: string;
    target: string;
  }[];
}

export async function generateGrowthRoadmap(
  context: StrategicContext,
  currentPositions: OrgChartPosition[]
): Promise<RoadmapMilestone[]> {
  const currentHeadcount = currentPositions.filter(p => p.status === 'filled').length;
  const targetHeadcount = context.growth_targets?.headcount_target || currentHeadcount * 2;
  
  const prompt = `Você é um consultor de planejamento organizacional especializado em roadmaps de crescimento.

**Situação Atual:**
- Headcount atual: ${currentHeadcount}
- Headcount alvo: ${targetHeadcount}
- Timeline: ${context.growth_targets?.timeline || '12 meses'}

**Estrutura Atual:**
${JSON.stringify(currentPositions.map(p => ({
  title: p.position_title,
  dept: p.department,
  status: p.status
})), null, 2)}

**Metas de Receita:** ${context.growth_targets?.revenue_target || 'Não definido'}

Crie um roadmap de crescimento trimestral detalhado. Retorne array JSON:
[
  {
    "quarter": "Q1 2025",
    "headcount_target": 25,
    "key_hires": [
      {
        "position": "título da posição",
        "department": "departamento",
        "priority": "critical|high|medium",
        "rationale": "por que contratar neste momento"
      }
    ],
    "organizational_changes": ["mudança 1", "mudança 2"],
    "success_metrics": [
      {
        "metric": "nome da métrica",
        "target": "valor alvo"
      }
    ]
  }
]

Planeje para 4-6 trimestres. Priorize contratações críticas primeiro.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 3000,
      messages: [{
        role: "user",
        content: prompt
      }]
    });

    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return [];
  } catch (error) {
    console.error('❌ Error generating growth roadmap:', error);
    throw new Error('Failed to generate growth roadmap');
  }
}

// ========== COMPETENCY GAP ANALYSIS ==========

export interface CompetencyGapAnalysis {
  position_title: string;
  critical_gaps: {
    competency: string;
    gap_severity: number;  // 1-10
    business_impact: string;
    development_priority: 'immediate' | 'short_term' | 'long_term';
  }[];
  strengths: string[];
  overall_readiness_score: number;  // 0-100
  recommended_focus_areas: string[];
}

export async function analyzeCompetencyGaps(
  position: OrgChartPosition,
  profile: CompetencyProfile,
  context: StrategicContext
): Promise<CompetencyGapAnalysis> {
  const prompt = `Você é um especialista em análise de competências e desenvolvimento de talentos.

**Posição:** ${position.position_title} (${position.seniority_level})
**Departamento:** ${position.department}

**Competências Atuais:** ${JSON.stringify(profile.competencies, null, 2)}

**Contexto Estratégico:**
- Fase de crescimento: ${context.growth_targets?.timeline}
- Desafios: ${context.current_challenges?.join(', ')}

Analise os gaps de competências e retorne JSON:
{
  "position_title": "${position.position_title}",
  "critical_gaps": [
    {
      "competency": "nome da competência",
      "gap_severity": 8,  // 1-10
      "business_impact": "impacto no negócio",
      "development_priority": "immediate|short_term|long_term"
    }
  ],
  "strengths": ["força 1", "força 2"],
  "overall_readiness_score": 75,  // 0-100
  "recommended_focus_areas": ["área 1", "área 2"]
}

Foque em competências críticas para o crescimento da empresa.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1500,
      messages: [{
        role: "user",
        content: prompt
      }]
    });

    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Failed to parse competency gap analysis');
  } catch (error) {
    console.error('❌ Error analyzing competency gaps:', error);
    throw new Error('Failed to analyze competency gaps');
  }
}

console.log('✅ Strategic AI Service initialized');
