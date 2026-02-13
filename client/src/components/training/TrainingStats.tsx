
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Award, Clock } from 'lucide-react';
import { Training } from '@/types/training';

interface TrainingStatsProps {
  trainings: Training[];
  onStatsClick: (type: string) => void;
}

export const TrainingStats = ({ trainings, onStatsClick }: TrainingStatsProps) => {
  const activeTrainings = trainings.filter(t => t.status === 'active');
  const totalParticipants = trainings.reduce((acc, t) => acc + t.participants, 0);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onStatsClick('cursos ativos')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cursos Ativos</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeTrainings.length}</div>
        </CardContent>
      </Card>
      
      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onStatsClick('participantes')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Participantes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalParticipants}</div>
        </CardContent>
      </Card>
      
      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onStatsClick('concluídos')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
          <Award className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">0</div>
        </CardContent>
      </Card>
      
      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onStatsClick('horas totais')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Horas Totais</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">0h</div>
        </CardContent>
      </Card>
    </div>
  );
};
