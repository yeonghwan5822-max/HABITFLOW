import React from 'react';
import { cn } from '../../lib/utils';
import { Icon, IconName } from '../atoms/Icon';

interface SidebarItemProps {
  icon: IconName;
  label: string;
  active: boolean;
  onClick: () => void;
}

export function SidebarItem({ icon, label, active, onClick }: SidebarItemProps) {
  return (
    <button 
      onClick={onClick}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all duration-200 ease-in-out font-headline text-sm",
        active 
          ? "text-primary font-bold bg-primary/10 border-r-4 border-primary" 
          : "text-muted-foreground hover:bg-muted hover:text-primary"
      )}
    >
      <Icon name={icon} size={20} />
      <span>{label}</span>
    </button>
  );
}
