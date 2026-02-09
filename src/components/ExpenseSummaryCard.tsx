import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, TrendingUp, Receipt, PieChart } from 'lucide-react';
import { Expense, ExpenseCategory, expenseCategoryLabels } from '@/types/expense';
import { format } from 'date-fns';

interface ExpenseSummaryCardProps {
  expenses: Expense[];
  selectedDate: Date;
}

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  housing: 'bg-blue-500',
  utilities: 'bg-yellow-500',
  food: 'bg-green-500',
  transportation: 'bg-purple-500',
  healthcare: 'bg-red-500',
  entertainment: 'bg-pink-500',
  shopping: 'bg-orange-500',
  debt: 'bg-gray-500',
  savings: 'bg-emerald-500',
  other: 'bg-slate-500',
};

export function ExpenseSummaryCard({ expenses, selectedDate }: ExpenseSummaryCardProps) {
  const summary = useMemo(() => {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const count = expenses.length;
    const average = count > 0 ? total / count : 0;

    // Group by category
    const byCategory: Record<string, number> = {};
    expenses.forEach(exp => {
      byCategory[exp.category] = (byCategory[exp.category] || 0) + exp.amount;
    });

    // Sort categories by amount
    const sortedCategories = Object.entries(byCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4);

    // Find highest expense
    const highest = expenses.length > 0 
      ? expenses.reduce((max, exp) => exp.amount > max.amount ? exp : max, expenses[0])
      : null;

    return { total, count, average, sortedCategories, highest };
  }, [expenses]);

  if (expenses.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-destructive/5 via-card to-card border-destructive/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <div className="p-1.5 bg-destructive/10 rounded-lg">
            <PieChart className="h-4 w-4 text-destructive" />
          </div>
          {format(selectedDate, 'MMMM yyyy')} Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-background/50 rounded-xl">
            <div className="flex items-center justify-center gap-1 text-destructive mb-1">
              <TrendingDown className="h-4 w-4" />
            </div>
            <p className="text-lg font-bold text-foreground">
              KSh {summary.total.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Total Spent</p>
          </div>
          <div className="text-center p-3 bg-background/50 rounded-xl">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Receipt className="h-4 w-4" />
            </div>
            <p className="text-lg font-bold text-foreground">{summary.count}</p>
            <p className="text-xs text-muted-foreground">Transactions</p>
          </div>
          <div className="text-center p-3 bg-background/50 rounded-xl">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <TrendingUp className="h-4 w-4" />
            </div>
            <p className="text-lg font-bold text-foreground">
              KSh {Math.round(summary.average).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Average</p>
          </div>
        </div>

        {/* Top Categories */}
        {summary.sortedCategories.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Top Categories
            </p>
            <div className="space-y-2">
              {summary.sortedCategories.map(([category, amount]) => {
                const percentage = (amount / summary.total) * 100;
                return (
                  <div key={category} className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${CATEGORY_COLORS[category as ExpenseCategory] || 'bg-gray-500'}`} />
                    <span className="text-sm flex-1 truncate">
                      {expenseCategoryLabels[category as ExpenseCategory] || category}
                    </span>
                    <span className="text-sm font-medium">
                      KSh {amount.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Highest Expense */}
        {summary.highest && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Largest Expense
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${CATEGORY_COLORS[summary.highest.category as ExpenseCategory] || 'bg-gray-500'}`} />
                <span className="text-sm font-medium truncate max-w-[150px]">
                  {summary.highest.name}
                </span>
              </div>
              <span className="text-sm font-bold text-destructive">
                KSh {summary.highest.amount.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
