
import { toast } from '@/components/ui/use-toast';

// Tipos para comunicação com BrainSys IAO
export interface BrainSysStatus {
  status: string;
  initialized: boolean;
  memory: {
    totalSignals: number;
    activePatterns: number;
    memoryUsage: number;
  };
  system: {
    status: string;
    uptime: number;
  };
  feedback: {
    adaptations_count: number;
    avg_confidence: number;
    learning_rate: number;
  };
}

export interface EntityInsight {
  entity_id: string;
  insight_type: string;
  description: string;
  confidence: number;
  suggested_actions: string[];
  metadata: {
    timestamp: string;
    source: string;
    context: string;
  };
}

export interface BrainSysResponse<T = any> {
  success: boolean;
  data?: T;
  insights?: EntityInsight[];
  recommendations?: string[];
  confidence?: number;
  error?: string;
}

class BrainSysService {
  private baseUrl = '/api/brainsys';
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        this.isInitialized = true;
        console.log('🧠 BrainSys IAO inicializado com sucesso');
        toast({
          title: "BrainSys IAO Ativo",
          description: "Inteligência organizacional inicializada",
        });
        return true;
      } else {
        console.error('❌ Erro ao inicializar BrainSys:', result.error);
        return false;
      }
    } catch (error) {
      console.error('❌ Erro na comunicação com BrainSys:', error);
      return false;
    }
  }

  async getSystemStatus(): Promise<BrainSysStatus | null> {
    try {
      const response = await fetch(`${this.baseUrl}/status`);
      const result = await response.json();
      
      if (response.ok) {
        return result;
      } else {
        console.error('❌ Erro ao obter status:', result.error);
        return null;
      }
    } catch (error) {
      console.error('❌ Erro na comunicação:', error);
      return null;
    }
  }

  async analyzeEntity(entityId: string, context: string = 'PERFORMANCE_REVIEW'): Promise<BrainSysResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/analyze-entity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entityId, context }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('❌ Erro ao analisar entidade:', error);
      return { success: false, error: 'Erro na análise' };
    }
  }

  async analyzeTeam(teamId: string): Promise<BrainSysResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/analyze-team`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('❌ Erro ao analisar equipe:', error);
      return { success: false, error: 'Erro na análise da equipe' };
    }
  }

  async recordUserAction(userId: string, actionType: string, actionData: any = {}): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/record-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, actionType, actionData }),
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('❌ Erro ao registrar ação:', error);
      return false;
    }
  }

  async getEntityInsights(entityId: string, context: string = 'PERFORMANCE_REVIEW'): Promise<BrainSysResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/insights/${entityId}?context=${context}`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('❌ Erro ao obter insights:', error);
      return { success: false, error: 'Erro ao obter insights' };
    }
  }

  async getMemoryInsights(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/memory-insights`);
      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao obter insights da memória:', error);
      return null;
    }
  }

  async getEntityPatterns(entityId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/patterns/${entityId}`);
      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao obter padrões:', error);
      return null;
    }
  }

  async getFeedbackMetrics(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/feedback-metrics`);
      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao obter métricas de feedback:', error);
      return null;
    }
  }

  // Método para verificar se o BrainSys está ativo
  isActive(): boolean {
    return this.isInitialized;
  }

  // Método para registrar automaticamente ações importantes
  async autoRecordAction(userId: string, action: string, data?: any): Promise<void> {
    if (this.isInitialized && userId) {
      await this.recordUserAction(userId, action, {
        timestamp: new Date().toISOString(),
        ...data
      });
    }
  }
}

// Instância singleton
export const brainSysService = new BrainSysService();

// Exportar tipos
export type {
  BrainSysStatus,
  EntityInsight,
  BrainSysResponse,
};
