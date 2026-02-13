
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Video, MapPin, Zap } from 'lucide-react';
import { SmartScheduler } from './SmartScheduler';
import { useToast } from '@/hooks/use-toast';

interface MeetingScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultParticipants?: string[];
  meetingType?: 'onboarding' | 'feedback' | 'training' | 'general';
}

export const MeetingScheduleDialog: React.FC<MeetingScheduleDialogProps> = ({
  open,
  onOpenChange,
  defaultParticipants = [],
  meetingType = 'general'
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('smart');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '60',
    type: meetingType,
    location: '',
    meetingUrl: '',
    participants: defaultParticipants
  });

  const handleSmartSchedule = (suggestion: any) => {
    const startDate = new Date(suggestion.start_time);
    const endDate = new Date(suggestion.end_time);
    
    setFormData(prev => ({
      ...prev,
      date: startDate.toISOString().split('T')[0],
      time: startDate.toTimeString().slice(0, 5),
      duration: Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60)).toString()
    }));
    
    setActiveTab('manual');
    
    toast({
      title: "Horário selecionado",
      description: `Reunião agendada para ${startDate.toLocaleDateString('pt-BR')} às ${startDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
    });
  };

  const handleScheduleMeeting = () => {
    if (!formData.title || !formData.date || !formData.time) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha título, data e horário.",
        variant: "destructive"
      });
      return;
    }

    // Here would be the API call to create the meeting
    console.log('Criando reunião:', formData);
    
    toast({
      title: "Reunião agendada!",
      description: "A reunião foi criada com sucesso."
    });
    
    onOpenChange(false);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      duration: '60',
      type: meetingType,
      location: '',
      meetingUrl: '',
      participants: defaultParticipants
    });
  };

  const getMeetingTypeLabel = (type: string) => {
    const labels = {
      onboarding: 'Onboarding',
      feedback: 'Feedback',
      training: 'Treinamento',
      general: 'Geral'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Agendar Nova Reunião</span>
          </DialogTitle>
          <DialogDescription>
            Use a IA para encontrar o melhor horário ou agende manualmente
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="smart" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Agendamento Inteligente</span>
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Agendamento Manual</span>
            </TabsTrigger>
          </TabsList>

          <div className="overflow-auto max-h-[calc(90vh-200px)]">
            <TabsContent value="smart" className="mt-6">
              <SmartScheduler
                onSchedule={handleSmartSchedule}
                participantIds={defaultParticipants}
                meetingType={meetingType}
              />
            </TabsContent>

            <TabsContent value="manual" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título da Reunião *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Reunião de Onboarding - João Silva"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descrição opcional da reunião"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Tipo de Reunião</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value: 'onboarding' | 'feedback' | 'training' | 'general') => 
                        setFormData(prev => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="onboarding">Onboarding</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="training">Treinamento</SelectItem>
                        <SelectItem value="general">Geral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="date">Data *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Horário *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="duration">Duração</Label>
                    <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="60">1 hora</SelectItem>
                        <SelectItem value="90">1h 30min</SelectItem>
                        <SelectItem value="120">2 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location">Local</Label>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Sala de reuniões, endereço..."
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="meetingUrl">Link da Reunião</Label>
                    <div className="flex items-center space-x-2">
                      <Video className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="meetingUrl"
                        value={formData.meetingUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, meetingUrl: e.target.value }))}
                        placeholder="https://meet.google.com/..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              {formData.title && formData.date && formData.time && (
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <h4 className="font-medium mb-2">Resumo da Reunião</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Título:</strong> {formData.title}</div>
                    <div><strong>Tipo:</strong> <Badge variant="secondary">{getMeetingTypeLabel(formData.type)}</Badge></div>
                    <div><strong>Data:</strong> {new Date(formData.date).toLocaleDateString('pt-BR')}</div>
                    <div><strong>Horário:</strong> {formData.time} ({formData.duration} min)</div>
                    {formData.location && <div><strong>Local:</strong> {formData.location}</div>}
                    {formData.meetingUrl && <div><strong>Link:</strong> {formData.meetingUrl}</div>}
                  </div>
                </div>
              )}
            </TabsContent>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            {activeTab === 'manual' && (
              <Button onClick={handleScheduleMeeting}>
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Reunião
              </Button>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
