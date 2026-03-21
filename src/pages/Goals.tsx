import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Loader2, TrendingUp, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BudgetGoalCard } from '@/components/BudgetGoalCard';
import { AddBudgetGoalDialog } from '@/components/AddBudgetGoalDialog';
import { AddFundsDialog } from '@/components/AddFundsDialog';
import { useBudgetGoals, BudgetGoal } from '@/hooks/useBudgetGoals';
import { useProfile } from '@/hooks/useProfile';
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

const Goals = () => {
  const { goals, stats, isLoading, canAddGoal, goalLimit, addGoal, updateGoal, deleteGoal, addToGoal } = useBudgetGoals();
  const { formatAmount } = useProfile();
  const { toast } = useToast();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fundsDialogOpen, setFundsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<BudgetGoal | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<BudgetGoal | null>(null);

  const handleEdit = (goal: BudgetGoal) => {
    setEditingGoal(goal);
    setDialogOpen(true);
  };

  const handleAddFunds = (goal: BudgetGoal) => {
    setSelectedGoal(goal);
    setFundsDialogOpen(true);
  };

  const handleSubmit = async (goalData: Omit<BudgetGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingGoal) {
        await updateGoal(editingGoal.id, goalData);
        toast({ title: 'Goal updated successfully' });
        setEditingGoal(null);
      } else {
        await addGoal(goalData);
        toast({ title: 'Goal created successfully' });
      }
    } catch (error) {
      toast({ 
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save goal'
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGoal(id);
      toast({ title: 'Goal deleted successfully' });
    } catch (error) {
      toast({ 
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete goal'
      });
    }
  };

  const handleAddFundsSubmit = async (goalId: string, amount: number) => {
    try {
      await addToGoal(goalId, amount);
      toast({ title: `${formatAmount(amount)} added to goal` });
    } catch (error) {
      toast({ 
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add funds'
      });
    }
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditingGoal(null);
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
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">
            Savings Goals
          </h1>
          <p className="text-sm text-muted-foreground">
            {goals.length > 0
              ? `${stats.completedGoals} of ${stats.goalCount} goals completed`
              : 'Set targets and track your savings progress'}
            {goalLimit !== Infinity && goalLimit > 0 && (
              <span className="ml-1">· {goals.length}/{goalLimit} goals used</span>
            )}
          </p>
        </div>
        <Button 
          onClick={() => setDialogOpen(true)}
          disabled={!canAddGoal}
          className="rounded-xl bg-gradient-income hover:opacity-90 gap-2"
        >
          <Plus className="w-4 h-4" />
          {canAddGoal ? 'New Goal' : (goalLimit === 0 ? 'Upgrade to Add Goals' : 'Limit Reached')}
        </Button>
      </motion.div>

      {/* Stats Cards */}
      {goals.length > 0 && (
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-card border border-border/50 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">Total Goals</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.goalCount}</p>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 bg-income/10 rounded-xl">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-income" />
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">Total Saved</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-income">
              {formatAmount(stats.totalSaved)}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              of {formatAmount(stats.totalTarget)} target
            </p>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 bg-category-freelance/10 rounded-xl">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-category-freelance" />
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">Completed</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.completedGoals}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              of {stats.goalCount} goals
            </p>
          </div>
        </motion.div>
      )}

      {/* Overall Progress */}
      {goals.length > 0 && (
        <motion.div variants={itemVariants} className="bg-card border border-border/50 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground">Overall Progress</h2>
            <span className="text-xl sm:text-2xl font-bold text-primary">
              {stats.overallProgress.toFixed(0)}%
            </span>
          </div>
          <Progress 
            value={stats.overallProgress} 
            className="h-3 sm:h-4"
          />
          <div className="flex justify-between text-xs sm:text-sm text-muted-foreground mt-2">
            <span>{formatAmount(stats.totalSaved)} saved</span>
            <span>{formatAmount(stats.totalTarget - stats.totalSaved)} remaining</span>
          </div>
        </motion.div>
      )}

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <motion.div 
          variants={itemVariants}
          className="relative overflow-hidden bg-card border border-border/50 rounded-2xl p-8 sm:p-14 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-income/5 via-transparent to-primary/5" />
          <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-income/5 blur-2xl" />
          <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-primary/5 blur-2xl" />
          
          <div className="relative z-10">
            <div className="bg-gradient-to-br from-income/20 to-income/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
              <Target className="w-8 h-8 text-income" />
            </div>
            <h3 className="font-display font-bold text-foreground mb-2 text-lg">
              No savings goals yet
            </h3>
            <p className="text-muted-foreground mb-7 text-sm max-w-sm mx-auto leading-relaxed">
              Set financial goals to track your progress and stay motivated. Whether it's an emergency fund, vacation, or new car — start here.
            </p>
            <Button 
              onClick={() => setDialogOpen(true)}
              className="rounded-xl bg-gradient-income hover:opacity-90 shadow-md px-6"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create Your First Goal
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <BudgetGoalCard
                goal={goal}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddFunds={handleAddFunds}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      <AddBudgetGoalDialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        onSubmit={handleSubmit}
        editingGoal={editingGoal}
      />

      <AddFundsDialog
        open={fundsDialogOpen}
        onOpenChange={setFundsDialogOpen}
        goal={selectedGoal}
        onAddFunds={handleAddFundsSubmit}
      />
    </motion.div>
  );
};

export default Goals;
