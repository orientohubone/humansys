import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface GoogleCalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: { dateTime: string };
  end: { dateTime: string };
  location?: string;
  conferenceData?: { entryPoints: Array<{ uri: string }> };
  attendees?: Array<{ email: string; displayName: string; responseStatus: string }>;
  status: 'tentativelyAccepted' | 'accepted' | 'declined';
}

export const useMeetingsGoogle = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [synced, setSynced] = useState(false);

  const syncCalendar = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Call backend API to sync with Google Calendar
      const response = await fetch('/api/meetings/sync-google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        }
      });

      if (!response.ok) {
        throw new Error('Failed to sync calendar');
      }

      const data = await response.json();
      setEvents(data || []);
      setSynced(true);

      toast({
        title: "Sincronizado!",
        description: `${data.length} eventos sincronizados com sucesso!`
      });
    } catch (error) {
      console.error('Error syncing Google Calendar:', error);
      toast({
        title: "Erro ao sincronizar",
        description: "Não foi possível sincronizar com Google Calendar.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  const createEvent = useCallback(async (eventData: {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    location?: string;
    attendees?: string[];
  }) => {
    if (!user?.id) return false;

    try {
      const response = await fetch('/api/meetings/create-google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      await syncCalendar();
      toast({
        title: "Evento criado!",
        description: "Reunião agendada com sucesso no Google Calendar."
      });

      return true;
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o evento.",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, syncCalendar, toast]);

  return {
    events,
    loading,
    synced,
    syncCalendar,
    createEvent
  };
};
