import { motion } from 'framer-motion';
import { Target, Calendar, MoreHorizontal, Edit, Trash2, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BudgetGoal } from '@/hooks/useBudgetGoals';
import { format, differenceInDays, isPast } from 'date-fns';

interface BudgetGoalCardProps {
  goal: BudgetGoal;
  onEdit: (goal: BudgetGoal) => void;
  onDelete: (id: string) => void;
  onAddFunds: (goal: BudgetGoal) => void;
}

export function BudgetGoalCard({ goal, onEdit, onDelete, onAddFunds }: BudgetGoalCardProps) {
  const progress = goal.target_amount > 0 
    ? Math.min((goal.current_amount / goal.target_amount) * 100, 100) 
    : 0;
  
  const remaining = goal.target_amount - goal.current_amount;
  const isComplete = progress >= 100;
  
  const daysLeft = goal.deadline 
    ? differenceInDays(new Date(goal.deadline), new Date()) 
    : null;
  
  const isOverdue = goal.deadline ? isPast(new Date(goal.deadline)) && !isComplete : false;

  const getProgressColor = () => {
    if (isComplete) return 'bg-income';
    if (isOverdue) return 'bg-destructive';
    if (progress >= 75) return 'bg-income';
    if (progress >= 50) return 'bg-primary';
    if (progress >= 25) return 'bg-category-rental';
    return 'bg-primary';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card border rounded-2xl p-5 transition-all hover:shadow-lg ${
        isComplete ? 'border-income/30 bg-income/5' : 'border-border'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${
            isComplete 
              ? 'bg-income/20' 
              : isOverdue 
                ? 'bg-destructive/20' 
                : 'bg-primary/10'
          }`}>
            {isComplete ? (
              <Check className="w-5 h-5 text-income" />
            ) : (
              <Target className={`w-5 h-5 ${isOverdue ? 'text-destructive' : 'text-primary'}`} />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{goal.name}</h3>
            {goal.deadline && (
              <div className={`flex items-center gap-1 text-xs ${
                isOverdue ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                <Calendar className="w-3 h-3" />
                <span>
                  {isComplete 
                    ? 'Completed!' 
                    : isOverdue 
                      ? 'Overdue' 
                      : daysLeft !== null && daysLeft <= 30 
                        ? `${daysLeft} days left`
                        : format(new Date(goal.deadline), 'MMM d, yyyy')
                  }
                </span>
              </div>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuItem onClick={() => onAddFunds(goal)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Funds
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(goal)} className="gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(goal.id)} 
              className="gap-2 text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="text-2xl font-bold text-foreground">
            ${goal.current_amount.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">
            of ${goal.target_amount.toLocaleString()}
          </span>
        </div>

        <div className="relative">
          <Progress value={progress} className="h-3 bg-secondary" />
          <div 
            className={`absolute top-0 left-0 h-full rounded-full transition-all ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className={`font-medium ${
            isComplete ? 'text-income' : 'text-muted-foreground'
          }`}>
            {progress.toFixed(0)}% complete
          </span>
          {!isComplete && (
            <span className="text-muted-foreground">
              ${remaining.toLocaleString()} to go
            </span>
          )}
        </div>
      </div>

      {!isComplete && (
        <Button 
          onClick={() => onAddFunds(goal)}
          variant="outline" 
          size="sm" 
          className="w-full mt-4 rounded-xl gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Funds
        </Button>
      )}
    </motion.div>
  );
}
