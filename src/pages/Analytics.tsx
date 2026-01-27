import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { useIncomeSources } from '@/hooks/useIncomeSources';
import { useExpenses } from '@/hooks/useExpenses';
import { useCategoryBudgets } from '@/hooks/useCategoryBudgets';
import { categoryLabels, IncomeCategory } from '@/types/income';
import { expenseCategoryLabels, ExpenseCategory, frequencyMultipliers } from '@/types/expense';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Target, Loader2, Wallet, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, startOfMonth, endOfMonth, subMonths, addMonths, isSameMonth, parseISO, getMonth, getYear } from 'date-fns';
import { SetBudgetDialog } from '@/components/SetBudgetDialog';
import { BudgetProgressCard } from '@/components/BudgetProgressCard';
import { MonthlyReportCard } from '@/components/MonthlyReportCard';
import { CopyBudgetDialog } from '@/components/CopyBudgetDialog';

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
  const { stats: incomeStats, incomeSources, isLoading: incomeLoading } = useIncomeSources();
  const { expenses, isLoading: expenseLoading } = useExpenses();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  
  const currentMonth = getMonth(selectedMonth) + 1;
  const currentYear = getYear(selectedMonth);
  const { budgets, upsertBudget, copyFromMonth, isUpdating, isCopying } = useCategoryBudgets(currentMonth, currentYear);

  const isLoading = incomeLoading || expenseLoading;

  // Filter expenses by selected month
  const monthlyExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const expenseDate = parseISO(expense.date);
      return isSameMonth(expenseDate, selectedMonth);
    });
  }, [expenses, selectedMonth]);

  // Calculate monthly expense stats
  const monthlyExpenseStats = useMemo(() => {
    const byCategory: Record<ExpenseCategory, number> = {
      housing: 0,
      utilities: 0,
      food: 0,
      transportation: 0,
      healthcare: 0,
      entertainment: 0,
      shopping: 0,
      debt: 0,
      savings: 0,
      other: 0,
    };

    let totalMonthly = 0;

    monthlyExpenses.forEach(expense => {
      const amount = expense.amount * frequencyMultipliers[expense.frequency];
      totalMonthly += amount;
      byCategory[expense.category] += amount;
    });

    return {
      totalMonthly,
      totalYearly: totalMonthly * 12,
      byCategory,
      expenseCount: monthlyExpenses.length,
    };
  }, [monthlyExpenses]);

  // Get historical data for the last 6 months
  const historicalData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(selectedMonth, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      
      const monthExpenses = expenses.filter(expense => {
        const expenseDate = parseISO(expense.date);
        return expenseDate >= monthStart && expenseDate <= monthEnd;
      });

      const expenseTotal = monthExpenses.reduce((sum, expense) => {
        return sum + expense.amount * frequencyMultipliers[expense.frequency];
      }, 0);

      months.push({
        name: format(monthDate, 'MMM'),
        income: Math.round(incomeStats.totalMonthly),
        expenses: Math.round(expenseTotal),
      });
    }
    return months;
  }, [expenses, selectedMonth, incomeStats.totalMonthly]);

  // Income category breakdown data
  const incomeCategoryData = Object.entries(incomeStats.byCategory)
    .filter(([_, value]) => value > 0)
    .map(([category, value]) => ({
      name: categoryLabels[category as IncomeCategory],
      value: Math.round(value),
      fill: INCOME_COLORS[category as IncomeCategory],
    }))
    .sort((a, b) => b.value - a.value);

  // Expense category breakdown data for selected month
  const expenseCategoryData = Object.entries(monthlyExpenseStats.byCategory)
    .filter(([_, value]) => value > 0)
    .map(([category, value]) => ({
      name: expenseCategoryLabels[category as ExpenseCategory],
      value: Math.round(value),
      fill: EXPENSE_COLORS[category as ExpenseCategory],
    }))
    .sort((a, b) => b.value - a.value);

  // Net income data for pie chart
  const netData = [
    { name: 'Income', value: Math.round(incomeStats.totalMonthly), fill: '#10b981' },
    { name: 'Expenses', value: Math.round(monthlyExpenseStats.totalMonthly), fill: '#ef4444' },
  ];

  const netMonthly = incomeStats.totalMonthly - monthlyExpenseStats.totalMonthly;
  const savingsRate = incomeStats.totalMonthly > 0 
    ? ((netMonthly / incomeStats.totalMonthly) * 100).toFixed(1)
    : '0';

  const handlePreviousMonth = () => {
    setSelectedMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(prev => addMonths(prev, 1));
  };

  const handleCurrentMonth = () => {
    setSelectedMonth(new Date());
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
      {/* Month Selector */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Analytics</h2>
          <p className="text-muted-foreground text-sm">Track your financial trends</p>
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
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={handlePreviousMonth}
            >
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
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-income/10 rounded-xl">
              <TrendingUp className="w-5 h-5 text-income" />
            </div>
            <span className="text-sm text-muted-foreground">Monthly Income</span>
          </div>
          <p className="text-2xl font-bold font-display text-income">
            +${incomeStats.totalMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-destructive/10 rounded-xl">
              <TrendingDown className="w-5 h-5 text-destructive" />
            </div>
            <span className="text-sm text-muted-foreground">{format(selectedMonth, 'MMM')} Expenses</span>
          </div>
          <p className="text-2xl font-bold font-display text-destructive">
            -${monthlyExpenseStats.totalMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {monthlyExpenseStats.expenseCount} expense{monthlyExpenseStats.expenseCount !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Net {format(selectedMonth, 'MMM')}</span>
          </div>
          <p className={`text-2xl font-bold font-display ${netMonthly >= 0 ? 'text-income' : 'text-destructive'}`}>
            {netMonthly >= 0 ? '+' : ''}${netMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-category-rental/10 rounded-xl">
              <Target className="w-5 h-5 text-category-rental" />
            </div>
            <span className="text-sm text-muted-foreground">Savings Rate</span>
          </div>
          <p className={`text-2xl font-bold font-display ${parseFloat(savingsRate) >= 0 ? 'text-income' : 'text-destructive'}`}>
            {savingsRate}%
          </p>
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display font-semibold text-lg text-foreground mb-4">
            6-Month Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                  }}
                  formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name === 'income' ? 'Income' : 'Expenses']}
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorExpenses)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Income vs Expenses Pie */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display font-semibold text-lg text-foreground mb-4">
            {format(selectedMonth, 'MMMM')} Budget Distribution
          </h3>
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
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-income" />
              <span className="text-sm text-muted-foreground">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-sm text-muted-foreground">Expenses</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category Breakdowns */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Income Category Breakdown */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display font-semibold text-lg text-foreground mb-4">
            Income by Category
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeCategoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Monthly']}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Expense Category Breakdown */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display font-semibold text-lg text-foreground mb-4">
            {format(selectedMonth, 'MMMM')} Expenses by Category
          </h3>
          <div className="h-64">
            {expenseCategoryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No expenses in {format(selectedMonth, 'MMMM yyyy')}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseCategoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Monthly']}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>

      {/* Budget Progress Section */}
      {budgets.length > 0 && (
        <motion.div variants={itemVariants}>
          <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Budget Tracking - {format(selectedMonth, 'MMMM yyyy')}
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