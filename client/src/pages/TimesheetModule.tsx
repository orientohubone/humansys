import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Clock, 
  Play, 
  Pause, 
  Square, 
  Calendar as CalendarIcon, 
  Users, 
  BarChart3, 
  Timer,
  Coffee,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  Filter,
  Loader2,
  Zap
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTimesheet } from '@/hooks/useTimesheet';
import { useCollaborators } from '@/hooks/useCollaborators';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';


interface ClockState {
  isClockingIn: boolean;
  clockedIn: boolean;
  onBreak: boolean;
  currentSession: {
    clockIn?: string;
    breakStart?: string;
    breakEnd?: string;
  };
}

export const TimesheetModule: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { timesheets, loading: timesheetsLoading, createTimesheet, updateTimesheet } = useTimesheet();
  const { collaborators, isLoading: collaboratorsLoading } = useCollaborators();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [clockState, setClockState] = useState<ClockState>({
    isClockingIn: false,
    clockedIn: false,
    onBreak: false,
    currentSession: {}
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClockIn = async () => {
    if (!user?.id) {
      toast({ title: "Erro", description: "Usuário não autenticado", variant: "destructive" });
      return;
    }
    
    setIsLoadingAction(true);
    try {
      const now = new Date();
      
      const currentCollaborator = collaborators.find(c => c.email === user.email);
      if (!currentCollaborator) {
        toast({ title: "Erro", description: "Colaborador não encontrado", variant: "destructive" });
        return;
      }

      const success = await createTimesheet({
        collaborator_id: currentCollaborator.id,
        date: new Date(),
        clock_in: now,
        status: 'pending',
        location: 'Escritório Central'
      });

      if (success) {
        setClockState(prev => ({
          ...prev,
          clockedIn: true,
          currentSession: {
            ...prev.currentSession,
            clockIn: format(now, 'HH:mm')
          }
        }));
        toast({ title: "Sucesso", description: "Jornada iniciada com sucesso!" });
      }
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleClockOut = async () => {
    if (!user?.id) return;
    
    setIsLoadingAction(true);
    try {
      const now = new Date();

      const todayEntry = timesheets.find(t => {
        const entryDate = new Date(t.date);
        const today = new Date();
        return entryDate.toDateString() === today.toDateString() && !t.clock_out;
      });

      if (!todayEntry) {
        toast({ title: "Erro", description: "Nenhuma jornada ativa encontrada", variant: "destructive" });
        return;
      }

      const clockInTime = new Date(todayEntry.clock_in || new Date());
      const totalHours = (now.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
      const overtimeHours = Math.max(0, totalHours - 8);
      
      const success = await updateTimesheet(todayEntry.id, {
        clock_out: now,
        total_hours: parseFloat(totalHours.toFixed(2)),
        overtime_hours: parseFloat(overtimeHours.toFixed(2))
      });

      if (success) {
        setClockState(prev => ({
          ...prev,
          clockedIn: false,
          onBreak: false,
          currentSession: {}
        }));
        toast({ title: "Sucesso", description: `Jornada finalizada! Total: ${totalHours.toFixed(1)}h` });
      }
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleBreakStart = async () => {
    setIsLoadingAction(true);
    try {
      const now = new Date();

      const todayEntry = timesheets.find(t => {
        const entryDate = new Date(t.date);
        const today = new Date();
        return entryDate.toDateString() === today.toDateString() && !t.break_start;
      });

      if (!todayEntry) {
        toast({ title: "Erro", description: "Nenhuma jornada ativa", variant: "destructive" });
        return;
      }

      const success = await updateTimesheet(todayEntry.id, {
        break_start: now
      });

      if (success) {
        setClockState(prev => ({
          ...prev,
          onBreak: true,
          currentSession: {
            ...prev.currentSession,
            breakStart: format(now, 'HH:mm')
          }
        }));
        toast({ title: "Pausa iniciada", description: "Bom descanso!" });
      }
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleBreakEnd = async () => {
    setIsLoadingAction(true);
    try {
      const now = new Date();

      const todayEntry = timesheets.find(t => {
        const entryDate = new Date(t.date);
        const today = new Date();
        return entryDate.toDateString() === today.toDateString() && t.break_start && !t.break_end;
      });

      if (!todayEntry) {
        toast({ title: "Erro", description: "Nenhuma pausa ativa", variant: "destructive" });
        return;
      }

      const success = await updateTimesheet(todayEntry.id, {
        break_end: now
      });

      if (success) {
        setClockState(prev => ({
          ...prev,
          onBreak: false,
          currentSession: {
            ...prev.currentSession,
            breakEnd: format(now, 'HH:mm')
          }
        }));
        toast({ title: "Pausa finalizada", description: "Bem vindo de volta!" });
      }
    } finally {
      setIsLoadingAction(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    
    const labels = {
      pending: 'Pendente',
      approved: 'Aprovado',
      rejected: 'Rejeitado'
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  // Map timesheets from API to display format with collaborator data
  const mappedTimesheets = useMemo(() => {
    return timesheets.map(timesheet => {
      const collaborator = collaborators.find(c => c.id === timesheet.collaborator_id);
      return {
        ...timesheet,
        employee: {
          name: collaborator?.name || 'Desconhecido',
          position: collaborator?.role || '-'
        },
        date: new Date(timesheet.date),
        clockIn: timesheet.clock_in ? format(new Date(timesheet.clock_in), 'HH:mm') : undefined,
        clockOut: timesheet.clock_out ? format(new Date(timesheet.clock_out), 'HH:mm') : undefined,
        breakStart: timesheet.break_start ? format(new Date(timesheet.break_start), 'HH:mm') : undefined,
        breakEnd: timesheet.break_end ? format(new Date(timesheet.break_end), 'HH:mm') : undefined,
        totalHours: timesheet.total_hours || 0,
        overtimeHours: timesheet.overtime_hours || 0,
        location: timesheet.location || 'N/A'
      };
    });
  }, [timesheets, collaborators]);

  const weekDays = eachDayOfInterval({
    start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
    end: endOfWeek(selectedDate, { weekStartsOn: 1 })
  });

  const totalHoursWeek = useMemo(() => {
    return mappedTimesheets
      .filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startOfWeek(selectedDate, { weekStartsOn: 1 }) &&
               entryDate <= endOfWeek(selectedDate, { weekStartsOn: 1 });
      })
      .reduce((sum, entry) => sum + entry.totalHours, 0);
  }, [mappedTimesheets, selectedDate]);

  const totalOvertimeHours = useMemo(() => {
    return mappedTimesheets.reduce((sum, entry) => sum + entry.overtimeHours, 0);
  }, [mappedTimesheets]);

  const averageHoursPerDay = totalHoursWeek / 7;

  return (
    <DashboardLayout>
      <div className="space-y-4 xs:space-y-6 p-3 xs:p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 xs:gap-0">
          <div>
            <h1 className="text-2xl xs:text-3xl font-bold text-gray-900 dark:text-white">
              Ponto Digital
            </h1>
            <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Controle de jornada eletrônico
            </p>
          </div>
        <div className="flex gap-2 xs:gap-3 w-full xs:w-auto flex-col xs:flex-row">
          <Button variant="outline" size="sm" className="w-full xs:w-auto text-xs xs:text-sm">
            <Download className="h-4 w-4 mr-2" />
            Relatório
          </Button>
          <Button variant="outline" size="sm" className="w-full xs:w-auto text-xs xs:text-sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Current Time and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
        {/* Clock Display */}
        <Card className="lg:col-span-2 bg-white dark:bg-gray-900/50">
          <CardContent className="p-4 xs:p-6 sm:p-8">
            <div className="text-center">
              <div className="text-4xl xs:text-5xl font-mono font-bold text-gray-900 dark:text-white mb-2">
                {format(currentTime, 'HH:mm:ss')}
              </div>
              <div className="text-sm xs:text-base text-gray-500 dark:text-gray-400 mb-4 xs:mb-6">
                {format(currentTime, "EEEE, d 'de' MMMM", { locale: ptBR })}
              </div>
              
              {/* Clock Actions */}
              <div className="flex flex-col xs:flex-row justify-center gap-2 xs:gap-3 sm:gap-4">
                {!clockState.clockedIn ? (
                  <Button 
                    size="sm" 
                    onClick={handleClockIn} 
                    disabled={isLoadingAction}
                    className="w-full xs:w-auto bg-green-600 hover:bg-green-700 text-xs xs:text-sm"
                  >
                    {isLoadingAction ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 xs:h-5 w-4 xs:w-5 mr-1 xs:mr-2" />}
                    {isLoadingAction ? "Registrando..." : "Iniciar"}
                  </Button>
                ) : (
                  <>
                    {!clockState.onBreak ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={handleBreakStart} 
                        disabled={isLoadingAction}
                        className="w-full xs:w-auto text-xs xs:text-sm"
                      >
                        {isLoadingAction ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Coffee className="h-4 xs:h-5 w-4 xs:w-5 mr-1 xs:mr-2" />}
                        Pausa
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={handleBreakEnd} 
                        disabled={isLoadingAction}
                        className="w-full xs:w-auto bg-blue-600 hover:bg-blue-700 text-xs xs:text-sm"
                      >
                        {isLoadingAction ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 xs:h-5 w-4 xs:w-5 mr-1 xs:mr-2" />}
                        Retomar
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={handleClockOut} 
                      disabled={isLoadingAction}
                      className="w-full xs:w-auto text-xs xs:text-sm"
                    >
                      {isLoadingAction ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Square className="h-4 xs:h-5 w-4 xs:w-5 mr-1 xs:mr-2" />}
                      Finalizar
                    </Button>
                  </>
                )}
              </div>

              {/* Current Session Info */}
              {clockState.clockedIn && (
                <div className="mt-4 xs:mt-6 p-3 xs:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4 text-xs xs:text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Entrada:</span>
                      <span className="ml-2 font-medium">{clockState.currentSession.clockIn}</span>
                    </div>
                    {clockState.currentSession.breakStart && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Pausa:</span>
                        <span className="ml-2 font-medium text-xs">
                          {clockState.currentSession.breakStart}
                          {clockState.currentSession.breakEnd && ` - ${clockState.currentSession.breakEnd}`}
                        </span>
                      </div>
                    )}
                  </div>
                  {clockState.onBreak && (
                    <div className="mt-2 xs:mt-3 flex items-center justify-center">
                      <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 text-xs">
                        <Pause className="h-3 w-3 mr-1" />
                        Em Pausa
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Summary */}
        <div className="space-y-3 xs:space-y-6">
          <Card className="bg-white dark:bg-gray-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base xs:text-lg">
                <Timer className="h-4 xs:h-5 w-4 xs:w-5 mr-2 flex-shrink-0" />
                <span>Resumo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs xs:text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Total:</span>
                <span className="font-bold text-base xs:text-lg">{totalHoursWeek.toFixed(1)}h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Média:</span>
                <span className="font-medium">{averageHoursPerDay.toFixed(1)}h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Extras:</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">{totalOvertimeHours.toFixed(1)}h</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base xs:text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 xs:space-y-3 text-xs xs:text-sm">
              <div className="flex items-center gap-2 xs:gap-3">
                <div className={`w-2 xs:w-3 h-2 xs:h-3 rounded-full flex-shrink-0 ${
                  clockState.clockedIn ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`} />
                <span className="font-medium">
                  {clockState.clockedIn ? 'Jornada Ativa' : 'Fora do Expediente'}
                </span>
              </div>
              <div className="flex items-center gap-2 xs:gap-3">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300 truncate">Escritório Central</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="timesheet" className="space-y-4 xs:space-y-6">
        <TabsList className="w-full h-auto flex flex-wrap gap-1 xs:gap-2 p-1 xs:p-2 bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg" data-testid="timesheet-tabs">
          <TabsTrigger value="timesheet" className="text-xs xs:text-sm py-1 xs:py-2 px-2 xs:px-3 flex-1 xs:flex-initial min-w-fit text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800">Registros</TabsTrigger>
          <TabsTrigger value="calendar" className="text-xs xs:text-sm py-1 xs:py-2 px-2 xs:px-3 flex-1 xs:flex-initial min-w-fit text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800">Calendário</TabsTrigger>
          <TabsTrigger value="reports" className="text-xs xs:text-sm py-1 xs:py-2 px-2 xs:px-3 flex-1 xs:flex-initial min-w-fit text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800">Relatórios</TabsTrigger>
        </TabsList>

        {/* Timesheet Records */}
        <TabsContent value="timesheet" className="space-y-3 xs:space-y-6">
          <Card className="bg-white dark:bg-gray-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base xs:text-lg">Registros - Semana</CardTitle>
              <CardDescription className="text-xs xs:text-sm">
                Controle de horários e aprovações
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 xs:p-4">
              <div className="overflow-x-auto -mx-3 xs:-mx-4 px-3 xs:px-4">
                <table className="w-full text-xs xs:text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 xs:py-3 px-2 xs:px-4 font-medium text-gray-600 dark:text-gray-400">
                        Colaborador
                      </th>
                      <th className="text-left py-2 xs:py-3 px-2 xs:px-4 font-medium text-gray-600 dark:text-gray-400">
                        Data
                      </th>
                      <th className="text-left py-2 xs:py-3 px-2 xs:px-4 font-medium text-gray-600 dark:text-gray-400">
                        Entrada
                      </th>
                      <th className="text-left py-2 xs:py-3 px-2 xs:px-4 font-medium text-gray-600 dark:text-gray-400">
                        Saída
                      </th>
                      <th className="text-left py-2 xs:py-3 px-2 xs:px-4 font-medium text-gray-600 dark:text-gray-400">
                        Total
                      </th>
                      <th className="text-left py-2 xs:py-3 px-2 xs:px-4 font-medium text-gray-600 dark:text-gray-400">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {timesheetsLoading ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 xs:py-4 px-2 xs:px-4" colSpan={6}>
                            <Skeleton className="h-12 w-full" />
                          </td>
                        </tr>
                      ))
                    ) : mappedTimesheets.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 xs:py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <Clock className="h-10 xs:h-12 w-10 xs:w-12 text-gray-400 mb-3 xs:mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                              Nenhum registro
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              Registre o primeiro ponto
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      mappedTimesheets.map((entry) => (
                      <motion.tr
                        key={entry.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="py-2 xs:py-4 px-2 xs:px-4">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white text-xs xs:text-sm">
                              {entry.employee.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 hidden xs:block">
                              {entry.employee.position}
                            </div>
                          </div>
                        </td>
                        <td className="py-2 xs:py-4 px-2 xs:px-4 whitespace-nowrap">
                          {format(new Date(entry.date), "dd/MM")}
                        </td>
                        <td className="py-2 xs:py-4 px-2 xs:px-4 whitespace-nowrap">
                          {entry.clockIn || '-'}
                        </td>
                        <td className="py-2 xs:py-4 px-2 xs:px-4 whitespace-nowrap">
                          {entry.clockOut || '-'}
                        </td>
                        <td className="py-2 xs:py-4 px-2 xs:px-4 font-medium whitespace-nowrap">
                          {entry.totalHours.toFixed(1)}h
                        </td>
                        <td className="py-2 xs:py-4 px-2 xs:px-4">
                          {getStatusBadge(entry.status)}
                        </td>
                      </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar View */}
        <TabsContent value="calendar" className="space-y-3 xs:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
            <Card className="lg:col-span-2 bg-white dark:bg-gray-900/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base xs:text-lg">Calendário</CardTitle>
              </CardHeader>
              <CardContent className="p-3 xs:p-4">
                <div className="overflow-x-auto">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base xs:text-lg">Semana</CardTitle>
              </CardHeader>
              <CardContent className="p-3 xs:p-4">
                <div className="space-y-2 xs:space-y-3 text-xs xs:text-sm">
                  {weekDays.map((day) => {
                    const dayEntry = mappedTimesheets.find(entry => 
                      format(new Date(entry.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
                    );
                    
                    return (
                      <div key={day.toISOString()} className="flex justify-between items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            dayEntry ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                          <span className={`truncate ${isToday(day) ? 'font-bold text-emerald-600 dark:text-emerald-400' : ''}`}>
                            {format(day, 'EEE dd/MM', { locale: ptBR })}
                          </span>
                        </div>
                        <span className="font-medium flex-shrink-0 ml-2">
                          {dayEntry ? `${dayEntry.totalHours.toFixed(1)}h` : '-'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports" className="space-y-3 xs:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
            <Card className="bg-white dark:bg-gray-900/50">
              <CardContent className="flex items-center p-3 xs:p-4 gap-2 xs:gap-4">
                <div className="flex items-center justify-center w-10 xs:w-12 h-10 xs:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
                  <Clock className="h-5 xs:h-6 w-5 xs:w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs xs:text-sm font-medium text-gray-500 dark:text-gray-400">Horas/Mês</p>
                  <p className="text-lg xs:text-2xl font-bold text-gray-900 dark:text-white truncate">{(totalHoursWeek * 4.3).toFixed(0)}h</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900/50">
              <CardContent className="flex items-center p-3 xs:p-4 gap-2 xs:gap-4">
                <div className="flex items-center justify-center w-10 xs:w-12 h-10 xs:h-12 bg-green-100 dark:bg-green-900 rounded-lg flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs xs:text-sm font-medium text-gray-500 dark:text-gray-400">Aprovados</p>
                  <p className="text-lg xs:text-2xl font-bold text-gray-900 dark:text-white">
                    {mappedTimesheets.length > 0 
                      ? Math.round((mappedTimesheets.filter(t => t.status === 'approved').length / mappedTimesheets.length) * 100)
                      : 0}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900/50">
              <CardContent className="flex items-center p-3 xs:p-4 gap-2 xs:gap-4">
                <div className="flex items-center justify-center w-10 xs:w-12 h-10 xs:h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex-shrink-0">
                  <AlertTriangle className="h-5 xs:h-6 w-5 xs:w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs xs:text-sm font-medium text-gray-500 dark:text-gray-400">Pendentes</p>
                  <p className="text-lg xs:text-2xl font-bold text-gray-900 dark:text-white">{mappedTimesheets.filter(t => t.status === 'pending').length}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900/50">
              <CardContent className="flex items-center p-3 xs:p-4 gap-2 xs:gap-4">
                <div className="flex items-center justify-center w-10 xs:w-12 h-10 xs:h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex-shrink-0">
                  <Users className="h-5 xs:h-6 w-5 xs:w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs xs:text-sm font-medium text-gray-500 dark:text-gray-400">Ativos</p>
                  <p className="text-lg xs:text-2xl font-bold text-gray-900 dark:text-white">{collaborators.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </DashboardLayout>
  );
};