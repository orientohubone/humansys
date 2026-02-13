
export interface OpenAIMessage {
  role: 'user' | 'assistant';
  content: string;
  agent?: string;
}

export interface OpenAIAssistantConfig {
  assistantId: string;
  apiKey: string;
}

export interface MultiAgentConfig {
  name: string;
  assistantId: string;
  specialty: string;
  description: string;
  active: boolean;
}

class OpenAIService {
  private config: OpenAIAssistantConfig | null = null;
  private multiAgents: MultiAgentConfig[] = [
    {
      name: 'BrainSys Recruiter',
      assistantId: '', // Will be set from config
      specialty: 'recruitment',
      description: 'Especialista em recrutamento, seleção e análise de perfis comportamentais',
      active: false
    },
    {
      name: 'BrainSys Wellness',
      assistantId: '', // Will be set from config  
      specialty: 'wellness',
      description: 'Especialista em bem-estar, saúde mental e qualidade de vida no trabalho',
      active: false
    },
    {
      name: 'BrainSys Analytics',
      assistantId: '', // Will be set from config
      specialty: 'analytics',
      description: 'Especialista em análise de dados, métricas preditivas e business intelligence',
      active: false
    },
    {
      name: 'BrainSys Strategy',
      assistantId: '', // Will be set from config
      specialty: 'strategy',
      description: 'Especialista em estratégia de RH, planejamento organizacional e tomada de decisões',
      active: false
    },
    {
      name: 'BrainSys Employer Branding',
      assistantId: '', // Will be set from config
      specialty: 'employer_branding',
      description: 'Especialista em marca empregadora, atração de talentos e reputação organizacional',
      active: false
    },
    {
      name: 'BrainSys Endomarketing',
      assistantId: '', // Will be set from config
      specialty: 'endomarketing',
      description: 'Especialista em comunicação interna, engajamento e marketing para colaboradores',
      active: false
    },
    {
      name: 'BrainSys Cultura',
      assistantId: '', // Will be set from config
      specialty: 'culture',
      description: 'Especialista em cultura organizacional, valores e transformação cultural',
      active: false
    },
    {
      name: 'BrainSys Clima',
      assistantId: '', // Will be set from config
      specialty: 'climate',
      description: 'Especialista em clima organizacional, satisfação e ambiente de trabalho',
      active: false
    }
  ];

  setConfig(config: OpenAIAssistantConfig) {
    this.config = config;
    // Ativar o agente principal
    this.multiAgents.forEach(agent => {
      agent.assistantId = config.assistantId;
      agent.active = true;
    });
  }

  getMultiAgents(): MultiAgentConfig[] {
    return this.multiAgents.filter(agent => agent.active);
  }

  async createSwarmThread(): Promise<string> {
    console.log('🐝 Criando thread para enxame de agentes...');
    return await this.createThread();
  }

