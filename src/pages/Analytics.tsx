import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell,
} from 'recharts';
import { useCategoryBudgets } from '@/hooks/useCategoryBudgets';
import { useProfile } from '@/hooks/useProfile';
import { categoryLabels, IncomeCategory } from '@/types/income';
import { expenseCategoryLabels, ExpenseCategory } from '@/types/expense';
import {
  TrendingUp, TrendingDown, Target, Loader2, Wallet, ChevronLeft, ChevronRight,
  Calendar as CalendarIcon, PieChart, BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  format, startOfMonth, endOfMonth, subMonths, addMonths, isSameMonth,
  startOfYear, endOfYear, differenceInCalendarMonths, differenceInCalendarDays,
  addDays, eachMonthOfInterval, eachDayOfInterval, isWithinInterval, parseISO,
} from 'date-fns';
import { SetBudgetDialog } from '@/components/SetBudgetDialog';
import { CopyBudgetDialog } from '@/components/CopyBudgetDialog';
import { ExportReportDialog } from '@/components/ExportReportDialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Helmet } from 'react-helmet-async';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

const INCOME_COLORS: Record<IncomeCategory, string> = {
  salary: '#3b82f6', freelance: '#a855f7', investment: '#10b981',
  rental: '#f59e0b', business: '#ec4899', other: '#6b7280',
};
const EXPENSE_COLORS: Record<ExpenseCategory, string> = {
  housing: '#ef4444', utilities: '#f59e0b', food: '#f97316',
  transportation: '#0ea5e9', healthcare: '#ec4899', entertainment: '#8b5cf6',
  shopping: '#6366f1', debt: '#dc2626', savings: '#10b981', other: '#6b7280',
};

type PeriodKey = 'month' | '3m' | '6m' | 'ytd' | '1y' | 'custom';
const PERIOD_LABELS: Record<PeriodKey, string> = {
  month: 'Month', '3m': '3M', '6m': '6M', ytd: 'YTD', '1y': '1Y', custom: 'Custom',
};

