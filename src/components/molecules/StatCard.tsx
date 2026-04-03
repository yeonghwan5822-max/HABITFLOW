import React from 'react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  highlight?: boolean;
}

export function StatCard({ label, value, highlight }: StatCardProps) {
  return (
    <div className={cn(
      "bg-card p-5 rounded-2xl border border-border shadow-sm text-center flex flex-col items-center",
      highlight && "bg-primary/5 border-primary/20"
    )}>
      <span className={cn(
        "text-muted-foreground text-[10px] font-bold uppercase mb-1 tracking-widest", 
        highlight && "text-primary/70"
      )}>
        {label}
      </span>
      <p className={cn(
        "text-sm font-black text-card-foreground font-headline", 
        highlight && "text-primary"
      )}>
        {value}
      </p>
    </div>
  );
}
