import { useState } from 'react';
import { motion } from 'framer-motion';
import { StatsCard } from '@/components/StatsCard';
import { IncomeCard } from '@/components/IncomeCard';
import { IncomeChart } from '@/components/IncomeChart';
import { AddIncomeDialog } from '@/components/AddIncomeDialog';
import { Button } from '@/components/ui/button';
import { useIncomeSources, IncomeSource } from '@/hooks/useIncomeSources';
import { useExpenses } from '@/hooks/useExpenses';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Layers, 
  Plus,
  ArrowRight,
  Loader2,
  Wallet
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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
  const { incomeSources, stats: incomeStats, addIncomeSource, updateIncomeSource, deleteIncomeSource, isLoading: incomeLoading } = useIncomeSources();
  const { stats: expenseStats, isLoading: expenseLoading } = useExpenses();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeSource | null>(null);

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
  const isLoading = incomeLoading || expenseLoading;

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
      className="space-y-8"
    >
      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Monthly Income"
          value={`$${incomeStats.totalMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          subtitle="All sources combined"
          icon={<TrendingUp className="w-6 h-6" />}
          variant="income"
        />
        <StatsCard
          title="Monthly Expenses"
          value={`$${expenseStats.totalMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          subtitle={`${expenseStats.expenseCount} expense${expenseStats.expenseCount !== 1 ? 's' : ''}`}
          icon={<TrendingDown className="w-6 h-6" />}
          variant="destructive"
        />
        <StatsCard
          title="Net Monthly"
          value={`${netMonthly >= 0 ? '+' : ''}$${netMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          subtitle={netMonthly >= 0 ? 'You\'re in the green!' : 'Spending exceeds income'}
          icon={<Wallet className="w-6 h-6" />}
          variant={netMonthly >= 0 ? 'income' : 'destructive'}
        />
        <StatsCard
          title="Yearly Projection"
          value={`${netYearly >= 0 ? '+' : ''}$${netYearly.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          subtitle="Net savings/loss"
          icon={<DollarSign className="w-6 h-6" />}
          variant="primary"
        />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Income Sources */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">
                Recent Income
              </h2>
              <p className="text-sm text-muted-foreground">
                Your latest income sources
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                className="rounded-xl gap-2"
                asChild
              >
                <Link to="/sources">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button 
                onClick={() => setDialogOpen(true)}
                className="rounded-xl bg-gradient-income hover:opacity-90 transition-opacity gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
          </div>

          {recentSources.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <div className="bg-secondary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                No income sources yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Start tracking your income
              </p>
              <Button 
                onClick={() => setDialogOpen(true)}
                className="rounded-xl bg-gradient-income hover:opacity-90"
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

        {/* Chart */}
        <motion.div variants={itemVariants} className="space-y-6">
          <IncomeChart stats={incomeStats} />
          
          {/* Quick Stats */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-display font-semibold text-foreground mb-4">
              Budget Overview
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Income</span>
                <span className="text-sm font-medium text-income">
                  +${incomeStats.totalMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Expenses</span>
                <span className="text-sm font-medium text-destructive">
                  -${expenseStats.totalMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Net Balance</span>
                  <span className={`text-sm font-bold ${netMonthly >= 0 ? 'text-income' : 'text-destructive'}`}>
                    {netMonthly >= 0 ? '+' : ''}${netMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
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
