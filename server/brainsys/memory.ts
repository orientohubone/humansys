
import { z } from 'zod';
import { Signal, SignalType, DecisionContext } from './ontology';

// Schema para memória temporal
export const MemoryEntrySchema = z.object({
  id: z.string().uuid(),
  signal: z.object({
    id: z.string().uuid(),
    type: z.enum(['ENGAGEMENT', 'PERFORMANCE', 'SATISFACTION', 'STRESS', 'COLLABORATION', 'INNOVATION', 'LEADERSHIP', 'LEARNING', 'ADAPTATION', 'FEEDBACK', 'GROWTH', 'RISK']),
    entity_id: z.string().uuid(),
    value: z.number(),
    context: z.enum(['RECRUITMENT', 'PERFORMANCE_REVIEW', 'TEAM_FORMATION', 'SKILL_DEVELOPMENT', 'CAREER_PATH', 'ENGAGEMENT_BOOST', 'STRESS_MITIGATION', 'INNOVATION_CATALYST', 'LEADERSHIP_DEVELOPMENT', 'CULTURE_ALIGNMENT']),
    properties: z.record(z.any()),
    metadata: z.object({
      timestamp: z.date(),
      source: z.string(),
      confidence: z.number().min(0).max(1),
      impact_score: z.number().min(0).max(1)
    })
  }),
  ttl: z.number().positive(),
  created_at: z.date(),
  accessed_at: z.date(),
  access_count: z.number().nonnegative(),
  temporal_weight: z.number().min(0).max(1)
});

export const MemoryPattern = z.object({
  id: z.string().uuid(),
  name: z.string(),
  signals: z.array(z.string().uuid()),
  frequency: z.number().positive(),
  confidence: z.number().min(0).max(1),
  last_occurrence: z.date(),
  conditions: z.record(z.any()),
  outcomes: z.record(z.any())
});

export type MemoryEntry = z.infer<typeof MemoryEntrySchema>;
export type Pattern = z.infer<typeof MemoryPattern>;

export class BrainSysMemory {
  private memory: Map<string, MemoryEntry> = new Map();
  private patterns: Map<string, Pattern> = new Map();
  private signalHistory: Map<string, Signal[]> = new Map();
  
  // Configurações de TTL por tipo de sinal
  private readonly ttlConfig: Record<SignalType, number> = {
    'ENGAGEMENT': 7 * 24 * 60 * 60 * 1000, // 7 dias
    'PERFORMANCE': 30 * 24 * 60 * 60 * 1000, // 30 dias
    'SATISFACTION': 14 * 24 * 60 * 60 * 1000, // 14 dias
    'STRESS': 3 * 24 * 60 * 60 * 1000, // 3 dias
    'COLLABORATION': 21 * 24 * 60 * 60 * 1000, // 21 dias
    'INNOVATION': 90 * 24 * 60 * 60 * 1000, // 90 dias
    'LEADERSHIP': 60 * 24 * 60 * 60 * 1000, // 60 dias
    'LEARNING': 45 * 24 * 60 * 60 * 1000, // 45 dias
    'ADAPTATION': 21 * 24 * 60 * 60 * 1000, // 21 dias
    'FEEDBACK': 14 * 24 * 60 * 60 * 1000, // 14 dias
    'GROWTH': 90 * 24 * 60 * 60 * 1000, // 90 dias
    'RISK': 7 * 24 * 60 * 60 * 1000 // 7 dias
  };

  storeSignal(signal: Signal): void {
    const ttl = this.ttlConfig[signal.type];
    const memoryEntry: MemoryEntry = {
      id: crypto.randomUUID(),
      signal,
      ttl,
      created_at: new Date(),
      accessed_at: new Date(),
      access_count: 0,
      temporal_weight: 1.0
    };

    this.memory.set(memoryEntry.id, memoryEntry);
    
    // Atualizar histórico de sinais por entidade
    if (!this.signalHistory.has(signal.entity_id)) {
      this.signalHistory.set(signal.entity_id, []);
    }
    this.signalHistory.get(signal.entity_id)!.push(signal);

    // Executar limpeza de memória se necessário
    this.cleanupExpiredEntries();
    
    // Detectar padrões emergentes
    this.detectPatterns(signal.entity_id);
  }

