
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CertificateEditor } from '@/components/certificates/CertificateEditor';
import { CertificateTemplate, Certificate, CertificateAnalytics } from '@/types/certificates';
import { Plus, FileImage, Download, Users, TrendingUp, Award, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ModernCertificates = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('templates');
  const [editingTemplate, setEditingTemplate] = useState<CertificateTemplate | undefined>();
  const [showEditor, setShowEditor] = useState(false);

  // Mock data
  const mockTemplates: CertificateTemplate[] = [
    {
      id: '1',
      name: 'Certificado Padrão',
      description: 'Template padrão para treinamentos',
      background_color: '#ffffff',
      text_color: '#000000',
      border_style: 'elegant',
      elements: [],
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Certificado Premium',
      description: 'Template premium com design moderno',
      background_color: '#f8fafc',
      text_color: '#1e293b',
      border_style: 'modern',
      elements: [],
      created_at: '2024-01-10T14:30:00Z',
      updated_at: '2024-01-10T14:30:00Z'
    }
  ];

  const mockCertificates: Certificate[] = [
    {
      id: '1',
      template_id: '1',
      recipient_name: 'João Silva',
      course_name: 'Treinamento de Liderança',
      completion_date: '2024-01-20',
      issued_by: 'Maria Santos',
      certificate_url: '',
      verification_code: 'CERT-2024-001',
      created_at: '2024-01-20T16:00:00Z'
    },
    {
      id: '2',
      template_id: '2',
      recipient_name: 'Ana Costa',
      course_name: 'Curso de Excel Avançado',
      completion_date: '2024-01-18',
      issued_by: 'Carlos Lima',
      certificate_url: '',
      verification_code: 'CERT-2024-002',
      created_at: '2024-01-18T11:30:00Z'
    }
  ];

  const mockAnalytics: CertificateAnalytics = {
    total_issued: 156,
    issued_this_month: 23,
    most_popular_course: 'Treinamento de Liderança',
    templates_used: 8,
    download_count: 142
  };

  const handleSaveTemplate = (template: CertificateTemplate) => {
    console.log('Salvando template:', template);
    toast({
      title: "Template salvo",
      description: "Template de certificado salvo com sucesso!"
    });
    setShowEditor(false);
    setEditingTemplate(undefined);
  };

  const handlePreviewTemplate = (template: CertificateTemplate) => {
    console.log('Visualizando template:', template);
    toast({
      title: "Gerando preview",
      description: "Preview do certificado será exibido em breve."
    });
  };

  const editTemplate = (template: CertificateTemplate) => {
    setEditingTemplate(template);
    setShowEditor(true);
  };

  const createNewTemplate = () => {
    setEditingTemplate(undefined);
    setShowEditor(true);
  };

  if (showEditor) {
    return (
      <DashboardLayout>
        <CertificateEditor
          template={editingTemplate}
          onSave={handleSaveTemplate}
          onPreview={handlePreviewTemplate}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Certificados Modernos</h1>
            <p className="text-muted-foreground">
              Crie, gerencie e analise certificados com editor visual avançado
            </p>
          </div>
          <Button onClick={createNewTemplate}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Template
          </Button>
        </div>

        {/* Analytics Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Emitidos</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalytics.total_issued}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalytics.issued_this_month}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalytics.download_count}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Templates</CardTitle>
              <FileImage className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalytics.templates_used}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mais Popular</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold truncate">{mockAnalytics.most_popular_course}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="certificates">Certificados Emitidos</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                      <Badge variant="outline">{template.border_style}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="w-full h-32 rounded border-2 mb-4 flex items-center justify-center"
                      style={{ 
                        backgroundColor: template.background_color,
                        borderStyle: template.border_style !== 'none' ? 'solid' : 'none'
                      }}
                    >
                      <span className="text-sm text-muted-foreground">Preview do Template</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => editTemplate(template)}>
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handlePreviewTemplate(template)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-4">
            <div className="space-y-4">
              {mockCertificates.map((certificate) => (
                <Card key={certificate.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="font-semibold">{certificate.course_name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>👤 {certificate.recipient_name}</span>
                          <span>📅 {new Date(certificate.completion_date).toLocaleDateString('pt-BR')}</span>
                          <span>✍️ {certificate.issued_by}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {certificate.verification_code}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Visualizar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatório de Certificados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Relatórios detalhados em breve</p>
                  <p className="text-sm">Analytics avançados serão implementados na próxima fase</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
