import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  MapPin, 
  Calendar, 
  Star, 
  MoreHorizontal,
  TrendingUp,
  MessageSquare 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Collaborator {
  id: string;
  name: string;
  email: string;
  department: string;
  status: string;
  skills: string[];
  performance?: number;
  hireDate: string;
  avatar?: string;
  position?: string;
}

interface CollaboratorCardProps {
  collaborator: Collaborator;
  onViewProfile?: (id: string) => void;
  onSendFeedback?: (id: string) => void;
  onViewPerformance?: (id: string) => void;
  className?: string;
}

const STATUS_CONFIG = {
  ativo: { color: 'bg-green-100 text-green-800', label: 'Ativo' },
  inativo: { color: 'bg-gray-100 text-gray-800', label: 'Inativo' },
  ferias: { color: 'bg-blue-100 text-blue-800', label: 'Férias' },
  licenca: { color: 'bg-orange-100 text-orange-800', label: 'Licença' }
};

const DEPARTMENT_CONFIG = {
  desenvolvimento: { color: 'bg-purple-100 text-purple-800', label: 'Desenvolvimento' },
  marketing: { color: 'bg-pink-100 text-pink-800', label: 'Marketing' },
  rh: { color: 'bg-cyan-100 text-cyan-800', label: 'RH' },
  financeiro: { color: 'bg-yellow-100 text-yellow-800', label: 'Financeiro' }
};

export const CollaboratorCard: React.FC<CollaboratorCardProps> = ({
  collaborator,
  onViewProfile,
  onSendFeedback,
  onViewPerformance,
  className
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getPerformanceColor = (performance?: number) => {
    if (!performance) return 'text-gray-500';
    if (performance >= 90) return 'text-green-600';
    if (performance >= 80) return 'text-blue-600';
    if (performance >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const statusConfig = STATUS_CONFIG[collaborator.status as keyof typeof STATUS_CONFIG];
  const departmentConfig = DEPARTMENT_CONFIG[collaborator.department as keyof typeof DEPARTMENT_CONFIG];

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer",
      "border border-border bg-card",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {getInitials(collaborator.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-base leading-tight">
                {collaborator.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {collaborator.position || 'Colaborador'}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background border border-border">
              <DropdownMenuItem 
                onClick={() => onViewProfile?.(collaborator.id)}
                className="cursor-pointer"
              >
                Ver Perfil
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onSendFeedback?.(collaborator.id)}
                className="cursor-pointer"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Enviar Feedback
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onViewPerformance?.(collaborator.id)}
                className="cursor-pointer"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Ver Performance
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Info */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="mr-2 h-4 w-4" />
            <span className="truncate">{collaborator.email}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            <span>
              Desde {format(new Date(collaborator.hireDate), 'MMM yyyy', { locale: ptBR })}
            </span>
          </div>
        </div>

        {/* Status and Department */}
        <div className="flex items-center gap-2">
          <Badge 
            variant="secondary" 
            className={cn("text-xs", statusConfig?.color)}
          >
            {statusConfig?.label || collaborator.status}
          </Badge>
          <Badge 
            variant="outline" 
            className={cn("text-xs", departmentConfig?.color)}
          >
            {departmentConfig?.label || collaborator.department}
          </Badge>
        </div>

        {/* Performance */}
        {collaborator.performance && (
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <Star className="mr-1 h-4 w-4 text-yellow-500" />
              <span>Performance</span>
            </div>
            <span className={cn(
              "text-sm font-medium",
              getPerformanceColor(collaborator.performance)
            )}>
              {collaborator.performance}%
            </span>
          </div>
        )}

        {/* Skills */}
        {collaborator.skills.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Habilidades
            </h4>
            <div className="flex flex-wrap gap-1">
              {collaborator.skills.slice(0, 3).map(skill => (
                <Badge 
                  key={skill} 
                  variant="secondary" 
                  className="text-xs bg-muted/50"
                >
                  {skill}
                </Badge>
              ))}
              {collaborator.skills.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-muted/50">
                  +{collaborator.skills.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};