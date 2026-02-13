
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const NewSurveyDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    target: '',
    deadline: '',
    anonymous: false
  });

  const handleCreateSurvey = () => {
    if (!formData.title || !formData.type || !formData.target) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Simular criação da pesquisa
    toast({
      title: "Pesquisa criada",
      description: `Pesquisa "${formData.title}" foi criada com sucesso.`,
    });

    setFormData({
      title: '',
      description: '',
      type: '',
      target: '',
      deadline: '',
      anonymous: false
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-xs xs:text-sm w-full xs:w-auto">
          <Plus className="h-3 xs:h-4 w-3 xs:w-4 mr-1 xs:mr-2" />
          <span className="hidden xs:inline">Nova Pesquisa</span>
          <span className="xs:hidden">Nova</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md sm:max-w-lg mx-auto max-h-[90vh] overflow-y-auto dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-lg xs:text-xl text-gray-900 dark:text-white">Criar Nova Pesquisa</DialogTitle>
          <DialogDescription className="text-xs xs:text-sm">
            Configure uma nova pesquisa para sua equipe
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 xs:gap-4 py-3 xs:py-4">
          <div className="grid gap-1.5 xs:gap-2">
            <Label htmlFor="title" className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Título da Pesquisa *</Label>
            <Input 
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Ex: Pesquisa de Satisfação 2024"
              className="text-xs xs:text-sm px-2 xs:px-3 py-1.5 xs:py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="grid gap-1.5 xs:gap-2">
            <Label htmlFor="description" className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Descrição</Label>
            <Textarea 
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Descreva o objetivo da pesquisa..."
              className="text-xs xs:text-sm px-2 xs:px-3 py-1.5 xs:py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white resize-none"
              rows={2}
            />
          </div>
          
          <div className="grid gap-1.5 xs:gap-2">
            <Label className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Tipo de Pesquisa *</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData({...formData, type: value})}
            >
              <SelectTrigger className="text-xs xs:text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800">
                <SelectItem value="satisfaction">Satisfação</SelectItem>
                <SelectItem value="engagement">Engajamento</SelectItem>
                <SelectItem value="climate">Clima Organizacional</SelectItem>
                <SelectItem value="feedback">Feedback 360°</SelectItem>
                <SelectItem value="custom">Personalizada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-1.5 xs:gap-2">
            <Label className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Público Alvo *</Label>
            <Select 
              value={formData.target} 
              onValueChange={(value) => setFormData({...formData, target: value})}
            >
              <SelectTrigger className="text-xs xs:text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                <SelectValue placeholder="Selecione o público" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800">
                <SelectItem value="all">Todos os colaboradores</SelectItem>
                <SelectItem value="management">Apenas gestores</SelectItem>
                <SelectItem value="department">Departamento específico</SelectItem>
                <SelectItem value="custom">Seleção personalizada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-1.5 xs:gap-2">
            <Label htmlFor="deadline" className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Prazo para Resposta</Label>
            <Input 
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              className="text-xs xs:text-sm px-2 xs:px-3 py-1.5 xs:py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </div>
        </div>
        <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 justify-end">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="w-full xs:w-auto text-xs xs:text-sm dark:bg-gray-800 dark:border-gray-600"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleCreateSurvey}
            className="w-full xs:w-auto text-xs xs:text-sm bg-emerald-600 hover:bg-emerald-700"
          >
            Criar Pesquisa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
