import React from 'react';
import { CollaboratorCard } from './CollaboratorCard';
import { AdvancedSearch } from './AdvancedSearch';
import { SmartFilters, ActiveFilter } from './SmartFilters';
import { useCollaboratorFilters } from '@/hooks/useCollaboratorFilters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Filter, Search, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CollaboratorsListProps {
  onAddCollaborator?: () => void;
  className?: string;
}

export const CollaboratorsList: React.FC<CollaboratorsListProps> = ({
  onAddCollaborator,
  className
}) => {
  const { toast } = useToast();
  const {
    searchQuery,
    activeFilters,
    filteredCollaborators,
    setSearchQuery,
    setActiveFilters,
    clearAllFilters,
    filterStats
  } = useCollaboratorFilters();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSuggestionSelect = (suggestion: any) => {
    console.log('Suggestion selected:', suggestion);
    // Implementar lógica específica para diferentes tipos de sugestões
  };

  const handleFiltersChange = (filters: ActiveFilter[]) => {
    setActiveFilters(filters);
  };

  const handleViewProfile = (id: string) => {
    toast({
      title: "Visualizar Perfil",
      description: `Abrindo perfil do colaborador ${id}`
    });
  };

  const handleSendFeedback = (id: string) => {
    toast({
      title: "Enviar Feedback",
      description: `Abrindo formulário de feedback para colaborador ${id}`
    });
  };

  const handleViewPerformance = (id: string) => {
    toast({
      title: "Ver Performance",
      description: `Abrindo dashboard de performance do colaborador ${id}`
    });
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Colaboradores</h2>
          <p className="text-muted-foreground">
            {filterStats.filtered} de {filterStats.total} colaboradores
            {filterStats.activeFiltersCount > 0 && (
              <span className="ml-2 text-primary">
                ({filterStats.activeFiltersCount} filtro{filterStats.activeFiltersCount > 1 ? 's' : ''} ativo{filterStats.activeFiltersCount > 1 ? 's' : ''})
              </span>
            )}
          </p>
        </div>
        <Button onClick={onAddCollaborator}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Colaborador
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <AdvancedSearch
                onSearch={handleSearch}
                onSuggestionSelect={handleSuggestionSelect}
                placeholder="Pesquisar por nome, email, departamento ou habilidade..."
              />
            </div>
          </div>

          <SmartFilters
            activeFilters={activeFilters}
            onFiltersChange={handleFiltersChange}
          />
        </CardContent>
      </Card>

      {/* Results */}
      {filteredCollaborators.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {filterStats.activeFiltersCount > 0 
                ? "Nenhum colaborador encontrado" 
                : "Nenhum colaborador cadastrado"
              }
            </h3>
            <p className="text-muted-foreground mb-6">
              {filterStats.activeFiltersCount > 0
                ? "Tente ajustar os filtros de pesquisa ou adicionar novos colaboradores."
                : "Comece adicionando colaboradores ao seu sistema."
              }
            </p>
            {filterStats.activeFiltersCount > 0 ? (
              <Button variant="outline" onClick={clearAllFilters}>
                <Filter className="mr-2 h-4 w-4" />
                Limpar Filtros
              </Button>
            ) : (
              <Button onClick={onAddCollaborator}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeiro Colaborador
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCollaborators.map(collaborator => (
            <CollaboratorCard
              key={collaborator.id}
              collaborator={collaborator}
              onViewProfile={handleViewProfile}
              onSendFeedback={handleSendFeedback}
              onViewPerformance={handleViewPerformance}
              className="animate-fade-in"
            />
          ))}
        </div>
      )}
    </div>
  );
};