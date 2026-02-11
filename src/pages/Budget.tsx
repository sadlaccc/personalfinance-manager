import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PiggyBank, Loader2, ChevronLeft, ChevronRight, Calendar, AlertTriangle, CheckCircle, TrendingUp, Pencil, BarChart3, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { SetBudgetDialog } from '@/components/SetBudgetDialog';
import { EditBudgetDialog } from '@/components/EditBudgetDialog';
import { CopyBudgetDialog } from '@/components/CopyBudgetDialog';
import { useCategoryBudgets } from '@/hooks/useCategoryBudgets';
import { useExpenses } from '@/hooks/useExpenses';
import { useProfile } from '@/hooks/useProfile';
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

const CATEGORY_COLORS: Record<ExpenseCategory, { bg: string; text: string; light: string }> = {
  housing: { bg: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', light: 'bg-blue-500/10' },
  utilities: { bg: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', light: 'bg-amber-500/10' },
  food: { bg: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', light: 'bg-emerald-500/10' },
  transportation: { bg: 'bg-violet-500', text: 'text-violet-600 dark:text-violet-400', light: 'bg-violet-500/10' },
  healthcare: { bg: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400', light: 'bg-rose-500/10' },
  entertainment: { bg: 'bg-pink-500', text: 'text-pink-600 dark:text-pink-400', light: 'bg-pink-500/10' },
  shopping: { bg: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400', light: 'bg-orange-500/10' },
  debt: { bg: 'bg-slate-500', text: 'text-slate-600 dark:text-slate-400', light: 'bg-slate-500/10' },
  savings: { bg: 'bg-teal-500', text: 'text-teal-600 dark:text-teal-400', light: 'bg-teal-500/10' },
  other: { bg: 'bg-gray-500', text: 'text-gray-600 dark:text-gray-400', light: 'bg-gray-500/10' },
};

interface Budget {
  id: string;
  category: string;
  budget_amount: number;
}

const Budget = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const currentMonth = getMonth(selectedMonth) + 1;
  const currentYear = getYear(selectedMonth);

  const { budgets, upsertBudget, deleteBudget, copyFromMonth, isUpdating, isCopying, isLoading: budgetsLoading } = useCategoryBudgets(currentMonth, currentYear);
  const { expenses, isLoading: expensesLoading } = useExpenses({
    month: selectedMonth.getMonth(),
    year: selectedMonth.getFullYear()
  });
  const { formatAmount } = useProfile();

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

  // Calculate total actual spending across ALL categories
  const totalActualSpending = useMemo(() => {
    return Object.values(spendingByCategory).reduce((sum, amount) => sum + amount, 0);
  }, [spendingByCategory]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    let totalBudget = 0;
    let totalBudgetedSpent = 0;
    let overBudgetCount = 0;
    let onTrackCount = 0;

    budgets.forEach(budget => {
      totalBudget += budget.budget_amount;
      const spent = spendingByCategory[budget.category] || 0;
      totalBudgetedSpent += spent;
      if (spent > budget.budget_amount) {
        overBudgetCount++;
      } else {
        onTrackCount++;
      }
    });

    return {
      totalBudget,
      totalBudgetedSpent,
      totalActualSpending,
      remaining: totalBudget - totalBudgetedSpent,
      overBudgetCount,
      onTrackCount,
      utilizationRate: totalBudget > 0 ? (totalBudgetedSpent / totalBudget) * 100 : 0
    };
  }, [budgets, spendingByCategory, totalActualSpending]);

  const handlePreviousMonth = () => setSelectedMonth(prev => subMonths(prev, 1));
  const handleNextMonth = () => setSelectedMonth(prev => addMonths(prev, 1));
  const handleCurrentMonth = () => setSelectedMonth(new Date());

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setEditDialogOpen(true);
  };

  const handleDeleteBudget = async (id: string) => {
    await deleteBudget(id);
  };

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
      <motion.div variants={itemVariants} className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
          </div>
        </div>
        <div className="flex items-center justify-center sm:justify-start">
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
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <PiggyBank className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Total Budget</span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-foreground">
              {formatAmount(summaryStats.totalBudget)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{budgets.length} categories</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <ArrowDownRight className="w-4 h-4 text-destructive" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Total Spent</span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-destructive">
              {formatAmount(summaryStats.totalActualSpending)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatAmount(summaryStats.totalBudgetedSpent)} in budgeted
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-2 rounded-lg ${summaryStats.remaining >= 0 ? 'bg-income/10' : 'bg-destructive/10'}`}>
                <CheckCircle className={`w-4 h-4 ${summaryStats.remaining >= 0 ? 'text-income' : 'text-destructive'}`} />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Remaining</span>
            </div>
            <p className={`text-lg sm:text-xl font-bold ${summaryStats.remaining >= 0 ? 'text-income' : 'text-destructive'}`}>
              {summaryStats.remaining < 0 ? '-' : ''}{formatAmount(Math.abs(summaryStats.remaining))}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {summaryStats.remaining >= 0 ? 'Under budget' : 'Over budget'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-2 rounded-lg ${summaryStats.overBudgetCount > 0 ? 'bg-destructive/10' : 'bg-income/10'}`}>
                <AlertTriangle className={`w-4 h-4 ${summaryStats.overBudgetCount > 0 ? 'text-destructive' : 'text-income'}`} />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Over Budget</span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-foreground">
              {summaryStats.overBudgetCount} / {budgets.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {summaryStats.onTrackCount} on track
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Overall Progress */}
      {budgets.length > 0 && (
        <motion.div variants={itemVariants} className="bg-card border border-border/50 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <h2 className="font-display font-semibold text-foreground text-sm sm:text-base">Overall Budget Usage</h2>
            </div>
            <span className={`text-lg sm:text-xl font-bold ${
              summaryStats.utilizationRate > 100 ? 'text-destructive' : 
              summaryStats.utilizationRate > 80 ? 'text-warning' : 'text-income'
            }`}>
              {summaryStats.utilizationRate.toFixed(0)}%
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                summaryStats.utilizationRate > 100 ? 'bg-destructive' :
                summaryStats.utilizationRate > 80 ? 'bg-warning' : 'bg-income'
              }`}
              style={{ width: `${Math.min(summaryStats.utilizationRate, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-muted-foreground mt-2">
            <span>{formatAmount(summaryStats.totalBudgetedSpent)} spent</span>
            <span>{formatAmount(summaryStats.totalBudget)} budgeted</span>
          </div>
        </motion.div>
      )}

      {/* Budget Cards Grid */}
      {budgets.length === 0 ? (
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-8 sm:p-12 text-center">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PiggyBank className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">
            No budgets set for {format(selectedMonth, 'MMMM')}
          </h3>
          <p className="text-muted-foreground mb-6 text-sm max-w-xs mx-auto">
            Set category budgets to track your spending limits and stay on top of your finances
          </p>
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
            const colors = CATEGORY_COLORS[budget.category as ExpenseCategory] || CATEGORY_COLORS.other;

            return (
              <Card 
                key={budget.id} 
                className="overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50"
                onClick={() => handleEditBudget(budget)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${colors.bg}`} />
                      {expenseCategoryLabels[budget.category as ExpenseCategory] || budget.category}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {isOverBudget ? (
                        <Badge variant="destructive" className="text-xs">
                          Over
                        </Badge>
                      ) : isNearLimit ? (
                        <Badge variant="secondary" className="text-xs bg-warning/15 text-warning border-warning/20">
                          Near
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs bg-income/15 text-income border-income/20">
                          OK
                        </Badge>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditBudget(budget);
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOverBudget ? 'bg-destructive' : isNearLimit ? 'bg-warning' : 'bg-income'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatAmount(spent)} spent</span>
                      <span>{percentage.toFixed(0)}%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">Budget: {formatAmount(budget.budget_amount)}</span>
                    <span className={`text-sm font-semibold ${isOverBudget ? 'text-destructive' : 'text-income'}`}>
                      {isOverBudget ? '-' : '+'}{formatAmount(Math.abs(remaining))}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>
      )}

      {/* Edit Budget Dialog */}
      <EditBudgetDialog
        budget={editingBudget}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdate={upsertBudget}
        onDelete={handleDeleteBudget}
        isUpdating={isUpdating}
      />
    </motion.div>
  );
};

export default Budget;