const Analytics = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [period, setPeriod] = useState<PeriodKey>('month');
  const [customStart, setCustomStart] = useState<Date | undefined>(subMonths(new Date(), 2));
  const [customEnd, setCustomEnd] = useState<Date | undefined>(new Date());
  const { user } = useAuth();
  const { formatAmount } = useProfile();

  const { start, end, label } = useMemo(() => {
    const now = new Date();
    switch (period) {
      case '3m': return { start: startOfMonth(subMonths(now, 2)), end: endOfMonth(now), label: 'Last 3 months' };
      case '6m': return { start: startOfMonth(subMonths(now, 5)), end: endOfMonth(now), label: 'Last 6 months' };
      case 'ytd': return { start: startOfYear(now), end: endOfMonth(now), label: `${format(now, 'yyyy')} to date` };
      case '1y': return { start: startOfMonth(subMonths(now, 11)), end: endOfMonth(now), label: 'Last 12 months' };
      case 'custom':
        if (customStart && customEnd) return { start: customStart, end: customEnd, label: `${format(customStart, 'MMM d')} – ${format(customEnd, 'MMM d, yyyy')}` };
        return { start: startOfMonth(now), end: endOfMonth(now), label: format(now, 'MMMM yyyy') };
      case 'month':
      default:
        return { start: startOfMonth(selectedMonth), end: endOfMonth(selectedMonth), label: format(selectedMonth, 'MMMM yyyy') };
    }
  }, [period, selectedMonth, customStart, customEnd]);

  const currentMonth = selectedMonth.getMonth() + 1;
  const currentYear = selectedMonth.getFullYear();
  const { budgets, upsertBudget, copyFromMonth, isUpdating, isCopying } = useCategoryBudgets(currentMonth, currentYear);

  // Range-based query: totals + category breakdowns + all rows
  const { data: rangeData, isLoading } = useQuery({
    queryKey: ['analytics-range', user?.id, start.toISOString(), end.toISOString()],
    queryFn: async () => {
      if (!user) return null;
      const startStr = format(start, 'yyyy-MM-dd');
      const endStr = format(end, 'yyyy-MM-dd');
      const [inc, exp] = await Promise.all([
        supabase.from('income_sources').select('amount, category, date')
          .eq('user_id', user.id).gte('date', startStr).lte('date', endStr),
        supabase.from('expenses').select('amount, category, date')
          .eq('user_id', user.id).gte('date', startStr).lte('date', endStr),
      ]);
      return { income: inc.data || [], expenses: exp.data || [] };
    },
    enabled: !!user,
  });

  const stats = useMemo(() => {
    const incomeRows = rangeData?.income || [];
    const expenseRows = rangeData?.expenses || [];
    const incomeByCategory = {} as Record<IncomeCategory, number>;
    const expenseByCategory = {} as Record<ExpenseCategory, number>;
    let totalIncome = 0, totalExpenses = 0;
    incomeRows.forEach((r: any) => {
      const a = Number(r.amount); totalIncome += a;
      incomeByCategory[r.category as IncomeCategory] = (incomeByCategory[r.category as IncomeCategory] || 0) + a;
    });
    expenseRows.forEach((r: any) => {
      const a = Number(r.amount); totalExpenses += a;
      expenseByCategory[r.category as ExpenseCategory] = (expenseByCategory[r.category as ExpenseCategory] || 0) + a;
    });
    return {
      totalIncome, totalExpenses,
      net: totalIncome - totalExpenses,
      savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0,
      incomeByCategory, expenseByCategory,
      incomeCount: incomeRows.length, expenseCount: expenseRows.length,
    };
  }, [rangeData]);

  // Trend data: monthly buckets when range >= ~2 months, daily otherwise
  const trendData = useMemo(() => {
    const incomeRows = rangeData?.income || [];
    const expenseRows = rangeData?.expenses || [];
    const useDaily = differenceInCalendarDays(end, start) < 62;
    if (useDaily) {
      const days = eachDayOfInterval({ start, end });
      return days.map(d => {
        const dayStr = format(d, 'yyyy-MM-dd');
        const income = incomeRows.filter((r: any) => r.date === dayStr).reduce((s: number, r: any) => s + Number(r.amount), 0);
        const expenses = expenseRows.filter((r: any) => r.date === dayStr).reduce((s: number, r: any) => s + Number(r.amount), 0);
        return { name: format(d, 'MMM d'), income: Math.round(income), expenses: Math.round(expenses) };
      });
    }
    const months = eachMonthOfInterval({ start, end });
    return months.map(m => {
      const mStart = startOfMonth(m), mEnd = endOfMonth(m);
      const income = incomeRows.filter((r: any) => isWithinInterval(parseISO(r.date), { start: mStart, end: mEnd })).reduce((s: number, r: any) => s + Number(r.amount), 0);
      const expenses = expenseRows.filter((r: any) => isWithinInterval(parseISO(r.date), { start: mStart, end: mEnd })).reduce((s: number, r: any) => s + Number(r.amount), 0);
      return { name: format(m, 'MMM yy'), income: Math.round(income), expenses: Math.round(expenses) };
    });
  }, [rangeData, start, end]);

  const incomeCategoryData = Object.entries(stats.incomeByCategory)
    .filter(([, v]) => v > 0)
    .map(([c, v]) => ({ name: categoryLabels[c as IncomeCategory], value: Math.round(v), fill: INCOME_COLORS[c as IncomeCategory] }))
    .sort((a, b) => b.value - a.value);

  const expenseCategoryData = Object.entries(stats.expenseByCategory)
    .filter(([, v]) => v > 0)
    .map(([c, v]) => ({ name: expenseCategoryLabels[c as ExpenseCategory], value: Math.round(v), fill: EXPENSE_COLORS[c as ExpenseCategory] }))
    .sort((a, b) => b.value - a.value);

  const netData = [
    { name: 'Income', value: Math.round(stats.totalIncome), fill: '#10b981' },
    { name: 'Expenses', value: Math.round(stats.totalExpenses), fill: '#ef4444' },
  ];

  const monthNav = period === 'month';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Analytics – FedhaFlow</title>
        <meta name="description" content="Visualize income, expenses and savings across custom periods with FedhaFlow analytics." />
      </Helmet>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
        {/* Header + Period Selector */}
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground leading-tight">Analytics</h2>
            <p className="text-muted-foreground text-xs">{label}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-0.5 bg-card border border-border rounded-xl p-1">
              {(Object.keys(PERIOD_LABELS) as PeriodKey[]).map(k => (
                <Button
                  key={k}
                  size="sm"
                  variant={period === k ? 'default' : 'ghost'}
                  className={cn('h-7 text-xs px-2.5 rounded-lg', period === k ? '' : 'text-muted-foreground')}
                  onClick={() => setPeriod(k)}
                >
                  {PERIOD_LABELS[k]}
                </Button>
              ))}
            </div>

            {period === 'custom' && (
              <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 text-xs px-2.5">
                      <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                      {customStart ? format(customStart, 'MMM d') : 'Start'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={customStart} onSelect={setCustomStart} initialFocus className={cn('p-3 pointer-events-auto')} />
                  </PopoverContent>
                </Popover>
                <span className="text-xs text-muted-foreground">→</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 text-xs px-2.5">
                      {customEnd ? format(customEnd, 'MMM d') : 'End'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={customEnd} onSelect={setCustomEnd} initialFocus className={cn('p-3 pointer-events-auto')} />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {monthNav && (
              <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1">
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => setSelectedMonth(p => subMonths(p, 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <button onClick={() => setSelectedMonth(new Date())} className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-accent transition-colors">
                  <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-medium text-xs min-w-[90px] text-center">{format(selectedMonth, 'MMM yyyy')}</span>
                </button>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => setSelectedMonth(p => addMonths(p, 1))} disabled={isSameMonth(selectedMonth, new Date())}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            <ExportReportDialog
              monthlyIncome={stats.totalIncome}
              monthlyExpenses={stats.totalExpenses}
              expensesByCategory={stats.expenseByCategory as Record<ExpenseCategory, number>}
              incomeByCategory={stats.incomeByCategory as Record<IncomeCategory, number>}
              selectedMonth={selectedMonth}
            />
            <CopyBudgetDialog currentMonth={currentMonth} currentYear={currentYear} onCopy={copyFromMonth} isCopying={isCopying} />
            <SetBudgetDialog onSubmit={upsertBudget} existingBudgets={budgets} isUpdating={isUpdating} />
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-card border border-border/50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1.5 bg-income/10 rounded-lg"><TrendingUp className="w-4 h-4 text-income" /></div>
              <span className="text-xs text-muted-foreground">Income</span>
            </div>
            <p className="text-lg sm:text-xl font-bold font-display text-income">+{formatAmount(stats.totalIncome)}</p>
            <p className="text-[11px] text-muted-foreground">{stats.incomeCount} entr{stats.incomeCount === 1 ? 'y' : 'ies'}</p>
          </div>
          <div className="bg-card border border-border/50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1.5 bg-destructive/10 rounded-lg"><TrendingDown className="w-4 h-4 text-destructive" /></div>
              <span className="text-xs text-muted-foreground">Expenses</span>
            </div>
            <p className="text-lg sm:text-xl font-bold font-display text-destructive">-{formatAmount(stats.totalExpenses)}</p>
            <p className="text-[11px] text-muted-foreground">{stats.expenseCount} entr{stats.expenseCount === 1 ? 'y' : 'ies'}</p>
          </div>
          <div className="bg-card border border-border/50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1.5 bg-primary/10 rounded-lg"><Wallet className="w-4 h-4 text-primary" /></div>
              <span className="text-xs text-muted-foreground">Net</span>
            </div>
            <p className={`text-lg sm:text-xl font-bold font-display ${stats.net >= 0 ? 'text-income' : 'text-destructive'}`}>
              {stats.net >= 0 ? '+' : ''}{formatAmount(Math.abs(stats.net))}
            </p>
          </div>
          <div className="bg-card border border-border/50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1.5 bg-category-rental/10 rounded-lg"><Target className="w-4 h-4 text-category-rental" /></div>
              <span className="text-xs text-muted-foreground">Savings Rate</span>
            </div>
            <p className={`text-lg sm:text-xl font-bold font-display ${stats.savingsRate >= 0 ? 'text-income' : 'text-destructive'}`}>
              {stats.savingsRate.toFixed(1)}%
            </p>
          </div>
        </motion.div>

        {/* Trend + Distribution */}
        <div className="grid lg:grid-cols-2 gap-4">
          <motion.div variants={itemVariants} className="bg-card border border-border/50 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-primary" />
              <h3 className="font-display font-semibold text-sm sm:text-base text-foreground">Trend</h3>
              <span className="text-xs text-muted-foreground ml-auto">{trendData.length} pts</span>
            </div>
            <div className="h-60">
              {trendData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No data</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--income))" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="hsl(var(--income))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(value: number, name: string) => [formatAmount(value), name === 'income' ? 'Income' : 'Expenses']}
                    />
                    <Area type="monotone" dataKey="income" stroke="hsl(var(--income))" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="expenses" stroke="hsl(var(--destructive))" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-card border border-border/50 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <PieChart className="w-4 h-4 text-primary" />
              <h3 className="font-display font-semibold text-sm sm:text-base text-foreground">Distribution</h3>
            </div>
            <div className="h-60 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie data={netData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={5} dataKey="value">
                    {netData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }}
                    formatter={(value: number) => [formatAmount(value), '']}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6">
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-income" /><span className="text-xs text-muted-foreground">Income</span></div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-destructive" /><span className="text-xs text-muted-foreground">Expenses</span></div>
            </div>
          </motion.div>
        </div>

        {/* Category Breakdowns */}
        <div className="grid lg:grid-cols-2 gap-4">
          <motion.div variants={itemVariants} className="bg-card border border-border/50 rounded-2xl p-4 sm:p-5">
            <h3 className="font-display font-semibold text-sm sm:text-base text-foreground mb-3">Income by Category</h3>
            <div className="h-56">
              {incomeCategoryData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No income in period</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incomeCategoryData} layout="vertical" margin={{ left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} width={90} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(v: number) => [formatAmount(v), '']}
                    />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {incomeCategoryData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-card border border-border/50 rounded-2xl p-4 sm:p-5">
            <h3 className="font-display font-semibold text-sm sm:text-base text-foreground mb-3">Expenses by Category</h3>
            <div className="h-56">
              {expenseCategoryData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No expenses in period</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={expenseCategoryData} layout="vertical" margin={{ left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} width={90} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(v: number) => [formatAmount(v), '']}
                    />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {expenseCategoryData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default Analytics;
