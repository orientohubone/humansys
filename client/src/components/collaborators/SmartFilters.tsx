
import React, { useState } from 'react';
import { Filter, X, Calendar, Star, Users, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export interface FilterOption {
  id: string;
  label: string;
  value: string;
  type: 'department' | 'status' | 'performance' | 'skills' | 'date';
}

export interface ActiveFilter {
  id: string;
  type: string;
  label: string;
  value: any;
}

interface SmartFiltersProps {
  activeFilters: ActiveFilter[];
  onFiltersChange: (filters: ActiveFilter[]) => void;
  className?: string;
}

const DEPARTMENT_OPTIONS = [
  { id: 'dev', label: 'Desenvolvimento', value: 'desenvolvimento' },
  { id: 'mk', label: 'Marketing', value: 'marketing' },
  { id: 'rh', label: 'Recursos Humanos', value: 'rh' },
  { id: 'fin', label: 'Financeiro', value: 'financeiro' },
];

const STATUS_OPTIONS = [
  { id: 'active', label: 'Ativo', value: 'ativo' },
  { id: 'inactive', label: 'Inativo', value: 'inativo' },
  { id: 'vacation', label: 'Férias', value: 'ferias' },
  { id: 'leave', label: 'Licença', value: 'licenca' },
];

const SKILLS_OPTIONS = [
  { id: 'react', label: 'React', value: 'react' },
  { id: 'js', label: 'JavaScript', value: 'javascript' },
  { id: 'node', label: 'Node.js', value: 'nodejs' },
  { id: 'design', label: 'Design', value: 'design' },
  { id: 'data', label: 'Análise de Dados', value: 'data-analysis' },
];

export const SmartFilters: React.FC<SmartFiltersProps> = ({
  activeFilters,
  onFiltersChange,
  className
}) => {
  const [performanceRange, setPerformanceRange] = useState([0, 100]);

  const addFilter = (filter: ActiveFilter) => {
    const existing = activeFilters.find(f => f.id === filter.id);
    if (!existing) {
      onFiltersChange([...activeFilters, filter]);
    }
  };

  const removeFilter = (filterId: string) => {
    onFiltersChange(activeFilters.filter(f => f.id !== filterId));
  };

  const clearAllFilters = () => {
    onFiltersChange([]);
  };

  const handleDepartmentChange = (value: string) => {
    const option = DEPARTMENT_OPTIONS.find(opt => opt.value === value);
    if (option) {
      addFilter({
        id: `dept-${option.id}`,
        type: 'department',
        label: `Depto: ${option.label}`,
        value: option.value
      });
    }
  };

  const handleStatusChange = (value: string) => {
    const option = STATUS_OPTIONS.find(opt => opt.value === value);
    if (option) {
      addFilter({
        id: `status-${option.id}`,
        type: 'status',
        label: `Status: ${option.label}`,
        value: option.value
      });
    }
  };

  const handleSkillToggle = (skill: typeof SKILLS_OPTIONS[0], checked: boolean) => {
    if (checked) {
      addFilter({
        id: `skill-${skill.id}`,
        type: 'skills',
        label: `Skill: ${skill.label}`,
        value: skill.value
      });
    } else {
      removeFilter(`skill-${skill.id}`);
    }
  };

  const handlePerformanceFilter = () => {
    addFilter({
      id: 'performance-range',
      type: 'performance',
      label: `Performance: ${performanceRange[0]}% - ${performanceRange[1]}%`,
      value: performanceRange
    });
  };

  const isSkillActive = (skillId: string) => {
    return activeFilters.some(f => f.id === `skill-${skillId}`);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Department Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Briefcase className="mr-2 h-4 w-4" />
              Departamento
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 bg-background border border-border">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Filtrar por Departamento</h4>
              <Select onValueChange={handleDepartmentChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um departamento" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border">
                  {DEPARTMENT_OPTIONS.map(option => (
                    <SelectItem key={option.id} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>

        {/* Status Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Users className="mr-2 h-4 w-4" />
              Status
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 bg-background border border-border">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Filtrar por Status</h4>
              <Select onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border">
                  {STATUS_OPTIONS.map(option => (
                    <SelectItem key={option.id} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>

        {/* Skills Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Star className="mr-2 h-4 w-4" />
              Habilidades
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 bg-background border border-border">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Filtrar por Habilidades</h4>
              <div className="space-y-2">
                {SKILLS_OPTIONS.map(skill => (
                  <div key={skill.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill.id}
                      checked={isSkillActive(skill.id)}
                      onCheckedChange={(checked) => 
                        handleSkillToggle(skill, checked as boolean)
                      }
                    />
                    <label 
                      htmlFor={skill.id} 
                      className="text-sm cursor-pointer"
                    >
                      {skill.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Performance Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Star className="mr-2 h-4 w-4" />
              Performance
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 bg-background border border-border">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Filtrar por Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{performanceRange[0]}%</span>
                  <span>{performanceRange[1]}%</span>
                </div>
                <Slider
                  value={performanceRange}
                  onValueChange={setPerformanceRange}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
              <Button 
                onClick={handlePerformanceFilter}
                size="sm" 
                className="w-full"
              >
                Aplicar Filtro
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="mr-1 h-4 w-4" />
            Limpar ({activeFilters.length})
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map(filter => (
            <Badge 
              key={filter.id} 
              variant="secondary" 
              className="flex items-center gap-1 animate-fade-in"
            >
              {filter.label}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFilter(filter.id)}
                className="h-4 w-4 p-0 hover:bg-destructive/20"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
