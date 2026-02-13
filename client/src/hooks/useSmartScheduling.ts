
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Meeting, TimeSlot, SchedulingSuggestion, AvailabilityPreference } from '@/types/meetings';
import { addMinutes, startOfHour, isWithinInterval, parseISO, format } from 'date-fns';

export const useSmartScheduling = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<SchedulingSuggestion[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock data for demonstration - in real app, this would come from API
  const mockAvailability: AvailabilityPreference[] = [
    { user_id = '1', day_of_week: 1, start_time: '09:00', end_time: '17:00', preferred: true },
    { user_id = '1', day_of_week: 2, start_time: '09:00', end_time: '17:00', preferred: true },
    { user_id = '1', day_of_week: 3, start_time: '09:00', end_time: '17:00', preferred: true },
    { user_id = '2', day_of_week: 1, start_time: '10:00', end_time: '18:00', preferred: true },
    { user_id = '2', day_of_week: 2, start_time: '10:00', end_time: '18:00', preferred: true },
  ];

  const mockExistingMeetings: Meeting[] = [
    {
      id: '1',
      title: 'Reunião de Alinhamento',
      start_time: '2024-01-25T14:00:00Z',
      end_time: '2024-01-25T15:00:00Z',
      type: 'general',
      status: 'confirmed',
      organizer_id: '1',
      participants: [],
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    }
  ];

  const generateTimeSlots = useCallback((
    startDate: Date,
    endDate: Date,
    duration: number,
    participantIds: string[]
  ): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const current = startOfHour(startDate);
    
    while (current < endDate) {
      const slotEnd = addMinutes(current, duration);
      
      // Check availability for all participants
      const conflicts = mockExistingMeetings.filter(meeting => {
        const meetingStart = parseISO(meeting.start_time);
        const meetingEnd = parseISO(meeting.end_time);
        
        return isWithinInterval(current, { start: meetingStart, end: meetingEnd }) ||
               isWithinInterval(slotEnd, { start: meetingStart, end: meetingEnd });
      });

      slots.push({
        start: current.toISOString(),
        end: slotEnd.toISOString(),
        available: conflicts.length === 0,
        participants: participantIds,
        conflicts: conflicts.map(c => c.id)
      });

      current.setMinutes(current.getMinutes() + 30); // 30-minute intervals
    }

    return slots;
  }, []);

  const analyzeOptimalTimes = useCallback(async (
    participantIds: string[],
    duration: number,
    preferredDate?: Date,
    timeRange?: { start: string; end: string }
  ): Promise<SchedulingSuggestion[]> => {
    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const searchStart = preferredDate || new Date();
      const searchEnd = addMinutes(searchStart, 7 * 24 * 60); // Search next 7 days

      const timeSlots = generateTimeSlots(searchStart, searchEnd, duration, participantIds);
      const availableSlots = timeSlots.filter(slot => slot.available);

      // Score slots based on various factors
      const scoredSuggestions: SchedulingSuggestion[] = availableSlots
        .slice(0, 10) // Limit to top 10 suggestions
        .map((slot, index) => {
          const startTime = parseISO(slot.start);
          const hour = startTime.getHours();
          const dayOfWeek = startTime.getDay();

          // Scoring algorithm (simplified)
          let score = 50; // Base score

          // Prefer business hours (9-17)
          if (hour >= 9 && hour <= 17) score += 30;
          
          // Prefer weekdays
          if (dayOfWeek >= 1 && dayOfWeek <= 5) score += 20;
          
          // Prefer mid-morning and early afternoon
          if (hour >= 10 && hour <= 11) score += 15;
          if (hour >= 14 && hour <= 15) score += 10;

          // Reduce score for very early or late hours
          if (hour < 8 || hour > 18) score -= 20;

          // Random variation for demonstration
          score += Math.random() * 10 - 5;

          return {
            id: `suggestion_${index}`,
            start_time: slot.start,
            end_time: slot.end,
            confidence_score: Math.min(Math.max(score, 0), 100),
            reasoning: generateReasoning(hour, dayOfWeek, participantIds.length),
            conflicts: slot.conflicts?.length || 0,
            available_participants: participantIds.length,
            total_participants: participantIds.length
          };
        })
        .sort((a, b) => b.confidence_score - a.confidence_score);

      setSuggestions(scoredSuggestions);
      return scoredSuggestions;

    } catch (error) {
      console.error('Erro ao analisar horários:', error);
      toast({
        title: "Erro na análise",
        description: "Não foi possível analisar os horários disponíveis.",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsAnalyzing(false);
    }
  }, [generateTimeSlots, toast]);

  const generateReasoning = (hour: number, dayOfWeek: number, participantCount: number): string => {
    const reasons = [];

    if (hour >= 9 && hour <= 17) {
      reasons.push("horário comercial");
    }

    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      reasons.push("dia útil");
    }

    if (hour >= 10 && hour <= 11) {
      reasons.push("período produtivo da manhã");
    }

    if (hour >= 14 && hour <= 15) {
      reasons.push("início da tarde");
    }

    if (participantCount <= 3) {
      reasons.push("reunião pequena");
    }

    return `Sugerido por: ${reasons.join(", ")}`;
  };

  const checkConflicts = useCallback(async (
    startTime: string,
    endTime: string,
    participantIds: string[]
  ): Promise<Meeting[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const start = parseISO(startTime);
    const end = parseISO(endTime);

    return mockExistingMeetings.filter(meeting => {
      const meetingStart = parseISO(meeting.start_time);
      const meetingEnd = parseISO(meeting.end_time);
      
      return (start < meetingEnd && end > meetingStart);
    });
  }, []);

  const findAlternatives = useCallback(async (
    originalStart: string,
    duration: number,
    participantIds: string[]
  ): Promise<SchedulingSuggestion[]> => {
    const originalDate = parseISO(originalStart);
    
    // Look for alternatives in a 3-day window around the original time
    const searchStart = addMinutes(originalDate, -3 * 24 * 60);
    const searchEnd = addMinutes(originalDate, 3 * 24 * 60);

    return analyzeOptimalTimes(participantIds, duration, searchStart);
  }, [analyzeOptimalTimes]);

  return {
    suggestions,
    isAnalyzing,
    analyzeOptimalTimes,
    checkConflicts,
    findAlternatives,
    setSuggestions
  };
};
