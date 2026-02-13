
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, ExternalLink } from 'lucide-react';
import { useCertificateTemplates } from '@/hooks/useCertificateTemplates';

export const CertificateTemplateDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'completion',
    template_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createTemplate } = useCertificateTemplates();

  const handleSubmit = async () => {
    if (!formData.name || !formData.description) return;

    setIsSubmitting(true);
    const success = await createTemplate(formData);
    
    if (success) {
      setFormData({ name: '', description: '', type: 'completion', template_url: '' });
      setOpen(false);
    }
    setIsSubmitting(false);
  };

  const isCanvaUrl = (url: string) => {
    return url.includes('canva.com');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar Template de Certificado</DialogTitle>
          <DialogDescription>
            Configure um novo template para gerar certificados. Você pode usar templates do Canva.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Template *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Certificado de Conclusão"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completion">Conclusão</SelectItem>
                  <SelectItem value="participation">Participação</SelectItem>
                  <SelectItem value="excellence">Excelência</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva o template e sua finalidade"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template_url">URL do Template (Canva)</Label>
            <div className="flex gap-2">
              <Input
                id="template_url"
                value={formData.template_url}
                onChange={(e) => setFormData({ ...formData, template_url: e.target.value })}
                placeholder="https://www.canva.com/design/..."
              />
              {formData.template_url && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(formData.template_url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
            {formData.template_url && !isCanvaUrl(formData.template_url) && (
              <p className="text-sm text-amber-600">
                ⚠️ Recomendamos usar templates do Canva para melhor compatibilidade
              </p>
            )}
            {formData.template_url && isCanvaUrl(formData.template_url) && (
              <p className="text-sm text-green-600">
                ✅ Template do Canva detectado - dados serão preenchidos automaticamente
              </p>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Como usar templates do Canva:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Crie seu template no Canva com campos para nome e data</li>
              <li>2. Copie o link de compartilhamento do template</li>
              <li>3. Cole aqui - o sistema preencherá automaticamente os dados</li>
              <li>4. Campos suportados: Nome do colaborador e Data de emissão</li>
            </ol>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!formData.name || !formData.description || isSubmitting}
          >
            {isSubmitting ? 'Criando...' : 'Criar Template'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
