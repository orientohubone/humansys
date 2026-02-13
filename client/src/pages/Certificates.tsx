import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Download, Eye, Calendar, Plus, Edit, Trash2, ExternalLink, Upload, Link2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CertificateTemplate {
  id: string;
  name: string;
  description: string;
  type: 'completion' | 'participation' | 'achievement';
  templateMethod: 'attachment' | 'url';
  templateUrl?: string;
  attachmentName?: string;
  active: boolean;
  createdAt: Date;
}

interface IssuedCertificate {
  id: string;
  templateId: string;
  collaboratorName: string;
  collaboratorId: string;
  course: string;
  issueDate: string;
  certificateNumber: string;
}

const mockCollaborators = [
  { id: '1', name: 'João Silva', email: 'joao@example.com' },
  { id: '2', name: 'Maria Santos', email: 'maria@example.com' },
  { id: '3', name: 'Carlos Oliveira', email: 'carlos@example.com' },
  { id: '4', name: 'Ana Costa', email: 'ana@example.com' },
];

export const Certificates = () => {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [issuedCertificates, setIssuedCertificates] = useState<IssuedCertificate[]>([]);
  const [createTemplateOpen, setCreateTemplateOpen] = useState(false);
  const [generateCertOpen, setGenerateCertOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CertificateTemplate | null>(null);
  const [activeTab, setActiveTab] = useState('templates');
  const { toast } = useToast();

  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    type: 'completion' as 'completion' | 'participation' | 'achievement',
    templateMethod: 'url' as 'attachment' | 'url',
    templateUrl: '',
    attachmentName: '',
    attachmentFile: null as File | null
  });

  const [generateForm, setGenerateForm] = useState({
    templateId: '',
    collaboratorId: '',
    course: '',
    autoFillDate: true
  });

  const handleCreateTemplate = () => {
    if (!templateForm.name || !templateForm.description) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome e descrição do template",
        variant: "destructive"
      });
      return;
    }

    if (templateForm.templateMethod === 'url' && !templateForm.templateUrl) {
      toast({
        title: "URL obrigatória",
        description: "Insira a URL do Canva ou template",
        variant: "destructive"
      });
      return;
    }

    if (templateForm.templateMethod === 'attachment' && !templateForm.attachmentName) {
      toast({
        title: "Anexo obrigatório",
        description: "Carregue o arquivo do template",
        variant: "destructive"
      });
      return;
    }

    if (editingTemplate) {
      setTemplates(templates.map(t =>
        t.id === editingTemplate.id
          ? {
              ...t,
              name: templateForm.name,
              description: templateForm.description,
              type: templateForm.type,
              templateMethod: templateForm.templateMethod,
              templateUrl: templateForm.templateMethod === 'url' ? templateForm.templateUrl : undefined,
              attachmentName: templateForm.templateMethod === 'attachment' ? templateForm.attachmentName : undefined
            }
          : t
      ));
      toast({
        title: "Template atualizado!",
        description: `"${templateForm.name}" foi atualizado com sucesso.`
      });
      setEditingTemplate(null);
    } else {
      const newTemplate: CertificateTemplate = {
        id: Date.now().toString(),
        name: templateForm.name,
        description: templateForm.description,
        type: templateForm.type,
        templateMethod: templateForm.templateMethod,
        templateUrl: templateForm.templateMethod === 'url' ? templateForm.templateUrl : undefined,
        attachmentName: templateForm.templateMethod === 'attachment' ? templateForm.attachmentName : undefined,
        active: true,
        createdAt: new Date()
      };
      setTemplates([...templates, newTemplate]);
      toast({
        title: "Template criado!",
        description: `"${templateForm.name}" foi criado com sucesso.`
      });
    }

    setTemplateForm({
      name: '',
      description: '',
      type: 'completion',
      templateMethod: 'url',
      templateUrl: '',
      attachmentName: '',
      attachmentFile: null
    });
    setCreateTemplateOpen(false);
  };

  const handleGenerateCertificate = () => {
    if (!generateForm.templateId || !generateForm.collaboratorId) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione template e colaborador",
        variant: "destructive"
      });
      return;
    }

    const template = templates.find(t => t.id === generateForm.templateId);
    const collaborator = mockCollaborators.find(c => c.id === generateForm.collaboratorId);

    if (!template || !collaborator) {
      toast({
        title: "Erro",
        description: "Template ou colaborador não encontrado",
        variant: "destructive"
      });
      return;
    }

    const newCert: IssuedCertificate = {
      id: Date.now().toString(),
      templateId: generateForm.templateId,
      collaboratorName: collaborator.name,
      collaboratorId: generateForm.collaboratorId,
      course: generateForm.course,
      issueDate: generateForm.autoFillDate ? new Date().toLocaleDateString('pt-BR') : new Date().toISOString().split('T')[0],
      certificateNumber: `CERT-${Date.now().toString().slice(-8).toUpperCase()}`
    };

    setIssuedCertificates([...issuedCertificates, newCert]);
    toast({
      title: "Certificado gerado!",
      description: `Certificado de ${collaborator.name} foi gerado com sucesso.`,
    });

    setGenerateForm({
      templateId: '',
      collaboratorId: '',
      course: '',
      autoFillDate: true
    });
    setGenerateCertOpen(false);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    toast({
      title: "Template removido",
      description: "O template foi deletado com sucesso."
    });
  };

  const handleToggleTemplate = (id: string) => {
    setTemplates(templates.map(t =>
      t.id === id ? { ...t, active: !t.active } : t
    ));
  };

  const handleDownloadCertificate = (cert: IssuedCertificate) => {
    toast({
      title: "Download iniciado",
      description: `${cert.certificateNumber} foi baixado.`
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 xs:space-y-6">
        {/* Header */}
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-4">
          <div>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="h-6 xs:h-8 w-6 xs:w-8 text-emerald-600" />
              Certificados e Templates
            </h1>
            <p className="text-sm xs:text-base text-gray-600 dark:text-gray-400 mt-1">
              Crie templates e gere certificados com preenchimento automático
            </p>
          </div>
          <div className="flex gap-2 flex-col xs:flex-row">
            <Dialog open={createTemplateOpen} onOpenChange={setCreateTemplateOpen}>
              <DialogTrigger asChild>
                <Button
                  className="text-xs xs:text-sm bg-emerald-600 hover:bg-emerald-700 w-full xs:w-auto"
                  onClick={() => setEditingTemplate(null)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Novo Template
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-md sm:max-w-lg mx-auto max-h-[90vh] overflow-y-auto dark:bg-gray-900">
                <DialogHeader>
                  <DialogTitle className="text-lg xs:text-xl">{editingTemplate ? 'Editar Template' : 'Criar Template de Certificado'}</DialogTitle>
                  <DialogDescription className="text-xs xs:text-sm">
                    Configure o template com Canva ou anexo
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-xs xs:text-sm font-medium">Nome do Template *</label>
                    <input
                      type="text"
                      value={templateForm.name}
                      onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                      placeholder="Ex: Certificado Conclusão Python"
                      className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs xs:text-sm font-medium">Descrição *</label>
                    <textarea
                      value={templateForm.description}
                      onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                      placeholder="Descreva o tipo de certificado..."
                      className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="text-xs xs:text-sm font-medium">Tipo de Certificado</label>
                    <select
                      value={templateForm.type}
                      onChange={(e) => setTemplateForm({ ...templateForm, type: e.target.value as 'completion' | 'participation' | 'achievement' })}
                      className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                    >
                      <option value="completion">Conclusão de Curso</option>
                      <option value="participation">Participação</option>
                      <option value="achievement">Conquista/Competência</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs xs:text-sm font-medium">Método de Template</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button
                        onClick={() => setTemplateForm({ ...templateForm, templateMethod: 'url' })}
                        className={`p-3 rounded-lg border-2 transition-all text-xs xs:text-sm font-medium ${
                          templateForm.templateMethod === 'url'
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                        }`}
                      >
                        <Link2 className="h-4 w-4 mx-auto mb-1" />
                        URL Canva
                      </button>
                      <button
                        onClick={() => setTemplateForm({ ...templateForm, templateMethod: 'attachment' })}
                        className={`p-3 rounded-lg border-2 transition-all text-xs xs:text-sm font-medium ${
                          templateForm.templateMethod === 'attachment'
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                        }`}
                      >
                        <Upload className="h-4 w-4 mx-auto mb-1" />
                        Anexo
                      </button>
                    </div>
                  </div>

                  {templateForm.templateMethod === 'url' ? (
                    <div>
                      <label className="text-xs xs:text-sm font-medium">URL do Canva ou Template *</label>
                      <input
                        type="url"
                        value={templateForm.templateUrl}
                        onChange={(e) => setTemplateForm({ ...templateForm, templateUrl: e.target.value })}
                        placeholder="https://www.canva.com/..."
                        className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Cole o link compartilhável do Canva</p>
                    </div>
                  ) : (
                    <div>
                      <label className="text-xs xs:text-sm font-medium">Anexo do Template *</label>
                      <div className="border-2 border-dashed rounded-lg p-4 text-center bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 mt-2">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-400">
                          Clique ou arraste arquivo PDF/PNG
                        </p>
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              setTemplateForm({
                                ...templateForm,
                                attachmentFile: e.target.files[0],
                                attachmentName: e.target.files[0].name
                              });
                            }
                          }}
                          className="hidden"
                          id="attachment-input"
                        />
                        <input type="file" id="attachment-input" className="hidden" />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => document.getElementById('attachment-input')?.click()}
                          className="mt-3 text-xs dark:bg-gray-700"
                        >
                          Selecionar Arquivo
                        </Button>
                      </div>
                      {templateForm.attachmentName && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">✓ {templateForm.attachmentName}</p>
                      )}
                    </div>
                  )}
                </div>

                <DialogFooter className="gap-2 flex flex-col xs:flex-row">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCreateTemplateOpen(false);
                      setEditingTemplate(null);
                    }}
                    className="w-full xs:w-auto text-xs xs:text-sm dark:bg-gray-800"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreateTemplate}
                    className="w-full xs:w-auto text-xs xs:text-sm bg-emerald-600 hover:bg-emerald-700"
                  >
                    {editingTemplate ? 'Atualizar Template' : 'Criar Template'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={generateCertOpen} onOpenChange={setGenerateCertOpen}>
              <DialogTrigger asChild>
                <Button className="text-xs xs:text-sm w-full xs:w-auto">
                  <Plus className="h-4 w-4 mr-1" />
                  Gerar Certificado
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-md sm:max-w-lg mx-auto max-h-[90vh] overflow-y-auto dark:bg-gray-900">
                <DialogHeader>
                  <DialogTitle className="text-lg xs:text-xl">Gerar Novo Certificado</DialogTitle>
                  <DialogDescription className="text-xs xs:text-sm">
                    Selecione o template, colaborador e curso para gerar
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-xs xs:text-sm font-medium">Template *</label>
                    <select
                      value={generateForm.templateId}
                      onChange={(e) => setGenerateForm({ ...generateForm, templateId: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                    >
                      <option value="">Selecione um template...</option>
                      {templates.filter(t => t.active).map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs xs:text-sm font-medium">Colaborador *</label>
                    <select
                      value={generateForm.collaboratorId}
                      onChange={(e) => setGenerateForm({ ...generateForm, collaboratorId: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                    >
                      <option value="">Selecione um colaborador...</option>
                      {mockCollaborators.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs xs:text-sm font-medium">Curso/Treinamento *</label>
                    <input
                      type="text"
                      value={generateForm.course}
                      onChange={(e) => setGenerateForm({ ...generateForm, course: e.target.value })}
                      placeholder="Ex: Python Avançado"
                      className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                    />
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <input
                      type="checkbox"
                      checked={generateForm.autoFillDate}
                      onChange={(e) => setGenerateForm({ ...generateForm, autoFillDate: e.target.checked })}
                      className="w-4 h-4"
                      id="auto-date"
                    />
                    <label htmlFor="auto-date" className="text-xs xs:text-sm text-emerald-900 dark:text-emerald-100">
                      Preencher data automaticamente com data de hoje
                    </label>
                  </div>
                </div>

                <DialogFooter className="gap-2 flex flex-col xs:flex-row">
                  <Button
                    variant="outline"
                    onClick={() => setGenerateCertOpen(false)}
                    className="w-full xs:w-auto text-xs xs:text-sm dark:bg-gray-800"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleGenerateCertificate}
                    className="w-full xs:w-auto text-xs xs:text-sm bg-emerald-600 hover:bg-emerald-700"
                  >
                    Gerar Certificado
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-4 xs:pt-6">
              <div className="text-center">
                <p className="text-lg xs:text-2xl font-bold text-emerald-600">{templates.length}</p>
                <p className="text-xs xs:text-sm text-muted-foreground mt-1">Templates</p>
              </div>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-4 xs:pt-6">
              <div className="text-center">
                <p className="text-lg xs:text-2xl font-bold text-blue-600">{templates.filter(t => t.active).length}</p>
                <p className="text-xs xs:text-sm text-muted-foreground mt-1">Ativos</p>
              </div>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-4 xs:pt-6">
              <div className="text-center">
                <p className="text-lg xs:text-2xl font-bold text-purple-600">{templates.filter(t => t.templateMethod === 'url').length}</p>
                <p className="text-xs xs:text-sm text-muted-foreground mt-1">Canva</p>
              </div>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-4 xs:pt-6">
              <div className="text-center">
                <p className="text-lg xs:text-2xl font-bold text-green-600">{issuedCertificates.length}</p>
                <p className="text-xs xs:text-sm text-muted-foreground mt-1">Emitidos</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="templates" className="text-xs xs:text-sm dark:text-white">Templates</TabsTrigger>
            <TabsTrigger value="issued" className="text-xs xs:text-sm dark:text-white">Emitidos</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            {templates.length === 0 ? (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="py-12 text-center">
                  <Award className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm xs:text-base">Nenhum template criado ainda</p>
                  <Button
                    onClick={() => setCreateTemplateOpen(true)}
                    className="text-xs xs:text-sm"
                  >
                    Criar Primeiro Template
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                    <CardHeader className="pb-3 xs:pb-4">
                      <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-3 xs:gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-base xs:text-lg">{template.name}</CardTitle>
                          <CardDescription className="text-xs xs:text-sm mt-1">{template.description}</CardDescription>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant={template.active ? 'default' : 'secondary'} className="text-xs">
                              {template.active ? 'Ativo' : 'Inativo'}
                            </Badge>
                            <Badge variant="outline" className={`text-xs ${template.templateMethod === 'url' ? 'text-green-600 border-green-600' : 'text-blue-600 border-blue-600'}`}>
                              {template.templateMethod === 'url' ? 'Canva' : 'Anexo'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {template.type === 'completion' ? 'Conclusão' : template.type === 'participation' ? 'Participação' : 'Conquista'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="flex flex-col xs:flex-row gap-2">
                        {template.templateMethod === 'url' && template.templateUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(template.templateUrl, '_blank')}
                            className="flex-1 text-xs dark:bg-gray-700"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Ver
                          </Button>
                        )}
                        {template.templateMethod === 'attachment' && template.attachmentName && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs dark:bg-gray-700"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            {template.attachmentName}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingTemplate(template);
                            setTemplateForm({
                              name: template.name,
                              description: template.description,
                              type: template.type,
                              templateMethod: template.templateMethod,
                              templateUrl: template.templateUrl || '',
                              attachmentName: template.attachmentName || '',
                              attachmentFile: null
                            });
                            setCreateTemplateOpen(true);
                          }}
                          className="flex-1 text-xs dark:bg-gray-700"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleTemplate(template.id)}
                          className={`flex-1 text-xs ${template.active ? 'dark:bg-gray-700' : 'text-red-600 dark:text-red-400 dark:bg-gray-700'}`}
                        >
                          {template.active ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="flex-1 text-xs text-red-600 dark:text-red-400 dark:bg-gray-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="issued" className="space-y-4">
            {issuedCertificates.length === 0 ? (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="py-12 text-center">
                  <Award className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm xs:text-base">Nenhum certificado emitido ainda</p>
                  <Button
                    onClick={() => setGenerateCertOpen(true)}
                    className="text-xs xs:text-sm"
                  >
                    Emitir Primeiro Certificado
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
                {issuedCertificates.map((cert) => {
                  const template = templates.find(t => t.id === cert.templateId);
                  return (
                    <Card key={cert.id} className="dark:bg-gray-800 dark:border-gray-700">
                      <CardHeader className="pb-3 xs:pb-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-base xs:text-lg">{cert.collaboratorName}</CardTitle>
                            <CardDescription className="text-xs xs:text-sm mt-1">{template?.name}</CardDescription>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{cert.course}</p>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-2 mb-4 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Número:</span>
                            <span className="font-mono font-semibold text-emerald-600">{cert.certificateNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Data:</span>
                            <span>{cert.issueDate}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleDownloadCertificate(cert)}
                            className="flex-1 text-xs bg-emerald-600 hover:bg-emerald-700"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Baixar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs dark:bg-gray-700"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