  getRecentSignals(entityId: string, timeWindow: number = 24 * 60 * 60 * 1000): Signal[] {
    const cutoff = new Date(Date.now() - timeWindow);
    const signals: Signal[] = [];

    for (const [id, entry] of this.memory) {
      if (entry.signal.entity_id === entityId && entry.created_at > cutoff) {
        entry.accessed_at = new Date();
        entry.access_count += 1;
        signals.push(entry.signal);
      }
    }

    return signals.sort((a, b) => b.metadata.timestamp.getTime() - a.metadata.timestamp.getTime());
  }

  getSignalsByType(signalType: SignalType, limit: number = 50): Signal[] {
    const signals: Signal[] = [];

    for (const [id, entry] of this.memory) {
      if (entry.signal.type === signalType) {
        entry.accessed_at = new Date();
        entry.access_count += 1;
        signals.push(entry.signal);
      }
    }

    return signals
      .sort((a, b) => b.metadata.timestamp.getTime() - a.metadata.timestamp.getTime())
      .slice(0, limit);
  }

  getSignalsByContext(context: DecisionContext, limit: number = 50): Signal[] {
    const signals: Signal[] = [];

    for (const [id, entry] of this.memory) {
      if (entry.signal.context === context) {
        entry.accessed_at = new Date();
        entry.access_count += 1;
        signals.push(entry.signal);
      }
    }

    return signals
      .sort((a, b) => b.metadata.timestamp.getTime() - a.metadata.timestamp.getTime())
      .slice(0, limit);
  }

  calculateTemporalWeight(timestamp: Date): number {
    const now = Date.now();
    const age = now - timestamp.getTime();
    const maxAge = 90 * 24 * 60 * 60 * 1000; // 90 dias
    
    return Math.max(0, 1 - (age / maxAge));
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now();
    const expiredIds: string[] = [];

    for (const [id, entry] of this.memory) {
      const age = now - entry.created_at.getTime();
      if (age > entry.ttl) {
        expiredIds.push(id);
      } else {
        // Atualizar peso temporal
        entry.temporal_weight = this.calculateTemporalWeight(entry.created_at);
      }
    }

    expiredIds.forEach(id => this.memory.delete(id));
  }

  private detectPatterns(entityId: string): void {
    const entitySignals = this.signalHistory.get(entityId) || [];
    if (entitySignals.length < 3) return;

    // Detectar padrões de sequência temporal
    const recentSignals = entitySignals
      .filter(s => Date.now() - s.metadata.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000)
      .sort((a, b) => a.metadata.timestamp.getTime() - b.metadata.timestamp.getTime());

    // Padrão de declínio de engagement
    const engagementSignals = recentSignals.filter(s => s.type === 'ENGAGEMENT');
    if (engagementSignals.length >= 3) {
      const isDecreasing = this.isDecreasingTrend(engagementSignals.map(s => s.value));
      if (isDecreasing) {
        this.recordPattern({
          id: crypto.randomUUID(),
          name: 'ENGAGEMENT_DECLINE',
          signals: engagementSignals.map(s => s.id),
          frequency: 1,
          confidence: 0.8,
          last_occurrence: new Date(),
          conditions: { entity_id: entityId, trend: 'decreasing' },
          outcomes: { risk_level: 'medium', action: 'intervention_needed' }
        });
      }
    }

    // Padrão de stress + baixa performance
    const stressSignals = recentSignals.filter(s => s.type === 'STRESS');
    const performanceSignals = recentSignals.filter(s => s.type === 'PERFORMANCE');
    
    if (stressSignals.length > 0 && performanceSignals.length > 0) {
      const highStress = stressSignals.some(s => s.value > 0.7);
      const lowPerformance = performanceSignals.some(s => s.value < 0.4);
      
      if (highStress && lowPerformance) {
        this.recordPattern({
          id: crypto.randomUUID(),
          name: 'STRESS_PERFORMANCE_CORRELATION',
          signals: [...stressSignals, ...performanceSignals].map(s => s.id),
          frequency: 1,
          confidence: 0.9,
          last_occurrence: new Date(),
          conditions: { entity_id: entityId, stress_threshold: 0.7, performance_threshold: 0.4 },
          outcomes: { risk_level: 'high', action: 'urgent_intervention' }
        });
      }
    }
  }

