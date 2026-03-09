import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { useIncomeSources } from '@/hooks/useIncomeSources';
import { useExpenses } from '@/hooks/useExpenses';
import { useCategoryBudgets } from '@/hooks/useCategoryBudgets';
import { useProfile } from '@/hooks/useProfile';
import { categoryLabels, IncomeCategory } from '@/types/income';
import { expenseCategoryLabels, ExpenseCategory } from '@/types/expense';
import { TrendingUp, TrendingDown, Target, Loader2, Wallet, ChevronLeft, ChevronRight, Calendar, PieChart, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, startOfMonth, endOfMonth, subMonths, addMonths, isSameMonth, parseISO, getMonth, getYear } from 'date-fns';
import { SetBudgetDialog } from '@/components/SetBudgetDialog';
import { BudgetProgressCard } from '@/components/BudgetProgressCard';
import { MonthlyReportCard } from '@/components/MonthlyReportCard';
import { CopyBudgetDialog } from '@/components/CopyBudgetDialog';
import { ExportReportDialog } from '@/components/ExportReportDialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';

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

const INCOME_COLORS: Record<IncomeCategory, string> = {
  salary: '#3b82f6',
  freelance: '#a855f7',
  investment: '#10b981',
  rental: '#f59e0b',
  business: '#ec4899',
  other: '#6b7280',
};

const EXPENSE_COLORS: Record<ExpenseCategory, string> = {
  housing: '#ef4444',
  utilities: '#f59e0b',
  food: '#f97316',
  transportation: '#0ea5e9',
  healthcare: '#ec4899',
  entertainment: '#8b5cf6',
  shopping: '#6366f1',
  debt: '#dc2626',
  savings: '#10b981',
  other: '#6b7280',
};

