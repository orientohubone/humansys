
import { DiscQuestion, DiscAnswer, DiscProfile, DiscReport, DiscInsight, DiscGamification, DiscBadge, DiscAchievement } from '@/types/disc';

class DiscService {
  // Perguntas padrão do DISC
  private discQuestions: DiscQuestion[] = [
    {
      id: '1',
      category: 'D',
      question: 'Como você aborda desafios e problemas?',
      options: [
        'Enfrento diretamente e tomo decisões rápidas',
        'Busco soluções criativas e envolvo outros',
        'Analiso cuidadosamente antes de agir',
        'Procuro métodos comprovados e sistemáticos'
      ]
    },
    {
      id: '2',
      category: 'I',
      question: 'Como você se comporta em situações sociais?',
      options: [
        'Assumo a liderança e dirijo as conversas',
        'Sou expressivo e gosto de interagir com todos',
        'Prefiro ouvir e dar suporte aos outros',
        'Observo e participo quando necessário'
      ]
    },
    {
      id: '3',
      category: 'S',
      question: 'Como você lida com mudanças?',
      options: [
        'Adapto-me rapidamente e vejo oportunidades',
        'Aceito bem se puder envolver outras pessoas',
        'Preciso de tempo para me ajustar',
        'Avalio cuidadosamente os impactos'
      ]
    },
    {
      id: '4',
      category: 'C',
      question: 'Como você aborda seu trabalho?',
      options: [
        'Foco em resultados e eficiência',
        'Gosto de variedade e interação',
        'Valorizo estabilidade e colaboração',
        'Priorizo qualidade e precisão'
      ]
    },
    {
      id: '5',
      category: 'D',
      question: 'Como você toma decisões?',
      options: [
        'De forma rápida e decisiva',
        'Considerando o impacto nas pessoas',
        'Com cautela e consultando outros',
        'Baseando-me em dados e análises'
      ]
    },
    {
      id: '6',
      category: 'I',
      question: 'Como você prefere comunicar-se?',
      options: [
        'Direto e objetivo',
        'Entusiasmado e expressivo',
        'Calmo e respeitoso',
        'Preciso e detalhado'
      ]
    },
    {
      id: '7',
      category: 'S',
      question: 'Como você trabalha em equipe?',
      options: [
        'Lidero e dirijo as atividades',
        'Motivo e energizo o grupo',
        'Colaboro e apoio os colegas',
        'Contribuo com análises e dados'
      ]
    },
    {
      id: '8',
      category: 'C',
      question: 'Como você lida com regras e procedimentos?',
      options: [
        'Questiono se são eficientes',
        'Adapto-as conforme necessário',
        'Sigo-as fielmente',
        'Estudo-as em detalhes'
      ]
    },
    {
      id: '9',
      category: 'D',
      question: 'Qual é seu estilo de liderança?',
      options: [
        'Autoritário e direto',
        'Inspirador e motivador',
        'Democrático e colaborativo',
        'Analítico e metódico'
      ]
    },
    {
      id: '10',
      category: 'I',
      question: 'Como você influencia outros?',
      options: [
        'Através de autoridade e pressão',
        'Com entusiasmo e persuasão',
        'Sendo confiável e consistente',
        'Com fatos e lógica'
      ]
    },
    {
      id: '11',
      category: 'S',
      question: 'Como você reage a conflitos?',
      options: [
        'Enfrento diretamente',
        'Procuro mediar e harmonizar',
        'Evito e busco estabilidade',
        'Analiso as causas'
      ]
    },
    {
      id: '12',
      category: 'C',
      question: 'Como você organiza seu trabalho?',
      options: [
        'Foco nos resultados principais',
        'Mantenho flexibilidade',
        'Sigo uma rotina estável',
        'Planejo detalhadamente'
      ]
    }
  ];

  getQuestions(): DiscQuestion[] {
    return this.discQuestions;
  }

