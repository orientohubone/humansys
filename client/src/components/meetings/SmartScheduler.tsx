
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  Users, 
  Brain, 
  Calendar as CalendarIcon,
  AlertTriangle,
  CheckCircle,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useSmartScheduling } from '@/hooks/useSmartScheduling';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SmartSchedulerProps {
  onSchedule: (suggestion: any) => void;
  participantIds?: string[];
  defaultDuration?: number;
  meetingType?: 'onboarding' | 'feedback' | 'training' | 'general';
}

export const SmartScheduler: React.FC<SmartSchedulerProps> = ({
  onSchedule,
  participantIds = [],
  defaultDuration = 60,
  meetingType = 'general'
}) => {
  const { suggestions, isAnalyzing, analyzeOptimalTimes } = useSmartScheduling();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [duration, setDuration] = useState(defaultDuration);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(participantIds);
  const [timeRange, setTimeRange] = useState({ start: '09:00', end: '17:00' });

  const handleAnalyze = async () => {
    await analyzeOptimalTimes(
      selectedParticipants,
      duration,
      selectedDate,
      timeRange
    );
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getConfidenceText = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Regular';
    return 'Baixo';
  };

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>Agendamento Inteligente</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label>Data Preferencial</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  locale={ptBR}
                  className="rounded-md border"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Duração (minutos)</Label>
                <Select value={duration.toString()} onValueChange={(value) => setDuration(Number(value))}>
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Início</Label>
                  <Input
                    type="time"
                    value={timeRange.start}
                    onChange={(e) => setTimeRange(prev => ({ ...prev, start: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Fim</Label>
                  <Input
                    type="time"
                    value={timeRange.end}
                    onChange={(e) => setTimeRange(prev => ({ ...prev, end: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Participantes</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {selectedParticipants.length} participante(s) selecionado(s)
                  </span>
                </div>
              </div>

              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analisando...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Analisar Horários
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Sugestões da IA</span>
              </div>
              <Badge variant="secondary">{suggestions.length} opções encontradas</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    
                    <div>
                      <div className="font-medium">
                        {format(parseISO(suggestion.start_time), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(parseISO(suggestion.start_time), 'HH:mm', { locale: ptBR })} - {' '}
                        {format(parseISO(suggestion.end_time), 'HH:mm', { locale: ptBR })}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {suggestion.reasoning}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-center">
                      <div className={`w-3 h-3 rounded-full ${getConfidenceColor(suggestion.confidence_score)} mb-1`}></div>
                      <div className="text-xs font-medium">
                        {getConfidenceText(suggestion.confidence_score)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(suggestion.confidence_score)}%
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      {suggestion.conflicts === 0 ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {suggestion.available_participants}/{suggestion.total_participants}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => onSchedule(suggestion)}
                      className="ml-2"
                    >
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Agendar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isAnalyzing && suggestions.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-8">
            <div className="text-center">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">IA Pronta para Ajudar</h3>
              <p className="text-muted-foreground mb-4">
                Configure os parâmetros acima e clique em "Analisar Horários" para receber sugestões inteligentes
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Otimização automática</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>Conflitos detectados</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>Scoring inteligente</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
