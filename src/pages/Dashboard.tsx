import { useState } from 'react';
import { motion } from 'framer-motion';
import { StatsCard } from '@/components/StatsCard';
import { IncomeCard } from '@/components/IncomeCard';
import { IncomeChart } from '@/components/IncomeChart';
import { AddIncomeDialog } from '@/components/AddIncomeDialog';

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
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { format, addMonths, subMonths } from 'date-fns';

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

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();

  const { incomeSources, stats: incomeStats, addIncomeSource, updateIncomeSource, deleteIncomeSource, isLoading: incomeLoading } = useIncomeSources({ month: selectedMonth, year: selectedYear });
  const { stats: expenseStats, isLoading: expenseLoading } = useExpenses({ month: selectedMonth, year: selectedYear });
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
  const netYearly = incomeStats.totalYearly - expenseStats.totalYearly;
  const isLoading = incomeLoading || expenseLoading || profileLoading;
  const isCurrentMonth = selectedDate.getMonth() === new Date().getMonth() && selectedDate.getFullYear() === new Date().getFullYear();

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
      className="space-y-4"
    >
      {/* Month Selector & Greeting */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <GreetingWidget />
        <div className="flex items-center gap-2 bg-card border border-border rounded-xl p-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={handlePrevMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <button
            onClick={handleCurrentMonth}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors min-w-[140px] justify-center"
          >
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {format(selectedDate, 'MMMM yyyy')}
            </span>
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={handleNextMonth}
            disabled={isCurrentMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
          title="Yearly Projection"
          value={`${netYearly >= 0 ? '+' : ''}${formatAmount(Math.abs(netYearly))}`}
          subtitle="Net savings"
          icon={<DollarSign className="w-5 h-5" />}
          variant="primary"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Recent Income Sources */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">
                Recent Income
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Your latest income sources
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                size="sm"
                className="rounded-xl gap-2 text-xs sm:text-sm"
                asChild
              >
                <Link to="/sources">
                  View All
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Link>
              </Button>
              <Button 
                size="sm"
                onClick={() => setDialogOpen(true)}
                className="rounded-xl bg-gradient-income hover:opacity-90 transition-opacity gap-2 text-xs sm:text-sm"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                Add
              </Button>
            </div>
          </div>

          {recentSources.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-12 text-center">
              <div className="bg-secondary w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                No income sources yet
              </h3>
              <p className="text-muted-foreground mb-4 text-xs sm:text-sm">
                Start tracking your income
              </p>
              <Button 
                size="sm"
                onClick={() => setDialogOpen(true)}
                className="rounded-xl bg-gradient-income hover:opacity-90 text-xs sm:text-sm"
              >
                Add Your First Income
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {recentSources.map((income, index) => (
                <motion.div
                  key={income.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <IncomeCard
                    income={income}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Chart, Subscription and Notifications */}
        <motion.div variants={itemVariants} className="space-y-3">
          <SubscriptionCard />
          <IncomeChart stats={incomeStats} />
          
          
          {/* Quick Stats */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-display font-semibold text-foreground mb-3 text-sm">
              Budget Overview
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Total Income</span>
                <span className="text-xs font-medium text-income">
                  +{formatAmount(incomeStats.totalMonthly)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Total Expenses</span>
                <span className="text-xs font-medium text-destructive">
                  -{formatAmount(expenseStats.totalMonthly)}
                </span>
              </div>
              <div className="border-t border-border pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">Net Balance</span>
                  <span className={`text-xs font-bold ${netMonthly >= 0 ? 'text-income' : 'text-destructive'}`}>
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
