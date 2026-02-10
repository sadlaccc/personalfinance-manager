import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from 'lucide-react';
import { IncomeSource } from '@/hooks/useIncomeSources';
import { Expense } from '@/types/expense';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, subDays } from 'date-fns';

interface FinancialSummaryCardProps {
  incomeSources: IncomeSource[];
  expenses: Expense[];
  selectedDate: Date;
  formatAmount: (amount: number) => string;
}

type PeriodOption = 'month' | 'week' | '7days' | '30days' | 'all';

const periodLabels: Record<PeriodOption, string> = {
  month: 'This Month',
  week: 'This Week',
  '7days': 'Last 7 Days',
  '30days': 'Last 30 Days',
  all: 'All',
};

export function FinancialSummaryCard({ incomeSources, expenses, selectedDate, formatAmount }: FinancialSummaryCardProps) {
  const [period, setPeriod] = useState<PeriodOption>('month');

  const filterByPeriod = <T extends { date: string }>(items: T[]): T[] => {
    const now = new Date();
    return items.filter(item => {
      const d = new Date(item.date);
      switch (period) {
        case 'week':
          return d >= startOfWeek(now, { weekStartsOn: 1 }) && d <= endOfWeek(now, { weekStartsOn: 1 });
        case '7days':
          return d >= subDays(now, 7) && d <= now;
        case '30days':
          return d >= subDays(now, 30) && d <= now;
        case 'all':
          return true;
        case 'month':
        default:
          return d >= startOfMonth(selectedDate) && d <= endOfMonth(selectedDate);
      }
    });
  };

  const summary = useMemo(() => {
    const filteredIncome = filterByPeriod(incomeSources);
    const filteredExpenses = filterByPeriod(expenses);

    const totalIncome = filteredIncome.reduce((s, i) => s + i.amount, 0);
    const totalExpenses = filteredExpenses.reduce((s, e) => s + e.amount, 0);
    const net = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    const expenseRatio = totalIncome > 0 ? Math.min((totalExpenses / totalIncome) * 100, 100) : 0;

    return {
      totalIncome,
      totalExpenses,
      net,
      savingsRate: Math.max(savingsRate, 0),
      expenseRatio,
      incomeCount: filteredIncome.length,
      expenseCount: filteredExpenses.length,
    };
  }, [incomeSources, expenses, period, selectedDate]);

  const hasData = summary.incomeCount > 0 || summary.expenseCount > 0;

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-card to-card border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            Financial Summary
          </CardTitle>
          <div className="flex items-center gap-1 flex-wrap">
            {(Object.keys(periodLabels) as PeriodOption[]).map((opt) => (
              <Button
                key={opt}
                variant={period === opt ? 'default' : 'ghost'}
                size="sm"
                className="h-7 text-xs rounded-lg px-2.5"
                onClick={() => setPeriod(opt)}
              >
                {periodLabels[opt]}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasData ? (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No financial data for this period
          </div>
        ) : (
          <>
            {/* Income vs Expense bars */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-income" />
                  <span className="text-xs text-muted-foreground">Income ({summary.incomeCount})</span>
                </div>
                <p className="text-lg font-bold text-income">{formatAmount(summary.totalIncome)}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-destructive" />
                  <span className="text-xs text-muted-foreground">Expenses ({summary.expenseCount})</span>
                </div>
                <p className="text-lg font-bold text-destructive">{formatAmount(summary.totalExpenses)}</p>
              </div>
            </div>

            {/* Expense ratio bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Expense-to-Income Ratio</span>
                <span className="font-medium">{summary.expenseRatio.toFixed(0)}%</span>
              </div>
              <Progress value={summary.expenseRatio} className="h-2" />
            </div>

            {/* Net & Savings */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-background/50 rounded-xl text-center">
                <Wallet className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                <p className={`text-base font-bold ${summary.net >= 0 ? 'text-income' : 'text-destructive'}`}>
                  {summary.net >= 0 ? '+' : ''}{formatAmount(summary.net)}
                </p>
                <p className="text-xs text-muted-foreground">Net Balance</p>
              </div>
              <div className="p-3 bg-background/50 rounded-xl text-center">
                <TrendingUp className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                <p className={`text-base font-bold ${summary.savingsRate >= 20 ? 'text-income' : summary.savingsRate > 0 ? 'text-warning' : 'text-destructive'}`}>
                  {summary.savingsRate.toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground">Savings Rate</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
