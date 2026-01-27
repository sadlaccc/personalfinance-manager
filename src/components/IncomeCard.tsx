import { IncomeSource } from '@/hooks/useIncomeSources';
import { categoryLabels, categoryColors } from '@/types/income';
import { frequencyMultipliers } from '@/types/expense';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, TrendingUp, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

interface IncomeCardProps {
  income: IncomeSource;
  onEdit: (income: IncomeSource) => void;
  onDelete: (id: string) => void;
}

const frequencyLabels: Record<string, string> = {
  monthly: 'Monthly',
  weekly: 'Weekly',
  biweekly: 'Bi-weekly',
  quarterly: 'Quarterly',
  yearly: 'Yearly',
  'one-time': 'One-time',
};

export function IncomeCard({ income, onEdit, onDelete }: IncomeCardProps) {
  const monthlyAmount = income.amount * frequencyMultipliers[income.frequency];
  
  return (
    <div className="group relative bg-card border border-border rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:border-primary/20 animate-fade-in">
      {/* Category indicator */}
      <div className={cn(
        "absolute top-0 left-6 w-12 h-1 rounded-b-full",
        categoryColors[income.category]
      )} />
      
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded-full text-primary-foreground",
              categoryColors[income.category]
            )}>
              {categoryLabels[income.category]}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {frequencyLabels[income.frequency] || income.frequency}
            </span>
            {income.date && (
              <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                {format(parseISO(income.date), 'MMM d, yyyy')}
              </span>
            )}
          </div>
          
          <h3 className="font-semibold text-foreground truncate mb-1">
            {income.name}
          </h3>
          
          {income.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {income.description}
            </p>
          )}
          
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-display text-foreground">
              ${income.amount.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">
              /{income.frequency === 'one-time' ? 'once' : income.frequency.replace('ly', '')}
            </span>
          </div>
          
          {income.frequency !== 'monthly' && income.frequency !== 'one-time' && (
            <div className="flex items-center gap-1.5 mt-2 text-sm text-income">
              <TrendingUp className="w-4 h-4" />
              <span>${monthlyAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo equivalent</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9 rounded-xl"
            onClick={() => onEdit(income)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(income.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