  async createThread(): Promise<string> {
    if (!this.config) throw new Error('OpenAI config não definida');

    console.log('🤖 Criando thread OpenAI...');

    const response = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro ao criar thread:', response.status, errorText);
      throw new Error(`Erro ao criar thread: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Thread criada com sucesso:', data.id);
    return data.id;
  }

  async sendMessage(threadId: string, message: string): Promise<void> {
    if (!this.config) throw new Error('OpenAI config não definida');

    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        role: 'user',
        content: message
      })
    });

    if (!response.ok) {
      throw new Error(`Erro ao enviar mensagem: ${response.statusText}`);
    }
  }

  async runAssistant(threadId: string): Promise<string> {
    if (!this.config) throw new Error('OpenAI config não definida');

    // Criar uma execução
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        assistant_id: this.config.assistantId
      })
    });

    if (!runResponse.ok) {
      throw new Error(`Erro ao executar assistente: ${runResponse.statusText}`);
    }

    const runData = await runResponse.json();
    const runId = runData.id;

    // Aguardar conclusão da execução
    let status = 'in_progress';
    while (status === 'in_progress' || status === 'queued') {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });

      if (!statusResponse.ok) {
        throw new Error(`Erro ao verificar status: ${statusResponse.statusText}`);
      }

      const statusData = await statusResponse.json();
      status = statusData.status;

      if (status === 'failed') {
        throw new Error('Execução do assistente falhou');
      }
    }

    return runId;
  }

  async getMessages(threadId: string): Promise<OpenAIMessage[]> {
    if (!this.config) throw new Error('OpenAI config não definida');

    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar mensagens: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data
      .sort((a: any, b: any) => a.created_at - b.created_at)
      .map((msg: any) => ({
        role: msg.role,
        content: msg.content[0]?.text?.value || ''
      }));
  }

  async sendMessageAndGetResponse(threadId: string, message: string): Promise<string> {
    await this.sendMessage(threadId, message);
    await this.runAssistant(threadId);
    const messages = await this.getMessages(threadId);
    
    // Retorna a última mensagem do assistente
    const assistantMessages = messages.filter(m => m.role === 'assistant');
    return assistantMessages[assistantMessages.length - 1]?.content || 'Desculpe, não consegui gerar uma resposta.';
  }

  async executeSwarmConsultation(
    threadId: string, 
    query: string, 
    selectedAgents?: string[],
    onProgress?: (progress: number, step: string) => void
  ): Promise<{
    coordinator: string;
    specialists: { agent: string; response: string; }[];
    synthesis: string;
  }> {
    console.log('🐝 Executando consulta com enxame de agentes...');
    
    const activeAgents = selectedAgents || ['recruitment', 'analytics', 'strategy', 'culture', 'climate'];
    const totalSteps = 2 + activeAgents.length; // Coordenador + Especialistas + Síntese
    let currentStep = 0;

    const updateProgress = (step: string) => {
      currentStep++;
      const progress = Math.round((currentStep / totalSteps) * 100);
      onProgress?.(progress, step);
      console.log(`🐝 Progresso: ${progress}% - ${step}`);
    };

    try {
      // 1. Coordenador principal analisa a query
      updateProgress('Coordenador analisando consulta...');
      
      const coordinatorPrompt = `Como BrainSys IAO, faça uma análise CONCISA desta consulta em no máximo 3 parágrafos:

"${query}"

Especialistas disponíveis: Recruiter, Wellness, Analytics, Strategy, Employer Branding, Endomarketing, Culture, Climate.

Responda de forma objetiva com:
1. Análise principal da consulta
2. Especialistas mais relevantes
3. Abordagem recomendada`;

      await this.sendMessage(threadId, coordinatorPrompt);
      await Promise.race([
        this.runAssistant(threadId),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout do coordenador')), 30000))
      ]);
      
      let messages = await this.getMessages(threadId);
      const coordinatorResponse = messages[messages.length - 1]?.content || 'Análise do coordenador indisponível.';

      // 2. Executa consulta com especialistas de forma mais eficiente
      const specialists = [];
      
      for (let i = 0; i < activeAgents.length; i++) {
        const agentType = activeAgents[i];
        const agent = this.multiAgents.find(a => a.specialty === agentType);
        
        if (agent && agent.active) {
          updateProgress(`${agent.name} analisando...`);
          
          const specialistPrompt = `Como ${agent.name}, analise BREVEMENTE esta consulta em no máximo 2 parágrafos:

"${query}"

Forneça apenas:
- Insights específicos da sua área
- 2-3 recomendações práticas
- 1 alerta principal (se houver)

Seja direto e focado.`;

          try {
            await this.sendMessage(threadId, specialistPrompt);
            await Promise.race([
              this.runAssistant(threadId),
              new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout do ${agent.name}`)), 25000))
            ]);
            
            messages = await this.getMessages(threadId);
            const specialistResponse = messages[messages.length - 1]?.content || `Resposta do ${agent.name} indisponível.`;
            
            specialists.push({
              agent: agent.name,
              response: specialistResponse
            });
          } catch (error) {
            console.error(`❌ Erro com ${agent.name}:`, error);
            specialists.push({
              agent: agent.name,
              response: `${agent.name} temporariamente indisponível. Recomendo consultar este especialista novamente.`
            });
          }
        }
      }

      // 3. Síntese final otimizada
      updateProgress('Gerando síntese final...');
      
      const synthesisPrompt = `Como BrainSys IAO, crie uma síntese EXECUTIVA em no máximo 4 parágrafos:

CONSULTA: "${query}"

INSIGHTS DOS ESPECIALISTAS:
${specialists.map(s => `${s.agent}: ${s.response.substring(0, 300)}...`).join('\n\n')}

Forneça:
1. Conclusão principal
2. Top 3 ações prioritárias
3. Próximos passos
4. Alertas importantes

Seja objetivo e acionável.`;

      try {
        await this.sendMessage(threadId, synthesisPrompt);
        await Promise.race([
          this.runAssistant(threadId),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout da síntese')), 30000))
        ]);
        
        messages = await this.getMessages(threadId);
        const synthesis = messages[messages.length - 1]?.content || 'Síntese indisponível - consulte as respostas individuais dos especialistas.';

        onProgress?.(100, 'Consulta concluída!');
        
        return {
          coordinator: coordinatorResponse,
          specialists,
          synthesis
        };
      } catch (error) {
        console.error('❌ Erro na síntese:', error);
        return {
          coordinator: coordinatorResponse,
          specialists,
          synthesis: 'Síntese automática: Baseado nas análises dos especialistas, recomendo revisar cada resposta individual para uma compreensão completa da situação.'
        };
      }

    } catch (error) {
      console.error('❌ Erro na consulta do enxame:', error);
      throw new Error(`Falha na consulta do enxame: ${error.message}`);
    }
  }
}

export const openaiService = new OpenAIService();
