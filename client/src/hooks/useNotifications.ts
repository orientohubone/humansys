
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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

export const useNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock notifications for demonstration
  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'achievement',
          title: 'Nova Conquista!',
          message: 'Você desbloqueou o badge "Primeira Meta" por completar sua primeira meta.',
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'medium',
          actionLabel: 'Ver Badge'
        },
        {
          id: '2',
          type: 'reminder',
          title: 'Meta próxima do prazo',
          message: 'Sua meta "Aumentar vendas em 20%" vence em 3 dias.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
          priority: 'high',
          actionLabel: 'Ver Meta'
        },
        {
          id: '3',
          type: 'training',
          title: 'Novo treinamento disponível',
          message: 'O curso "Gestão de Conflitos" foi adicionado à sua trilha de aprendizado.',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          read: true,
          priority: 'low',
          actionLabel: 'Começar Curso'
        },
        {
          id: '4',
          type: 'alert',
          title: 'Feedback pendente',
          message: 'Você tem 2 feedbacks pendentes para revisar.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          priority: 'medium',
          actionLabel: 'Ver Feedbacks'
        }
      ];
      
      setNotifications(mockNotifications);
      setIsLoading(false);
    };

    if (user) {
      loadNotifications();
    }
  }, [user]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    toast({
      title: "Notificações marcadas como lidas",
      description: "Todas as notificações foram marcadas como lidas."
    });
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast for high priority notifications
    if (notification.priority === 'high') {
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.type === 'alert' ? 'destructive' : 'default'
      });
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    addNotification
  };
};
