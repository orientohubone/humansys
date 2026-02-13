
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const defaultTemplates = [
  {
    id: '1',
    name: 'Certificado de Conclusão',
    description: 'Template padrão para cursos e treinamentos',
    type: 'completion',
    active: true
  },
  {
    id: '2', 
    name: 'Certificado de Excelência',
    description: 'Para reconhecimento de performance excepcional',
    type: 'excellence',
    active: true
  },
  {
    id: '3',
    name: 'Certificado de Participação',
    description: 'Para participação em eventos e workshops',
    type: 'participation', 
    active: false
  }
];

export const CertificateTemplates = () => {
  const [templates, setTemplates] = useState(defaultTemplates);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    type: 'completion'
  });

  const handleAddTemplate = () => {
    if (!newTemplate.name || !newTemplate.description) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    const template = {
      id: Date.now().toString(),
      ...newTemplate,
      active: true
    };

    setTemplates([...templates, template]);
    setNewTemplate({ name: '', description: '', type: 'completion' });
    setOpen(false);

    toast({
      title: "Template criado",
      description: "Novo template de certificado foi criado com sucesso.",
    });
  };

  const toggleTemplate = (id: string) => {
    setTemplates(templates.map(t => 
      t.id === id ? { ...t, active: !t.active } : t
    ));
    
    toast({
      title: "Template atualizado",
      description: "Status do template foi alterado.",
    });
  };

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    toast({
      title: "Template removido",
      description: "Template foi removido com sucesso.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Templates de Certificados</CardTitle>
            <CardDescription>
              Configure os modelos de certificados disponíveis no sistema
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Template
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Template de Certificado</DialogTitle>
                <DialogDescription>
                  Configure um novo modelo de certificado
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome do Template</Label>
                  <Input 
                    id="name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                    placeholder="Ex: Certificado de Liderança"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input 
                    id="description"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                    placeholder="Descreva quando usar este template"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddTemplate}>
                  Criar Template
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {templates.map((template) => (
            <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Award className="h-6 w-6 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant={template.active ? 'default' : 'secondary'}>
                  {template.active ? 'Ativo' : 'Inativo'}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleTemplate(template.id)}
                >
                  {template.active ? 'Desativar' : 'Ativar'}
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => deleteTemplate(template.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
