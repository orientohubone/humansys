
import { z } from 'zod';
import { Entity, Signal, SignalType, DecisionContext } from './ontology';
import { BrainSysMemory, Pattern } from './memory';

// Schema para contexto de decisão
export const InferenceContextSchema = z.object({
  entity_id: z.string().uuid(),
  context: z.enum(['RECRUITMENT', 'PERFORMANCE_REVIEW', 'TEAM_FORMATION', 'SKILL_DEVELOPMENT', 'CAREER_PATH', 'ENGAGEMENT_BOOST', 'STRESS_MITIGATION', 'INNOVATION_CATALYST', 'LEADERSHIP_DEVELOPMENT', 'CULTURE_ALIGNMENT']),
  current_state: z.record(z.any()),
  goals: z.array(z.string()),
  constraints: z.record(z.any()),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  metadata: z.object({
    timestamp: z.date(),
    source: z.string(),
    confidence_threshold: z.number().min(0).max(1)
  })
});

export const InferenceResultSchema = z.object({
  id: z.string().uuid(),
  context: InferenceContextSchema,
  insights: z.array(z.object({
    type: z.enum(['RECOMMENDATION', 'PREDICTION', 'ALERT', 'PATTERN', 'OPTIMIZATION']),
    title: z.string(),
    description: z.string(),
    confidence: z.number().min(0).max(1),
    impact: z.enum(['low', 'medium', 'high']),
    urgency: z.enum(['low', 'medium', 'high', 'urgent']),
    evidence: z.array(z.string()),
    suggested_actions: z.array(z.string()),
    metadata: z.record(z.any())
  })),
  decisions: z.array(z.object({
    type: z.string(),
    action: z.string(),
    reasoning: z.string(),
    confidence: z.number().min(0).max(1),
    expected_outcome: z.string(),
    risk_level: z.enum(['low', 'medium', 'high']),
    resource_requirements: z.record(z.any())
  })),
  metadata: z.object({
    processing_time: z.number(),
    total_signals_analyzed: z.number(),
    patterns_matched: z.number(),
    confidence_score: z.number().min(0).max(1)
  })
});

export type InferenceContext = z.infer<typeof InferenceContextSchema>;
export type InferenceResult = z.infer<typeof InferenceResultSchema>;

export class BrainSysInference {
  private memory: BrainSysMemory;
  private rules: Map<string, InferenceRule> = new Map();

  constructor(memory: BrainSysMemory) {
    this.memory = memory;
    this.initializeRules();
  }

  async generateInsights(context: InferenceContext): Promise<InferenceResult> {
    const startTime = Date.now();
    
    // Coletar sinais relevantes
    const recentSignals = this.memory.getRecentSignals(context.entity_id);
    const contextSignals = this.memory.getSignalsByContext(context.context);
    const patterns = this.memory.getEntityPatterns(context.entity_id);

    // Aplicar regras de inferência
    const insights = await this.applyInferenceRules(context, recentSignals, patterns);
    
    // Gerar decisões adaptativas
    const decisions = await this.generateDecisions(context, insights, recentSignals);

    const processingTime = Date.now() - startTime;
    
    return {
      id: crypto.randomUUID(),
      context,
      insights,
      decisions,
      metadata: {
        processing_time: processingTime,
        total_signals_analyzed: recentSignals.length,
        patterns_matched: patterns.length,
        confidence_score: this.calculateOverallConfidence(insights)
      }
    };
  }

  private async applyInferenceRules(
    context: InferenceContext, 
    signals: Signal[], 
    patterns: Pattern[]
  ): Promise<InferenceResult['insights']> {
    const insights: InferenceResult['insights'] = [];

    // Regra 1: Análise de Engagement
    const engagementInsight = this.analyzeEngagement(context, signals);
    if (engagementInsight) insights.push(engagementInsight);

    // Regra 2: Detecção de Stress
    const stressInsight = this.analyzeStress(context, signals);
    if (stressInsight) insights.push(stressInsight);

    // Regra 3: Análise de Performance
    const performanceInsight = this.analyzePerformance(context, signals);
    if (performanceInsight) insights.push(performanceInsight);

    // Regra 4: Análise de Padrões
    const patternInsights = this.analyzePatterns(context, patterns);
    insights.push(...patternInsights);

    // Regra 5: Predições baseadas em tendências
    const predictiveInsights = await this.generatePredictions(context, signals);
    insights.push(...predictiveInsights);

    return insights.sort((a, b) => b.confidence - a.confidence);
  }

