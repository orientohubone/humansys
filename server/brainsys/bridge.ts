import { db } from '../db';
import { users, collaborators, feedbacks, trainings, onboardingProcesses } from '../../shared/schema';
import { eq, desc, and, gte, lte } from 'drizzle-orm';
import { BrainSysMemory } from './memory';
import { BrainSysInference, InferenceContext, InferenceResult } from './inference';
import { OntologyEngine, EntityFactory, Signal, SignalType, DecisionContext } from './ontology';

// Interface para eventos do sistema
interface SystemEvent {
  id: string;
  type: 'USER_ACTION' | 'SYSTEM_CHANGE' | 'BUSINESS_EVENT';
  entity_id: string;
  data: any;
  timestamp: Date;
  source: string;
}

// Interface para comunicação com frontend
interface BrainSysResponse {
  success: boolean;
  data?: any;
  insights?: InferenceResult['insights'];
  recommendations?: string[];
  confidence?: number;
  error?: string;
}

export class BrainSysBridge {
  private memory: BrainSysMemory;
  private inference: BrainSysInference;
  private ontology: OntologyEngine;
  private eventQueue: SystemEvent[] = [];
  private isProcessing = false;

  constructor() {
    this.memory = new BrainSysMemory();
    this.inference = new BrainSysInference(this.memory);
    this.ontology = new OntologyEngine();
    this.initializeSystem();
  }

  private async initializeSystem(): Promise<void> {
    try {
      // Carregar dados existentes e construir ontologia
      await this.loadExistingData();

      // Iniciar processamento de eventos
      this.startEventProcessing();

      console.log('🧠 BrainSys IAO inicializado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao inicializar BrainSys:', error);
    }
  }

