
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Survey, SurveyQuestion } from '@/types/surveys';
import { Plus, Trash2, GripVertical, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SurveyBuilderProps {
  survey?: Survey;
  onSave: (survey: Survey) => void;
  onPreview: (survey: Survey) => void;
}

export const SurveyBuilder: React.FC<SurveyBuilderProps> = ({
  survey,
  onSave,
  onPreview
}) => {
  const { toast } = useToast();
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  
  const [editingSurvey, setEditingSurvey] = useState<Survey>(
    survey || {
      id: '',
      title: '',
      description: '',
      type: 'custom',
      status: 'draft',
      questions: [],
      target_audience: [],
      start_date: '',
      end_date: '',
      anonymous: true,
      created_by: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  );

  const questionTypes = [
    { value: 'multiple_choice', label: 'Múltipla Escolha' },
    { value: 'rating', label: 'Avaliação (Estrelas)' },
    { value: 'scale', label: 'Escala Numérica' },
    { value: 'text', label: 'Texto Livre' },
    { value: 'yes_no', label: 'Sim/Não' },
    { value: 'matrix', label: 'Matriz de Perguntas' }
  ];

  const addQuestion = (type: SurveyQuestion['type']) => {
    const newQuestion: SurveyQuestion = {
      id: Date.now().toString(),
      type,
      question: 'Nova pergunta',
      required: false,
      options: type === 'multiple_choice' ? ['Opção 1', 'Opção 2'] : undefined,
      scale_min: type === 'scale' ? 1 : undefined,
      scale_max: type === 'scale' ? 10 : undefined,
      scale_labels: type === 'scale' ? { min: 'Discordo totalmente', max: 'Concordo totalmente' } : undefined
    };

    setEditingSurvey(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
      updated_at: new Date().toISOString()
    }));
  };

  const updateQuestion = (questionId: string, updates: Partial<SurveyQuestion>) => {
    setEditingSurvey(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
      updated_at: new Date().toISOString()
    }));
  };

  const deleteQuestion = (questionId: string) => {
    setEditingSurvey(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId),
      updated_at: new Date().toISOString()
    }));
  };

  const addOption = (questionId: string) => {
    const question = editingSurvey.questions.find(q => q.id === questionId);
    if (question && question.options) {
      updateQuestion(questionId, {
        options: [...question.options, `Opção ${question.options.length + 1}`]
      });
    }
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = editingSurvey.questions.find(q => q.id === questionId);
    if (question && question.options) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = editingSurvey.questions.find(q => q.id === questionId);
    if (question && question.options && question.options.length > 2) {
      const newOptions = question.options.filter((_, index) => index !== optionIndex);
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const handleDragStart = (e: React.DragEvent, questionId: string) => {
    setDraggedItem(questionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetQuestionId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetQuestionId) {
      setDraggedItem(null);
      return;
    }

    const questions = [...editingSurvey.questions];
    const draggedIndex = questions.findIndex(q => q.id === draggedItem);
    const targetIndex = questions.findIndex(q => q.id === targetQuestionId);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedQuestion] = questions.splice(draggedIndex, 1);
      questions.splice(targetIndex, 0, draggedQuestion);
      
      setEditingSurvey(prev => ({
        ...prev,
        questions,
        updated_at: new Date().toISOString()
      }));
    }
    
    setDraggedItem(null);
  };

  const handleSave = () => {
    if (!editingSurvey.title.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, insira um título para a pesquisa.",
        variant: "destructive"
      });
      return;
    }

    if (editingSurvey.questions.length === 0) {
      toast({
        title: "Perguntas obrigatórias",
        description: "A pesquisa deve ter pelo menos uma pergunta.",
        variant: "destructive"
      });
      return;
    }

    onSave(editingSurvey);
    toast({
      title: "Pesquisa salva",
      description: "Pesquisa criada com sucesso!"
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-3 xs:p-4 sm:p-6 space-y-3 xs:space-y-4 sm:space-y-6">
      <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-3 xs:gap-4">
        <div>
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Criar Pesquisa</h2>
          <p className="text-xs xs:text-sm text-muted-foreground mt-1">Configure perguntas e opções</p>
        </div>
        <div className="flex gap-2 flex-col xs:flex-row w-full xs:w-auto">
          <Button variant="outline" onClick={() => onPreview(editingSurvey)} className="text-xs xs:text-sm w-full xs:w-auto dark:bg-gray-800">
            <Eye className="h-3 xs:h-4 w-3 xs:w-4 mr-1 xs:mr-2" />
            Visualizar
          </Button>
          <Button onClick={handleSave} className="text-xs xs:text-sm w-full xs:w-auto">
            Salvar Pesquisa
          </Button>
        </div>
      </div>

      {/* Configurações Gerais */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="pb-3 xs:pb-4">
          <CardTitle className="text-base xs:text-lg text-gray-900 dark:text-white">Configurações Gerais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 xs:space-y-4">
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
            <div>
              <Label htmlFor="title" className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Título da Pesquisa</Label>
              <Input
                id="title"
                value={editingSurvey.title}
                onChange={(e) => setEditingSurvey(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Pesquisa de Clima"
                className="text-xs xs:text-sm px-2 xs:px-3 py-1.5 xs:py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
              />
            </div>
            <div>
              <Label htmlFor="type" className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Tipo de Pesquisa</Label>
              <Select
                value={editingSurvey.type}
                onValueChange={(value: Survey['type']) =>
                  setEditingSurvey(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger className="text-xs xs:text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700">
                  <SelectItem value="climate">Clima Organizacional</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                  <SelectItem value="satisfaction">Satisfação</SelectItem>
                  <SelectItem value="engagement">Engajamento</SelectItem>
                  <SelectItem value="custom">Personalizada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Descrição</Label>
            <Textarea
              id="description"
              value={editingSurvey.description}
              onChange={(e) => setEditingSurvey(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o objetivo..."
              className="text-xs xs:text-sm px-2 xs:px-3 py-1.5 xs:py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white resize-none mt-1"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
            <div>
              <Label htmlFor="start-date" className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Data de Início</Label>
              <Input
                id="start-date"
                type="datetime-local"
                value={editingSurvey.start_date}
                onChange={(e) => setEditingSurvey(prev => ({ ...prev, start_date: e.target.value }))}
                className="text-xs xs:text-sm px-2 xs:px-3 py-1.5 xs:py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
              />
            </div>
            <div>
              <Label htmlFor="end-date" className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Data de Término</Label>
              <Input
                id="end-date"
                type="datetime-local"
                value={editingSurvey.end_date}
                onChange={(e) => setEditingSurvey(prev => ({ ...prev, end_date: e.target.value }))}
                className="text-xs xs:text-sm px-2 xs:px-3 py-1.5 xs:py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 xs:gap-4 p-3 xs:p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
            <Switch
              id="anonymous"
              checked={editingSurvey.anonymous}
              onCheckedChange={(checked) => setEditingSurvey(prev => ({ ...prev, anonymous: checked }))}
              className="data-[state=checked]:bg-green-600"
            />
            <Label htmlFor="anonymous" className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white cursor-pointer flex-1">
              Pesquisa anônima
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Perguntas */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="pb-3 xs:pb-4">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-3">
            <CardTitle className="text-base xs:text-lg text-gray-900 dark:text-white">Perguntas</CardTitle>
            <Select onValueChange={(value: SurveyQuestion['type']) => addQuestion(value)}>
              <SelectTrigger className="text-xs xs:text-sm w-full xs:w-40 sm:w-48 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                <SelectValue placeholder="Adicionar pergunta" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700">
                {questionTypes.map(type => (
                  <SelectItem key={type.value} value={type.value} className="text-xs xs:text-sm">
                    <Plus className="h-3 xs:h-4 w-3 xs:w-4 mr-2 inline" />
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 xs:space-y-4">
            {editingSurvey.questions.map((question, index) => (
              <div
                key={question.id}
                draggable
                onDragStart={(e) => handleDragStart(e, question.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, question.id)}
                className={`border rounded-lg p-2 xs:p-3 sm:p-4 bg-white dark:bg-gray-700 cursor-move transition-all ${
                  draggedItem === question.id ? 'opacity-50' : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-2 xs:gap-3 sm:gap-4">
                  <div className="mt-1 xs:mt-2 hidden xs:block flex-shrink-0">
                    <GripVertical className="h-4 xs:h-5 w-4 xs:w-5 text-muted-foreground" />
                  </div>
                  
                  <div className="flex-1 space-y-2 xs:space-y-3">
                    <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2">
                      <span className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">#{index + 1}</span>
                      <Input
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                        className="flex-1 text-xs xs:text-sm px-2 xs:px-3 py-1.5 xs:py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={question.required}
                          onCheckedChange={(checked) => updateQuestion(question.id, { required: checked })}
                        />
                        <Label className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Obrigatória</Label>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteQuestion(question.id)}
                        className="text-xs dark:text-red-400 dark:hover:bg-gray-600"
                      >
                        <Trash2 className="h-3 xs:h-4 w-3 xs:w-4" />
                      </Button>
                    </div>

                    {question.type === 'multiple_choice' && question.options && (
                      <div className="space-y-1.5 xs:space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-1.5 xs:gap-2">
                            <Input
                              value={option}
                              onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                              placeholder={`Opção ${optionIndex + 1}`}
                              className="flex-1 text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-1.5 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                            />
                            {question.options!.length > 2 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeOption(question.id, optionIndex)}
                                className="text-xs dark:text-red-400 dark:hover:bg-gray-600"
                              >
                                <Trash2 className="h-3 xs:h-4 w-3 xs:w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addOption(question.id)}
                          className="text-xs xs:text-sm w-full xs:w-auto dark:bg-gray-700 dark:border-gray-600"
                        >
                          <Plus className="h-3 xs:h-4 w-3 xs:w-4 mr-1 xs:mr-2" />
                          Adicionar Opção
                        </Button>
                      </div>
                    )}

                    {question.type === 'scale' && (
                      <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
                        <div>
                          <Label className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Valor Mínimo</Label>
                          <Input
                            type="number"
                            value={question.scale_min || 1}
                            onChange={(e) => updateQuestion(question.id, { scale_min: Number(e.target.value) })}
                            className="text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-1.5 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Valor Máximo</Label>
                          <Input
                            type="number"
                            value={question.scale_max || 10}
                            onChange={(e) => updateQuestion(question.id, { scale_max: Number(e.target.value) })}
                            className="text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-1.5 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Rótulo Mínimo</Label>
                          <Input
                            value={question.scale_labels?.min || ''}
                            onChange={(e) => updateQuestion(question.id, {
                              scale_labels: { ...question.scale_labels, min: e.target.value, max: question.scale_labels?.max || '' }
                            })}
                            className="text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-1.5 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Rótulo Máximo</Label>
                          <Input
                            value={question.scale_labels?.max || ''}
                            onChange={(e) => updateQuestion(question.id, {
                              scale_labels: { ...question.scale_labels, max: e.target.value, min: question.scale_labels?.min || '' }
                            })}
                            className="text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-1.5 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {editingSurvey.questions.length === 0 && (
            <div className="text-center py-6 xs:py-8 text-muted-foreground">
              <p className="text-xs xs:text-sm">Nenhuma pergunta adicionada ainda.</p>
              <p className="text-xs text-muted-foreground">Use o menu acima para adicionar perguntas.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