  calculateProfile(answers: DiscAnswer[]): DiscProfile {
    if (!answers || answers.length === 0) {
      throw new Error('Respostas inválidas para calcular perfil');
    }

    const scores = { D: 0, I: 0, S: 0, C: 0 };
    
    // Calcular pontuações baseadas nas respostas
    answers.forEach(answer => {
      const question = this.discQuestions.find(q => q.id === answer.question_id);
      if (question) {
        const styleMapping = ['D', 'I', 'S', 'C'];
        const selectedStyle = styleMapping[answer.selected_option];
        if (selectedStyle) {
          scores[selectedStyle as keyof typeof scores] += 1;
        }
      }
    });

    // Normalizar pontuações para percentuais
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const normalizedScores = {
      dominance: Math.round((scores.D / total) * 100),
      influence: Math.round((scores.I / total) * 100),
      steadiness: Math.round((scores.S / total) * 100),
      conscientiousness: Math.round((scores.C / total) * 100)
    };

    // Determinar estilos primário e secundário
    const sortedStyles = Object.entries(normalizedScores)
      .sort(([,a], [,b]) => b - a)
      .map(([key]) => {
        const styleMap: { [key: string]: 'D' | 'I' | 'S' | 'C' } = {
          dominance: 'D',
          influence: 'I', 
          steadiness: 'S',
          conscientiousness: 'C'
        };
        return styleMap[key];
      });

    const insights = this.generateInsights(normalizedScores);
    const recommendations = this.getCareerRecommendations(sortedStyles[0]);

    return {
      id: crypto.randomUUID(),
      user_id: '',
      dominance: normalizedScores.dominance,
      influence: normalizedScores.influence,
      steadiness: normalizedScores.steadiness,
      conscientiousness: normalizedScores.conscientiousness,
      primary_style: sortedStyles[0],
      secondary_style: sortedStyles[1],
      completed_at: new Date().toISOString(),
      insights,
      recommendations
    };
  }

  private generateInsights(scores: any): DiscInsight[] {
    const insights: DiscInsight[] = [];

    // Análise de Dominância
    insights.push({
      category: 'Dominância',
      description: scores.dominance > 70 
        ? 'Você demonstra alta orientação para resultados e liderança'
        : scores.dominance > 40 
        ? 'Você apresenta características equilibradas de liderança'
        : 'Você prefere trabalhar em equipe e dar suporte',
      strength_level: scores.dominance,
      development_areas: scores.dominance < 50 
        ? ['Desenvolver assertividade', 'Praticar tomada de decisão'] 
        : ['Desenvolver paciência', 'Melhorar escuta ativa'],
      ai_prediction: this.generateAIPrediction('dominance', scores.dominance)
    });

    // Análise de Influência
    insights.push({
      category: 'Influência',
      description: scores.influence > 70
        ? 'Você tem excelentes habilidades sociais e de comunicação'
        : scores.influence > 40
        ? 'Você consegue se relacionar bem com outras pessoas'
        : 'Você prefere comunicação mais reservada e focada',
      strength_level: scores.influence,
      development_areas: scores.influence < 50
        ? ['Desenvolver habilidades de apresentação', 'Praticar networking']
        : ['Focar em detalhes', 'Melhorar escuta'],
      ai_prediction: this.generateAIPrediction('influence', scores.influence)
    });

    // Análise de Estabilidade
    insights.push({
      category: 'Estabilidade',
      description: scores.steadiness > 70
        ? 'Você valoriza estabilidade e trabalho em equipe'
        : scores.steadiness > 40
        ? 'Você equilibra bem estabilidade e mudanças'
        : 'Você adapta-se facilmente a mudanças',
      strength_level: scores.steadiness,
      development_areas: scores.steadiness < 50
        ? ['Desenvolver paciência', 'Melhorar trabalho em equipe']
        : ['Aumentar flexibilidade', 'Aceitar mudanças'],
      ai_prediction: this.generateAIPrediction('steadiness', scores.steadiness)
    });

    // Análise de Conscienciosidade
    insights.push({
      category: 'Conscienciosidade',
      description: scores.conscientiousness > 70
        ? 'Você tem alta atenção aos detalhes e qualidade'
        : scores.conscientiousness > 40
        ? 'Você equilibra qualidade e eficiência'
        : 'Você foca mais em resultados do que em detalhes',
      strength_level: scores.conscientiousness,
      development_areas: scores.conscientiousness < 50
        ? ['Atenção aos detalhes', 'Melhorar planejamento']
        : ['Aumentar velocidade', 'Focar em resultados'],
      ai_prediction: this.generateAIPrediction('conscientiousness', scores.conscientiousness)
    });

    return insights;
  }

