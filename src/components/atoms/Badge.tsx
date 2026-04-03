import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ 
  variant = 'primary', 
  children, 
  className,
  ...props
}: BadgeProps) {
  const variants = {
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-primary/10 text-primary',
    outline: 'border border-border text-muted-foreground',
  };

  return (
    <span 
      className={cn(
        'px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
