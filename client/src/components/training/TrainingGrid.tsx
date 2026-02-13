
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play } from 'lucide-react';
import { Training } from '@/types/training';

interface TrainingGridProps {
  trainings: Training[];
  onStartCourse: (courseId: string, courseName: string) => void;
  onViewCourse: (courseId: string) => void;
}

export const TrainingGrid = ({ trainings, onStartCourse, onViewCourse }: TrainingGridProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {trainings.map((course) => (
        <Card key={course.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                <p className="text-sm text-muted-foreground mb-2">
                  {course.description}
                </p>
                <p className="text-sm text-muted-foreground">
                  {course.duration} • {course.instructor || 'Instrutor não definido'}
                </p>
              </div>
              <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                {course.status === 'active' ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {course.participants} participantes
              </span>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onViewCourse(course.id)}
                >
                  Detalhes
                </Button>
                <Button 
                  size="sm"
                  onClick={() => onStartCourse(course.id, course.title)}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Iniciar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
