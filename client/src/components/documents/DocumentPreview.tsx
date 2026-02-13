
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Download, 
  Share2, 
  Eye, 
  Calendar, 
  User, 
  Tag,
  Clock,
  BarChart3,
  X
} from 'lucide-react';
import { Document } from '@/hooks/useDocuments';

interface DocumentPreviewProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (document: Document) => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  isOpen,
  onClose,
  onDownload
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!document) return null;

  const handleDownload = async () => {
    setIsLoading(true);
    await onDownload(document);
    setIsLoading(false);
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-3">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${getCategoryColor(document.category)}`}>
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span>{document.title}</span>
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header com metadados */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <Badge>{getCategoryLabel(document.category)}</Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4" />
              {new Date(document.updated_at).toLocaleDateString('pt-BR')}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Tag className="mr-1 h-4 w-4" />
              Versão {document.version}
            </div>
            {document.pages && (
              <div className="flex items-center text-sm text-muted-foreground">
                <FileText className="mr-1 h-4 w-4" />
                {document.pages} páginas
              </div>
            )}
            <div className="flex items-center text-sm text-muted-foreground">
              <BarChart3 className="mr-1 h-4 w-4" />
              {document.download_count} downloads
            </div>
          </div>

          {/* Descrição */}
          {document.description && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">Descrição</h3>
                <p className="text-sm text-muted-foreground">{document.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Preview do documento */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-4">Preview do Documento</h3>
              <div className="border rounded-lg p-8 bg-gray-50 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Preview do documento não disponível
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Faça o download para visualizar o conteúdo completo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações de acesso */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Nível de Acesso</h3>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {document.access_level === 'all' ? 'Todos os colaboradores' :
                   document.access_level === 'managers' ? 'Apenas gestores' : 'Apenas administradores'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
            <Button onClick={handleDownload} disabled={isLoading}>
              <Download className="mr-2 h-4 w-4" />
              {isLoading ? 'Baixando...' : 'Download'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
