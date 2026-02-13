
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const NewDocumentDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    access: 'all',
    file: null as File | null
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({...formData, file});
    }
  };

  const handleCreateDocument = () => {
    if (!formData.title || !formData.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Simular upload do documento
    toast({
      title: "Documento criado",
      description: `Documento "${formData.title}" foi criado com sucesso.`,
    });

    setFormData({
      title: '',
      description: '',
      category: '',
      access: 'all',
      file: null
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-xs xs:text-sm w-full xs:w-auto">
          <Plus className="h-3 xs:h-4 w-3 xs:w-4 mr-1 xs:mr-2" />
          <span className="hidden xs:inline">Novo Documento</span>
          <span className="xs:hidden">Novo</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md sm:max-w-lg mx-auto max-h-[90vh] overflow-y-auto dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-lg xs:text-xl text-gray-900 dark:text-white">Adicionar Novo Documento</DialogTitle>
          <DialogDescription className="text-xs xs:text-sm">
            Faça upload de um novo documento para a biblioteca
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 xs:gap-4 py-3 xs:py-4">
          <div className="grid gap-1.5 xs:gap-2">
            <Label htmlFor="title" className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Título do Documento *</Label>
            <Input 
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Ex: Manual de Procedimentos"
              className="text-xs xs:text-sm px-2 xs:px-3 py-1.5 xs:py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="grid gap-1.5 xs:gap-2">
            <Label htmlFor="description" className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Descrição</Label>
            <Textarea 
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Descreva o conteúdo do documento..."
              className="text-xs xs:text-sm px-2 xs:px-3 py-1.5 xs:py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white resize-none"
              rows={2}
            />
          </div>
          
          <div className="grid gap-1.5 xs:gap-2">
            <Label className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Categoria *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({...formData, category: value})}
            >
              <SelectTrigger className="text-xs xs:text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800">
                <SelectItem value="policies">Políticas</SelectItem>
                <SelectItem value="procedures">Procedimentos</SelectItem>
                <SelectItem value="forms">Formulários</SelectItem>
                <SelectItem value="manuals">Manuais</SelectItem>
                <SelectItem value="templates">Templates</SelectItem>
                <SelectItem value="contracts">Contratos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-1.5 xs:gap-2">
            <Label className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Nível de Acesso</Label>
            <Select 
              value={formData.access} 
              onValueChange={(value) => setFormData({...formData, access: value})}
            >
              <SelectTrigger className="text-xs xs:text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800">
                <SelectItem value="all">Todos os colaboradores</SelectItem>
                <SelectItem value="management">Apenas gestores</SelectItem>
                <SelectItem value="hr">Apenas RH</SelectItem>
                <SelectItem value="restricted">Acesso restrito</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-1.5 xs:gap-2">
            <Label htmlFor="file" className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Arquivo</Label>
            <div className="flex flex-col xs:flex-row gap-1.5 xs:gap-2">
              <Input 
                id="file"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                className="text-xs xs:text-sm px-2 xs:px-3 py-1.5 xs:py-2 flex-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
              <Button type="button" variant="outline" size="icon" className="dark:bg-gray-800 dark:border-gray-600">
                <Upload className="h-3 xs:h-4 w-3 xs:w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
            </p>
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
            onClick={handleCreateDocument}
            className="w-full xs:w-auto text-xs xs:text-sm bg-emerald-600 hover:bg-emerald-700"
          >
            Adicionar Documento
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
