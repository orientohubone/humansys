
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CertificateTemplate, CertificateElement } from '@/types/certificates';
import { Type, Image, FileSignature, Calendar, QrCode, Palette, Download, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CertificateEditorProps {
  template?: CertificateTemplate;
  onSave: (template: CertificateTemplate) => void;
  onPreview: (template: CertificateTemplate) => void;
}

export const CertificateEditor: React.FC<CertificateEditorProps> = ({
  template,
  onSave,
  onPreview
}) => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const [editingTemplate, setEditingTemplate] = useState<CertificateTemplate>(
    template || {
      id: '',
      name: 'Novo Certificado',
      description: '',
      background_color: '#ffffff',
      text_color: '#000000',
      border_style: 'simple',
      elements: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  );

  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<CertificateElement | null>(null);

  const elementTypes = [
    { type: 'text', label: 'Texto', icon: Type },
    { type: 'image', label: 'Imagem', icon: Image },
    { type: 'signature', label: 'Assinatura', icon: FileSignature },
    { type: 'date', label: 'Data', icon: Calendar },
    { type: 'qr-code', label: 'QR Code', icon: QrCode }
  ];

  const addElement = (type: CertificateElement['type']) => {
    const newElement: CertificateElement = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? 'Texto de exemplo' : '',
      x: 100,
      y: 100,
      width: type === 'text' ? 200 : 100,
      height: type === 'text' ? 40 : 100,
      font_size: 16,
      font_weight: 'normal',
      align: 'center',
      color: editingTemplate.text_color
    };

    setEditingTemplate(prev => ({
      ...prev,
      elements: [...prev.elements, newElement],
      updated_at: new Date().toISOString()
    }));

    setSelectedElement(newElement.id);
  };

  const updateElement = (elementId: string, updates: Partial<CertificateElement>) => {
    setEditingTemplate(prev => ({
      ...prev,
      elements: prev.elements.map(el =>
        el.id === elementId ? { ...el, ...updates } : el
      ),
      updated_at: new Date().toISOString()
    }));
  };

  const deleteElement = (elementId: string) => {
    setEditingTemplate(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== elementId),
      updated_at: new Date().toISOString()
    }));
    setSelectedElement(null);
  };

  const handleSave = () => {
    if (!editingTemplate.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para o template.",
        variant: "destructive"
      });
      return;
    }

    onSave(editingTemplate);
    toast({
      title: "Template salvo",
      description: "Template de certificado salvo com sucesso!"
    });
  };

  const selectedElementData = editingTemplate.elements.find(el => el.id === selectedElement);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <div>
          <h2 className="text-xl font-semibold">Editor de Certificados</h2>
          <p className="text-sm text-muted-foreground">
            Crie e personalize templates de certificados
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onPreview(editingTemplate)}>
            <Download className="h-4 w-4 mr-2" />
            Visualizar
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-80 border-r bg-muted/30">
          <Tabs defaultValue="design" className="h-full">
            <TabsList className="grid w-full grid-cols-2 m-4">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="elements">Elementos</TabsTrigger>
            </TabsList>

            <TabsContent value="design" className="p-4 space-y-4">
              <div>
                <Label htmlFor="template-name">Nome do Template</Label>
                <Input
                  id="template-name"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={editingTemplate.description}
                  onChange={(e) => setEditingTemplate(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                />
              </div>

              <div>
                <Label>Cor de Fundo</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={editingTemplate.background_color}
                    onChange={(e) => setEditingTemplate(prev => ({
                      ...prev,
                      background_color: e.target.value
                    }))}
                    className="w-12 h-8 rounded border"
                  />
                  <Input
                    value={editingTemplate.background_color}
                    onChange={(e) => setEditingTemplate(prev => ({
                      ...prev,
                      background_color: e.target.value
                    }))}
                  />
                </div>
              </div>

              <div>
                <Label>Estilo da Borda</Label>
                <Select
                  value={editingTemplate.border_style}
                  onValueChange={(value: CertificateTemplate['border_style']) =>
                    setEditingTemplate(prev => ({ ...prev, border_style: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem borda</SelectItem>
                    <SelectItem value="simple">Simples</SelectItem>
                    <SelectItem value="elegant">Elegante</SelectItem>
                    <SelectItem value="modern">Moderno</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="elements" className="p-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Adicionar Elementos</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {elementTypes.map(({ type, label, icon: Icon }) => (
                      <Button
                        key={type}
                        variant="outline"
                        size="sm"
                        onClick={() => addElement(type as CertificateElement['type'])}
                        className="h-auto p-3 flex flex-col gap-1"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-xs">{label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {selectedElementData && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Propriedades do Elemento</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedElementData.type === 'text' && (
                        <>
                          <div>
                            <Label className="text-xs">Conteúdo</Label>
                            <Input
                              value={selectedElementData.content}
                              onChange={(e) => updateElement(selectedElement!, { content: e.target.value })}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Tamanho da Fonte</Label>
                            <Input
                              type="number"
                              value={selectedElementData.font_size}
                              onChange={(e) => updateElement(selectedElement!, { font_size: Number(e.target.value) })}
                              className="h-8"
                            />
                          </div>
                        </>
                      )}
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">X</Label>
                          <Input
                            type="number"
                            value={selectedElementData.x}
                            onChange={(e) => updateElement(selectedElement!, { x: Number(e.target.value) })}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Y</Label>
                          <Input
                            type="number"
                            value={selectedElementData.y}
                            onChange={(e) => updateElement(selectedElement!, { y: Number(e.target.value) })}
                            className="h-8"
                          />
                        </div>
                      </div>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteElement(selectedElement!)}
                        className="w-full"
                      >
                        Remover Elemento
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-4 bg-gray-100">
          <div className="bg-white shadow-lg mx-auto" style={{ width: '800px', height: '600px' }}>
            <div
              ref={canvasRef}
              className="relative w-full h-full"
              style={{
                backgroundColor: editingTemplate.background_color,
                border: editingTemplate.border_style !== 'none' ? '2px solid #ccc' : 'none'
              }}
            >
              {editingTemplate.elements.map((element) => (
                <div
                  key={element.id}
                  className={`absolute cursor-pointer border-2 ${
                    selectedElement === element.id ? 'border-blue-500' : 'border-transparent'
                  } hover:border-blue-300`}
                  style={{
                    left: element.x,
                    top: element.y,
                    width: element.width,
                    height: element.height,
                    fontSize: element.font_size,
                    fontWeight: element.font_weight,
                    textAlign: element.align,
                    color: element.color
                  }}
                  onClick={() => setSelectedElement(element.id)}
                >
                  {element.type === 'text' && (
                    <div className="w-full h-full flex items-center justify-center">
                      {element.content}
                    </div>
                  )}
                  {element.type === 'date' && (
                    <div className="w-full h-full flex items-center justify-center text-sm">
                      {new Date().toLocaleDateString('pt-BR')}
                    </div>
                  )}
                  {element.type === 'signature' && (
                    <div className="w-full h-full flex items-center justify-center text-sm border-t border-gray-400">
                      Assinatura
                    </div>
                  )}
                  {element.type === 'qr-code' && (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-xs">
                      QR Code
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
