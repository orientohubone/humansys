
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserPlus, BookOpen, MessageSquare, Trophy, FileText, Calendar, Bell } from 'lucide-react';

interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
}

interface ActivityItemProps {
  activity: Activity;
  onViewDetails?: (id: number) => void;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  onViewDetails
}) => {
  const getIcon = (iconName: string) => {
    const iconMap = {
      'UserPlus': UserPlus,
      'BookOpen': BookOpen,
      'MessageSquare': MessageSquare,
      'Trophy': Trophy,
      'FileText': FileText,
      'Calendar': Calendar,
      'Bell': Bell
    };
    
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Bell;
    return IconComponent;
  };

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case 'collaborator_added': return 'bg-green-100 dark:bg-green-900/20';
      case 'training_completed': return 'bg-blue-100 dark:bg-blue-900/20';
      case 'feedback_received': return 'bg-purple-100 dark:bg-purple-900/20';
      case 'goal_achieved': return 'bg-yellow-100 dark:bg-yellow-900/20';
      case 'document_uploaded': return 'bg-gray-100 dark:bg-gray-900/20';
      default: return 'bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const IconComponent = getIcon(activity.icon);

  return (
    <div className="flex items-start gap-2 xs:gap-3 p-2 xs:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
      <div className={`p-1.5 xs:p-2 rounded-lg ${getActivityBgColor(activity.type)} flex-shrink-0`}>
        <IconComponent className={`h-3 xs:h-4 w-3 xs:w-4 ${activity.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-col xs:flex-row items-start xs:items-start xs:justify-between gap-1 xs:gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs xs:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {activity.title}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 xs:mt-1 line-clamp-2">
              {activity.description}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 xs:mt-2">
              {activity.timestamp}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity text-xs h-6 px-1 flex-shrink-0"
            onClick={() => onViewDetails?.(activity.id)}
          >
            <span className="hidden xs:inline">Ver</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
