import { useState } from 'react';
import { useSystemVersions } from '@/hooks/useSystemVersions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Sparkles, 
  Bug, 
  Trash2, 
  Shield, 
  AlertTriangle,
  Package,
  Calendar,
  User,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const categoryIcons: Record<string, React.ComponentType<any>> = {
  feature: Sparkles,
  improvement: Code,
  bugfix: Bug,
  security: Shield,
  infrastructure: Package,
  deprecated: AlertTriangle
};

const categoryColors: Record<string, string> = {
  feature: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  improvement: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  bugfix: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  security: 'bg-red-500/10 text-red-600 border-red-500/20',
  infrastructure: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  deprecated: 'bg-gray-500/10 text-gray-600 border-gray-500/20'
};

const changeTypeIcons: Record<string, React.ComponentType<any>> = {
  added: Sparkles,
  changed: Code,
  fixed: Bug,
  removed: Trash2,
  security: Shield,
  deprecated: AlertTriangle
};

const changeTypeColors: Record<string, string> = {
  added: 'text-emerald-600 dark:text-emerald-400',
  changed: 'text-blue-600 dark:text-blue-400',
  fixed: 'text-amber-600 dark:text-amber-400',
  removed: 'text-red-600 dark:text-red-400',
  security: 'text-red-700 dark:text-red-500',
  deprecated: 'text-gray-600 dark:text-gray-400'
};

export const FounderVersionsTab = () => {
  const { versions, loading, fetchVersions } = useSystemVersions();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredVersions = selectedTag
    ? versions.filter(v => v.impact_tags?.includes(selectedTag))
    : versions;

  const allTags = Array.from(
    new Set(versions.flatMap(v => v.impact_tags || []))
  );

  return (
    <div className="space-y-4 xs:space-y-6 sm:space-y-8" data-testid="founder-versions-tab">
      <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-gray-900 dark:border-emerald-700">
        <CardHeader className="p-3 xs:p-4 sm:p-6">
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-base xs:text-lg sm:text-xl text-gray-900 dark:text-white">
                <Package className="h-4 xs:h-5 w-4 xs:w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                Controle de Versões do Sistema
              </CardTitle>
              <CardDescription className="text-xs xs:text-sm dark:text-gray-400 mt-1">
                Histórico completo de mudanças, melhorias e correções
              </CardDescription>
            </div>
            <Button
              onClick={() => fetchVersions()}
              variant="outline"
              size="sm"
              className="gap-2 text-xs xs:text-sm h-8 xs:h-9 dark:border-gray-600 dark:text-gray-300 flex-shrink-0"
              data-testid="button-refresh-versions"
            >
              <RefreshCw className="h-3 xs:h-4 w-3 xs:w-4" />
              <span className="hidden xs:inline">Atualizar</span>
              <span className="xs:hidden">Atualiz.</span>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Tag Filters */}
      {allTags.length > 0 && (
        <Card className="dark:bg-gray-800/50 dark:border-gray-700">
          <CardHeader className="p-3 xs:p-4">
            <CardTitle className="text-xs xs:text-sm font-medium flex items-center gap-2 text-gray-900 dark:text-white">
              <Filter className="h-4 w-4" />
              Filtrar por Tag de Impacto
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <div className="flex flex-wrap gap-1.5 xs:gap-2">
              <Button
                variant={selectedTag === null ? "default" : "outline"}
                size="sm"
                className="text-xs xs:text-sm h-8 xs:h-9 dark:border-gray-600"
                onClick={() => setSelectedTag(null)}
                data-testid="filter-all-tags"
              >
                Todas
              </Button>
              {allTags.map(tag => {
                const Icon = categoryIcons[tag] || Code;
                return (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    size="sm"
                    className="gap-1 xs:gap-2 text-xs xs:text-sm h-8 xs:h-9 dark:border-gray-600"
                    onClick={() => setSelectedTag(tag)}
                    data-testid={`filter-tag-${tag}`}
                  >
                    <Icon className="h-3 w-3" />
                    <span className="hidden xs:inline capitalize">{tag}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Versions List */}
      {loading && (
        <Card className="dark:bg-gray-800/50 dark:border-gray-700">
          <CardContent className="py-12 text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-emerald-600 dark:text-emerald-400 mb-4" />
            <p className="text-sm text-muted-foreground dark:text-gray-400">Carregando versões...</p>
          </CardContent>
        </Card>
      )}

      {!loading && filteredVersions.length === 0 && (
        <Card className="dark:bg-gray-800/50 dark:border-gray-700">
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              {selectedTag
                ? `Nenhuma versão encontrada para a tag "${selectedTag}"`
                : 'Nenhuma versão registrada ainda'}
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && filteredVersions.length > 0 && (
        <div className="space-y-3 xs:space-y-4">
          <Accordion type="single" collapsible className="space-y-3 xs:space-y-4">
            {filteredVersions.map((version) => (
              <AccordionItem
                key={version.id}
                value={version.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md dark:hover:shadow-md/20 transition-shadow"
                data-testid={`version-item-${version.version}`}
              >
                <AccordionTrigger className="px-3 xs:px-4 sm:px-6 py-3 xs:py-4 hover:no-underline hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="flex flex-col gap-2 xs:gap-3 w-full text-left">
                    <div className="flex items-center gap-2 xs:gap-3 flex-wrap">
                      <Badge variant="outline" className="font-mono text-xs xs:text-sm bg-white dark:bg-gray-700 dark:border-gray-600">
                        v{version.version}
                      </Badge>
                      <h3 className="font-semibold text-sm xs:text-base text-gray-900 dark:text-white">{version.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 xs:gap-4 text-xs xs:text-sm text-gray-600 dark:text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 xs:h-4 w-3 xs:w-4" />
                        {format(new Date(version.release_date), 'dd MMM yyyy', { locale: ptBR })}
                      </span>
                      {version.impact_tags && version.impact_tags.length > 0 && (
                        <div className="flex gap-1 xs:gap-2 flex-wrap">
                          {version.impact_tags.map(tag => {
                            const Icon = categoryIcons[tag] || Code;
                            return (
                              <Badge
                                key={tag}
                                variant="outline"
                                className={`text-xs ${categoryColors[tag] || ''}`}
                              >
                                <Icon className="h-3 w-3 mr-1" />
                                <span className="hidden xs:inline">{tag}</span>
                              </Badge>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-3 xs:px-4 sm:px-6 pb-4 xs:pb-6 pt-2 bg-gradient-to-b from-gray-50/50 to-gray-50 dark:from-gray-800/30 dark:to-gray-900/50">
                  {version.summary && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{version.summary}</p>
                  )}
                  
                  <div className="space-y-3 xs:space-y-4">
                    {version.changes.map((change, idx) => {
                      const Icon = changeTypeIcons[change.type] || Code;
                      const colorClass = changeTypeColors[change.type] || '';
                      
                      return (
                        <div
                          key={idx}
                          className="flex gap-3 items-start p-3 xs:p-4 rounded-lg bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors"
                          data-testid={`change-${change.type}-${idx}`}
                        >
                          <Icon className={`h-4 xs:h-5 w-4 xs:w-5 mt-0.5 flex-shrink-0 ${colorClass}`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <Badge variant="outline" className="text-xs capitalize dark:border-gray-700 dark:bg-gray-800">
                                {change.type}
                              </Badge>
                              {change.module && (
                                <Badge variant="secondary" className="text-xs dark:bg-gray-800 dark:text-gray-400">
                                  {change.module}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{change.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};
