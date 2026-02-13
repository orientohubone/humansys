
import { BrainSysMemory } from './memory';
import { BrainSysInference } from './inference';
import { OntologyEngine } from './ontology';
import { BrainSysBridge } from './bridge';
import { BrainSysFeedbackLoop } from './feedback-loop';

// Classe principal do BrainSys IAO
export class BrainSysIAO {
  private memory: BrainSysMemory;
  private inference: BrainSysInference;
  private ontology: OntologyEngine;
  private bridge: BrainSysBridge;
  private feedbackLoop: BrainSysFeedbackLoop;
  private isInitialized = false;

  constructor() {
    this.memory = new BrainSysMemory();
    this.inference = new BrainSysInference(this.memory);
    this.ontology = new OntologyEngine();
    this.bridge = new BrainSysBridge();
    this.feedbackLoop = new BrainSysFeedbackLoop(this.memory, this.inference, this.ontology);
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🧠 Inicializando BrainSys IAO...');
      
      // Inicializar componentes
      await this.initializeComponents();
      
      this.isInitialized = true;
      console.log('✅ BrainSys IAO inicializado com sucesso');
      
      // Relatório de inicialização
      await this.generateInitializationReport();
      
    } catch (error) {
      console.error('❌ Erro ao inicializar BrainSys IAO:', error);
      throw error;
    }
  }

  private async initializeComponents(): Promise<void> {
    // Componentes já são inicializados em seus construtores
    // Aqui podemos fazer configurações adicionais se necessário
  }

  private async generateInitializationReport(): Promise<void> {
    const memoryStats = this.memory.getMemoryInsights();
    const systemHealth = await this.bridge.getSystemHealth();
    
    console.log('📊 Relatório de Inicialização BrainSys IAO:');
    console.log(`- Memória: ${memoryStats.totalSignals} sinais, ${memoryStats.activePatterns} padrões`);
    console.log(`- Sistema: ${systemHealth.data?.status || 'unknown'}`);
    console.log(`- Ontologia: ${this.ontology.exportGraph().entities.length} entidades`);
  }

  // Métodos públicos para uso no sistema
  async analyzeEntity(entityId: string, context: any) {
    if (!this.isInitialized) {
      throw new Error('BrainSys IAO não foi inicializado');
    }

    return await this.bridge.getEntityInsights(entityId, context);
  }

  async analyzeTeam(teamId: string) {
    if (!this.isInitialized) {
      throw new Error('BrainSys IAO não foi inicializado');
    }

    return await this.bridge.getTeamInsights(teamId);
  }

  async recordUserAction(userId: string, actionType: string, actionData: any) {
    if (!this.isInitialized) {
      throw new Error('BrainSys IAO não foi inicializado');
    }

    await this.bridge.recordUserAction(userId, actionType, actionData);
  }

  async getSystemStatus() {
    if (!this.isInitialized) {
      return { status: 'not_initialized' };
    }

    const memoryStats = this.memory.getMemoryInsights();
    const systemHealth = await this.bridge.getSystemHealth();
    const feedbackMetrics = this.feedbackLoop.getSystemMetrics();

    return {
      status: 'active',
      initialized: this.isInitialized,
      memory: memoryStats,
      system: systemHealth.data,
      feedback: feedbackMetrics,
      uptime: process.uptime()
    };
  }

  // Getter para componentes (para uso avançado)
  getMemory(): BrainSysMemory {
    return this.memory;
  }

  getInference(): BrainSysInference {
    return this.inference;
  }

  getOntology(): OntologyEngine {
    return this.ontology;
  }

  getBridge(): BrainSysBridge {
    return this.bridge;
  }

  getFeedbackLoop(): BrainSysFeedbackLoop {
    return this.feedbackLoop;
  }
}

// Instância singleton global
export const brainSysIAO = new BrainSysIAO();

// Exportar todos os tipos e classes necessárias
export * from './ontology';
export * from './memory';
export * from './inference';
export * from './bridge';
export * from './feedback-loop';
