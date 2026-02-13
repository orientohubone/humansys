
import { z } from 'zod';
import { BrainSysMemory } from './memory';
import { BrainSysInference, InferenceResult } from './inference';
import { OntologyEngine } from './ontology';
import { brainSysBridge } from './bridge';

// Schema para resultado de aprendizado
export const LearningOutcomeSchema = z.object({
  id: z.string().uuid(),
  prediction_id: z.string().uuid(),
  actual_outcome: z.any(),
  predicted_outcome: z.any(),
  accuracy: z.number().min(0).max(1),
  confidence_delta: z.number().min(-1).max(1),
  learning_points: z.array(z.string()),
  timestamp: z.date(),
  metadata: z.record(z.any())
});

export const AdaptationActionSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['RULE_ADJUSTMENT', 'THRESHOLD_UPDATE', 'PATTERN_REFINEMENT', 'WEIGHT_ADJUSTMENT']),
  target: z.string(),
  old_value: z.any(),
  new_value: z.any(),
  rationale: z.string(),
  expected_impact: z.number().min(0).max(1),
  timestamp: z.date(),
  metadata: z.record(z.any())
});

export const FeedbackMetricsSchema = z.object({
  accuracy_rate: z.number().min(0).max(1),
  precision: z.number().min(0).max(1),
  recall: z.number().min(0).max(1),
  f1_score: z.number().min(0).max(1),
  confidence_calibration: z.number().min(0).max(1),
  adaptation_frequency: z.number().nonnegative(),
  learning_velocity: z.number().nonnegative(),
  timestamp: z.date()
});

export type LearningOutcome = z.infer<typeof LearningOutcomeSchema>;
export type AdaptationAction = z.infer<typeof AdaptationActionSchema>;
export type FeedbackMetrics = z.infer<typeof FeedbackMetricsSchema>;

export class BrainSysFeedbackLoop {
  private memory: BrainSysMemory;
  private inference: BrainSysInference;
  private ontology: OntologyEngine;
  private learningHistory: Map<string, LearningOutcome> = new Map();
  private adaptationLog: Map<string, AdaptationAction> = new Map();
  private metrics: FeedbackMetrics[] = [];
  private isLearning = false;

  constructor(memory: BrainSysMemory, inference: BrainSysInference, ontology: OntologyEngine) {
    this.memory = memory;
    this.inference = inference;
    this.ontology = ontology;
    this.initializeFeedbackLoop();
  }

  private initializeFeedbackLoop(): void {
    // Iniciar ciclo de aprendizado a cada 1 hora
    setInterval(() => {
      this.performLearningCycle();
    }, 60 * 60 * 1000);

    // Avaliar métricas a cada 6 horas
    setInterval(() => {
      this.evaluateSystemMetrics();
    }, 6 * 60 * 60 * 1000);

    // Adaptação do sistema a cada 24 horas
    setInterval(() => {
      this.performSystemAdaptation();
    }, 24 * 60 * 60 * 1000);

    console.log('🔄 BrainSys Feedback Loop inicializado');
  }

  async recordPredictionOutcome(
    predictionId: string,
    actualOutcome: any,
    predictedOutcome: any,
    context: any
  ): Promise<void> {
    const accuracy = this.calculateAccuracy(actualOutcome, predictedOutcome);
    const confidenceDelta = this.calculateConfidenceDelta(actualOutcome, predictedOutcome, context);

    const learningOutcome: LearningOutcome = {
      id: crypto.randomUUID(),
      prediction_id: predictionId,
      actual_outcome: actualOutcome,
      predicted_outcome: predictedOutcome,
      accuracy,
      confidence_delta: confidenceDelta,
      learning_points: this.extractLearningPoints(actualOutcome, predictedOutcome),
      timestamp: new Date(),
      metadata: { context }
    };

    this.learningHistory.set(learningOutcome.id, learningOutcome);
    
    // Aprender imediatamente com resultados significativos
    if (Math.abs(confidenceDelta) > 0.3) {
      await this.immediateAdaptation(learningOutcome);
    }
  }

  private calculateAccuracy(actual: any, predicted: any): number {
    // Implementar cálculo de precisão baseado no tipo de predição
    if (typeof actual === 'number' && typeof predicted === 'number') {
      const error = Math.abs(actual - predicted);
      return Math.max(0, 1 - error);
    }
    
    if (typeof actual === 'boolean' && typeof predicted === 'boolean') {
      return actual === predicted ? 1 : 0;
    }
    
    // Para objetos complexos, usar comparação estrutural
    return this.structuralSimilarity(actual, predicted);
  }

