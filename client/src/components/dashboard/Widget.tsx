
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Maximize2, Minimize2, Settings, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface WidgetProps {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  onRemove?: (id: string) => void;
  onExpand?: (id: string) => void;
  onConfigure?: (id: string) => void;
  isExpanded?: boolean;
  isDragging?: boolean;
}

export const Widget: React.FC<WidgetProps> = ({
  id,
  title,
  description,
  children,
  className,
  onRemove,
  onExpand,
  onConfigure,
  isExpanded = false,
  isDragging = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className={cn(
        "relative transition-all duration-300 hover:shadow-lg",
        isExpanded && "col-span-2 row-span-2",
        isDragging && "opacity-50 rotate-2 scale-105",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 xs:pb-2">
        <div className="flex flex-col min-w-0 flex-1">
          <CardTitle className="text-xs xs:text-sm font-medium truncate">{title}</CardTitle>
          {description && (
            <CardDescription className="text-xs line-clamp-1">{description}</CardDescription>
          )}
        </div>
        
        {/* Widget Controls */}
        <div className={cn(
          "flex items-center space-x-1 transition-opacity duration-200",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background border border-border">
              {onExpand && (
                <DropdownMenuItem onClick={() => onExpand(id)} className="cursor-pointer">
                  {isExpanded ? (
                    <>
                      <Minimize2 className="mr-2 h-4 w-4" />
                      Minimizar
                    </>
                  ) : (
                    <>
                      <Maximize2 className="mr-2 h-4 w-4" />
                      Expandir
                    </>
                  )}
                </DropdownMenuItem>
              )}
              {onConfigure && (
                <DropdownMenuItem onClick={() => onConfigure(id)} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurar
                </DropdownMenuItem>
              )}
              {onRemove && (
                <DropdownMenuItem 
                  onClick={() => onRemove(id)} 
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <X className="mr-2 h-4 w-4" />
                  Remover
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className={cn(
        "transition-all duration-300",
        isExpanded && "p-6"
      )}>
        {children}
      </CardContent>
    </Card>
  );
};
