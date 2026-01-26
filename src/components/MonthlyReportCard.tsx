import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface MonthlyReportCardProps {
  month: Date;
  totalIncome: number;
  totalExpenses: number;
  categoryBreakdown: Record<string, number>;
  savingsRate: number;
}

const categoryLabels: Record<string, string> = {
  housing: 'Housing',
  utilities: 'Utilities',
  food: 'Food',
  transportation: 'Transportation',
  healthcare: 'Healthcare',
  entertainment: 'Entertainment',
  shopping: 'Shopping',
  debt: 'Debt',
  savings: 'Savings',
  other: 'Other',
};

const categoryColors: Record<string, string> = {
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

export function MonthlyReportCard({
  month,
  totalIncome,
  totalExpenses,
  categoryBreakdown,
  savingsRate,
}: MonthlyReportCardProps) {
  const netIncome = totalIncome - totalExpenses;
  const sortedCategories = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Monthly Report - {format(month, 'MMMM yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-green-500/10">
              <TrendingUp className="h-5 w-5 text-green-500 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Income</p>
              <p className="font-bold text-green-500">KES {totalIncome.toLocaleString()}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-red-500/10">
              <TrendingDown className="h-5 w-5 text-red-500 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Expenses</p>
              <p className="font-bold text-red-500">KES {totalExpenses.toLocaleString()}</p>
            </div>
            <div className={`text-center p-3 rounded-lg ${netIncome >= 0 ? 'bg-emerald-500/10' : 'bg-orange-500/10'}`}>
              <Wallet className={`h-5 w-5 mx-auto mb-1 ${netIncome >= 0 ? 'text-emerald-500' : 'text-orange-500'}`} />
              <p className="text-xs text-muted-foreground">Net</p>
              <p className={`font-bold ${netIncome >= 0 ? 'text-emerald-500' : 'text-orange-500'}`}>
                KES {netIncome.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-primary/10">
              <PiggyBank className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Savings Rate</p>
              <p className="font-bold text-primary">{savingsRate.toFixed(1)}%</p>
            </div>
          </div>

          <Separator />

          {/* Top Spending Categories */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Top Spending Categories</h4>
            <div className="space-y-3">
              {sortedCategories.map(([category, amount]) => {
                const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                return (
                  <div key={category} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${categoryColors[category] || 'bg-gray-500'}`} />
                    <span className="text-sm flex-1">{categoryLabels[category] || category}</span>
                    <span className="text-sm font-medium">KES {amount.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {sortedCategories.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <p>No expenses recorded for this month</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
