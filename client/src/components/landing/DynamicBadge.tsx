import React from 'react';
import { Badge } from '@/components/ui/badge';

interface DynamicBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const DynamicBadge: React.FC<DynamicBadgeProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <Badge 
      className={`mb-6 bg-primary/10 text-primary hover:bg-primary/20 animate-pulse ${className}`}
    >
      {children}
    </Badge>
  );
};