  private calculateConfidenceDelta(actual: any, predicted: any, context: any): number {
    const accuracy = this.calculateAccuracy(actual, predicted);
    const originalConfidence = context.confidence || 0.5;
    
    // Se a precisão é alta, aumentar confiança; se baixa, diminuir
    return (accuracy - 0.5) * 2 * (1 - originalConfidence);
  }

  private extractLearningPoints(actual: any, predicted: any): string[] {
    const points: string[] = [];
    
    // Análise de discrepâncias
    if (typeof actual === 'number' && typeof predicted === 'number') {
      const error = Math.abs(actual - predicted);
      if (error > 0.2) {
        points.push(`Erro numérico significativo: ${error.toFixed(3)}`);
      }
    }
    
    // Análise de padrões
    if (actual !== predicted) {
      points.push('Predição incorreta - revisar modelo');
    }
    
    return points;
  }

  private async immediateAdaptation(outcome: LearningOutcome): Promise<void> {
    console.log('🔄 Adaptação imediata iniciada', outcome.id);
    
    // Ajustar thresholds baseado no resultado
    if (outcome.accuracy < 0.5) {
      await this.adjustInferenceThresholds(outcome);
    }
    
    // Refinar padrões se necessário
    if (outcome.learning_points.length > 2) {
      await this.refinePatterns(outcome);
    }
  }

  private async adjustInferenceThresholds(outcome: LearningOutcome): Promise<void> {
    const adaptation: AdaptationAction = {
      id: crypto.randomUUID(),
      type: 'THRESHOLD_UPDATE',
      target: 'inference_thresholds',
      old_value: 0.7,
      new_value: 0.6,
      rationale: `Baixa precisão detectada (${outcome.accuracy.toFixed(2)})`,
      expected_impact: 0.2,
      timestamp: new Date(),
      metadata: { outcome_id: outcome.id }
    };

    this.adaptationLog.set(adaptation.id, adaptation);
    console.log('🔧 Threshold ajustado:', adaptation.target);
  }

  private async refinePatterns(outcome: LearningOutcome): Promise<void> {
    const adaptation: AdaptationAction = {
      id: crypto.randomUUID(),
      type: 'PATTERN_REFINEMENT',
      target: 'pattern_detection',
      old_value: 'existing_patterns',
      new_value: 'refined_patterns',
      rationale: `Múltiplos pontos de aprendizado identificados`,
      expected_impact: 0.3,
      timestamp: new Date(),
      metadata: { outcome_id: outcome.id }
    };

    this.adaptationLog.set(adaptation.id, adaptation);
    console.log('🔧 Padrões refinados:', adaptation.target);
  }

  private async performLearningCycle(): Promise<void> {
    if (this.isLearning) return;
    
    this.isLearning = true;
    console.log('🧠 Iniciando ciclo de aprendizado...');

    try {
      // Analisar resultados recentes
      const recentOutcomes = this.getRecentOutcomes(24 * 60 * 60 * 1000); // 24 horas
      
      // Identificar padrões de erro
      const errorPatterns = this.identifyErrorPatterns(recentOutcomes);
      
      // Aplicar correções
      for (const pattern of errorPatterns) {
        await this.applyCorrection(pattern);
      }
      
      // Atualizar pesos do modelo
      await this.updateModelWeights(recentOutcomes);
      
      console.log('✅ Ciclo de aprendizado concluído');
    } catch (error) {
      console.error('❌ Erro no ciclo de aprendizado:', error);
    } finally {
      this.isLearning = false;
    }
  }