  private generateAIPrediction(category: string, score: number): string {
    const predictions = {
      dominance: {
        high: 'IA prevê excelente performance em posições de liderança e gestão estratégica',
        medium: 'IA prevê bom desempenho em funções que requerem iniciativa e tomada de decisão',
        low: 'IA prevê maior sucesso em funções colaborativas e de suporte'
      },
      influence: {
        high: 'IA prevê grande sucesso em vendas, marketing e funções que envolvem persuasão',
        medium: 'IA prevê bom desempenho em funções que requerem comunicação interpessoal',
        low: 'IA prevê maior eficiência em trabalhos técnicos e analíticos'
      },
      steadiness: {
        high: 'IA prevê excelência em funções que requerem consistência e trabalho em equipe',
        medium: 'IA prevê adaptabilidade a diferentes ambientes de trabalho',
        low: 'IA prevê maior sucesso em ambientes dinâmicos e de mudança rápida'
      },
      conscientiousness: {
        high: 'IA prevê excelente performance em funções que requerem precisão e qualidade',
        medium: 'IA prevê equilíbrio entre qualidade e produtividade',
        low: 'IA prevê maior eficiência em funções que priorizam velocidade e resultados'
      }
    };

    const level = score > 70 ? 'high' : score > 40 ? 'medium' : 'low';
    return predictions[category as keyof typeof predictions][level];
  }

  generateReport(profile: DiscProfile): DiscReport {
    const styleDescriptions: Record<string, string> = {
      D: 'Dominante - Orientado para resultados, direto e determinado',
      I: 'Influente - Sociável, otimista e persuasivo',
      S: 'Estável - Paciente, confiável e colaborativo',
      C: 'Consciencioso - Preciso, analítico e sistemático'
    };

    return {
      profile,
      detailed_analysis: `Seu perfil ${styleDescriptions[profile.primary_style] || 'Não definido'} indica que você possui características únicas que podem ser potencializadas. Com ${this.getStyleScore(profile, profile.primary_style)}% no estilo primário, você demonstra forte tendência para comportamentos típicos desta categoria.`,
      career_recommendations: this.getCareerRecommendations(profile.primary_style),
      team_compatibility: this.getTeamCompatibility(profile),
      leadership_style: this.getLeadershipStyle(profile.primary_style),
      communication_preferences: this.getCommunicationPreferences(profile.primary_style),
      stress_indicators: this.getStressIndicators(profile.primary_style),
      growth_opportunities: this.getGrowthOpportunities(profile.primary_style)
    };
  }

  private getStyleScore(profile: DiscProfile, style: string): number {
    const scoreMap: Record<string, number> = {
      D: profile.dominance,
      I: profile.influence,
      S: profile.steadiness,
      C: profile.conscientiousness
    };
    return scoreMap[style] || 0;
  }

  getCareerRecommendations(style: string): string[] {
    const recommendations = {
      D: [
        'Posições de liderança e gestão',
        'Empreendedorismo e startups',
        'Vendas estratégicas',
        'Consultoria empresarial'
      ],
      I: [
        'Marketing e comunicação',
        'Vendas e relacionamento com clientes',
        'Recursos humanos',
        'Treinamento e desenvolvimento'
      ],
      S: [
        'Suporte ao cliente',
        'Gestão de projetos',
        'Recursos humanos',
        'Educação e ensino'
      ],
      C: [
        'Análise de dados',
        'Auditoria e compliance',
        'Pesquisa e desenvolvimento',
        'Engenharia e tecnologia'
      ]
    };
    return recommendations[style as keyof typeof recommendations] || [];
  }

  getTeamCompatibility(profile: DiscProfile): string {
    const compatibility = {
      D: 'Trabalha melhor com equipes orientadas para resultados e que aceitem liderança direta.',
      I: 'Prospera em equipes colaborativas e ambientes sociais dinâmicos.',
      S: 'Excelente em equipes estáveis que valorizam harmonia e cooperação.',
      C: 'Funciona bem em equipes que valorizam precisão e trabalho detalhado.'
    };
    return compatibility[profile.primary_style as keyof typeof compatibility] || '';
  }

