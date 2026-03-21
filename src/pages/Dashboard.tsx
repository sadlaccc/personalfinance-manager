import { useState } from 'react';
import { motion } from 'framer-motion';
import { StatsCard } from '@/components/StatsCard';
import { IncomeCard } from '@/components/IncomeCard';
import { IncomeChart } from '@/components/IncomeChart';
import { AddIncomeDialog } from '@/components/AddIncomeDialog';
import { FinancialSummaryCard } from '@/components/FinancialSummaryCard';
import { GreetingWidget } from '@/components/GreetingWidget';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { Button } from '@/components/ui/button';
import { useIncomeSources, IncomeSource } from '@/hooks/useIncomeSources';
import { useExpenses } from '@/hooks/useExpenses';
import { useProfile } from '@/hooks/useProfile';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Plus,
  ArrowRight,
  Loader2,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Receipt,
  Target,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { format, addMonths, subMonths } from 'date-fns';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const quickActions = [
  { label: 'Add Income', icon: TrendingUp, href: '/sources', color: 'bg-income/10 text-income' },
  { label: 'Add Expense', icon: Receipt, href: '/expenses', color: 'bg-destructive/10 text-destructive' },
  { label: 'Set Goal', icon: Target, href: '/goals', color: 'bg-primary/10 text-primary' },
  { label: 'Analytics', icon: BarChart3, href: '/analytics', color: 'bg-ticket/10 text-ticket' },
];

