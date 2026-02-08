import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Loader2, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BudgetGoalCard } from '@/components/BudgetGoalCard';
import { AddBudgetGoalDialog } from '@/components/AddBudgetGoalDialog';
import { AddFundsDialog } from '@/components/AddFundsDialog';
import { useBudgetGoals, BudgetGoal } from '@/hooks/useBudgetGoals';
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
  const { goals, stats, isLoading, addGoal, updateGoal, deleteGoal, addToGoal } = useBudgetGoals();
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
      toast({ title: `$${amount.toLocaleString()} added to goal` });
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
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Savings Goals
          </h1>
          <p className="text-muted-foreground">
            Track your progress towards financial goals
          </p>
        </div>
        <Button 
          onClick={() => setDialogOpen(true)}
          className="rounded-xl bg-gradient-income hover:opacity-90 gap-2"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </Button>
      </motion.div>

      {/* Stats Cards */}
      {goals.length > 0 && (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Total Goals</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.goalCount}</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-income/10 rounded-xl">
                <TrendingUp className="w-5 h-5 text-income" />
              </div>
              <span className="text-sm text-muted-foreground">Total Saved</span>
            </div>
            <p className="text-2xl font-bold text-income">
              ${stats.totalSaved.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              of ${stats.totalTarget.toLocaleString()} target
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-category-freelance/10 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-category-freelance" />
              </div>
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.completedGoals}</p>
            <p className="text-xs text-muted-foreground mt-1">
              of {stats.goalCount} goals
            </p>
          </div>
        </motion.div>
      )}

      {/* Overall Progress */}
      {goals.length > 0 && (
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground">Overall Progress</h2>
            <span className="text-2xl font-bold text-primary">
              {stats.overallProgress.toFixed(0)}%
            </span>
          </div>
          <Progress value={stats.overallProgress} className="h-4" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>${stats.totalSaved.toLocaleString()} saved</span>
            <span>${(stats.totalTarget - stats.totalSaved).toLocaleString()} remaining</span>
          </div>
        </motion.div>
      )}

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <motion.div 
          variants={itemVariants}
          className="bg-card border border-border rounded-2xl p-8 sm:p-12 text-center"
        >
          <div className="bg-gradient-to-br from-income/20 to-income/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-income" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">
            No savings goals yet
          </h3>
          <p className="text-muted-foreground mb-6 text-sm max-w-xs mx-auto">
            Set financial goals to track your progress and stay motivated on your savings journey
          </p>
          <Button 
            onClick={() => setDialogOpen(true)}
            className="rounded-xl bg-gradient-income hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Goal
          </Button>
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
