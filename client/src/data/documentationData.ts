
import { DocumentationItem } from '@/types/documentation';
import {
  BookOpen,
  DollarSign,
  TrendingUp,
  Target,
  AlertTriangle,
  BarChart3,
  Users,
  Settings,
  FileText,
  CheckCircle,
  Lightbulb,
  Shield,
  Zap,
  Globe,
  MessageSquare,
  Trophy,
  Clock,
  Heart,
  Brain,
  Crown,
  UserPlus,
  Video,
  Calendar,
  PieChart,
  Database,
  Lock,
  Smartphone,
  Star,
  Search,
  Filter,
  Download,
  Upload,
  Share,
  Edit,
  Eye,
  Trash,
  Plus,
  Minus,
  RefreshCw,
  Save,
  Copy,
  Mail,
  Phone,
  MapPin,
  Camera,
  Mic,
  Volume2,
  Play,
  Pause,
  Stop,
  SkipForward,
  SkipBack,
  FastForward,
  Rewind
} from 'lucide-react';

export const documentationData: DocumentationItem[] = [
  {
    id: 'manual-sistema-completo',
    title: 'Manual Completo do Sistema HumanSys',
    description: 'Guia definitivo para usar todas as funcionalidades da plataforma de RH com IA',
    category: 'manual-sistema',
    categoryLabel: 'Manual do Sistema',
    icon: BookOpen,
    estimatedReadTime: 45,
    lastUpdated: '2025-01-20',
    downloadUrl: '/docs/manual-sistema-completo.pdf',
    content: [
      {
        title: '1. Introdução ao HumanSys',
        description: 'Visão geral da plataforma e seus objetivos',
        icon: Brain,
        items: [
          'O que é o HumanSys: Plataforma completa de gestão de RH com IA integrada',
          'Principais benefícios: Automação de 80% das tarefas, insights preditivos, análise comportamental',
          'Público-alvo: Empresas de 10 a 1000+ colaboradores que buscam digitalização do RH',
          'Visão geral da arquitetura: Interface intuitiva + IA BrainSys + Analytics avançado',
          'Diferencial competitivo: Primeira plataforma brasileira com IA nativa para RH'
        ]
      },
      {
        title: '2. Primeiros Passos e Configuração',
        description: 'Como configurar e começar a usar o sistema',
        icon: Settings,
        items: [
          'Criação de conta: Cadastro empresarial, definição de administrador principal',
          'Configuração inicial: Dados da empresa, logo, cores, personalização da marca',
          'Estrutura organizacional: Criação de departamentos, cargos, níveis hierárquicos',
          'Configuração de permissões: Definição de roles (Admin, RH, Gestor, Colaborador)',
          'Integração com sistemas: Conectar com folha de pagamento, e-mail corporativo, calendário',
          'Importação de dados: Upload em massa de colaboradores via CSV/Excel',
          'Configuração de notificações: E-mail, SMS, push notifications',
          'Personalização da interface: Temas, layout, widgets do dashboard'
        ]
      },
      {
        title: '3. Dashboard Principal',
        description: 'Centro de comando da plataforma',
        icon: PieChart,
        items: [
          'Visão geral: Métricas principais, KPIs de RH, alertas inteligentes',
          'Widgets personalizáveis: Colaboradores ativos, aniversariantes, ausências, metas',
          'Gráficos e analytics: Crescimento da equipe, turnover, engajamento, produtividade',
          'Centro de notificações: Tarefas pendentes, aprovações, lembretes automáticos',
          'Acesso rápido: Shortcuts para funções mais usadas',
          'IA Assistant: Chat inteligente 24/7 para dúvidas e orientações',
          'Modo escuro/claro: Alternância de temas conforme preferência',
          'Exportação de dados: Relatórios em PDF, Excel, CSV'
        ]
      },
      {
        title: '4. Gestão de Colaboradores',
        description: 'Administre informações completas da sua equipe',
        icon: Users,
        items: [
          'Cadastro de colaboradores: Dados pessoais, profissionais, documentos, fotos',
          'Organização por departamentos: Estrutura hierárquica, subordinação, equipes',
          'Controle de status: Ativo, inativo, férias, licença, afastamento',
          'Histórico profissional: Promoções, transferências, mudanças de cargo',
          'Documentos anexos: Contratos, certidões, diplomas, certificações',
          'Filtros inteligentes: Busca por cargo, departamento, tempo de empresa, idade',
          'Análise DISC integrada: Perfil comportamental de cada colaborador',
          'Gestão de dependentes: Cadastro de familiares, plano de saúde',
          'Controle de acesso: Definir permissões específicas por colaborador',
          'Exportação de dados: Relatórios personalizados, listas por critérios'
        ]
      },
      {
        title: '5. Análise DISC com IA',
        description: 'Mapeamento comportamental avançado',
        icon: Brain,
        items: [
          'O que é DISC: Metodologia para análise de perfis comportamentais',
          'Como funciona: 24 perguntas estratégicas com análise por IA em 5 minutos',
          'Tipos de perfil: Dominante, Influente, Estável, Cauteloso e combinações',
          'Aplicação de testes: Individual, em grupo, para novos funcionários',
          'Interpretação de resultados: Gráficos visuais, percentuais, descrições detalhadas',
          'Relatórios automáticos: PDF personalizado com recomendações específicas',
          'Uso estratégico: Formação de equipes, desenvolvimento, resolução de conflitos',
          'Histórico de testes: Acompanhar evolução dos perfis ao longo do tempo',
          'Comparação de perfis: Compatibilidade entre colegas, gestores e subordinados',
          'Integração com recrutamento: Usar DISC na seleção de candidatos'
        ]
      },
      {
        title: '6. Brainsys IAO (Inteligência Artificial Organizacional)',
        description: 'Núcleo de IA da plataforma',
        icon: Zap,
        items: [
          'Visão geral do IAO: Sistema de IA proprietário para insights organizacionais',
          'Análises preditivas: Previsão de turnover, identificação de talentos',
          'Recomendações automáticas: Sugestões de treinamento, promoções, ajustes',
          'Detecção de padrões: Comportamentos, tendências, anomalias na equipe',
          'Alertas inteligentes: Notificações sobre riscos, oportunidades, ações necessárias',
          'Aprendizado contínuo: Sistema evolui com dados da empresa',
          'Dashboard específico: Métricas de IA, confiabilidade das predições',
          'Configuração de parâmetros: Ajustar sensibilidade, critérios, alertas',
          'Histórico de insights: Acompanhar acuracidade das previsões',
          'Integração com outros módulos: IA presente em toda a plataforma'
        ]
      },
      {
        title: '7. Onboarding Estruturado',
        description: 'Integração profissional de novos colaboradores',
        icon: UserPlus,
        items: [
          'Criação de jornadas: Definir etapas do processo de integração',
          'Templates personalizáveis: Modelos por cargo, departamento, senioridade',
          'Checklist automático: Tarefas obrigatórias, documentos, treinamentos',
          'Gamificação: Pontos, badges, progresso visual para engajar',
          'Vídeos de boas-vindas: Upload e organização de conteúdo audiovisual',
          'Mentor assignment: Designar padrinhos/mentores para novos colaboradores',
          'Feedback contínuo: Avaliações durante o período de experiência',
          'Métricas de sucesso: Tempo de adaptação, satisfação, produtividade inicial',
          'Automatização: Envio de e-mails, criação de usuários, agenda de reuniões',
          'Acompanhamento pós-integração: Follow-up 30, 60, 90 dias'
        ]
      },
      {
        title: '8. Sistema de Feedback 360°',
        description: 'Avaliações completas e estruturadas',
        icon: MessageSquare,
        items: [
          'Configuração de ciclos: Definir períodos, participantes, critérios',
          'Tipos de avaliação: Auto-avaliação, gestor, pares, subordinados, clientes',
          'Questionários personalizados: Criar perguntas específicas por cargo/objetivo',
          'Escala de avaliação: Likert, notas, comentários qualitativos',
          'Anonimato configurável: Garantir honestidade nas respostas',
          'Relatórios automáticos: Gráficos comparativos, pontos fortes/fracos',
          'Planos de desenvolvimento: PDI automático baseado nos resultados',
          'Histórico evolutivo: Acompanhar progresso ao longo dos ciclos',
          'Calibração de avaliadores: Treinamento para padronizar critérios',
          'Exportação de resultados: Relatórios individuais e consolidados'
        ]
      },
      {
        title: '9. Gestão de Metas e PDI',
        description: 'Desenvolvimento individual e coletivo',
        icon: Target,
        items: [
          'Criação de metas: SMART goals, OKRs, metas individuais e de equipe',
          'Cascateamento: Desdobrar objetivos estratégicos em metas operacionais',
          'Acompanhamento visual: Progress bars, gráficos, status em tempo real',
          'Check-ins regulares: 1:1s estruturados, revisões de progresso',
          'PDI automático: Planos baseados em análises DISC e feedback 360°',
          'Biblioteca de ações: Sugestões de treinamentos, cursos, experiências',
          'Gamificação: Pontos por metas atingidas, rankings, reconhecimento',
          'Alertas de prazo: Notificações sobre deadlines, marcos importantes',
          'Análise de performance: Correlação entre metas e resultados da empresa',
          'Modelos de carreira: Trilhas de desenvolvimento por função'
        ]
      },
      {
        title: '10. Plataforma de Treinamentos',
        description: 'Desenvolvimento e capacitação integrados',
        icon: Video,
        items: [
          'Catálogo de cursos: Biblioteca interna e externa, categorização por tema',
          'Upload de conteúdo: Vídeos, PDFs, apresentações, links externos',
          'Trilhas de aprendizagem: Sequências lógicas de cursos por cargo/objetivo',
          'Certificações: Emissão automática de certificados com QR Code',
          'Avaliações de conhecimento: Quizzes, provas, validação de aprendizado',
          'Tracking de progresso: Tempo gasto, conclusões, notas obtidas',
          'Recomendações por IA: Sugestões baseadas em perfil DISC e gaps identificados',
          'Integração externa: Udemy, Coursera, LinkedIn Learning, universidades',
          'Métricas de efetividade: ROI do treinamento, impacto na performance',
          'Calendário de capacitação: Agenda de turmas, instrutores, salas'
        ]
      },
      {
        title: '11. Reuniões 1:1 Inteligentes',
        description: 'Gestão estratégica de conversas individuais',
        icon: Calendar,
        items: [
          'Agendamento automático: Recorrência configurável, lembretes automáticos',
          'Templates de pauta: Estruturas pré-definidas por tipo de reunião',
          'Preparação inteligente: IA sugere tópicos baseados em dados do colaborador',
          'Atas automáticas: Registro de decisões, action items, próximos passos',
          'Integração com calendário: Outlook, Google Calendar, Teams',
          'Métricas de qualidade: Frequência, duração, satisfação dos participantes',
          'Follow-up automático: Lembretes de compromissos assumidos',
          'Análise de tendências: Temas recorrentes, evolução de questões',
          'Feedback sobre gestores: Avaliação da qualidade das conversas',
          'Histórico completo: Registro de todas as reuniões e evoluções'
        ]
      },
      {
        title: '12. Gamificação Corporativa',
        description: 'Engajamento através de elementos de jogo',
        icon: Trophy,
        items: [
          'Sistema de pontos: Critérios configuráveis por ação/comportamento',
          'Badges e conquistas: Reconhecimento visual por marcos atingidos',
          'Rankings e leaderboards: Competições saudáveis entre equipes',
          'Níveis e progressão: Sistema de evolução baseado em performance',
          'Recompensas: Integração com RH para benefícios tangíveis',
          'Desafios temporários: Campanhas específicas, eventos sazonais',
          'Social features: Comentários, likes, compartilhamentos internos',
          'Personalização: Adaptar sistema por departamento, cultura da empresa',
          'Métricas de engajamento: Participação, evolução, impacto nos resultados',
          'Configuração de regras: Definir comportamentos que geram pontos'
        ]
      },
      {
        title: '13. Relatórios e Analytics',
        description: 'Business Intelligence para RH',
        icon: BarChart3,
        items: [
          'Dashboard executivo: KPIs estratégicos para C-level e diretoria',
          'Relatórios pré-configurados: Turnover, absenteísmo, produtividade, custos',
          'Builder de relatórios: Construir análises customizadas com drag-and-drop',
          'Drill-down analytics: Navegar de dados consolidados para detalhes específicos',
          'Análise temporal: Comparar períodos, identificar tendências, sazonalidades',
          'Benchmarking: Comparar métricas com mercado, setor, empresas similares',
          'Predições com IA: Projeções de cenários futuros baseados em dados históricos',
          'Alertas automáticos: Notificações quando métricas saem do esperado',
          'Exportação avançada: PDFs executivos, planilhas detalhadas, APIs',
          'Agendamento de relatórios: Envio automático para stakeholders'
        ]
      },
      {
        title: '14. Módulos Especializados',
        description: 'Funcionalidades avançadas por área',
        icon: Database,
        items: [
          'Recrutamento e Seleção: ATS integrado, pipeline de candidatos, análise de CVs',
          'Pesquisas e Surveys: Constructor de questionários, Net Promoter Score, clima organizacional',
          'Gestão de Documentos: Repositório central, controle de versões, assinaturas digitais',
          'Certificações: Templates personalizáveis, validação por QR Code, tracking',
          'Segurança e Compliance: Logs de auditoria, controle de acesso, LGPD',
          'Mobile App: Acesso completo via smartphone, push notifications',
          'API e Integrações: Conectar com ERPs, folha de pagamento, ferramentas existentes',
          'Wellness: Acompanhamento de bem-estar, programas de saúde mental',
          'Carreiras: Planos de sucessão, mapeamento de talentos, job rotation',
          'Inovação: Banco de ideias, programas de inovação interna'
        ]
      },
      {
        title: '15. Configurações Avançadas',
        description: 'Personalização profunda do sistema',
        icon: Settings,
        items: [
          'Configurações de empresa: Dados fiscais, endereços, múltiplas filiais',
          'Gerenciamento de usuários: Criação, edição, desativação, bulk operations',
          'Políticas de senha: Complexidade, expiração, histórico, 2FA',
          'Customização de campos: Adicionar campos específicos da empresa',
          'Workflows automatizados: Criar fluxos de aprovação, processos customizados',
          'Integrações via API: Configurar conexões com sistemas externos',
          'Backup e restauração: Políticas de backup, recuperação de dados',
          'Configurações de e-mail: SMTP próprio, templates personalizados',
          'Auditoria e logs: Rastreamento de ações, relatórios de segurança',
          'Configurações de IA: Ajustar parâmetros do BrainSys IAO'
        ]
      },
      {
        title: '16. Segurança e Compliance',
        description: 'Proteção de dados e conformidade legal',
        icon: Shield,
        items: [
          'LGPD Compliance: Ferramentas para adequação à Lei Geral de Proteção de Dados',
          'Criptografia: Dados em trânsito e em repouso protegidos',
          'Controle de acesso: Autenticação multifator, SSO, permissões granulares',
          'Auditoria completa: Logs de todas as ações, relatórios de conformidade',
          'Backup automático: Redundância de dados, disaster recovery',
          'Certificações: ISO 27001, SOC 2, outras certificações de segurança',
          'Políticas de retenção: Controle sobre tempo de armazenamento de dados',
          'Anonimização: Ferramentas para anonimizar dados pessoais',
          'Consentimento digital: Gestão de termos de uso, políticas de privacidade',
          'Incidentes de segurança: Protocolo de resposta, notificações'
        ]
      },
      {
        title: '17. Mobile App',
        description: 'Acesso móvel completo',
        icon: Smartphone,
        items: [
          'Aplicativo nativo: iOS e Android com todas as funcionalidades',
          'Offline mode: Funcionar mesmo sem conexão com sincronização posterior',
          'Push notifications: Alertas em tempo real, configuráveis por usuário',
          'Biometria: Login por digital, face ID, autenticação segura',
          'Geolocalização: Check-in por localização, controle de presença',
          'Camera integration: Upload de documentos, fotos de perfil',
          'Assinatura digital: Assinar documentos diretamente pelo celular',
          'Chat interno: Comunicação entre colaboradores, grupos de trabalho',
          'Dashboard mobile: Versão otimizada para telas menores',
          'Sincronização: Dados sempre atualizados entre web e mobile'
        ]
      },
      {
        title: '18. Integrações e API',
        description: 'Conectividade com outros sistemas',
        icon: Globe,
        items: [
          'API RESTful: Endpoints para todas as funcionalidades principais',
          'Webhooks: Notificações automáticas para sistemas externos',
          'Integração com ERPs: SAP, Oracle, Totvs, Microsiga',
          'Folha de pagamento: Domínio Sistemas, Senior, RM, outros',
          'E-mail e calendário: Outlook, Gmail, Google Calendar, Exchange',
          'Videoconferência: Teams, Zoom, Google Meet, integração nativa',
          'Ferramentas de produtividade: Slack, Microsoft 365, Google Workspace',
          'Sistemas de ponto: Integração com relógios de ponto eletrônicos',
          'Marketplace: Conectar com app stores corporativos',
          'Documentação técnica: Guias completos para desenvolvedores'
        ]
      },
      {
        title: '19. Suporte e Treinamento',
        description: 'Recursos para sucesso do cliente',
        icon: Heart,
        items: [
          'Onboarding assistido: Implementação guiada por especialistas',
          'Treinamento de usuários: Capacitação de administradores e usuários finais',
          'Central de ajuda: Base de conhecimento, FAQs, tutoriais em vídeo',
          'Suporte técnico: Chat, e-mail, telefone, atendimento especializado',
          'Customer Success: Acompanhamento proativo, métricas de sucesso',
          'Webinars regulares: Sessões sobre novidades, melhores práticas',
          'Comunidade de usuários: Fórum para troca de experiências',
          'Consultoria estratégica: Orientação sobre melhores práticas de RH',
          'Updates automáticos: Novas funcionalidades sem necessidade de reinstalação',
          'SLA garantido: Tempo de resposta assegurado por contrato'
        ]
      },
      {
        title: '20. Métricas e ROI',
        description: 'Demonstração de valor e resultados',
        icon: TrendingUp,
        items: [
          'ROI Calculator: Ferramenta para calcular retorno do investimento',
          'Métricas de adoção: Uso da plataforma, engajamento dos usuários',
          'Tempo economizado: Quantificação de horas poupadas em processos manuais',
          'Redução de turnover: Impacto da IA na retenção de talentos',
          'Melhoria de performance: Correlação entre uso da ferramenta e resultados',
          'Benchmarking de mercado: Comparação com indicadores do setor',
          'Análise de custos: Comparativo com soluções tradicionais de RH',
          'Cases de sucesso: Exemplos reais de clientes e resultados obtidos',
          'Relatórios de valor: Documentos executivos para justificar investimento',
          'Projeções futuras: Estimativas de impacto a médio e longo prazo'
        ]
      }
    ]
  },
  {
    id: 'estrategias-vendas',
    title: 'Estratégias de Vendas B2B',
    description: 'Metodologias e processos para maximizar vendas corporativas',
    category: 'vendas',
    categoryLabel: 'Manual de Vendas',
    icon: DollarSign,
    estimatedReadTime: 12,
    lastUpdated: '2024-01-10',
    content: [
      {
        title: 'Qualificação de Leads',
        description: 'Como identificar e qualificar prospects ideais',
        icon: Target,
        items: [
          'Critérios de ICP (Ideal Customer Profile)',
          'Framework BANT (Budget, Authority, Need, Timeline)',
          'Técnicas de descoberta de dor',
          'Scorecard de qualificação'
        ]
      },
      {
        title: 'Processo de Vendas',
        description: 'Metodologia estruturada para fechar negócios',
        icon: CheckCircle,
        items: [
          'Mapeamento da jornada do cliente',
          'Scripts de abordagem e apresentação',
          'Tratamento de objeções comuns',
          'Técnicas de fechamento'
        ]
      },
      {
        title: 'Follow-up e Relacionamento',
        description: 'Mantenha relacionamentos duradouros com clientes',
        icon: Heart,
        items: [
          'Cronograma de follow-up estruturado',
          'Estratégias de upsell e cross-sell',
          'Programa de fidelização',
          'Gestão de reclamações e suporte'
        ]
      }
    ]
  },
  {
    id: 'marketing-digital',
    title: 'Marketing Digital para RH Tech',
    description: 'Estratégias de marketing específicas para o setor de RH e tecnologia',
    category: 'marketing',
    categoryLabel: 'Manual de Marketing',
    icon: TrendingUp,
    estimatedReadTime: 10,
    lastUpdated: '2024-01-08',
    content: [
      {
        title: 'Content Marketing',
        description: 'Criação de conteúdo relevante para RH',
        icon: FileText,
        items: [
          'Calendário editorial mensal',
          'Templates de posts para LinkedIn',
          'E-books e whitepapers sobre RH',
          'Cases de sucesso e depoimentos'
        ]
      },
      {
        title: 'Campanhas Digitais',
        description: 'Estratégias de mídia paga e orgânica',
        icon: Globe,
        items: [
          'Campanhas no LinkedIn Ads',
          'Google Ads para palavras-chave de RH',
          'Email marketing segmentado',
          'Webinars e eventos online'
        ]
      },
      {
        title: 'SEO e Presença Online',
        description: 'Otimização para mecanismos de busca',
        icon: Zap,
        items: [
          'Palavras-chave relevantes para RH',
          'Otimização de landing pages',
          'Link building com sites de RH',
          'Google My Business otimizado'
        ]
      }
    ]
  },
  {
    id: 'proposta-valor-unica',
    title: 'Proposta de Valor Única',
    description: 'Diferenciais competitivos e benefícios únicos da nossa solução',
    category: 'proposta-valor',
    categoryLabel: 'Proposta de Valor',
    icon: Trophy,
    estimatedReadTime: 8,
    lastUpdated: '2024-01-12',
    content: [
      {
        title: 'Diferenciais Tecnológicos',
        description: 'O que nos torna únicos no mercado',
        icon: Lightbulb,
        items: [
          'IA integrada para análise preditiva',
          'Interface intuitiva e user-friendly',
          'Integração com 50+ sistemas',
          'Segurança enterprise com ISO 27001'
        ]
      },
      {
        title: 'Benefícios Quantificáveis',
        description: 'Resultados mensuráveis para nossos clientes',
        icon: BarChart3,
        items: [
          'Redução de 60% no tempo de processos de RH',
          'Aumento de 40% no engajamento dos colaboradores',
          'ROI médio de 300% em 12 meses',
          'Diminuição de 80% em retrabalho administrativo'
        ]
      },
      {
        title: 'Suporte e Acompanhamento',
        description: 'Compromisso com o sucesso do cliente',
        icon: Shield,
        items: [
          'Customer Success dedicado',
          'Onboarding personalizado',
          'Suporte 24/7 em português',
          'Treinamentos mensais gratuitos'
        ]
      }
    ]
  },
  {
    id: 'dores-empresas-rh',
    title: 'Principais Dores das Empresas em RH',
    description: 'Problemas comuns que nossa solução resolve efetivamente',
    category: 'dores-empresas',
    categoryLabel: 'Dores das Empresas',
    icon: AlertTriangle,
    estimatedReadTime: 7,
    lastUpdated: '2024-01-05',
    content: [
      {
        title: 'Gestão Manual e Ineficiente',
        description: 'Processos manuais que consomem tempo excessivo',
        icon: Clock,
        items: [
          'Planilhas desatualizadas e descentralizadas',
          'Retrabalho constante em tarefas administrativas',
          'Dificuldade em encontrar informações rapidamente',
          'Erros humanos em cálculos e relatórios'
        ]
      },
      {
        title: 'Falta de Visibilidade e Controle',
        description: 'Ausência de dados para tomada de decisão',
        icon: BarChart3,
        items: [
          'Impossibilidade de gerar relatórios em tempo real',
          'Falta de métricas de performance e engajamento',
          'Dificuldade em identificar tendências e padrões',
          'Ausência de dashboards executivos'
        ]
      },
      {
        title: 'Comunicação e Engajamento',
        description: 'Desafios na comunicação interna',
        icon: MessageSquare,
        items: [
          'Feedback esporádico e pouco estruturado',
          'Baixo engajamento dos colaboradores',
          'Dificuldade em manter equipes alinhadas',
          'Falta de transparência nos processos'
        ]
      }
    ]
  },
  {
    id: 'benchmarks-mercado',
    title: 'Benchmarks e Dados de Mercado',
    description: 'Estatísticas e comparativos do setor de RH e tecnologia',
    category: 'benchmarks',
    categoryLabel: 'Benchmarks',
    icon: BarChart3,
    estimatedReadTime: 6,
    lastUpdated: '2024-01-03',
    externalUrl: 'https://rh-insights.com/benchmarks',
    content: [
      {
        title: 'Mercado de HR Tech no Brasil',
        description: 'Dados atualizados sobre o crescimento do setor',
        icon: TrendingUp,
        items: [
          'Mercado de R$ 2,3 bilhões em 2024',
          'Crescimento de 25% ao ano',
          '78% das empresas investem em digitalização do RH',
          'ROI médio de 280% em soluções de RH'
        ]
      },
      {
        title: 'Comparativo com Concorrentes',
        description: 'Nossa posição no mercado nacional',
        icon: Trophy,
        items: [
          'Top 3 em satisfação do cliente (NPS 72)',
          '40% mais rápido que a concorrência',
          'Preço 30% mais competitivo',
          'Única solução com IA nativa'
        ]
      },
      {
        title: 'Tendências para 2024-2025',
        description: 'Para onde o mercado está caminhando',
        icon: Globe,
        items: [
          'IA e automação em 85% das empresas',
          'People Analytics como diferencial',
          'Employee Experience prioritário',
          'Integração com ferramentas de produtividade'
        ]
      }
    ]
  }
];
