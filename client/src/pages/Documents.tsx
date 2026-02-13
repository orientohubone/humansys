
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  BarChart3,
  Search,
  Plus
} from 'lucide-react';
import { NewDocumentDialog } from '@/components/documents/NewDocumentDialog';
import { DocumentEditDialog } from '@/components/documents/DocumentEditDialog';
import { DocumentPreview } from '@/components/documents/DocumentPreview';
import { DocumentAnalytics } from '@/components/documents/DocumentAnalytics';
import { SmartSearch } from '@/components/documents/SmartSearch';
import { useDocuments, Document } from '@/hooks/useDocuments';

export const Documents = () => {
  const { documents, incrementDownloadCount, deleteDocument } = useDocuments();
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(documents);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Atualizar documentos filtrados quando documents mudar
  React.useEffect(() => {
    setFilteredDocuments(documents);
  }, [documents]);

  const handleDownload = (document: Document) => {
    incrementDownloadCount(document.id);
    // Implementar lógica de download
  };

  const handleDelete = async (documentId: string) => {
    if (confirm('Tem certeza que deseja excluir este documento?')) {
      await deleteDocument(documentId);
    }
  };

  const handlePreview = (document: Document) => {
    setPreviewDocument(document);
    setIsPreviewOpen(true);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'policies': 'bg-blue-500',
      'procedures': 'bg-green-500', 
      'forms': 'bg-purple-500',
      'general': 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'policies': 'Políticas',
      'procedures': 'Procedimentos',
      'forms': 'Formulários',
      'general': 'Geral'
    };
    return labels[category] || 'Geral';
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 xs:space-y-6">
        <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-4 xs:gap-6">
          <div>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Central de Documentos</h1>
            <p className="text-xs xs:text-sm text-muted-foreground mt-1">
              Sistema inteligente de gestão documental
            </p>
          </div>
          <NewDocumentDialog />
        </div>

        <Tabs defaultValue="documents" className="space-y-4 xs:space-y-6">
          <TabsList className="dark:bg-gray-800 dark:border-gray-700">
            <TabsTrigger value="documents" className="flex items-center gap-1 xs:gap-2 text-xs xs:text-sm dark:text-white">
              <FileText className="h-3 w-3 xs:h-4 xs:w-4" />
              <span className="hidden xs:inline">Documentos</span>
              <span className="xs:hidden">Docs</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1 xs:gap-2 text-xs xs:text-sm dark:text-white">
              <BarChart3 className="h-3 w-3 xs:h-4 xs:w-4" />
              <span className="hidden xs:inline">Analytics</span>
              <span className="xs:hidden">Análise</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-3 xs:space-y-4 sm:space-y-6">
            {/* Busca inteligente */}
            <SmartSearch
              documents={documents}
              onFilter={setFilteredDocuments}
              onSearch={() => {}}
            />

            {/* Lista de documentos */}
            <div className="grid gap-3 xs:gap-4">
              {filteredDocuments.length === 0 ? (
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="flex flex-col items-center justify-center py-8 xs:py-12 px-4">
                    {documents.length === 0 ? (
                      <>
                        <FileText className="h-12 xs:h-16 w-12 xs:w-16 text-muted-foreground mb-3 xs:mb-4" />
                        <h3 className="text-base xs:text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhum documento criado</h3>
                        <p className="text-xs xs:text-sm text-muted-foreground text-center mb-4 xs:mb-6">
                          Crie seu primeiro documento para começar.
                        </p>
                        <NewDocumentDialog />
                      </>
                    ) : (
                      <>
                        <Search className="h-12 xs:h-16 w-12 xs:w-16 text-muted-foreground mb-3 xs:mb-4" />
                        <h3 className="text-base xs:text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhum documento encontrado</h3>
                        <p className="text-xs xs:text-sm text-muted-foreground text-center">
                          Tente ajustar os filtros ou termos de busca.
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              ) : (
                filteredDocuments.map((document) => (
                  <Card key={document.id} className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
                    <CardHeader className="pb-3 xs:pb-4">
                      <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-3 xs:gap-4">
                        <div className="flex items-start gap-2 xs:gap-3 flex-1">
                          <div className={`h-6 xs:h-8 w-6 xs:w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getCategoryColor(document.category)}`}>
                            <FileText className="h-3 xs:h-4 w-3 xs:w-4 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-sm xs:text-base truncate text-gray-900 dark:text-white">{document.title}</CardTitle>
                            <CardDescription className="text-xs xs:text-sm mt-1 line-clamp-2">
                              Versão {document.version} • {new Date(document.updated_at).toLocaleDateString('pt-BR')}
                              {document.pages && ` • ${document.pages}p`}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className="text-xs xs:text-sm flex-shrink-0">{getCategoryLabel(document.category)}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {document.description && (
                        <p className="text-xs xs:text-sm text-muted-foreground line-clamp-2">
                          {document.description}
                        </p>
                      )}
                      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-4">
                        <div className="text-xs xs:text-sm text-muted-foreground">
                          <span className="hidden xs:inline">Acesso: {document.access_level === 'all' ? 'Todos' : document.access_level === 'managers' ? 'Gestores' : 'Admin'}</span>
                          <span className="xs:hidden">
                            {document.access_level === 'all' ? 'Todos' : document.access_level === 'managers' ? 'Gestores' : 'Admin'}
                          </span>
                          <span className="mx-1">•</span>
                          <span className="font-medium">{document.download_count}</span> downloads
                        </div>
                        <div className="flex gap-1 xs:gap-2 w-full xs:w-auto">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePreview(document)}
                            className="text-xs xs:text-sm flex-1 xs:flex-none dark:bg-gray-700"
                          >
                            <Eye className="h-3 xs:h-4 w-3 xs:w-4" />
                            <span className="hidden xs:inline ml-1">Ver</span>
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleDownload(document)}
                            className="text-xs xs:text-sm flex-1 xs:flex-none"
                          >
                            <Download className="h-3 xs:h-4 w-3 xs:w-4" />
                            <span className="hidden xs:inline ml-1">Baixar</span>
                          </Button>
                          <DocumentEditDialog document={document} />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(document.id)}
                            className="text-xs xs:text-sm text-destructive hover:text-destructive dark:bg-gray-700 flex-1 xs:flex-none"
                          >
                            <Trash2 className="h-3 xs:h-4 w-3 xs:w-4" />
                            <span className="hidden xs:inline ml-1">Excluir</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <DocumentAnalytics documents={documents} />
          </TabsContent>
        </Tabs>

        {/* Modal de preview */}
        <DocumentPreview
          document={previewDocument}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          onDownload={handleDownload}
        />
      </div>
    </DashboardLayout>
  );
};