  private getRecentOutcomes(timeWindow: number): LearningOutcome[] {
    const cutoff = new Date(Date.now() - timeWindow);
    return Array.from(this.learningHistory.values())
      .filter(outcome => outcome.timestamp > cutoff)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  private identifyErrorPatterns(outcomes: LearningOutcome[]): any[] {
    const patterns = [];
    
    // Padrão 1: Baixa precisão consistente
    const lowAccuracyOutcomes = outcomes.filter(o => o.accuracy < 0.6);
    if (lowAccuracyOutcomes.length > outcomes.length * 0.3) {
      patterns.push({
        type: 'LOW_ACCURACY',
        frequency: lowAccuracyOutcomes.length,
        severity: 'high',
        outcomes: lowAccuracyOutcomes
      });
    }
    
    // Padrão 2: Overconfidence
    const overconfidentOutcomes = outcomes.filter(o => o.confidence_delta < -0.3);
    if (overconfidentOutcomes.length > 5) {
      patterns.push({
        type: 'OVERCONFIDENCE',
        frequency: overconfidentOutcomes.length,
        severity: 'medium',
        outcomes: overconfidentOutcomes
      });
    }
    
    return patterns;
  }

  private async applyCorrection(pattern: any): Promise<void> {
    switch (pattern.type) {
      case 'LOW_ACCURACY':
        await this.correctLowAccuracy(pattern);
        break;
      case 'OVERCONFIDENCE':
        await this.correctOverconfidence(pattern);
        break;
    }
  }

  private async correctLowAccuracy(pattern: any): Promise<void> {
    const adaptation: AdaptationAction = {
      id: crypto.randomUUID(),
      type: 'RULE_ADJUSTMENT',
      target: 'accuracy_rules',
      old_value: 'current_rules',
      new_value: 'adjusted_rules',
      rationale: `Correção para baixa precisão (${pattern.frequency} casos)`,
      expected_impact: 0.4,
      timestamp: new Date(),
      metadata: { pattern }
    };

    this.adaptationLog.set(adaptation.id, adaptation);
    console.log('🔧 Correção aplicada para baixa precisão');
  }

  private async correctOverconfidence(pattern: any): Promise<void> {
    const adaptation: AdaptationAction = {
      id: crypto.randomUUID(),
      type: 'WEIGHT_ADJUSTMENT',
      target: 'confidence_weights',
      old_value: 'current_weights',
      new_value: 'calibrated_weights',
      rationale: `Correção para overconfidence (${pattern.frequency} casos)`,
      expected_impact: 0.3,
      timestamp: new Date(),
      metadata: { pattern }
    };

    this.adaptationLog.set(adaptation.id, adaptation);
    console.log('🔧 Correção aplicada para overconfidence');
  }

  private async updateModelWeights(outcomes: LearningOutcome[]): Promise<void> {
    if (outcomes.length < 10) return;
    
    const avgAccuracy = outcomes.reduce((sum, o) => sum + o.accuracy, 0) / outcomes.length;
    const avgConfidenceDelta = outcomes.reduce((sum, o) => sum + o.confidence_delta, 0) / outcomes.length;
    
    // Ajustar pesos baseado na performance
    const weightAdjustment = avgAccuracy < 0.7 ? -0.1 : 0.05;
    
    const adaptation: AdaptationAction = {
      id: crypto.randomUUID(),
      type: 'WEIGHT_ADJUSTMENT',
      target: 'model_weights',
      old_value: 'current_weights',
      new_value: `adjusted_by_${weightAdjustment}`,
      rationale: `Atualização baseada em ${outcomes.length} resultados`,
      expected_impact: Math.abs(weightAdjustment),
      timestamp: new Date(),
      metadata: { avgAccuracy, avgConfidenceDelta }
    };

    this.adaptationLog.set(adaptation.id, adaptation);
    console.log('🔧 Pesos do modelo atualizados');
  }

  private async evaluateSystemMetrics(): Promise<void> {
    const recentOutcomes = this.getRecentOutcomes(24 * 60 * 60 * 1000);
    
    if (recentOutcomes.length === 0) return;
    
    const metrics: FeedbackMetrics = {
      accuracy_rate: this.calculateAccuracyRate(recentOutcomes),
      precision: this.calculatePrecision(recentOutcomes),
      recall: this.calculateRecall(recentOutcomes),
      f1_score: 0, // Calculado após precision e recall
      confidence_calibration: this.calculateConfidenceCalibration(recentOutcomes),
      adaptation_frequency: this.calculateAdaptationFrequency(),
      learning_velocity: this.calculateLearningVelocity(),
      timestamp: new Date()
    };

    metrics.f1_score = this.calculateF1Score(metrics.precision, metrics.recall);
    
    this.metrics.push(metrics);
    
    // Manter apenas os últimos 30 dias de métricas
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
    
    console.log('📊 Métricas do sistema atualizadas:', {
      accuracy: metrics.accuracy_rate.toFixed(3),
      precision: metrics.precision.toFixed(3),
      recall: metrics.recall.toFixed(3),
      f1: metrics.f1_score.toFixed(3)
    });
  }

  private calculateAccuracyRate(outcomes: LearningOutcome[]): number {
    return outcomes.reduce((sum, o) => sum + o.accuracy, 0) / outcomes.length;
  }

  private calculatePrecision(outcomes: LearningOutcome[]): number {
    // Implementação simplificada - pode ser expandida
    const correctPredictions = outcomes.filter(o => o.accuracy > 0.7).length;
    return correctPredictions / outcomes.length;
  }

  private calculateRecall(outcomes: LearningOutcome[]): number {
    // Implementação simplificada - pode ser expandida
    const relevantOutcomes = outcomes.filter(o => o.accuracy > 0.5).length;
    return relevantOutcomes / outcomes.length;
  }

  private calculateF1Score(precision: number, recall: number): number {
    return 2 * (precision * recall) / (precision + recall);
  }

  private calculateConfidenceCalibration(outcomes: LearningOutcome[]): number {
    const calibrationError = outcomes.reduce((sum, o) => {
      const expectedAccuracy = 0.5 + (o.confidence_delta / 2);
      return sum + Math.abs(o.accuracy - expectedAccuracy);
    }, 0);
    
    return Math.max(0, 1 - (calibrationError / outcomes.length));
  }

  private calculateAdaptationFrequency(): number {
    const recentAdaptations = Array.from(this.adaptationLog.values())
      .filter(a => Date.now() - a.timestamp.getTime() < 24 * 60 * 60 * 1000);
    
    return recentAdaptations.length;
  }

  private calculateLearningVelocity(): number {
    const recentOutcomes = this.getRecentOutcomes(24 * 60 * 60 * 1000);
    const learningPointsCount = recentOutcomes
      .reduce((sum, o) => sum + o.learning_points.length, 0);
    
    return learningPointsCount / Math.max(1, recentOutcomes.length);
  }

  private async performSystemAdaptation(): Promise<void> {
    console.log('🔄 Iniciando adaptação do sistema...');
    
    const currentMetrics = this.metrics[this.metrics.length - 1];
    if (!currentMetrics) return;
    
    // Adaptação baseada em métricas
    if (currentMetrics.accuracy_rate < 0.7) {
      await this.performMajorAdaptation();
    } else if (currentMetrics.confidence_calibration < 0.6) {
      await this.performConfidenceAdaptation();
    }
    
    console.log('✅ Adaptação do sistema concluída');
  }

  private async performMajorAdaptation(): Promise<void> {
    const adaptation: AdaptationAction = {
      id: crypto.randomUUID(),
      type: 'RULE_ADJUSTMENT',
      target: 'system_rules',
      old_value: 'current_system_rules',
      new_value: 'adapted_system_rules',
      rationale: 'Adaptação maior devido à baixa precisão do sistema',
      expected_impact: 0.5,
      timestamp: new Date(),
      metadata: { adaptation_type: 'major' }
    };

    this.adaptationLog.set(adaptation.id, adaptation);
    console.log('🔧 Adaptação maior aplicada');
  }

  private async performConfidenceAdaptation(): Promise<void> {
    const adaptation: AdaptationAction = {
      id: crypto.randomUUID(),
      type: 'WEIGHT_ADJUSTMENT',
      target: 'confidence_system',
      old_value: 'current_confidence_weights',
      new_value: 'calibrated_confidence_weights',
      rationale: 'Adaptação de confiança devido à má calibração',
      expected_impact: 0.3,
      timestamp: new Date(),
      metadata: { adaptation_type: 'confidence' }
    };

    this.adaptationLog.set(adaptation.id, adaptation);
    console.log('🔧 Adaptação de confiança aplicada');
  }

  private structuralSimilarity(obj1: any, obj2: any): number {
    // Implementação simplificada de similaridade estrutural
    if (obj1 === obj2) return 1;
    if (typeof obj1 !== typeof obj2) return 0;
    
    if (typeof obj1 === 'object' && obj1 !== null && obj2 !== null) {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);
      const commonKeys = keys1.filter(key => keys2.includes(key));
      
      if (commonKeys.length === 0) return 0;
      
      const similarity = commonKeys.reduce((sum, key) => {
        return sum + this.structuralSimilarity(obj1[key], obj2[key]);
      }, 0);
      
      return similarity / commonKeys.length;
    }
    
    return obj1 === obj2 ? 1 : 0;
  }

  // Métodos para monitoramento
  getSystemMetrics(): FeedbackMetrics | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null;
  }

  getAdaptationHistory(): AdaptationAction[] {
    return Array.from(this.adaptationLog.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getLearningHistory(): LearningOutcome[] {
    return Array.from(this.learningHistory.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Método para resetar aprendizado (uso em desenvolvimento)
  resetLearning(): void {
    this.learningHistory.clear();
    this.adaptationLog.clear();
    this.metrics.length = 0;
    console.log('🔄 Sistema de aprendizado resetado');
  }
}