  private analyzeEngagement(context: InferenceContext, signals: Signal[]): InferenceResult['insights'][0] | null {
    const engagementSignals = signals.filter(s => s.type === 'ENGAGEMENT');
    if (engagementSignals.length === 0) return null;

    const avgEngagement = engagementSignals.reduce((sum, s) => sum + s.value, 0) / engagementSignals.length;
    const trend = this.memory.analyzeTrends(context.entity_id, 'ENGAGEMENT');

    if (avgEngagement < 0.4 || trend.trend === 'decreasing') {
      return {
        type: 'ALERT',
        title: 'Baixo Engagement Detectado',
        description: `Engagement médio de ${(avgEngagement * 100).toFixed(1)}% com tendência ${trend.trend}`,
        confidence: 0.85,
        impact: 'high',
        urgency: avgEngagement < 0.3 ? 'urgent' : 'high',
        evidence: [`${engagementSignals.length} sinais de engagement analisados`, `Tendência: ${trend.trend}`],
        suggested_actions: [
          'Agendar conversa individual com o colaborador',
          'Revisar carga de trabalho e desafios',
          'Implementar programa de reconhecimento'
        ],
        metadata: { threshold: 0.4, current_value: avgEngagement }
      };
    }

    if (avgEngagement > 0.8 && trend.trend === 'increasing') {
      return {
        type: 'RECOMMENDATION',
        title: 'Alto Engagement - Oportunidade de Crescimento',
        description: `Engagement excepcional de ${(avgEngagement * 100).toFixed(1)}%`,
        confidence: 0.9,
        impact: 'medium',
        urgency: 'low',
        evidence: [`${engagementSignals.length} sinais positivos`, `Tendência crescente`],
        suggested_actions: [
          'Considerar promoção ou novas responsabilidades',
          'Usar como mentor para outros colaboradores',
          'Explorar projetos de inovação'
        ],
        metadata: { threshold: 0.8, current_value: avgEngagement }
      };
    }

    return null;
  }

  private analyzeStress(context: InferenceContext, signals: Signal[]): InferenceResult['insights'][0] | null {
    const stressSignals = signals.filter(s => s.type === 'STRESS');
    if (stressSignals.length === 0) return null;

    const avgStress = stressSignals.reduce((sum, s) => sum + s.value, 0) / stressSignals.length;
    const trend = this.memory.analyzeTrends(context.entity_id, 'STRESS');

    if (avgStress > 0.7 || trend.trend === 'increasing') {
      return {
        type: 'ALERT',
        title: 'Nível de Stress Elevado',
        description: `Stress médio de ${(avgStress * 100).toFixed(1)}% com tendência ${trend.trend}`,
        confidence: 0.8,
        impact: 'high',
        urgency: avgStress > 0.8 ? 'urgent' : 'high',
        evidence: [`${stressSignals.length} sinais de stress`, `Tendência: ${trend.trend}`],
        suggested_actions: [
          'Implementar programa de bem-estar',
          'Revisar distribuição de tarefas',
          'Oferecer suporte psicológico',
          'Flexibilizar horários de trabalho'
        ],
        metadata: { threshold: 0.7, current_value: avgStress }
      };
    }

    return null;
  }

  private analyzePerformance(context: InferenceContext, signals: Signal[]): InferenceResult['insights'][0] | null {
    const performanceSignals = signals.filter(s => s.type === 'PERFORMANCE');
    if (performanceSignals.length === 0) return null;

    const avgPerformance = performanceSignals.reduce((sum, s) => sum + s.value, 0) / performanceSignals.length;
    const trend = this.memory.analyzeTrends(context.entity_id, 'PERFORMANCE');

    if (avgPerformance < 0.5 || trend.trend === 'decreasing') {
      return {
        type: 'ALERT',
        title: 'Performance Abaixo do Esperado',
        description: `Performance média de ${(avgPerformance * 100).toFixed(1)}% com tendência ${trend.trend}`,
        confidence: 0.85,
        impact: 'high',
        urgency: 'high',
        evidence: [`${performanceSignals.length} sinais de performance`, `Tendência: ${trend.trend}`],
        suggested_actions: [
          'Implementar plano de desenvolvimento individual',
          'Aumentar frequência de feedback',
          'Revisar objetivos e metas',
          'Oferecer treinamento específico'
        ],
        metadata: { threshold: 0.5, current_value: avgPerformance }
      };
    }

    return null;
  }