const Analytics = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const { user } = useAuth();
  const { formatAmount } = useProfile();
  
  const currentMonth = getMonth(selectedMonth) + 1;
  const currentYear = getYear(selectedMonth);
  
  const { stats: incomeStats, incomeSources, isLoading: incomeLoading } = useIncomeSources({
    month: selectedMonth.getMonth(),
    year: selectedMonth.getFullYear()
  });
  const { expenses, isLoading: expenseLoading } = useExpenses({
    month: selectedMonth.getMonth(),
    year: selectedMonth.getFullYear()
  });
  const { budgets, upsertBudget, copyFromMonth, isUpdating, isCopying } = useCategoryBudgets(currentMonth, currentYear);

  // Fetch 6 months of historical data for trend chart
  const { data: historicalData = [] } = useQuery({
    queryKey: ['analytics-trend', user?.id, selectedMonth.getMonth(), selectedMonth.getFullYear()],
    queryFn: async () => {
      if (!user) return [];
      
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const month = subMonths(selectedMonth, i);
        const monthStart = format(startOfMonth(month), 'yyyy-MM-dd');
        const monthEnd = format(endOfMonth(month), 'yyyy-MM-dd');
        months.push({ month, monthStart, monthEnd, label: format(month, 'MMM') });
      }

      const results = await Promise.all(months.map(async ({ monthStart, monthEnd, label }) => {
        const [incomeRes, expenseRes] = await Promise.all([
          supabase
            .from('income_sources')
            .select('amount')
            .gte('date', monthStart)
            .lte('date', monthEnd),
          supabase
            .from('expenses')
            .select('amount')
            .gte('date', monthStart)
            .lte('date', monthEnd),
        ]);

        const income = (incomeRes.data || []).reduce((sum, r) => sum + Number(r.amount), 0);
        const expensesTotal = (expenseRes.data || []).reduce((sum, r) => sum + Number(r.amount), 0);

        return { name: label, income: Math.round(income), expenses: Math.round(expensesTotal) };
      }));

      return results;
    },
    enabled: !!user,
  });

  const isLoading = incomeLoading || expenseLoading;

  // Filter expenses by selected month
  const monthlyExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const expenseDate = parseISO(expense.date);
      return isSameMonth(expenseDate, selectedMonth);
    });
  }, [expenses, selectedMonth]);

  const monthlyExpenseStats = useMemo(() => {
    const byCategory: Record<ExpenseCategory, number> = {
      housing: 0, utilities: 0, food: 0, transportation: 0, healthcare: 0,
      entertainment: 0, shopping: 0, debt: 0, savings: 0, other: 0,
    };
    let totalMonthly = 0;
    monthlyExpenses.forEach(expense => {
      totalMonthly += expense.amount;
      byCategory[expense.category] += expense.amount;
    });
    return { totalMonthly, totalYearly: totalMonthly * 12, byCategory, expenseCount: monthlyExpenses.length };
  }, [monthlyExpenses]);

  const incomeCategoryData = Object.entries(incomeStats.byCategory)
    .filter(([_, value]) => value > 0)
    .map(([category, value]) => ({
      name: categoryLabels[category as IncomeCategory],
      value: Math.round(value),
      fill: INCOME_COLORS[category as IncomeCategory],
    }))
    .sort((a, b) => b.value - a.value);

  const expenseCategoryData = Object.entries(monthlyExpenseStats.byCategory)
    .filter(([_, value]) => value > 0)
    .map(([category, value]) => ({
      name: expenseCategoryLabels[category as ExpenseCategory],
      value: Math.round(value),
      fill: EXPENSE_COLORS[category as ExpenseCategory],
    }))
    .sort((a, b) => b.value - a.value);

  const netData = [
    { name: 'Income', value: Math.round(incomeStats.totalMonthly), fill: '#10b981' },
    { name: 'Expenses', value: Math.round(monthlyExpenseStats.totalMonthly), fill: '#ef4444' },
  ];

  const netMonthly = incomeStats.totalMonthly - monthlyExpenseStats.totalMonthly;
  const savingsRate = incomeStats.totalMonthly > 0 
    ? ((netMonthly / incomeStats.totalMonthly) * 100).toFixed(1)
    : '0';

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
      {/* Month Selector */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Analytics</h2>
          <p className="text-muted-foreground text-sm">Track your financial trends and patterns</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <ExportReportDialog
            monthlyIncome={incomeStats.totalMonthly}
            monthlyExpenses={monthlyExpenseStats.totalMonthly}
            expensesByCategory={monthlyExpenseStats.byCategory}
            incomeByCategory={incomeStats.byCategory}
            selectedMonth={selectedMonth}
          />
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
              variant="ghost" size="icon" className="h-8 w-8 rounded-lg"
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
        <div className="bg-card border border-border/50 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 bg-income/10 rounded-xl">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-income" />
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground">Income</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold font-display text-income">
            +{formatAmount(incomeStats.totalMonthly)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {incomeStats.sourceCount} source{incomeStats.sourceCount !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="bg-card border border-border/50 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 bg-destructive/10 rounded-xl">
              <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground">Expenses</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold font-display text-destructive">
            -{formatAmount(monthlyExpenseStats.totalMonthly)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {monthlyExpenseStats.expenseCount} expense{monthlyExpenseStats.expenseCount !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="bg-card border border-border/50 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground">Net Balance</span>
          </div>
          <p className={`text-lg sm:text-2xl font-bold font-display ${netMonthly >= 0 ? 'text-income' : 'text-destructive'}`}>
            {netMonthly >= 0 ? '+' : ''}{formatAmount(Math.abs(netMonthly))}
          </p>
        </div>
        
        <div className="bg-card border border-border/50 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 bg-category-rental/10 rounded-xl">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-category-rental" />
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground">Savings Rate</span>
          </div>
          <p className={`text-lg sm:text-2xl font-bold font-display ${parseFloat(savingsRate) >= 0 ? 'text-income' : 'text-destructive'}`}>
            {savingsRate}%
          </p>
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* 6-Month Trend */}
        <motion.div variants={itemVariants} className="bg-card border border-border/50 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold text-base sm:text-lg text-foreground">
              6-Month Trend
            </h3>
          </div>
          <div className="h-64">
            {historicalData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                No data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historicalData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--income))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--income))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      fontSize: '13px',
                    }}
                    formatter={(value: number, name: string) => [formatAmount(value), name === 'income' ? 'Income' : 'Expenses']}
                  />
                  <Area type="monotone" dataKey="income" stroke="hsl(var(--income))" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="expenses" stroke="hsl(var(--destructive))" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpenses)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex justify-center gap-6 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-income" />
              <span className="text-xs text-muted-foreground">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-xs text-muted-foreground">Expenses</span>
            </div>
          </div>
        </motion.div>

        {/* Income vs Expenses Pie */}
        <motion.div variants={itemVariants} className="bg-card border border-border/50 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-ticket" />
            <h3 className="font-display font-semibold text-base sm:text-lg text-foreground">
              {format(selectedMonth, 'MMMM')} Distribution
            </h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={netData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {netData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                  }}
                  formatter={(value: number) => [formatAmount(value), '']}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-income" />
              <span className="text-xs text-muted-foreground">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-xs text-muted-foreground">Expenses</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category Breakdowns */}
      <div className="grid lg:grid-cols-2 gap-5">
        <motion.div variants={itemVariants} className="bg-card border border-border/50 rounded-2xl p-5 sm:p-6">
          <h3 className="font-display font-semibold text-base sm:text-lg text-foreground mb-4">
            Income by Category
          </h3>
          <div className="h-64">
            {incomeCategoryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                No income in {format(selectedMonth, 'MMMM yyyy')}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeCategoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                    formatter={(value: number) => [formatAmount(value), 'Amount']}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-card border border-border/50 rounded-2xl p-5 sm:p-6">
          <h3 className="font-display font-semibold text-base sm:text-lg text-foreground mb-4">
            {format(selectedMonth, 'MMMM')} Expenses by Category
          </h3>
          <div className="h-64">
            {expenseCategoryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                No expenses in {format(selectedMonth, 'MMMM yyyy')}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseCategoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                    formatter={(value: number) => [formatAmount(value), 'Amount']}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>

      {/* Budget Progress */}
      {budgets.length > 0 && (
        <motion.div variants={itemVariants}>
          <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Budget Tracking — {format(selectedMonth, 'MMMM yyyy')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((budget) => (
              <BudgetProgressCard
                key={budget.id}
                category={budget.category}
                spent={monthlyExpenseStats.byCategory[budget.category as ExpenseCategory] || 0}
                budget={budget.budget_amount}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Monthly Report */}
      <motion.div variants={itemVariants}>
        <MonthlyReportCard
          month={selectedMonth}
          totalIncome={incomeStats.totalMonthly}
          totalExpenses={monthlyExpenseStats.totalMonthly}
          categoryBreakdown={monthlyExpenseStats.byCategory}
          savingsRate={incomeStats.totalMonthly > 0 ? (netMonthly / incomeStats.totalMonthly) * 100 : 0}
        />
      </motion.div>
    </motion.div>
  );
};

export default Analytics;