  getLeadershipStyle(style: string): string {
    const styles = {
      D: 'Liderança direta e orientada para resultados, tomando decisões rápidas.',
      I: 'Liderança inspiradora e motivacional, focando no desenvolvimento da equipe.',
      S: 'Liderança colaborativa e democrática, priorizando o consenso.',
      C: 'Liderança analítica e metodológica, baseada em dados e processos.'
    };
    return styles[style as keyof typeof styles] || '';
  }

  getCommunicationPreferences(style: string): string[] {
    const preferences = {
      D: ['Comunicação direta e objetiva', 'Foco em resultados', 'Decisões rápidas'],
      I: ['Comunicação expressiva e entusiasmada', 'Interação social', 'Apresentações dinâmicas'],
      S: ['Comunicação calma e respeitosa', 'Escuta ativa', 'Consenso em grupo'],
      C: ['Comunicação precisa e detalhada', 'Informações completas', 'Documentação clara']
    };
    return preferences[style as keyof typeof preferences] || [];
  }

  getStressIndicators(style: string): string[] {
    const indicators = {
      D: ['Falta de controle', 'Processos lentos', 'Microgerenciamento'],
      I: ['Isolamento social', 'Tarefas repetitivas', 'Ambiente formal'],
      S: ['Mudanças súbitas', 'Conflitos', 'Pressão por velocidade'],
      C: ['Falta de informações', 'Decisões apressadas', 'Ambiente desorganizado']
    };
    return indicators[style as keyof typeof indicators] || [];
  }

  getGrowthOpportunities(style: string): string[] {
    const opportunities = {
      D: ['Desenvolver paciência', 'Melhorar escuta ativa', 'Trabalhar em equipe'],
      I: ['Foco em detalhes', 'Gestão do tempo', 'Análise crítica'],
      S: ['Assertividade', 'Adaptabilidade', 'Tomada de decisão'],
      C: ['Flexibilidade', 'Comunicação interpessoal', 'Tolerância a ambiguidade']
    };
    return opportunities[style as keyof typeof opportunities] || [];
  }

  generateGamificationData(profile: DiscProfile): DiscGamification {
    const badges: DiscBadge[] = [
      {
        id: '1',
        name: 'Primeiro Perfil',
        description: 'Completou sua primeira análise DISC',
        icon: 'brain',
        color: 'purple',
        earned_at: profile.completed_at
      },
      {
        id: '2',
        name: `Especialista ${profile.primary_style}`,
        description: `Identificado como perfil ${profile.primary_style}`,
        icon: 'star',
        color: this.getStyleColor(profile.primary_style),
        earned_at: profile.completed_at
      }
    ];

    const achievements: DiscAchievement[] = [
      {
        id: '1',
        title: 'Autoconhecimento',
        description: 'Complete sua primeira análise DISC',
        points: 100,
        unlocked: true,
        progress: 1,
        max_progress: 1
      },
      {
        id: '2',
        title: 'Evolução Contínua',
        description: 'Complete 3 análises DISC',
        points: 300,
        unlocked: false,
        progress: 1,
        max_progress: 3
      }
    ];

    return {
      badges,
      level: 1,
      experience_points: 100,
      achievements,
      progress_streak: 1
    };
  }

  private getStyleColor(style: string): string {
    const colors: Record<string, string> = {
      D: 'red',
      I: 'yellow',
      S: 'green',
      C: 'blue'
    };
    return colors[style] || 'gray';
  }

  async saveProfile(profile: DiscProfile, userId: string): Promise<void> {
    try {
      // Por enquanto apenas log, implementação real do Supabase seria aqui
      console.log('Salvando perfil DISC:', { profile, userId });
      // Simular sucesso
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      throw new Error('Não foi possível salvar o perfil');
    }
  }

  async getUserProfiles(userId: string): Promise<DiscProfile[]> {
    try {
      // Por enquanto retorna array vazio, implementação real do Supabase seria aqui
      console.log('Buscando perfis do usuário:', userId);
      return [];
    } catch (error) {
      console.error('Erro ao buscar perfis:', error);
      return [];
    }
  }
}

export const discService = new DiscService();