  private analyzePatterns(context: InferenceContext, patterns: Pattern[]): InferenceResult['insights'] {
    const insights: InferenceResult['insights'] = [];

    for (const pattern of patterns) {
      if (pattern.confidence > 0.7) {
        insights.push({
          type: 'PATTERN',
          title: `Padrão Detectado: ${pattern.name}`,
          description: `Padrão recorrente identificado com ${pattern.frequency} ocorrências`,
          confidence: pattern.confidence,
          impact: pattern.outcomes.risk_level === 'high' ? 'high' : 'medium',
          urgency: pattern.outcomes.action === 'urgent_intervention' ? 'urgent' : 'medium',
          evidence: [`${pattern.frequency} ocorrências`, `Última ocorrência: ${pattern.last_occurrence.toLocaleDateString()}`],
          suggested_actions: this.getPatternActions(pattern),
          metadata: { pattern_id: pattern.id, frequency: pattern.frequency }
        });
      }
    }

    return insights;
  }

  private getPatternActions(pattern: Pattern): string[] {
    switch (pattern.name) {
      case 'ENGAGEMENT_DECLINE':
        return ['Intervenção imediata necessária', 'Revisar motivação e desafios', 'Implementar ações de retenção'];
      case 'STRESS_PERFORMANCE_CORRELATION':
        return ['Reduzir carga de trabalho', 'Implementar suporte psicológico', 'Revisar processo de trabalho'];
      default:
        return ['Monitorar padrão', 'Investigar causas', 'Implementar ações preventivas'];
    }
  }

  private async generatePredictions(context: InferenceContext, signals: Signal[]): Promise<InferenceResult['insights']> {
    const predictions: InferenceResult['insights'] = [];

    // Predição de Engagement
    const engagementTrend = this.memory.analyzeTrends(context.entity_id, 'ENGAGEMENT');
    if (engagementTrend.confidence > 0.6) {
      predictions.push({
        type: 'PREDICTION',
        title: 'Predição de Engagement',
        description: `Engagement previsto para próximo período: ${(engagementTrend.prediction * 100).toFixed(1)}%`,
        confidence: engagementTrend.confidence,
        impact: 'medium',
        urgency: 'low',
        evidence: [`Tendência: ${engagementTrend.trend}`, `Confiança: ${(engagementTrend.confidence * 100).toFixed(1)}%`],
        suggested_actions: this.getPredictionActions(engagementTrend),
        metadata: { prediction_value: engagementTrend.prediction, trend: engagementTrend.trend }
      });
    }

    return predictions;
  }

  private getPredictionActions(trend: any): string[] {
    if (trend.trend === 'decreasing') {
      return ['Implementar ações preventivas', 'Monitorar indicadores', 'Preparar plano de contenção'];
    }
    return ['Manter estratégias atuais', 'Monitorar evolução', 'Preparar para crescimento'];
  }

  private async generateDecisions(
    context: InferenceContext, 
    insights: InferenceResult['insights'], 
    signals: Signal[]
  ): Promise<InferenceResult['decisions']> {
    const decisions: InferenceResult['decisions'] = [];

    // Decisão baseada em alertas urgentes
    const urgentAlerts = insights.filter(i => i.urgency === 'urgent');
    if (urgentAlerts.length > 0) {
      decisions.push({
        type: 'IMMEDIATE_ACTION',
        action: 'Implementar intervenção imediata',
        reasoning: `${urgentAlerts.length} alertas urgentes detectados`,
        confidence: 0.9,
        expected_outcome: 'Mitigação de riscos críticos',
        risk_level: 'high',
        resource_requirements: { manager_time: 'high', budget: 'medium' }
      });
    }

    // Decisão baseada em padrões
    const patterns = insights.filter(i => i.type === 'PATTERN');
    if (patterns.length > 0) {
      decisions.push({
        type: 'PATTERN_INTERVENTION',
        action: 'Implementar ações baseadas em padrões',
        reasoning: `${patterns.length} padrões identificados requerem ação`,
        confidence: 0.8,
        expected_outcome: 'Quebra de padrões negativos',
        risk_level: 'medium',
        resource_requirements: { manager_time: 'medium', budget: 'low' }
      });
    }

    return decisions;
  }