const financialTips = [
  "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
  "Review your subscriptions monthly — cancel what you don't use.",
  "Set up a 3-month emergency fund as your first savings goal.",
  "Track every expense for 30 days to find hidden spending patterns.",
  "Automate your savings — pay yourself first each month.",
];

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();

  const { incomeSources, stats: incomeStats, canAddIncome, addIncomeSource, updateIncomeSource, deleteIncomeSource, isLoading: incomeLoading } = useIncomeSources({ month: selectedMonth, year: selectedYear });
  const { expenses, stats: expenseStats, isLoading: expenseLoading } = useExpenses({ month: selectedMonth, year: selectedYear });
  const { formatAmount, isLoading: profileLoading } = useProfile();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeSource | null>(null);

  const handlePrevMonth = () => setSelectedDate(prev => subMonths(prev, 1));
  const handleNextMonth = () => setSelectedDate(prev => addMonths(prev, 1));
  const handleCurrentMonth = () => setSelectedDate(new Date());

  const handleEdit = (income: IncomeSource) => {
    setEditingIncome(income);
    setDialogOpen(true);
  };

  const handleSubmit = async (incomeData: Omit<IncomeSource, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingIncome) {
        await updateIncomeSource(editingIncome.id, incomeData);
        toast({ title: 'Income updated successfully' });
        setEditingIncome(null);
      } else {
        await addIncomeSource(incomeData);
        toast({ title: 'Income added successfully' });
      }
    } catch (error) {
      toast({ 
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save income'
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteIncomeSource(id);
      toast({ title: 'Income deleted successfully' });
    } catch (error) {
      toast({ 
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete income'
      });
    }
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditingIncome(null);
  };

  const recentSources = incomeSources.slice(0, 3);
  const netMonthly = incomeStats.totalMonthly - expenseStats.totalMonthly;
  const isLoading = incomeLoading || expenseLoading || profileLoading;
  const isCurrentMonth = selectedDate.getMonth() === new Date().getMonth() && selectedDate.getFullYear() === new Date().getFullYear();

  // Pick a random daily tip
  const dailyTip = financialTips[new Date().getDate() % financialTips.length];

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
      className="space-y-5 max-w-[1400px] mx-auto"
    >
      {/* Month Selector & Greeting */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <GreetingWidget />
        <div className="flex items-center gap-1.5 bg-card border border-border/60 rounded-xl p-1 shadow-sm">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <button
            onClick={handleCurrentMonth}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors min-w-[140px] justify-center"
          >
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              {format(selectedDate, 'MMMM yyyy')}
            </span>
          </button>
          <Button
            variant="ghost" size="icon"
            className="h-8 w-8 rounded-lg hover:bg-muted"
            onClick={handleNextMonth}
            disabled={isCurrentMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard
          title="Monthly Income"
          value={formatAmount(incomeStats.totalMonthly)}
          subtitle="All sources"
          icon={<TrendingUp className="w-5 h-5" />}
          variant="income"
        />
        <StatsCard
          title="Monthly Expenses"
          value={formatAmount(expenseStats.totalMonthly)}
          subtitle={`${expenseStats.expenseCount} expense${expenseStats.expenseCount !== 1 ? 's' : ''}`}
          icon={<TrendingDown className="w-5 h-5" />}
          variant="destructive"
        />
        <StatsCard
          title="Net Monthly"
          value={`${netMonthly >= 0 ? '+' : ''}${formatAmount(Math.abs(netMonthly))}`}
          subtitle={netMonthly >= 0 ? 'Great progress!' : 'Over budget'}
          icon={<Wallet className="w-5 h-5" />}
          variant={netMonthly >= 0 ? 'income' : 'destructive'}
        />
        <StatsCard
          title="Savings Rate"
          value={`${incomeStats.totalMonthly > 0 ? Math.round(((incomeStats.totalMonthly - expenseStats.totalMonthly) / incomeStats.totalMonthly) * 100) : 0}%`}
          subtitle={`${incomeStats.sourceCount} source${incomeStats.sourceCount !== 1 ? 's' : ''}`}
          icon={<DollarSign className="w-5 h-5" />}
          variant="primary"
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <Link key={action.label} to={action.href}>
            <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer group">
              <div className={`p-2 rounded-lg ${action.color}`}>
                <action.icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {action.label}
              </span>
            </div>
          </Link>
        ))}
      </motion.div>

      {/* Financial Summary */}
      <motion.div variants={itemVariants}>
        <FinancialSummaryCard
          incomeSources={incomeSources}
          expenses={expenses}
          selectedDate={selectedDate}
          formatAmount={formatAmount}
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Income Sources */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">Recent Income</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Your latest income sources</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs border-border/60" asChild>
                <Link to="/sources">
                  View All
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
              <Button 
                size="sm"
                onClick={() => setDialogOpen(true)}
                disabled={!canAddIncome}
                className="rounded-xl bg-gradient-income hover:opacity-90 transition-opacity gap-1.5 text-xs shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                {canAddIncome ? 'Add' : 'Limit'}
              </Button>
            </div>
          </div>

          {recentSources.length === 0 ? (
            <div className="relative overflow-hidden bg-card border border-border/50 rounded-2xl p-10 sm:p-14 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-income/5 via-transparent to-primary/5" />
              <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-income/5 blur-2xl" />
              <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-primary/5 blur-2xl" />
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-income/20 to-income/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                  <DollarSign className="w-8 h-8 text-income" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-2 text-lg">No income sources yet</h3>
                <p className="text-muted-foreground mb-7 text-sm max-w-sm mx-auto leading-relaxed">
                  Start tracking your earnings by adding your first income source. You'll see trends and insights here.
                </p>
                <Button onClick={() => setDialogOpen(true)} className="rounded-xl bg-gradient-income hover:opacity-90 shadow-md px-6">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Income
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              {recentSources.map((income, index) => (
                <motion.div
                  key={income.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <IncomeCard income={income} onEdit={handleEdit} onDelete={handleDelete} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Sidebar */}
        <motion.div variants={itemVariants} className="space-y-4">
          <SubscriptionCard />
          <IncomeChart stats={incomeStats} />
          
          {/* Daily Tip */}
          <div className="bg-card border border-border/50 rounded-2xl p-4 sm:p-5 shadow-sm">
            <h3 className="font-display font-semibold text-foreground mb-3 text-sm flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-warning/10">
                <Lightbulb className="w-3.5 h-3.5 text-warning" />
              </div>
              Daily Tip
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {dailyTip}
            </p>
          </div>

          {/* Budget Overview */}
          <div className="bg-card border border-border/50 rounded-2xl p-4 sm:p-5 shadow-sm">
            <h3 className="font-display font-semibold text-foreground mb-4 text-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Budget Overview
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Income</span>
                <span className="text-sm font-semibold text-income">+{formatAmount(incomeStats.totalMonthly)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Expenses</span>
                <span className="text-sm font-semibold text-destructive">-{formatAmount(expenseStats.totalMonthly)}</span>
              </div>
              <div className="border-t border-border/50 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Net Balance</span>
                  <span className={`text-sm font-bold ${netMonthly >= 0 ? 'text-income' : 'text-destructive'}`}>
                    {netMonthly >= 0 ? '+' : ''}{formatAmount(netMonthly)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AddIncomeDialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        onSubmit={handleSubmit}
        editingIncome={editingIncome}
      />
    </motion.div>
  );
};

export default Dashboard;
