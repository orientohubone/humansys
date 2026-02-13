
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Competency, CompetencyCategory, FeedbackTemplate, RatingScale } from '@/types/competencies';

// Mock data - em produção viria do Supabase
const MOCK_CATEGORIES: CompetencyCategory[] = [
  { id: '1', name: 'Técnicas', color: 'bg-blue-100 text-blue-800', icon: 'Code' },
  { id: '2', name: 'Comportamentais', color: 'bg-green-100 text-green-800', icon: 'Users' },
  { id: '3', name: 'Liderança', color: 'bg-purple-100 text-purple-800', icon: 'Crown' },
  { id: '4', name: 'Comunicação', color: 'bg-orange-100 text-orange-800', icon: 'MessageCircle' }
];

const MOCK_COMPETENCIES: Competency[] = [
  {
    id: '1',
    name: 'Resolução de Problemas',
    description: 'Capacidade de identificar, analisar e resolver problemas complexos',
    category: MOCK_CATEGORIES[1],
    weight: 0.2
  },
  {
    id: '2',
    name: 'Trabalho em Equipe',
    description: 'Habilidade para colaborar efetivamente com outros membros da equipe',
    category: MOCK_CATEGORIES[1],
    weight: 0.15
  },
  {
    id: '3',
    name: 'Conhecimento Técnico',
    description: 'Domínio das ferramentas e tecnologias necessárias para o cargo',
    category: MOCK_CATEGORIES[0],
    weight: 0.25
  },
  {
    id: '4',
    name: 'Comunicação Verbal',
    description: 'Capacidade de se expressar claramente de forma oral',
    category: MOCK_CATEGORIES[3],
    weight: 0.1
  },
  {
    id: '5',
    name: 'Tomada de Decisão',
    description: 'Habilidade para tomar decisões assertivas e bem fundamentadas',
    category: MOCK_CATEGORIES[2],
    weight: 0.15
  }
];

const DEFAULT_RATING_SCALE: RatingScale = {
  min: 1,
  max: 5,
  labels: {
    1: 'Abaixo do Esperado',
    2: 'Parcialmente Adequado',
    3: 'Adequado',
    4: 'Acima do Esperado',
    5: 'Excepcional'
  },
  colors: {
    1: 'bg-red-100 text-red-800',
    2: 'bg-orange-100 text-orange-800',
    3: 'bg-yellow-100 text-yellow-800',
    4: 'bg-blue-100 text-blue-800',
    5: 'bg-green-100 text-green-800'
  }
};

const MOCK_TEMPLATES: FeedbackTemplate[] = [
  {
    id: '1',
    name: 'Avaliação de Performance Anual',
    description: 'Template padrão para avaliações anuais de performance',
    competencies: ['1', '2', '3', '4', '5'],
    ratingScale: DEFAULT_RATING_SCALE,
    isDefault: true,
    category: 'performance'
  },
  {
    id: '2',
    name: 'Feedback 360°',
    description: 'Avaliação completa com múltiplas perspectivas',
    competencies: ['1', '2', '4', '5'],
    ratingScale: DEFAULT_RATING_SCALE,
    isDefault: false,
    category: '360'
  }
];

export const useCompetencies = () => {
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [categories, setCategories] = useState<CompetencyCategory[]>([]);
  const [templates, setTemplates] = useState<FeedbackTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setCompetencies(MOCK_COMPETENCIES);
      setCategories(MOCK_CATEGORIES);
      setTemplates(MOCK_TEMPLATES);
      setIsLoading(false);
    }, 500);
  }, []);

  const getCompetenciesByCategory = (categoryId: string) => {
    return competencies.filter(comp => comp.category.id === categoryId);
  };

  const getTemplateById = (templateId: string) => {
    return templates.find(template => template.id === templateId);
  };

  const getCompetencyById = (competencyId: string) => {
    return competencies.find(comp => comp.id === competencyId);
  };

  return {
    competencies,
    categories,
    templates,
    isLoading,
    getCompetenciesByCategory,
    getTemplateById,
    getCompetencyById,
    defaultRatingScale: DEFAULT_RATING_SCALE
  };
};