  private calculateOverallConfidence(insights: InferenceResult['insights']): number {
    if (insights.length === 0) return 0;
    
    const totalConfidence = insights.reduce((sum, insight) => sum + insight.confidence, 0);
    return totalConfidence / insights.length;
  }

  private initializeRules(): void {
    // Regras de inferência serão expandidas conforme necessário
    this.rules.set('engagement_threshold', {
      id: 'engagement_threshold',
      condition: (signals: Signal[]) => signals.some(s => s.type === 'ENGAGEMENT' && s.value < 0.4),
      action: 'alert_low_engagement',
      confidence: 0.8
    });

    this.rules.set('stress_threshold', {
      id: 'stress_threshold',
      condition: (signals: Signal[]) => signals.some(s => s.type === 'STRESS' && s.value > 0.7),
      action: 'alert_high_stress',
      confidence: 0.85
    });
  }
}

interface InferenceRule {
  id: string;
  condition: (signals: Signal[]) => boolean;
  action: string;
  confidence: number;
}

// Classe para análise contextual avançada
export class ContextualAnalyzer {
  static analyzeDecisionContext(context: InferenceContext, signals: Signal[]): {
    complexity: 'low' | 'medium' | 'high';
    risk_factors: string[];
    opportunities: string[];
    recommendations: string[];
  } {
    const complexity = this.calculateComplexity(signals);
    const risk_factors = this.identifyRiskFactors(signals);
    const opportunities = this.identifyOpportunities(signals);
    const recommendations = this.generateContextualRecommendations(context, signals);

    return { complexity, risk_factors, opportunities, recommendations };
  }

  private static calculateComplexity(signals: Signal[]): 'low' | 'medium' | 'high' {
    const signalTypes = new Set(signals.map(s => s.type));
    const variability = this.calculateVariability(signals);
    
    if (signalTypes.size > 5 && variability > 0.3) return 'high';
    if (signalTypes.size > 3 && variability > 0.2) return 'medium';
    return 'low';
  }

  private static calculateVariability(signals: Signal[]): number {
    if (signals.length < 2) return 0;
    
    const values = signals.map(s => s.value);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    return Math.sqrt(variance);
  }

  private static identifyRiskFactors(signals: Signal[]): string[] {
    const risks: string[] = [];
    
    const highStress = signals.some(s => s.type === 'STRESS' && s.value > 0.7);
    const lowEngagement = signals.some(s => s.type === 'ENGAGEMENT' && s.value < 0.4);
    const lowPerformance = signals.some(s => s.type === 'PERFORMANCE' && s.value < 0.5);
    
    if (highStress) risks.push('Alto nível de stress');
    if (lowEngagement) risks.push('Baixo engagement');
    if (lowPerformance) risks.push('Performance insuficiente');
    
    return risks;
  }

  private static identifyOpportunities(signals: Signal[]): string[] {
    const opportunities: string[] = [];
    
    const highInnovation = signals.some(s => s.type === 'INNOVATION' && s.value > 0.7);
    const highLeadership = signals.some(s => s.type === 'LEADERSHIP' && s.value > 0.7);
    const highLearning = signals.some(s => s.type === 'LEARNING' && s.value > 0.7);
    
    if (highInnovation) opportunities.push('Potencial inovador alto');
    if (highLeadership) opportunities.push('Potencial de liderança');
    if (highLearning) opportunities.push('Alta capacidade de aprendizado');
    
    return opportunities;
  }

  private static generateContextualRecommendations(context: InferenceContext, signals: Signal[]): string[] {
    const recommendations: string[] = [];
    
    switch (context.context) {
      case 'RECRUITMENT':
        recommendations.push('Avaliar fit cultural', 'Analisar potencial de crescimento');
        break;
      case 'PERFORMANCE_REVIEW':
        recommendations.push('Focar em desenvolvimento', 'Estabelecer metas claras');
        break;
      case 'CAREER_PATH':
        recommendations.push('Mapear competências', 'Planejar desenvolvimento');
        break;
      default:
        recommendations.push('Monitorar evolução', 'Implementar ações preventivas');
    }
    
    return recommendations;
  }
}
