
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Trophy, 
  Calendar,
  BookOpen,
  Target,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'achievement' | 'reminder' | 'alert' | 'info' | 'goal' | 'training';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  actionLabel?: string;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onDismiss?: (notificationId: string) => void;
  onAction?: (notification: Notification) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  onAction
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'achievement': return Trophy;
      case 'reminder': return Calendar;
      case 'alert': return AlertTriangle;
      case 'goal': return Target;
      case 'training': return BookOpen;
      default: return Info;
    }
  };

  const getIconColor = (type: string, priority: string) => {
    if (priority === 'high') return 'text-red-500';
    
    switch (type) {
      case 'achievement': return 'text-yellow-500';
      case 'reminder': return 'text-blue-500';
      case 'alert': return 'text-orange-500';
      case 'goal': return 'text-purple-500';
      case 'training': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return `Hoje, ${format(date, 'HH:mm')}`;
    }
    
    if (isYesterday(date)) {
      return `Ontem, ${format(date, 'HH:mm')}`;
    }
    
    return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
  };

  const sortedNotifications = [...notifications].sort((a, b) => {
    // Unread first, then by timestamp (newest first)
    if (a.read !== b.read) {
      return a.read ? 1 : -1;
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>Notificações</span>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
        
        {unreadCount > 0 && onMarkAllAsRead && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onMarkAllAsRead}
            className="text-xs"
          >
            Marcar todas como lidas
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-96">
          {sortedNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Nenhuma notificação
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {sortedNotifications.map((notification) => {
                const Icon = getIcon(notification.type);
                
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 border-l-4 transition-colors hover:bg-muted/50 cursor-pointer",
                      !notification.read ? "bg-blue-50 border-l-blue-500" : "border-l-transparent",
                      notification.priority === 'high' && "border-l-red-500"
                    )}
                    onClick={() => {
                      if (!notification.read && onMarkAsRead) {
                        onMarkAsRead(notification.id);
                      }
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className={cn(
                        "h-5 w-5 mt-0.5 flex-shrink-0",
                        getIconColor(notification.type, notification.priority)
                      )} />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={cn(
                              "text-sm font-medium",
                              !notification.read && "font-semibold"
                            )}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatDate(notification.timestamp)}
                            </p>
                          </div>
                          
                          {onDismiss && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDismiss(notification.id);
                              }}
                              className="h-6 w-6 p-0 ml-2"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        
                        {notification.actionLabel && onAction && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAction(notification);
                            }}
                            className="mt-3 text-xs"
                          >
                            {notification.actionLabel}
                          </Button>
                        )}
                      </div>
                      
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
