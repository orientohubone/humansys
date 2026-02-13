
import React from 'react';
import { Badge } from '@/types/gamification';
import { Card, CardContent } from '@/components/ui/card';
import { Badge as UIBadge } from '@/components/ui/badge';
import { Trophy, Star, Zap, Target, BookOpen, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgeCardProps {
  badge: Badge;
  earned?: boolean;
  earnedDate?: string;
  progress?: number;
  className?: string;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  earned = false,
  earnedDate,
  progress = 0,
  className
}) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'milestone': return Trophy;
      case 'speed': return Zap;
      case 'quality': return Star;
      case 'engagement': return Users;
      case 'goal': return Target;
      case 'training': return BookOpen;
      default: return Trophy;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const Icon = getIcon(badge.category);

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg",
      earned ? "bg-gradient-to-br from-white to-green-50 border-green-200" : "bg-gray-50 border-gray-200",
      !earned && "opacity-60 grayscale",
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "p-2 rounded-full flex items-center justify-center",
            earned ? badge.color : "bg-gray-300"
          )}>
            <Icon className={cn(
              "h-5 w-5",
              earned ? "text-white" : "text-gray-500"
            )} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-sm truncate">{badge.name}</h4>
              <UIBadge 
                variant="secondary" 
                className={cn("text-xs", getRarityColor(badge.rarity))}
              >
                {badge.rarity}
              </UIBadge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {badge.description}
            </p>
            
            {earnedDate && (
              <p className="text-xs text-green-600 mt-1">
                Conquistado em {new Date(earnedDate).toLocaleDateString('pt-BR')}
              </p>
            )}
            
            {!earned && progress > 0 && (
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progresso</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
