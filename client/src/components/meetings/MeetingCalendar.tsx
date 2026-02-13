
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Video, MapPin, MoreHorizontal } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Meeting } from '@/types/meetings';

interface MeetingCalendarProps {
  meetings: Meeting[];
  onMeetingClick: (meeting: Meeting) => void;
  onDateClick: (date: Date) => void;
}

export const MeetingCalendar: React.FC<MeetingCalendarProps> = ({
  meetings,
  onMeetingClick,
  onDateClick
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock meetings for demonstration
  const mockMeetings: Meeting[] = [
    {
      id: '1',
      title: 'Onboarding - João Silva',
      description: 'Primeira reunião de integração',
      start_time: '2024-01-25T10:00:00Z',
      end_time: '2024-01-25T11:00:00Z',
      type: 'onboarding',
      status: 'confirmed',
      location: 'Sala de Reuniões A',
      organizer_id: '1',
      participants: [],
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '2',
      title: 'Feedback Mensal - Maria Santos',
      description: 'Reunião de feedback e avaliação',
      start_time: '2024-01-25T14:00:00Z',
      end_time: '2024-01-25T15:00:00Z',
      type: 'feedback',
      status: 'scheduled',
      meeting_url: 'https://meet.google.com/abc-defg-hij',
      organizer_id: '1',
      participants: [],
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '3',
      title: 'Treinamento de Segurança',
      description: 'Sessão de treinamento obrigatório',
      start_time: '2024-01-26T09:00:00Z',
      end_time: '2024-01-26T10:30:00Z',
      type: 'training',
      status: 'confirmed',
      location: 'Auditório Principal',
      organizer_id: '1',
      participants: [],
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    }
  ];

  const allMeetings = [...meetings, ...mockMeetings];

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const getMeetingsForDate = (date: Date) => {
    return allMeetings.filter(meeting => 
      isSameDay(new Date(meeting.start_time), date)
    );
  };

  const getTypeColor = (type: Meeting['type']) => {
    const colors = {
      onboarding: 'bg-blue-500',
      feedback: 'bg-green-500',
      training: 'bg-purple-500',
      general: 'bg-gray-500'
    };
    return colors[type];
  };

  const getStatusColor = (status: Meeting['status']) => {
    const colors = {
      scheduled: 'border-yellow-300 bg-yellow-50',
      confirmed: 'border-green-300 bg-green-50',
      cancelled: 'border-red-300 bg-red-50',
      completed: 'border-gray-300 bg-gray-50'
    };
    return colors[status];
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Calendário de Reuniões</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              ←
            </Button>
            <span className="font-medium min-w-[120px] text-center">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              →
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {/* Weekday Headers */}
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {calendarDays.map(day => {
            const dayMeetings = getMeetingsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div
                key={day.toISOString()}
                onClick={() => onDateClick(day)}
                className={`
                  min-h-[100px] p-1 border rounded cursor-pointer hover:bg-muted/50 transition-colors
                  ${!isCurrentMonth ? 'opacity-40' : ''}
                  ${isToday ? 'bg-primary/10 border-primary' : 'border-border'}
                `}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : ''}`}>
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-1">
                  {dayMeetings.slice(0, 2).map(meeting => (
                    <div
                      key={meeting.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMeetingClick(meeting);
                      }}
                      className={`
                        p-1 rounded text-xs cursor-pointer border-l-2 
                        ${getStatusColor(meeting.status)}
                      `}
                    >
                      <div className="font-medium truncate">{meeting.title}</div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{format(new Date(meeting.start_time), 'HH:mm')}</span>
                      </div>
                    </div>
                  ))}
                  
                  {dayMeetings.length > 2 && (
                    <div className="text-xs text-muted-foreground p-1">
                      +{dayMeetings.length - 2} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-sm">Onboarding</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm">Feedback</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span className="text-sm">Treinamento</span>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {allMeetings.length} reuniões este mês
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