  private isDecreasingTrend(values: number[]): boolean {
    if (values.length < 2) return false;
    
    let decreasing = 0;
    for (let i = 1; i < values.length; i++) {
      if (values[i] < values[i-1]) decreasing++;
    }
    
    return decreasing >= values.length * 0.7;
  }

  private recordPattern(pattern: Pattern): void {
    const existingPattern = Array.from(this.patterns.values())
      .find(p => p.name === pattern.name && 
                JSON.stringify(p.conditions) === JSON.stringify(pattern.conditions));

    if (existingPattern) {
      existingPattern.frequency += 1;
      existingPattern.last_occurrence = new Date();
      existingPattern.confidence = Math.min(existingPattern.confidence + 0.1, 1.0);
    } else {
      this.patterns.set(pattern.id, pattern);
    }
  }

  getPatterns(): Pattern[] {
    return Array.from(this.patterns.values())
      .sort((a, b) => b.confidence - a.confidence);
  }

  getEntityPatterns(entityId: string): Pattern[] {
    return Array.from(this.patterns.values())
      .filter(p => p.conditions.entity_id === entityId)
      .sort((a, b) => b.confidence - a.confidence);
  }

  // Método para análise de tendências
  analyzeTrends(entityId: string, signalType: SignalType, timeWindow: number = 30 * 24 * 60 * 60 * 1000): {
    trend: 'increasing' | 'decreasing' | 'stable';
    confidence: number;
    slope: number;
    prediction: number;
  } {
    const signals = this.getRecentSignals(entityId, timeWindow)
      .filter(s => s.type === signalType)
      .sort((a, b) => a.metadata.timestamp.getTime() - b.metadata.timestamp.getTime());

    if (signals.length < 2) {
      return { trend: 'stable', confidence: 0, slope: 0, prediction: 0 };
    }

    const values = signals.map(s => s.value);
    const slope = this.calculateSlope(values);
    const confidence = Math.min(signals.length / 10, 1.0);
    
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (Math.abs(slope) > 0.1) {
      trend = slope > 0 ? 'increasing' : 'decreasing';
    }

    const prediction = values[values.length - 1] + slope;

    return { trend, confidence, slope, prediction: Math.max(0, Math.min(1, prediction)) };
  }

  private calculateSlope(values: number[]): number {
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, idx) => sum + val * idx, 0);
    const sumX2 = values.reduce((sum, val, idx) => sum + idx * idx, 0);

    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  // Método para obter insights da memória
  getMemoryInsights(): {
    totalSignals: number;
    activePatterns: number;
    memoryUtilization: number;
    topSignalTypes: Array<{ type: SignalType; count: number }>;
  } {
    const totalSignals = this.memory.size;
    const activePatterns = this.patterns.size;
    const memoryUtilization = totalSignals / 10000; // Assumindo limite de 10k sinais

    const signalTypeCounts = new Map<SignalType, number>();
    for (const [id, entry] of this.memory) {
      const type = entry.signal.type;
      signalTypeCounts.set(type, (signalTypeCounts.get(type) || 0) + 1);
    }

    const topSignalTypes = Array.from(signalTypeCounts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalSignals,
      activePatterns,
      memoryUtilization,
      topSignalTypes
    };
  }
}
