import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  PlayCircle, 
  BookOpen, 
  Users, 
  Clock, 
  Star, 
  Award,
  Brain,
  CheckCircle2,
  TrendingUp,
  User
} from 'lucide-react';

interface TrainingData {
  id: string;
  title: string;
  description: string;
  instructor?: string;
  duration: string;
  participants: number;
  rating?: number;
  thumbnail?: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  training_type?: 'course' | 'simulation' | 'workshop';
  ai_generated?: boolean;
  enrollment?: {
    status: 'not-enrolled' | 'enrolled' | 'in-progress' | 'completed';
    progress?: number;
    completed_at?: string;
  };
  badges_earned?: number;
  certificate_available?: boolean;
  simulations?: any[];
  learning_objectives?: string[];
}

interface ModernTrainingCardProps {
  training: TrainingData;
  onStart: () => void;
}

export const ModernTrainingCard: React.FC<ModernTrainingCardProps> = ({ 
  training, 
  onStart 
}) => {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 border-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    advanced: 'bg-red-100 text-red-800 border-red-200'
  };

  const statusColors = {
    'not-enrolled': 'text-gray-600',
    'enrolled': 'text-blue-600',
    'in-progress': 'text-orange-600',
    'completed': 'text-green-600'
  };

  const typeIcons = {
    course: BookOpen,
    simulation: PlayCircle,
    workshop: Users
  };

  const TypeIcon = typeIcons[training.training_type || 'course'];
  const enrollment = training.enrollment || { status: 'not-enrolled' };

  const getActionButton = () => {
    switch (enrollment.status) {
      case 'completed':
        return (
          <Button variant="outline" className="w-full" onClick={onStart}>
            <Award className="mr-2 h-4 w-4" />
            Revisar Conteúdo
          </Button>
        );
      case 'in-progress':
        return (
          <Button className="w-full" onClick={onStart}>
            <TrendingUp className="mr-2 h-4 w-4" />
            Continuar ({enrollment.progress}%)
          </Button>
        );
      case 'enrolled':
        return (
          <Button className="w-full" onClick={onStart}>
            <PlayCircle className="mr-2 h-4 w-4" />
            Iniciar Treinamento
          </Button>
        );
      default:
        return (
          <Button variant="outline" className="w-full" onClick={onStart}>
            <PlayCircle className="mr-2 h-4 w-4" />
            Inscrever-se
          </Button>
        );
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-blue-300">
      <CardHeader className="pb-3">
        {/* Header with Type and AI Badge */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <TypeIcon className="h-4 w-4 text-blue-600" />
            </div>
            {training.ai_generated && (
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                <Brain className="mr-1 h-3 w-3" />
                IA
              </Badge>
            )}
          </div>
          {enrollment.status === 'completed' && (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          )}
        </div>

        {/* Title and Description */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg leading-tight group-hover:text-blue-600 transition-colors">
            {training.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {training.description}
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {training.difficulty && (
            <Badge 
              variant="outline" 
              className={difficultyColors[training.difficulty]}
            >
              {training.difficulty}
            </Badge>
          )}
          {training.category && (
            <Badge variant="outline">
              {training.category}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3 space-y-4">
        {/* Progress Bar for enrolled/in-progress */}
        {enrollment.status === 'in-progress' && enrollment.progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-medium">{enrollment.progress}%</span>
            </div>
            <Progress value={enrollment.progress} className="h-2" />
          </div>
        )}

        {/* Instructor and Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {training.instructor && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground truncate">
                {training.instructor}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {training.duration}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {training.participants} participantes
            </span>
          </div>

          {training.rating && (
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-muted-foreground">
                {training.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Learning Objectives Preview */}
        {training.learning_objectives && training.learning_objectives.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Objetivos de Aprendizagem:
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              {training.learning_objectives.slice(0, 2).map((objective, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-1">{objective}</span>
                </li>
              ))}
              {training.learning_objectives.length > 2 && (
                <li className="text-blue-600">
                  +{training.learning_objectives.length - 2} mais objetivos
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {training.certificate_available && (
            <Badge variant="outline" className="text-xs">
              <Award className="mr-1 h-3 w-3" />
              Certificado
            </Badge>
          )}
          {training.simulations && training.simulations.length > 0 && (
            <Badge variant="outline" className="text-xs">
              <PlayCircle className="mr-1 h-3 w-3" />
              Simulações
            </Badge>
          )}
          {training.badges_earned && training.badges_earned > 0 && (
            <Badge variant="outline" className="text-xs">
              <Star className="mr-1 h-3 w-3" />
              {training.badges_earned} badges
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        {getActionButton()}
      </CardFooter>
    </Card>
  );
};