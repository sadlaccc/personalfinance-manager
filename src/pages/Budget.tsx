import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PiggyBank, Loader2, ChevronLeft, ChevronRight, Calendar, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { SetBudgetDialog } from '@/components/SetBudgetDialog';
import { CopyBudgetDialog } from '@/components/CopyBudgetDialog';
import { useCategoryBudgets } from '@/hooks/useCategoryBudgets';
import { useExpenses } from '@/hooks/useExpenses';
import { expenseCategoryLabels, ExpenseCategory } from '@/types/expense';
import { format, subMonths, addMonths, isSameMonth, parseISO, getMonth, getYear } from 'date-fns';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

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

const Budget = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const currentMonth = getMonth(selectedMonth) + 1;
  const currentYear = getYear(selectedMonth);

  const { budgets, upsertBudget, copyFromMonth, isUpdating, isCopying, isLoading: budgetsLoading } = useCategoryBudgets(currentMonth, currentYear);
  const { expenses, isLoading: expensesLoading } = useExpenses({
    month: selectedMonth.getMonth(),
    year: selectedMonth.getFullYear()
  });

  const isLoading = budgetsLoading || expensesLoading;

  // Calculate spending per category for the selected month
  const spendingByCategory = useMemo(() => {
    const spending: Record<string, number> = {};
    expenses
      .filter(expense => {
        const expenseDate = parseISO(expense.date);
        return isSameMonth(expenseDate, selectedMonth);
      })
      .forEach(expense => {
        spending[expense.category] = (spending[expense.category] || 0) + expense.amount;
      });
    return spending;
  }, [expenses, selectedMonth]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    let totalBudget = 0;
    let totalSpent = 0;
    let overBudgetCount = 0;
    let onTrackCount = 0;

    budgets.forEach(budget => {
      totalBudget += budget.budget_amount;
      const spent = spendingByCategory[budget.category] || 0;
      totalSpent += spent;
      if (spent > budget.budget_amount) {
        overBudgetCount++;
      } else {
        onTrackCount++;
      }
    });

    return {
      totalBudget,
      totalSpent,
      remaining: totalBudget - totalSpent,
      overBudgetCount,
      onTrackCount,
      utilizationRate: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
    };
  }, [budgets, spendingByCategory]);

  const handlePreviousMonth = () => setSelectedMonth(prev => subMonths(prev, 1));
  const handleNextMonth = () => setSelectedMonth(prev => addMonths(prev, 1));
  const handleCurrentMonth = () => setSelectedMonth(new Date());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Monthly Budgets</h1>
          <p className="text-muted-foreground text-sm">Set and track your spending limits</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <CopyBudgetDialog
            currentMonth={currentMonth}
            currentYear={currentYear}
            onCopy={copyFromMonth}
            isCopying={isCopying}
          />
          <SetBudgetDialog 
            onSubmit={upsertBudget} 
            existingBudgets={budgets} 
            isUpdating={isUpdating}
          />
          <div className="flex items-center gap-2 bg-card border border-border rounded-xl p-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={handlePreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <button
              onClick={handleCurrentMonth}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-accent transition-colors"
            >
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm min-w-[100px] text-center">
                {format(selectedMonth, 'MMMM yyyy')}
              </span>
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={handleNextMonth}
              disabled={isSameMonth(selectedMonth, new Date())}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <PiggyBank className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Total Budget</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              KSh {summaryStats.totalBudget.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-destructive" />
              </div>
              <span className="text-xs text-muted-foreground">Total Spent</span>
            </div>
            <p className="text-xl font-bold text-destructive">
              KSh {summaryStats.totalSpent.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${summaryStats.remaining >= 0 ? 'bg-income/10' : 'bg-destructive/10'}`}>
                <CheckCircle className={`w-5 h-5 ${summaryStats.remaining >= 0 ? 'text-income' : 'text-destructive'}`} />
              </div>
              <span className="text-xs text-muted-foreground">Remaining</span>
            </div>
            <p className={`text-xl font-bold ${summaryStats.remaining >= 0 ? 'text-income' : 'text-destructive'}`}>
              KSh {Math.abs(summaryStats.remaining).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-category-rental/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-category-rental" />
              </div>
              <span className="text-xs text-muted-foreground">Over Budget</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {summaryStats.overBudgetCount} / {budgets.length}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Overall Progress */}
      {budgets.length > 0 && (
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground">Overall Budget Usage</h2>
            <span className={`text-xl font-bold ${summaryStats.utilizationRate > 100 ? 'text-destructive' : 'text-primary'}`}>
              {summaryStats.utilizationRate.toFixed(0)}%
            </span>
          </div>
          <Progress 
            value={Math.min(summaryStats.utilizationRate, 100)} 
            className={`h-3 ${summaryStats.utilizationRate > 100 ? '[&>div]:bg-destructive' : summaryStats.utilizationRate > 80 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-income'}`}
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>KSh {summaryStats.totalSpent.toLocaleString()} spent</span>
            <span>KSh {summaryStats.totalBudget.toLocaleString()} budgeted</span>
          </div>
        </motion.div>
      )}

      {/* Budget Cards Grid */}
      {budgets.length === 0 ? (
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-12 text-center">
          <div className="bg-secondary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PiggyBank className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">No budgets set for {format(selectedMonth, 'MMMM')}</h3>
          <p className="text-muted-foreground mb-4">Set category budgets to track your spending limits</p>
          <SetBudgetDialog onSubmit={upsertBudget} existingBudgets={budgets} isUpdating={isUpdating} />
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget) => {
            const spent = spendingByCategory[budget.category] || 0;
            const percentage = (spent / budget.budget_amount) * 100;
            const isOverBudget = spent > budget.budget_amount;
            const isNearLimit = percentage >= 80 && !isOverBudget;
            const remaining = budget.budget_amount - spent;

            return (
              <Card key={budget.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${CATEGORY_COLORS[budget.category as ExpenseCategory] || 'bg-gray-500'}`} />
                      {expenseCategoryLabels[budget.category as ExpenseCategory] || budget.category}
                    </CardTitle>
                    {isOverBudget ? (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Over Budget
                      </Badge>
                    ) : isNearLimit ? (
                      <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-600">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Near Limit
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        On Track
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className={`h-2 ${isOverBudget ? '[&>div]:bg-red-500' : isNearLimit ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'}`}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>KSh {spent.toLocaleString()} spent</span>
                      <span>{percentage.toFixed(0)}%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-1 border-t">
                    <span className="text-xs text-muted-foreground">Budget: KSh {budget.budget_amount.toLocaleString()}</span>
                    <span className={`text-sm font-semibold ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
                      {isOverBudget ? '-' : '+'}KSh {Math.abs(remaining).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Budget;
