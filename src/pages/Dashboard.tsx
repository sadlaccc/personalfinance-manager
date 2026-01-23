import { useState } from 'react';
import { motion } from 'framer-motion';
import { StatsCard } from '@/components/StatsCard';
import { IncomeCard } from '@/components/IncomeCard';
import { IncomeChart } from '@/components/IncomeChart';
import { AddIncomeDialog } from '@/components/AddIncomeDialog';
import { Button } from '@/components/ui/button';
import { useIncomeStore } from '@/hooks/useIncomeStore';
import { IncomeSource } from '@/types/income';
import { 
  DollarSign, 
  TrendingUp, 
  Layers, 
  Calendar,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const { incomeSources, stats, addIncomeSource, updateIncomeSource, deleteIncomeSource } = useIncomeStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeSource | null>(null);

  const handleEdit = (income: IncomeSource) => {
    setEditingIncome(income);
    setDialogOpen(true);
  };

  const handleSubmit = (incomeData: Omit<IncomeSource, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingIncome) {
      updateIncomeSource(editingIncome.id, incomeData);
      setEditingIncome(null);
    } else {
      addIncomeSource(incomeData);
    }
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditingIncome(null);
  };

  const recentSources = incomeSources.slice(0, 3);

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
          value={`$${stats.totalMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          subtitle="All sources combined"
          icon={<DollarSign className="w-6 h-6" />}
          variant="income"
        />
        <StatsCard
          title="Yearly Projection"
          value={`$${stats.totalYearly.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          subtitle="Based on current income"
          icon={<TrendingUp className="w-6 h-6" />}
          variant="primary"
        />
        <StatsCard
          title="Income Sources"
          value={stats.sourceCount.toString()}
          subtitle="Active streams"
          icon={<Layers className="w-6 h-6 text-primary" />}
        />
        <StatsCard
          title="This Month"
          value={new Date().toLocaleDateString('en-US', { month: 'long' })}
          subtitle={new Date().getFullYear().toString()}
          icon={<Calendar className="w-6 h-6 text-primary" />}
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
                    onDelete={deleteIncomeSource}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Chart */}
        <motion.div variants={itemVariants} className="space-y-6">
          <IncomeChart stats={stats} />
          
          {/* Quick Stats */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-display font-semibold text-foreground mb-4">
              Quick Breakdown
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.byCategory)
                .filter(([_, value]) => value > 0)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 4)
                .map(([category, value]) => {
                  const percentage = ((value / stats.totalMonthly) * 100).toFixed(0);
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground capitalize">
                        {category}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
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
