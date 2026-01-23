import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  variant?: 'default' | 'primary' | 'income';
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  variant = 'default',
  className 
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:shadow-lg",
        variant === 'default' && "bg-card border border-border",
        variant === 'primary' && "bg-gradient-hero text-primary-foreground",
        variant === 'income' && "bg-gradient-income text-income-foreground",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={cn(
            "text-sm font-medium",
            variant === 'default' ? "text-muted-foreground" : "opacity-90"
          )}>
            {title}
          </p>
          <p className="text-3xl font-bold font-display tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className={cn(
              "text-sm",
              variant === 'default' ? "text-muted-foreground" : "opacity-80"
            )}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl",
          variant === 'default' && "bg-secondary",
          variant === 'primary' && "bg-primary-foreground/20",
          variant === 'income' && "bg-income-foreground/20"
        )}>
          {icon}
        </div>
      </div>
      
      {/* Decorative element */}
      {variant !== 'default' && (
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-primary-foreground/10" />
      )}
    </div>
  );
}