  private async loadExistingData(): Promise<void> {
    try {
      // Carregar usuários com apenas campos que existem no schema
      const usersData = await db.select({
        id: users.id,
        email: users.email,
        full_name: users.full_name,
        position: users.position,
        company_name: users.company_name,
        company_cnpj: users.company_cnpj,
        avatar_url: users.avatar_url,
        created_at: users.created_at,
        updated_at: users.updated_at
      }).from(users);

      for (const user of usersData) {
        const userEntity = EntityFactory.createUser(user.id, {
          full_name: user.full_name,
          email: user.email,
          position: user.position,
          company_name: user.company_name
        });
        this.ontology.addEntity(userEntity);
      }

      // Carregar colaboradores com campos corretos
      const collaboratorsData = await db.select({
        id: collaborators.id,
        user_id: collaborators.user_id,
        name: collaborators.name,
        email: collaborators.email,
        role: collaborators.role,
        department: collaborators.department,
        status: collaborators.status,
        created_at: collaborators.created_at
      }).from(collaborators);

      for (const collab of collaboratorsData) {
        const collabEntity = EntityFactory.createUser(collab.id, {
          full_name: collab.name,
          email: collab.email,
          role: collab.role,
          department: collab.department
        });
        this.ontology.addEntity(collabEntity);
      }

      // Processar feedbacks recentes como sinais
      const recentFeedbacks = await db
        .select()
        .from(feedbacks)
        .where(gte(feedbacks.created_at, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)))
        .orderBy(desc(feedbacks.created_at));

      for (const feedback of recentFeedbacks) {
        const signal = this.feedbackToSignal(feedback);
        this.memory.storeSignal(signal);
      }

      console.log(`📊 Dados carregados: ${usersData.length} usuários, ${collaboratorsData.length} colaboradores, ${recentFeedbacks.length} feedbacks`);
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
    }
  }

  // Converter feedback em sinal
  private feedbackToSignal(feedback: any): Signal {
    let signalType: SignalType = 'FEEDBACK';

    // Mapear tipo de feedback para sinal
    switch (feedback.type) {
      case 'performance':
        signalType = 'PERFORMANCE';
        break;
      case 'engagement':
        signalType = 'ENGAGEMENT';
        break;
      case 'collaboration':
        signalType = 'COLLABORATION';
        break;
      default:
        signalType = 'FEEDBACK';
    }

    return {
      id: feedback.id,
      type: signalType,
      entity_id: feedback.to_collaborator_id,
      value: feedback.rating ? feedback.rating / 5 : 0.5,
      context: 'PERFORMANCE_REVIEW',
      properties: {
        subject: feedback.subject,
        content: feedback.content,
        from_user: feedback.from_user_id,
        anonymous: feedback.anonymous,
        urgent: feedback.urgent
      },
      metadata: {
        timestamp: feedback.created_at,
        source: 'feedback_system',
        confidence: 0.8,
        impact_score: feedback.urgent ? 0.9 : 0.6
      }
    };
  }

  // Processar evento do sistema
  async processSystemEvent(event: SystemEvent): Promise<void> {
    this.eventQueue.push(event);

    if (!this.isProcessing) {
      this.processEventQueue();
    }
  }

  private async processEventQueue(): Promise<void> {
    this.isProcessing = true;

    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift()!;

      try {
        await this.handleEvent(event);
      } catch (error) {
        console.error('❌ Erro ao processar evento:', error);
      }
    }

    this.isProcessing = false;
  }

  private async handleEvent(event: SystemEvent): Promise<void> {
    switch (event.type) {
      case 'USER_ACTION':
        await this.handleUserAction(event);
        break;
      case 'SYSTEM_CHANGE':
        await this.handleSystemChange(event);
        break;
      case 'BUSINESS_EVENT':
        await this.handleBusinessEvent(event);
        break;
    }
  }

  private async handleUserAction(event: SystemEvent): Promise<void> {
    // Converter ação do usuário em sinal
    const signal = this.userActionToSignal(event);
    if (signal) {
      this.memory.storeSignal(signal);
    }
  }

  private async handleSystemChange(event: SystemEvent): Promise<void> {
    // Atualizar ontologia com mudanças do sistema
    if (event.data.entity_type === 'USER') {
      const userEntity = EntityFactory.createUser(event.entity_id, event.data);
      this.ontology.addEntity(userEntity);
    }
  }

  private async handleBusinessEvent(event: SystemEvent): Promise<void> {
    // Processar eventos de negócio
    const signal = this.businessEventToSignal(event);
    if (signal) {
      this.memory.storeSignal(signal);
    }
  }

  private userActionToSignal(event: SystemEvent): Signal | null {
    const actionType = event.data.action_type;
    let signalType: SignalType;
    let value: number;

    switch (actionType) {
      case 'login':
        signalType = 'ENGAGEMENT';
        value = 0.6;
        break;
      case 'task_completion':
        signalType = 'PERFORMANCE';
        value = 0.8;
        break;
      case 'feedback_given':
        signalType = 'COLLABORATION';
        value = 0.7;
        break;
      case 'training_completed':
        signalType = 'LEARNING';
        value = 0.9;
        break;
      default:
        return null;
    }

    return {
      id: crypto.randomUUID(),
      type: signalType,
      entity_id: event.entity_id,
      value,
      context: 'PERFORMANCE_REVIEW',
      properties: event.data,
      metadata: {
        timestamp: event.timestamp,
        source: event.source,
        confidence: 0.7,
        impact_score: 0.5
      }
    };
  }

  private businessEventToSignal(event: SystemEvent): Signal | null {
    const eventType = event.data.event_type;
    let signalType: SignalType;
    let value: number;

    switch (eventType) {
      case 'goal_achieved':
        signalType = 'PERFORMANCE';
        value = 0.9;
        break;
      case 'deadline_missed':
        signalType = 'STRESS';
        value = 0.8;
        break;
      case 'promotion':
        signalType = 'GROWTH';
        value = 1.0;
        break;
      default:
        return null;
    }

    return {
      id: crypto.randomUUID(),
      type: signalType,
      entity_id: event.entity_id,
      value,
      context: 'PERFORMANCE_REVIEW',
      properties: event.data,
      metadata: {
        timestamp: event.timestamp,
        source: event.source,
        confidence: 0.9,
        impact_score: 0.8
      }
    };
  }

  // API para frontend
  async getEntityInsights(entityId: string, context: DecisionContext): Promise<BrainSysResponse> {
    try {
      const inferenceContext: InferenceContext = {
        entity_id: entityId,
        context,
        current_state: {},
        goals: [],
        constraints: {},
        priority: 'medium',
        metadata: {
          timestamp: new Date(),
          source: 'frontend_request',
          confidence_threshold: 0.7
        }
      };

      const result = await this.inference.generateInsights(inferenceContext);

      return {
        success: true,
        data: result,
        insights: result.insights,
        recommendations: result.insights.flatMap(i => i.suggested_actions),
        confidence: result.metadata.confidence_score
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  async getTeamInsights(teamId: string): Promise<BrainSysResponse> {
    try {
      // Buscar membros do time
      const teamMembers = await db
        .select()
        .from(collaborators)
        .where(eq(collaborators.department, teamId));

      const teamInsights = [];

      for (const member of teamMembers) {
        const memberInsights = await this.getEntityInsights(member.id, 'TEAM_FORMATION');
        if (memberInsights.success) {
          teamInsights.push({
            member_id: member.id,
            member_name: member.name,
            insights: memberInsights.insights
          });
        }
      }

      return {
        success: true,
        data: teamInsights,
        confidence: 0.8
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  async getSystemHealth(): Promise<BrainSysResponse> {
    try {
      const memoryInsights = this.memory.getMemoryInsights();
      const ontologyStats = {
        entities: this.ontology.exportGraph().entities.length,
        relations: this.ontology.exportGraph().relations.length
      };

      return {
        success: true,
        data: {
          memory: memoryInsights,
          ontology: ontologyStats,
          status: 'healthy',
          uptime: process.uptime()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  // Método para registrar ação do usuário
  async recordUserAction(userId: string, actionType: string, actionData: any): Promise<void> {
    const event: SystemEvent = {
      id: crypto.randomUUID(),
      type: 'USER_ACTION',
      entity_id: userId,
      data: { action_type: actionType, ...actionData },
      timestamp: new Date(),
      source: 'user_interface'
    };

    await this.processSystemEvent(event);
  }

  // Método para registrar mudança do sistema
  async recordSystemChange(entityId: string, changeType: string, changeData: any): Promise<void> {
    const event: SystemEvent = {
      id: crypto.randomUUID(),
      type: 'SYSTEM_CHANGE',
      entity_id: entityId,
      data: { change_type: changeType, ...changeData },
      timestamp: new Date(),
      source: 'system'
    };

    await this.processSystemEvent(event);
  }

  private startEventProcessing(): void {
    // Processar eventos periodicamente
    setInterval(() => {
      if (!this.isProcessing && this.eventQueue.length > 0) {
        this.processEventQueue();
      }
    }, 5000); // Processar a cada 5 segundos
  }
}

// Singleton para uso global
export const brainSysBridge = new BrainSysBridge();