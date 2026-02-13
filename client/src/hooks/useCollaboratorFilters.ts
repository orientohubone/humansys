
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ActiveFilter } from '@/components/collaborators/SmartFilters';

interface Collaborator {
  id: string;
  name: string;
  email: string;
  department: string;
  status: string;
  skills: string[];
  performance?: number;
  hireDate: string;
}

interface UseCollaboratorFiltersReturn {
  searchQuery: string;
  activeFilters: ActiveFilter[];
  filteredCollaborators: Collaborator[];
  setSearchQuery: (query: string) => void;
  setActiveFilters: (filters: ActiveFilter[]) => void;
  clearAllFilters: () => void;
  filterStats: {
    total: number;
    filtered: number;
    activeFiltersCount: number;
  };
}

// Mock data - em um cenário real, isso viria do Supabase
const MOCK_COLLABORATORS: Collaborator[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria.silva@empresa.com',
    department: 'desenvolvimento',
    status: 'ativo',
    skills: ['react', 'javascript', 'nodejs'],
    performance: 85,
    hireDate: '2023-01-15'
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao.santos@empresa.com',
    department: 'marketing',
    status: 'ativo',
    skills: ['design', 'data-analysis'],
    performance: 92,
    hireDate: '2022-08-20'
  },
  {
    id: '3',
    name: 'Ana Costa',
    email: 'ana.costa@empresa.com',
    department: 'rh',
    status: 'ferias',
    skills: ['javascript', 'design'],
    performance: 78,
    hireDate: '2023-03-10'
  },
  {
    id: '4',
    name: 'Pedro Lima',
    email: 'pedro.lima@empresa.com',
    department: 'desenvolvimento',
    status: 'ativo',
    skills: ['react', 'nodejs'],
    performance: 88,
    hireDate: '2023-05-22'
  },
  {
    id: '5',
    name: 'Carla Ferreira',
    email: 'carla.ferreira@empresa.com',
    department: 'financeiro',
    status: 'ativo',
    skills: ['data-analysis'],
    performance: 95,
    hireDate: '2022-11-05'
  }
];

export const useCollaboratorFilters = (
  collaborators: Collaborator[] = MOCK_COLLABORATORS
): UseCollaboratorFiltersReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setActiveFilters([]);
  }, []);

  const filteredCollaborators = useMemo(() => {
    let filtered = [...collaborators];

    // Aplicar busca por texto
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(collaborator =>
        collaborator.name.toLowerCase().includes(query) ||
        collaborator.email.toLowerCase().includes(query) ||
        collaborator.department.toLowerCase().includes(query) ||
        collaborator.skills.some(skill => skill.toLowerCase().includes(query))
      );
    }

    // Aplicar filtros ativos
    activeFilters.forEach(filter => {
      switch (filter.type) {
        case 'department':
          filtered = filtered.filter(c => c.department === filter.value);
          break;
        
        case 'status':
          filtered = filtered.filter(c => c.status === filter.value);
          break;
        
        case 'skills':
          filtered = filtered.filter(c => c.skills.includes(filter.value));
          break;
        
        case 'performance':
          if (Array.isArray(filter.value) && filter.value.length === 2) {
            const [min, max] = filter.value;
            filtered = filtered.filter(c => 
              c.performance !== undefined && 
              c.performance >= min && 
              c.performance <= max
            );
          }
          break;
        
        default:
          break;
      }
    });

    return filtered;
  }, [collaborators, searchQuery, activeFilters]);

  const filterStats = useMemo(() => ({
    total: collaborators.length,
    filtered: filteredCollaborators.length,
    activeFiltersCount: activeFilters.length + (searchQuery.trim() ? 1 : 0)
  }), [collaborators.length, filteredCollaborators.length, activeFilters.length, searchQuery]);

  return {
    searchQuery,
    activeFilters,
    filteredCollaborators,
    setSearchQuery,
    setActiveFilters,
    clearAllFilters,
    filterStats
  };
};
