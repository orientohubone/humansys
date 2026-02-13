
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Plus, Video, MapPin, Loader2, Zap, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export const Meetings = () => {
  const { toast } = useToast();
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [syncingGoogle, setSyncingGoogle] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [meetings, setMeetings] = useState([
    {
      id: '1',
      title: 'Reunião 1:1 - João Silva',
      date: '2024-01-25',
      time: '14:00',
      duration: '30 min',
      type: 'one-on-one',
      location: 'Sala de Reuniões A',
      participants: ['João Silva'],
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Feedback Trimestral - Ana Costa',
      date: '2024-01-26',
      time: '10:00',
      duration: '45 min',
      type: 'feedback',
      location: 'Online - Google Meet',
      participants: ['Ana Costa'],
      status: 'scheduled'
    }
  ]);

  const handleScheduleMeeting = () => {
    setShowScheduleDialog(true);
  };

  const handleSyncGoogle = async () => {
    setSyncingGoogle(true);
    try {
      // Simulating sync with Google Calendar API
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Sincronizado!",
        description: "Calendário sincronizado com Google Calendar com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro ao sincronizar",
        description: "Não foi possível sincronizar com Google Calendar.",
        variant: "destructive"
      });
    } finally {
      setSyncingGoogle(false);
    }
  };

  const handleViewDetails = (meeting: any) => {
    setSelectedMeeting(meeting);
    setShowDetailsDialog(true);
  };

  const handleEditMeeting = (meeting: any) => {
    setSelectedMeeting(meeting);
    setEditFormData({
      title: meeting.title,
      date: meeting.date,
      time: meeting.time,
      location: meeting.location,
      duration: meeting.duration
    });
    setShowEditDialog(true);
  };

  const handleSaveMeeting = () => {
    if (selectedMeeting && editFormData) {
      setMeetings(meetings.map(m => 
        m.id === selectedMeeting.id 
          ? { ...m, ...editFormData }
          : m
      ));
      toast({
        title: "Reunião atualizada!",
        description: "As alterações foram salvas com sucesso."
      });
      setShowEditDialog(false);
      setSelectedMeeting(null);
      setEditFormData(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'one-on-one': return Users;
      case 'feedback': return Users;
      case 'team': return Users;
      default: return Calendar;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 xs:space-y-6 p-3 xs:p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 xs:gap-0">
          <div>
            <h1 className="text-2xl xs:text-3xl font-bold text-gray-900 dark:text-white">Reuniões 1:1</h1>
            <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Gerencie reuniões individuais com colaboradores
            </p>
          </div>
          <div className="flex gap-2 xs:gap-3 w-full xs:w-auto flex-col xs:flex-row">
            <Button 
              size="sm"
              variant="outline"
              onClick={handleSyncGoogle}
              disabled={syncingGoogle}
              className="w-full xs:w-auto text-xs xs:text-sm"
              data-testid="sync-google-button"
            >
              {syncingGoogle ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1 xs:mr-2" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-1 xs:mr-2" />
                  <span className="hidden xs:inline">Google</span> Calendar
                </>
              )}
            </Button>
            <Button 
              size="sm"
              onClick={handleScheduleMeeting}
              className="w-full xs:w-auto text-xs xs:text-sm"
              data-testid="schedule-meeting-button"
            >
              <Plus className="h-4 w-4 mr-1 xs:mr-2" />
              Agendar
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
          <Card className="bg-white dark:bg-gray-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 xs:pb-3">
              <CardTitle className="text-xs xs:text-sm font-medium">Este Mês</CardTitle>
              <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            </CardHeader>
            <CardContent className="pt-2 xs:pt-3">
              <div className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white">12</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">agendadas</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 xs:pb-3">
              <CardTitle className="text-xs xs:text-sm font-medium">Realizadas</CardTitle>
              <Users className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            </CardHeader>
            <CardContent className="pt-2 xs:pt-3">
              <div className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white">8</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">este mês</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 xs:pb-3">
              <CardTitle className="text-xs xs:text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            </CardHeader>
            <CardContent className="pt-2 xs:pt-3">
              <div className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white">4</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">aguardando</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 xs:pb-3">
              <CardTitle className="text-xs xs:text-sm font-medium">Taxa</CardTitle>
              <Zap className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            </CardHeader>
            <CardContent className="pt-2 xs:pt-3">
              <div className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white">95%</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">comparecimento</p>
            </CardContent>
          </Card>
        </div>

        {/* Próximas Reuniões */}
        <div className="space-y-3 xs:space-y-4">
          <h3 className="text-base xs:text-lg font-semibold text-gray-900 dark:text-white">Próximas Reuniões</h3>
          
          {meetings.map((meeting) => {
            const TypeIcon = getTypeIcon(meeting.type);
            return (
              <Card key={meeting.id} className="bg-white dark:bg-gray-900/50">
                <CardHeader className="pb-3 xs:pb-4">
                  <div className="flex flex-col xs:flex-row justify-between items-start gap-2 xs:gap-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 xs:gap-3 mb-2 flex-wrap">
                        <TypeIcon className="h-4 xs:h-5 w-4 xs:w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <CardTitle className="text-base xs:text-lg text-gray-900 dark:text-white">{meeting.title}</CardTitle>
                        <Badge variant={getStatusColor(meeting.status)} className="text-xs">
                          {meeting.status === 'scheduled' ? 'Agendada' : 
                           meeting.status === 'completed' ? 'Realizada' : 'Cancelada'}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 xs:gap-4 text-xs xs:text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 xs:h-4 w-3 xs:w-4 flex-shrink-0" />
                          <span className="truncate">{new Date(meeting.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 xs:h-4 w-3 xs:w-4 flex-shrink-0" />
                          <span className="whitespace-nowrap">{meeting.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {meeting.location.includes('Online') ? (
                            <Video className="h-3 xs:h-4 w-3 xs:w-4 flex-shrink-0" />
                          ) : (
                            <MapPin className="h-3 xs:h-4 w-3 xs:w-4 flex-shrink-0" />
                          )}
                          <span className="truncate">{meeting.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-2 xs:pt-3">
                  <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 xs:gap-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs xs:text-sm text-gray-600 dark:text-gray-400">Participantes:</span>
                      {meeting.participants.map((participant, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {participant}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 w-full xs:w-auto">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs xs:text-sm flex-1 xs:flex-initial"
                        onClick={() => handleEditMeeting(meeting)}
                        data-testid={`edit-meeting-${meeting.id}`}
                      >
                        Editar
                      </Button>
                      <Button 
                        size="sm" 
                        className="text-xs xs:text-sm flex-1 xs:flex-initial"
                        onClick={() => handleViewDetails(meeting)}
                        data-testid={`view-meeting-${meeting.id}`}
                      >
                        {meeting.location.includes('Online') ? 'Entrar' : 'Detalhes'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Schedule Meeting Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="w-full max-w-md sm:max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Agendar Reunião
            </DialogTitle>
            <DialogDescription className="text-xs xs:text-sm">
              Crie uma nova reunião 1:1 com um colaborador
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Título *</label>
              <input 
                type="text"
                placeholder="Ex: Reunião 1:1 - João Silva"
                className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Data *</label>
                <input 
                  type="date"
                  className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Horário *</label>
                <input 
                  type="time"
                  className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Participante</label>
              <input 
                type="text"
                placeholder="Nome do colaborador"
                className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Local/Link</label>
              <input 
                type="text"
                placeholder="Sala ou link da reunião"
                className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 flex flex-col xs:flex-row">
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)} className="w-full xs:w-auto text-xs xs:text-sm">
              Cancelar
            </Button>
            <Button onClick={() => {
              toast({ title: "Reunião agendada!", description: "A reunião foi criada com sucesso." });
              setShowScheduleDialog(false);
            }} className="w-full xs:w-auto text-xs xs:text-sm">
              Agendar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="w-full max-w-md sm:max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Detalhes da Reunião
            </DialogTitle>
          </DialogHeader>
          
          {selectedMeeting && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Título</label>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{selectedMeeting.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Data</label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {new Date(selectedMeeting.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Horário</label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{selectedMeeting.time}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Local</label>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{selectedMeeting.location}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Duração</label>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{selectedMeeting.duration}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Participantes</label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {selectedMeeting.participants.map((p: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">{p}</Badge>
                  ))}
                </div>
              </div>

              {selectedMeeting.location.includes('Online') && (
                <Button className="w-full text-xs xs:text-sm" data-testid={`join-meeting-${selectedMeeting.id}`}>
                  <Video className="h-4 w-4 mr-2" />
                  Entrar na Reunião
                </Button>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 flex flex-col xs:flex-row">
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)} className="w-full xs:w-auto text-xs xs:text-sm">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="w-full max-w-md sm:max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Editar Reunião
            </DialogTitle>
            <DialogDescription className="text-xs xs:text-sm">
              Atualize os detalhes da reunião
            </DialogDescription>
          </DialogHeader>
          
          {editFormData && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Título *</label>
                <input 
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Data *</label>
                  <input 
                    type="date"
                    value={editFormData.date}
                    onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Horário *</label>
                  <input 
                    type="time"
                    value={editFormData.time}
                    onChange={(e) => setEditFormData({...editFormData, time: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Local/Link</label>
                <input 
                  type="text"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Duração</label>
                <input 
                  type="text"
                  value={editFormData.duration}
                  onChange={(e) => setEditFormData({...editFormData, duration: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 flex flex-col xs:flex-row">
            <Button variant="outline" onClick={() => setShowEditDialog(false)} className="w-full xs:w-auto text-xs xs:text-sm">
              Cancelar
            </Button>
            <Button onClick={handleSaveMeeting} className="w-full xs:w-auto text-xs xs:text-sm">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};
