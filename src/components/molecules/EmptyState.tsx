import React from 'react';
import { Icon, IconName } from '../atoms/Icon';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  icon: IconName;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center bg-card rounded-3xl border border-border border-dashed", className)}>
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-4">
        <Icon name={icon} size={32} />
      </div>
      <h3 className="text-lg font-bold text-card-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">{description}</p>
      {action}
    </div>
  );
}
