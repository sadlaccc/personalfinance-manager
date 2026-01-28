import { Expense, expenseCategoryLabels, expenseCategoryColors, frequencyMultipliers } from '@/types/expense';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2, ArrowDownCircle, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpenseCard({ expense, onEdit, onDelete }: ExpenseCardProps) {
  const monthlyAmount = expense.amount * frequencyMultipliers[expense.frequency];
  const formattedAmount = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(expense.amount);

  const formattedMonthly = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(monthlyAmount);

  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300">
      <div className="absolute top-0 left-0 w-1 h-full bg-destructive" />
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-destructive/10">
              <ArrowDownCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                {expense.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full text-white',
                  expenseCategoryColors[expense.category]
                )}>
                  {expenseCategoryLabels[expense.category]}
                </span>
                <span className="text-xs text-muted-foreground capitalize">
                  {expense.frequency}
                </span>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(expense)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(expense.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-destructive">
              {formattedAmount}
            </p>
            {expense.frequency !== 'monthly' && expense.frequency !== 'one-time' && (
              <p className="text-sm text-muted-foreground">
                {formattedMonthly}/mo
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <Calendar className="w-3.5 h-3.5" />
            {format(new Date(expense.date), 'MMM d, yyyy')}
          </div>
        </div>
        
        {expense.description && (
          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
            {expense.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
