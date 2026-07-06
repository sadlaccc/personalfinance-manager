import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  variant?: 'default' | 'primary' | 'income' | 'destructive';
  className?: string;
  trend?: number[];
  delta?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  variant = 'default',
  className,
  trend,
  delta,
}: StatsCardProps) {
  const isTinted = variant !== 'default';
  const strokeColor =
    variant === 'income' || variant === 'primary'
      ? 'hsl(var(--income-foreground))'
      : variant === 'destructive'
      ? 'hsl(var(--destructive-foreground))'
      : 'hsl(var(--primary))';

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className={cn(
        'relative overflow-hidden rounded-2xl p-5 transition-shadow duration-300 hover:shadow-lg group',
        variant === 'default' && 'bg-card border border-border/60',
        variant === 'primary' && 'bg-gradient-hero text-primary-foreground',
        variant === 'income' && 'bg-gradient-income text-income-foreground',
        variant === 'destructive' && 'bg-destructive text-destructive-foreground',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1.5 min-w-0">
          <p
            className={cn(
              'text-xs font-medium tracking-wide uppercase',
              isTinted ? 'opacity-85' : 'text-muted-foreground',
            )}
          >
            {title}
          </p>
          <p className="text-[1.6rem] font-bold font-display tracking-tight leading-none">
            {value}
          </p>
          {subtitle && (
            <p className={cn('text-xs', isTinted ? 'opacity-80' : 'text-muted-foreground')}>
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={cn(
            'p-2.5 rounded-xl shrink-0 transition-transform group-hover:scale-105',
            variant === 'default' && 'bg-secondary text-primary',
            variant === 'primary' && 'bg-primary-foreground/15',
            variant === 'income' && 'bg-income-foreground/15',
            variant === 'destructive' && 'bg-destructive-foreground/15',
          )}
        >
          {icon}
        </div>
      </div>

      {trend && trend.length > 1 && (
        <div className={cn('mt-3 -mx-1', isTinted ? 'opacity-70' : 'opacity-60')}>
          <Sparklines data={trend} height={28} margin={4}>
            <SparklinesLine style={{ stroke: strokeColor, strokeWidth: 2, fill: 'none' }} />
            <SparklinesSpots size={2} style={{ fill: strokeColor }} />
          </Sparklines>
        </div>
      )}

      {delta && (
        <span
          className={cn(
            'absolute top-3 right-3 text-[10px] font-semibold px-1.5 py-0.5 rounded-md',
            isTinted ? 'bg-white/15' : 'bg-muted text-muted-foreground',
          )}
        >
          {delta}
        </span>
      )}

      {isTinted && (
        <div className="absolute -right-10 -bottom-10 w-28 h-28 rounded-full bg-primary-foreground/10 blur-md pointer-events-none" />
      )}
    </motion.div>
  );
}
